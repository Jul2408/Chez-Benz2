<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'user_id', 'full_name', 'username', 'phone', 'avatar', 'cover_image',
        'bio', 'city', 'region', 'address', 'whatsapp_number', 'credits',
        'is_verified', 'latitude', 'longitude'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
