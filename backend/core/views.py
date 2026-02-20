from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import PlatformSettings
from .serializers import PlatformSettingsSerializer

class PlatformSettingsView(generics.RetrieveUpdateAPIView):
    serializer_class = PlatformSettingsSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_object(self):
        obj, created = PlatformSettings.objects.get_or_create(id=1)
        return obj
