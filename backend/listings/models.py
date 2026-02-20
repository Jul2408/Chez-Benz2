from django.db import models
from django.conf import settings
from core.models import TimeStampedModel

class Category(TimeStampedModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    icon = models.CharField(max_length=50, blank=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class Listing(TimeStampedModel):
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Brouillon'
        ACTIVE = 'ACTIVE', 'Actif'
        SOLD = 'SOLD', 'Vendu'
        ARCHIVED = 'ARCHIVED', 'Archivé'

    class Condition(models.TextChoices):
        NEW = 'NEUF', 'Neuf'
        USED = 'OCCASION', 'Occasion'
        REFURBISHED = 'RECONDITIONNE', 'Reconditionné'

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='listings')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='listings')
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='purchases')
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=0)
    currency = models.CharField(max_length=3, default='XAF')
    
    city = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    condition = models.CharField(max_length=20, choices=Condition.choices, default=Condition.USED)
    
    is_negotiable = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    views_count = models.PositiveIntegerField(default=0)
    
    # Store dynamic fields from frontend
    extra_attributes = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            import uuid
            base_slug = slugify(self.title)
            # Add a short UUID to ensure uniqueness
            self.slug = f"{base_slug}-{str(uuid.uuid4())[:8]}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class Photo(TimeStampedModel):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='photos')
    image = models.ImageField(upload_to='listings/')
    is_cover = models.BooleanField(default=False)

    def __str__(self):
        return f"Photo for {self.listing.title}"

class Favorite(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='favorited_by')

    class Meta:
        unique_together = ('user', 'listing')

    def __str__(self):
        return f"{self.user} favorited {self.listing}"

class ListingView(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='viewed_listings', null=True, blank=True)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='views')
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        # Ensure we don't spam DB with same view multiple times per second, 
        # but for simple history, we might just want latest view per user/listing
        
    def __str__(self):
        return f"{self.user} viewed {self.listing}"

class Boost(TimeStampedModel):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='boosts')
    duration_days = models.IntegerField()
    amount = models.DecimalField(max_digits=10, decimal_places=0)
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    transaction_id = models.CharField(max_length=100, blank=True)

    def save(self, *args, **kwargs):
        from django.utils import timezone
        if not self.end_date:
            self.end_date = timezone.now() + timezone.timedelta(days=self.duration_days)
        super().save(*args, **kwargs)
        
        # Auto update listing featured status
        self.listing.is_featured = True
        self.listing.save()

    def __str__(self):
        return f"Boost for {self.listing.title} ({self.duration_days} days)"
