from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
from .models import Listing, Category, Favorite, Boost
from .serializers import ListingSerializer, CategorySerializer, FavoriteSerializer, BoostSerializer

class BoostViewSet(viewsets.ModelViewSet):
    queryset = Boost.objects.all().order_by('-created_at')
    serializer_class = BoostSerializer
    permission_classes = [permissions.IsAdminUser]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'category': ['exact'],
        'category__slug': ['exact'],
        'city': ['exact', 'icontains'],
        'condition': ['exact'],
        'price': ['gte', 'lte'],
        'status': ['exact'],
        'user': ['exact'],
    }
    search_fields = ['title', 'description', 'city']
    ordering_fields = ['price', 'created_at', 'views_count']
    ordering = ['-created_at']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        # Staff/Admin see everything
        if user.is_staff:
            return queryset

        # Visibility logic:
        # 1. Anonymous users see ONLY ACTIVE listings
        # 2. Authenticated users see ACTIVE listings + THEIR OWN (any status)
        if user.is_authenticated:
            from django.db.models import Q
            queryset = queryset.filter(Q(status='ACTIVE') | Q(user=user))
        else:
            queryset = queryset.filter(status='ACTIVE')

        # Handle explicit "my listings" filter
        if self.action == 'list' and self.request.query_params.get('my_listings'):
            if user.is_authenticated:
                return queryset.filter(user=user)
            return queryset.none()
            
        return queryset

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        listing = self.get_object()
        listing.status = 'ACTIVE'
        listing.save()
        
        # Create notification for owner
        from notifications.models import Notification
        Notification.objects.create(
            user=listing.user,
            title="Annonce approuvée",
            message=f"Votre annonce '{listing.title}' a été validée et est maintenant en ligne !",
            action_url=f"/annonces/{listing.slug}"
        )
        
        return Response({'status': 'approved'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        listing = self.get_object()
        listing.status = 'ARCHIVED'
        listing.save()
        
        # Create notification for owner
        from notifications.models import Notification
        Notification.objects.create(
            user=listing.user,
            title="Annonce refusée",
            message=f"Votre annonce '{listing.title}' n'a pas été validée. Contactez le support pour plus d'infos.",
            action_url="/dashboard/annonces"
        )
        
        return Response({'status': 'rejected'})

    @action(detail=False, methods=['get'])
    def detail_by_slug(self, request):
        slug = request.query_params.get('slug')
        if not slug:
            return Response({'error': 'Slug is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Reusing queryset logic from get_queryset for access control
            queryset = self.get_queryset().filter(slug=slug)
            instance = queryset.first()
            
            if not instance:
                return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
            
            # Increment view count and record history
            self._handle_view_count(request, instance)
                
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        self._handle_view_count(request, instance)
            
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def _handle_view_count(self, request, instance):
        """Helper to handle view count logic including cooldowns and owner check"""
        try:
            user = request.user
            ip = request.META.get('REMOTE_ADDR', '')

            # Never count owner views
            if user.is_authenticated and instance.user == user:
                return

            from django.utils import timezone
            from datetime import timedelta
            cooldown_period = timezone.now() - timedelta(minutes=5)

            if user.is_authenticated:
                # For logged-in users: use ListingView table with cooldown
                from .models import ListingView
                has_view = ListingView.objects.filter(
                    user=user,
                    listing=instance,
                    created_at__gte=cooldown_period
                ).exists()

                if not has_view:
                    instance.views_count += 1
                    instance.save(update_fields=['views_count'])
                    ListingView.objects.create(
                        user=user,
                        listing=instance,
                        ip_address=ip
                    )
            else:
                # For anonymous users: use session/cache-based cooldown (no DB write)
                # We use Django's cache to track IP+listing combos
                from django.core.cache import cache
                cache_key = f"view_{instance.id}_{ip}"
                if not cache.get(cache_key):
                    instance.views_count += 1
                    instance.save(update_fields=['views_count'])
                    # Store in cache for 5 minutes
                    cache.set(cache_key, True, 300)
        except Exception as e:
            # Never let view counting crash the page
            import logging
            logging.getLogger(__name__).warning(f"View count error: {e}")

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        listing_id = request.data.get('listing')
        # Check if already exists to toggle
        favorite = Favorite.objects.filter(user=request.user, listing_id=listing_id).first()
        if favorite:
            favorite.delete()
            return Response({'status': 'removed'}, status=status.HTTP_200_OK)
        return super().create(request, *args, **kwargs)

class BoostViewSet(viewsets.ModelViewSet):
    from .serializers import BoostSerializer
    serializer_class = BoostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        from .models import Boost
        return Boost.objects.filter(listing__user=self.request.user)
        
    def create(self, request, *args, **kwargs):
        # Allow creating boosts for own listings
        # In a real app, this would involve payment gateway callback verification
        # For this MVP, we trust the client call (simulation)
        from .models import Listing
        
        listing_ids = request.data.get('annonceIds', [])
        duration = request.data.get('duration', 3)
        amount = request.data.get('amount', 0)
        
        # If single listing (from data.listing normally)
        if 'listing' in request.data:
            return super().create(request, *args, **kwargs)
            
        payment_method = request.data.get('paymentMethod', 'OM')
        annonce_ids = request.data.get('annonceIds', [])
        duration = request.data.get('duration', 3)
        total_amount = request.data.get('amount', 0)
        
        # Payment with Credits logic
        if payment_method == 'CREDITS':
            profile = request.user.profile
            if profile.credits < total_amount:
                return Response({'error': 'Crédits insuffisants'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Deduct credits
            profile.credits -= int(total_amount)
            profile.save()

        # Bulk creation for `annonceIds` (custom logic from BoostModal)
        created_boosts = []
        for listing_id in annonce_ids:
            try:
                listing = Listing.objects.get(id=listing_id)
                if listing.user != request.user:
                    continue
                    
                serializer = self.get_serializer(data={
                    'listing': listing_id,
                    'duration_days': duration,
                    'amount': total_amount / len(annonce_ids) if len(annonce_ids) > 0 else 0,
                    'is_active': True,
                    'transaction_id': f"CREDIT_{request.user.id}_{listing_id}" if payment_method == 'CREDITS' else ""
                })
                if serializer.is_valid():
                    self.perform_create(serializer)
                    created_boosts.append(serializer.data)
            except Listing.DoesNotExist:
                continue
                
        return Response({'success': True, 'boosts': created_boosts}, status=status.HTTP_201_CREATED)

class HistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Returns listings recently viewed by the current user.
    """
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        from .models import ListingView
        # Get latest distinct listings viewed by user
        # Postgres Distinct On is cleaner, but for SQLite/portability:
        # We'll just fetch listing IDs from latest views
        viewed_ids = ListingView.objects.filter(user=self.request.user)\
            .order_by('-created_at')\
            .values_list('listing_id', flat=True)[:50]
            
        # Remove duplicates while preserving order (Python < 3.7 dict order assumption or use set)
        # Using list dict from keys for order
        unique_ids = list(dict.fromkeys(viewed_ids))
        
        # Fetch listings. Note: This loses order if we just do filter(id__in=...) directly without preserving it
        # But for MVP it's okay.
        return Listing.objects.filter(id__in=unique_ids)

class DashboardOverview(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from messaging.models import Message
        from django.db.models import Q, Sum
        from .models import ListingView

        user = request.user
        
        # Seller Stats
        my_listings = Listing.objects.filter(user=user)
        total_views_received = my_listings.aggregate(Sum('views_count'))['views_count__sum'] or 0
        total_listing_count = my_listings.count()
        
        # Messages (Unread)
        unread_messages = Message.objects.filter(
            conversation__participants=user,
            is_read=False
        ).exclude(sender=user).count()
        
        # Buyer Stats
        favorites_count = Favorite.objects.filter(user=user).count()
        purchases_count = Listing.objects.filter(buyer=user).count()
        
        # History Count (Unique listings viewed)
        history_count = ListingView.objects.filter(user=user).values('listing').distinct().count()
        
        return Response({
            'listingCount': total_listing_count,
            'favoritesCount': favorites_count,
            'viewsCount': total_views_received,
            'messagesCount': unread_messages,
            'purchasesCount': purchases_count,
            'historyCount': history_count
        })

class AdminDashboardOverview(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        from users.models import User
        from messaging.models import Message, Conversation
        from django.db.models import Sum, Count
        from .models import Listing, Boost

        # KPI Stats
        total_users = User.objects.count()
        new_users_30d = User.objects.filter(date_joined__gte=request.query_params.get('start_date') or '2020-01-01').count() # Simplified
        
        total_listings = Listing.objects.count()
        active_listings = Listing.objects.filter(status='ACTIVE').count()
        
        total_messages = Message.objects.count()
        
        total_revenue = Boost.objects.aggregate(total=Sum('amount'))['total'] or 0
        
        # Top Cities
        top_cities = Listing.objects.values('city').annotate(count=Count('id')).order_by('-count')[:5]
        
        # Listing statuses for moderation simulation
        listing_stats = Listing.objects.values('status').annotate(count=Count('id'))
        
        # Monthly user registrations for the chart
        from django.utils import timezone
        from datetime import timedelta
        
        monthly_users = []
        now = timezone.now()
        for i in range(11, -1, -1):
            month_start = (now.replace(day=1) - timedelta(days=i*30)).replace(day=1, hour=0, minute=0, second=0)
            next_month = (month_start + timedelta(days=32)).replace(day=1)
            count = User.objects.filter(date_joined__gte=month_start, date_joined__lt=next_month).count()
            monthly_users.append(count)

        # Recent High Value Users (Top Sellers)
        top_sellers = User.objects.annotate(
            listings_count=Count('listings'),
            sales_count=Count('listings', filter=models.Q(listings__status='SOLD'))
        ).order_by('-listings_count')[:4]

        return Response({
            'kpis': {
                'total_users': total_users,
                'active_listings': active_listings,
                'total_messages': total_messages,
                'total_revenue': total_revenue,
            },
            'top_villes': list(top_cities),
            'listing_stats': list(listing_stats),
            'monthly_users': monthly_users,
            'top_sellers': [{
                'id': u.id,
                'full_name': u.profile.full_name if hasattr(u, 'profile') else u.email,
                'city': u.profile.city if hasattr(u, 'profile') else '',
                'listings': u.listings_count,
                'sales': u.sales_count,
                'avatar_url': u.profile.avatar.url if hasattr(u, 'profile') and u.profile.avatar else None,
                'avatar_initials': u.email[0].upper()
            } for u in top_sellers]
        })
