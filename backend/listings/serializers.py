from rest_framework import serializers
from .models import Category, Listing, Photo, Favorite, Boost
from users.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'parent']

class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ['id', 'image', 'is_cover']

class BoostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Boost
        fields = ['id', 'listing', 'duration_days', 'amount', 'start_date', 'end_date', 'is_active', 'transaction_id']
        read_only_fields = ['start_date', 'end_date', 'is_active']

class ListingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )
    photos = PhotoSerializer(many=True, read_only=True)
    uploaded_photos = serializers.ListField(
        child=serializers.ImageField(max_length=10*1024*1024, allow_empty_file=False, use_url=True),
        write_only=True,
        required=False
    )

    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'slug', 'description', 'price', 
            'currency', 'city', 'region', 'status', 'condition', 
            'is_negotiable', 'views_count', 'created_at', 
            'user', 'category', 'category_id', 'photos', 'uploaded_photos', 'extra_attributes'
        ]
        read_only_fields = ['slug', 'views_count', 'created_at', 'user']

    def create(self, validated_data):
        uploaded_photos = validated_data.pop('uploaded_photos', [])
        listing = Listing.objects.create(**validated_data)
        
        for photo in uploaded_photos:
            Photo.objects.create(listing=listing, image=photo)
            
        return listing

class ListingDetailSerializer(ListingSerializer):
    pass

class FavoriteSerializer(serializers.ModelSerializer):
    listing_detail = ListingSerializer(source='listing', read_only=True)
    
    class Meta:
        model = Favorite
        fields = ['id', 'listing', 'listing_detail', 'created_at']
        read_only_fields = ['created_at']
