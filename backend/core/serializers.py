from rest_framework import serializers
from .models import PlatformSettings

class PlatformSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformSettings
        fields = [
            'site_name', 'contact_email', 'contact_phone', 'address',
            'credit_price_xaf', 'commission_percentage',
            'facebook_url', 'whatsapp_number', 'maintenance_mode',
            'updated_at'
        ]
        read_only_fields = ['updated_at']
