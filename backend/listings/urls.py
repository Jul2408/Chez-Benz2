from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ListingViewSet, CategoryViewSet, FavoriteViewSet, DashboardOverview, AdminDashboardOverview, BoostViewSet, HistoryViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'favorites', FavoriteViewSet, basename='favorite')
router.register(r'boost', BoostViewSet, basename='boost')
router.register(r'history', HistoryViewSet, basename='history')
router.register(r'', ListingViewSet)

urlpatterns = [
    path('dashboard-stats/', DashboardOverview.as_view(), name='dashboard-stats'),
    path('admin-stats/', AdminDashboardOverview.as_view(), name='admin-stats'),
    path('', include(router.urls)),
]
