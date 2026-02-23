<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements FilamentUser
{
    use HasApiTokens, Notifiable;

    protected $fillable = ['email', 'password', 'role'];
    protected $hidden = ['password', 'remember_token'];

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->role === 'ADMIN';
    }

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function listings()
    {
        return $this->hasMany(Listing::class);
    }
}
