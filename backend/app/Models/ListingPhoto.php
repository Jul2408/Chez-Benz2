<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingPhoto extends Model
{
    protected $fillable = ['listing_id', 'image_path', 'is_cover'];

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }
}
