from django.db import models

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class PlatformSettings(TimeStampedModel):
    site_name = models.CharField(max_length=100, default='Chez-BEN2')
    contact_email = models.EmailField(default='contact@chez-ben2.com')
    contact_phone = models.CharField(max_length=20, default='+237 600 000 000')
    address = models.TextField(default='Douala, Cameroun')
    
    # Financials
    credit_price_xaf = models.DecimalField(max_digits=10, decimal_places=0, default=100) # Price for 1 credit
    commission_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=5.00)
    
    # Socials
    facebook_url = models.URLField(blank=True, null=True)
    whatsapp_number = models.CharField(max_length=20, blank=True, null=True)
    
    # App Features
    maintenance_mode = models.BooleanField(default=False)
    
    def __str__(self):
        return "Paramètres de la Plateforme"
    
    class Meta:
        verbose_name = "Paramètres"
        verbose_name_plural = "Paramètres"
