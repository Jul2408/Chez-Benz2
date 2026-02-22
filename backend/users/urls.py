from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, UserDetailView, CustomTokenObtainPairView, 
    PublicUserDetailView, BuyCreditsView, UserViewSet,
    PasswordChangeView, PasswordResetRequestView, PasswordResetConfirmView
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
    path('register', RegisterView.as_view(), name='auth_register'),
    path('login', CustomTokenObtainPairView.as_view(), name='auth_login'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('me', UserDetailView.as_view(), name='auth_me'),
    path('change-password', PasswordChangeView.as_view(), name='password_change'),
    path('password-reset', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/confirm', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('buy-credits', BuyCreditsView.as_view(), name='buy_credits'),
    path('<int:id>/', PublicUserDetailView.as_view(), name='public_profile'),
]
