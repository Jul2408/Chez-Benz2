<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::create([
            'email' => 'mbeleglaurent0@gmail.com',
            'password' => Hash::make('Laurent247'),
            'role' => 'ADMIN',
        ]);

        Profile::create([
            'user_id' => $user->id,
            'full_name' => 'Laurent Admin',
            'username' => 'admin_laurent',
            'credits' => 1000,
            'is_verified' => true,
        ]);
        
        $this->command->info('Admin user created successfully!');
    }
}
