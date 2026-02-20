from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import random
import string
from django.core.mail import send_mail
from django.conf import settings
from .serializers import (
    UserSerializer, RegisterSerializer, AdminUserSerializer, 
    PublicUserSerializer, PasswordChangeSerializer, 
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer
)
from .models import Follow, VerificationCode

User = get_user_model()

def generate_verification_code(user, code_type):
    # Expire old codes
    VerificationCode.objects.filter(user=user, type=code_type, is_used=False).update(is_used=True)
    
    code = ''.join(random.choices(string.digits, k=6))
    expires_at = timezone.now() + timedelta(minutes=15)
    
    return VerificationCode.objects.create(
        user=user,
        code=code,
        type=code_type,
        expires_at=expires_at
    )

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAdminUser]
    search_fields = ['email', 'profile__full_name', 'profile__phone']

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def follow(self, request, pk=None):
        followed_user = self.get_object()
        if request.user == followed_user:
            return Response({'error': 'You cannot follow yourself'}, status=400)
        
        Follow.objects.get_or_create(follower=request.user, followed=followed_user)
        return Response({'status': 'followed'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def unfollow(self, request, pk=None):
        followed_user = self.get_object()
        Follow.objects.filter(follower=request.user, followed=followed_user).delete()
        return Response({'status': 'unfollowed'})

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class PasswordChangeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if user.check_password(serializer.data.get('old_password')):
                user.set_password(serializer.data.get('new_password'))
                user.save()
                return Response({'message': 'Mot de passe mis à jour avec succès'}, status=status.HTTP_200_OK)
            return Response({'old_password': ['Ancien mot de passe incorrect']}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.data.get('email')
            user = User.objects.filter(email__iexact=email).first()
            
            if user:
                verify_code = generate_verification_code(user, VerificationCode.CodeType.PASSWORD_RESET)
                
                # Send email
                subject = f"{verify_code.code} est votre code de réinitialisation Chez-BEN2"
                message = f"Bonjour,\n\nUtilisez le code suivant pour réinitialiser votre mot de passe Chez-BEN2 : {verify_code.code}\n\nCe code expirera dans 15 minutes.\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet e-mail."
                
                try:
                    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])
                    print("\n" + "="*50)
                    print(f"🔑 CODE DE RÉINITIALISATION POUR {email} : {verify_code.code}")
                    print("="*50 + "\n")
                except Exception as e:
                    print(f"\n❌ Erreur d'envoi d'email : {e}")
                    print(f"🔑 LE CODE EST TOUT DE MÊME : {verify_code.code}")
                    print("="*50 + "\n")
                    # Still return success to prevent user enumeration if we want, 
                    # but here for dev we might want to know
            
            # We return success even if user doesn't exist for security (user enumeration)
            return Response({'message': 'Si un compte correspond à cet email, un code a été envoyé.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.data.get('email')
            code = serializer.data.get('code')
            new_password = serializer.data.get('new_password')
            
            user = User.objects.filter(email__iexact=email).first()
            if not user:
                return Response({'error': 'Email invalide'}, status=status.HTTP_400_BAD_REQUEST)
            
            verify_code = VerificationCode.objects.filter(
                user=user, 
                code=code, 
                type=VerificationCode.CodeType.PASSWORD_RESET,
                is_used=False,
                expires_at__gt=timezone.now()
            ).first()
            
            if not verify_code:
                return Response({'code': ['Code invalide ou expiré']}, status=status.HTTP_400_BAD_REQUEST)
            
            # Reset password
            user.set_password(new_password)
            user.save()
            
            # Mark code as used
            verify_code.is_used = True
            verify_code.save()
            
            return Response({'message': 'Votre mot de passe a été réinitialisé avec succès.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairView(TokenObtainPairView):
    pass

class PublicUserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = PublicUserSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'id'

class BuyCreditsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        amount = request.data.get('amount', 0)
        if amount <= 0:
            return Response({'error': 'Montant invalide'}, status=status.HTTP_400_BAD_REQUEST)
        
        profile = request.user.profile
        profile.credits += int(amount)
        profile.save()
        
        return Response({
            'success': True,
            'new_balance': profile.credits,
            'message': f'{amount} crédits ajoutés avec succès'
        })
