from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user)

    def create(self, request, *args, **kwargs):
        listing_id = request.data.get('listing')
        print(f"[DEBUG] POST /messaging/conversations/ - data: {request.data} - user: {request.user}")
        
        if not listing_id:
            return Response({'error': 'Listing ID is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            from listings.models import Listing
            listing = Listing.objects.get(id=listing_id)
        except (Listing.DoesNotExist, ValueError, TypeError) as e:
            return Response({'error': f'Listing with id {listing_id} not found'}, status=status.HTTP_404_NOT_FOUND)
            
        # Prevent starting conversation with self
        if listing.user.id == request.user.id:
            print("[DEBUG] Error: User trying to message themselves")
            return Response({'error': 'Cannot start conversation with yourself'}, status=status.HTTP_400_BAD_REQUEST)

        # Check for existing conversation
        existing_conv = Conversation.objects.filter(listing=listing).filter(participants=request.user).filter(participants=listing.user).distinct().first()
        
        if existing_conv:
            return Response(self.get_serializer(existing_conv).data)
            
        # Create new conversation
        try:
            conversation = Conversation.objects.create(listing=listing)
            conversation.participants.add(request.user)
            conversation.participants.add(listing.user)
            
            print(f"[DEBUG] Created new conversation {conversation.id} between {request.user.email} and {listing.user.email}")
            return Response(self.get_serializer(conversation).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"[DEBUG] Exception during creation: {str(e)}")
            return Response({'error': f'Failed to create conversation: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        try:
            conversation = Conversation.objects.filter(pk=pk).first()
            if not conversation:
                return Response({'error': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)
            
            if not conversation.participants.filter(id=request.user.id).exists():
                return Response({'error': 'You are not a participant in this conversation'}, status=status.HTTP_403_FORBIDDEN)
            
            content = request.data.get('content')
            if not content:
                return Response({'error': 'Content is required'}, status=status.HTTP_400_BAD_REQUEST)

            message = Message.objects.create(
                conversation=conversation,
                sender=request.user,
                content=content
            )
            
            conversation.save() # update updated_at
            
            # Enrich message with full sender data for frontend consistency
            serializer = MessageSerializer(message)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"[DEBUG] Exception during send_message: {str(e)}")
            return Response({'error': f'Failed to send message: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        conversation = self.get_object()
        
        # Mark messages as read
        Message.objects.filter(
            conversation=conversation,
            is_read=False
        ).exclude(sender=request.user).update(is_read=True)
        
        messages = conversation.messages.all()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        count = Message.objects.filter(
            conversation__participants=request.user,
            is_read=False
        ).exclude(sender=request.user).distinct().count()
        return Response({'unread_count': count})
