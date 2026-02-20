from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.http import QueryDict
from django.utils.datastructures import MultiValueDict
from .models import Profile

User = get_user_model()

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'full_name', 'username', 'phone', 'avatar', 'cover_image', 'bio', 
            'city', 'region', 'address', 'is_verified', 'whatsapp_number', 
            'facebook_url', 'instagram_url', 'website_url', 'experience_years',
            'notification_email', 'notification_push', 'notification_sms', 'credits',
            'latitude', 'longitude'
        ]
        read_only_fields = ['is_verified']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'profile', 'date_joined']
        read_only_fields = ['id', 'email', 'role', 'date_joined']

    def to_internal_value(self, data):
        # Handle flat keys from FormData like 'profile.full_name'
        if any(key.startswith('profile.') for key in data.keys()):
            new_data = data.copy()
            profile_data = {}
            for key in list(new_data.keys()):
                if key.startswith('profile.'):
                    _, field = key.split('.', 1)
                    if hasattr(new_data, 'getlist'):
                        value = new_data.getlist(key)[0]
                    else:
                        value = new_data.get(key)
                    profile_data[field] = value
            
            final_data = {}
            for k, v in data.items():
                if not k.startswith('profile.'):
                    final_data[k] = v
            final_data['profile'] = profile_data
            data = final_data
            
        # Common fix for username
        if 'profile' in data and 'username' in data['profile']:
            if data['profile']['username'] == '':
                data['profile']['username'] = None

        return super().to_internal_value(data)

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        
        # Update User fields (email, etc.)
        instance = super().update(instance, validated_data)

        # Update Profile fields using a serializer for validation and image handling
        if profile_data is not None:
            profile = getattr(instance, 'profile', None)
            if profile:
                # Filter out None values for fields that might be problematic or not sent
                # But keep images if they are provided
                serializer = ProfileSerializer(profile, data=profile_data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
            
        return instance

class AdminUserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'profile', 'date_joined', 'is_active', 'is_staff']
        read_only_fields = ['id', 'email', 'date_joined']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        
        # Sync is_staff with role
        role = validated_data.get('role')
        if role == 'ADMIN':
            validated_data['is_staff'] = True
        elif role == 'USER' or role == 'COMPANY':
            validated_data['is_staff'] = False
            
        instance = super().update(instance, validated_data)

        if profile_data is not None:
            profile = instance.profile
            serializer = ProfileSerializer(profile, data=profile_data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        return instance

class PublicUserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'profile', 'date_joined']
        read_only_fields = ['id', 'profile', 'date_joined']

import re
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from django.core.validators import RegexValidator

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    full_name = serializers.CharField(write_only=True, required=True)
    phone = serializers.CharField(write_only=True, required=False, validators=[
        RegexValidator(
            regex=r'^(\+237|6)[2356789][0-9]{7}$',
            message="Le format du téléphone doit être +237XXXXXXXXX ou 6XXXXXXXX (format camerounais)."
        )
    ])

    class Meta:
        model = User
        fields = ['email', 'password', 'full_name', 'phone']

    def validate_email(self, value):
        # Email unique insensible à la casse
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Un utilisateur avec cet email existe déjà.")
        return value.lower()

    def create(self, validated_data):
        full_name = validated_data.pop('full_name', '')
        phone = validated_data.pop('phone', '')
        
        # Le role est forcé à 'USER' pour l'inscription publique
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            role='USER'
        )
        
        # Mise à jour du profil (créé automatiquement par le signal)
        profile = user.profile
        profile.full_name = full_name
        if phone:
            profile.phone = phone
        profile.save()
            
        return user

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    code = serializers.CharField(required=True, max_length=6)
    new_password = serializers.CharField(required=True, validators=[validate_password])
