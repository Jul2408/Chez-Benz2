<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::updateOrCreate(
            ['email' => 'admin@chezben.com'],
            [
                'password' => Hash::make('Admin123!'),
                'role' => 'ADMIN',
            ]
        );

        $user->profile->update([
            'full_name' => 'Administrateur Chez-Ben',
            'username' => 'admin',
        ]);
    }
}
