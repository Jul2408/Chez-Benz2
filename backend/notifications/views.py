from rest_framework import viewsets, permissions
from .models import Notification
from .serializers import NotificationSerializer

from rest_framework.decorators import action
from rest_framework.response import Response

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Notification.objects.filter(user=self.request.user).order_by('-created_at')
        unread = self.request.query_params.get('unread')
        if unread == 'true':
            queryset = queryset.filter(is_read=False)
        return queryset

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def broadcast(self, request):
        title = request.data.get('title')
        message = request.data.get('message')
        action_url = request.data.get('action_url', '')

        if not title or not message:
            return Response({'error': 'Title and message are required'}, status=400)

        from django.contrib.auth import get_user_model
        User = get_user_model()
        users = User.objects.all()
        
        notifications = [
            Notification(user=user, title=title, message=message, action_url=action_url)
            for user in users
        ]
        Notification.objects.bulk_create(notifications)
        
        return Response({'status': f'Broadcast sent to {len(notifications)} users'})
