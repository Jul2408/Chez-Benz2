<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasName;
use Filament\Panel;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements FilamentUser, HasName
{
    use HasApiTokens, Notifiable;

    protected $fillable = ['email', 'password', 'role'];
    protected $hidden = ['password', 'remember_token'];

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->role === 'ADMIN';
    }

    public function getFilamentName(): string
    {
        return $this->profile && $this->profile->full_name ? $this->profile->full_name : $this->email;
    }

    protected static function booted()
    {
        static::created(function ($user) {
            $user->profile()->create([
                'credits' => 0,
                'is_verified' => false,
            ]);
        });
    }

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function listings()
    {
        return $this->hasMany(Listing::class);
    }

    public function favorites()
    {
        return $this->belongsToMany(Listing::class, 'favorites');
    }

    public function conversations()
    {
        return $this->belongsToMany(Conversation::class);
    }
}
