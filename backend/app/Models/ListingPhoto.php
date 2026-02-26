<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingPhoto extends Model
{
    protected $fillable = ['listing_id', 'image_path', 'is_cover'];

    protected $appends = ['image'];

    protected $casts = [
        'is_cover' => 'boolean',
    ];

    public function getImageAttribute()
    {
        return $this->image_path;
    }

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }
}
