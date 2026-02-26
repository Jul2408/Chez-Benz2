<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Listing extends Model
{
    protected $fillable = [
        'user_id', 'category_id', 'title', 'slug', 'description', 
        'price', 'currency', 'city', 'region', 'status', 'condition',
        'is_negotiable', 'is_featured', 'views_count', 'extra_attributes'
    ];

    protected $casts = [
        'extra_attributes' => 'array',
        'is_negotiable' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function photos()
    {
        return $this->hasMany(ListingPhoto::class);
    }

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites');
    }

    public function boosts()
    {
        return $this->hasMany(Boost::class);
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($listing) {
            if (empty($listing->slug)) {
                $listing->slug = Str::slug($listing->title) . '-' . Str::random(8);
            }
        });
    }
}
