<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Profile;
use App\Models\Category;
use App\Models\Listing;
use App\Models\ListingPhoto;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Catégories de base
        $categories = [
            ['name' => 'Véhicules', 'icon' => 'car'],
            ['name' => 'Immobilier', 'icon' => 'home'],
            ['name' => 'Electronique', 'icon' => 'smartphone'],
            ['name' => 'Mode', 'icon' => 'shirt'],
            ['name' => 'Maison & Jardin', 'icon' => 'lamp'],
            ['name' => 'Emploi', 'icon' => 'briefcase'],
            ['name' => 'Services', 'icon' => 'hammer'],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(
                ['slug' => Str::slug($cat['name'])],
                [
                    'name' => $cat['name'],
                    'icon' => $cat['icon'],
                ]
            );
        }

        // 2. Administrateur (si n'existe pas déjà)
        $admin = User::firstOrCreate(
            ['email' => 'mbeleglaurent0@gmail.com'],
            [
                'password' => Hash::make('Laurent247'),
                'role' => 'ADMIN',
            ]
        );

        Profile::updateOrCreate(
            ['user_id' => $admin->id],
            [
                'full_name' => 'Laurent Admin',
                'username' => 'laurent_admin',
                'phone' => '+237600000000',
                'city' => 'Douala',
                'region' => 'Littoral',
                'is_verified' => true,
            ]
        );

        // 3. Utilisateurs de test
        $users = [
            [
                'email' => 'user1@example.com',
                'full_name' => 'Samuel Eto\'o',
                'city' => 'Douala',
            ],
            [
                'email' => 'user2@example.com',
                'full_name' => 'Marc-Vivien Foé',
                'city' => 'Yaoundé',
            ],
        ];

        foreach ($users as $userData) {
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'password' => Hash::make('password'),
                    'role' => 'USER',
                ]
            );

            Profile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'full_name' => $userData['full_name'],
                    'username' => Str::slug($userData['full_name'], '_'),
                    'city' => $userData['city'],
                    'region' => $userData['city'] === 'Douala' ? 'Littoral' : 'Centre',
                ]
            );

            // Créer quelques annonces si l'utilisateur n'en a pas
            if ($user->listings()->count() < 3) {
                for ($i = 0; $i < 3; $i++) {
                    $cat = Category::inRandomOrder()->first();
                    $title = "Superbe " . $cat->name . " à vendre n°" . rand(1, 1000);
                    $listing = Listing::create([
                        'user_id' => $user->id,
                        'category_id' => $cat->id,
                        'title' => $title,
                        'slug' => Str::slug($title . "-" . Str::random(5)),
                        'description' => "Ceci est une annonce de test de grande qualité pour un(e) " . $cat->name . ".",
                        'price' => rand(1000, 1000000),
                        'city' => $userData['city'],
                        'region' => $userData['city'] === 'Douala' ? 'Littoral' : 'Centre',
                        'status' => 'ACTIVE',
                        'condition' => 'OCCASION',
                    ]);

                    // Liste d'images valides par catégorie pour éviter les 404
                    $imageIds = [
                        'vehicules' => ['1533473359331-0135ef1b58bf', '1494976388531-d1058494cdd8', '1503376780353-7e6692767b70'],
                        'immobilier' => ['158058418af64-15a0028a360f', '1522708323590-d24dbb6b0267', '1502672260266-1c1ef2d93688'],
                        'electronique' => ['1498049794561-7780e7231661', '1511707171634-5f897ff02aa9', '1525547718561-0390ac82a931'],
                        'mode' => ['1483985988355-763728e1935b', '1523275335684-37898b6baf30', '1549298916-b41d501d3772'],
                        'default' => ['1472851294608-062f824d29cc', '1505740420928-5e560c06d30e', '1441986300917-64674bd600d8']
                    ];

                    $catSlug = $cat->slug;
                    $pool = $imageIds[$catSlug] ?? $imageIds['default'];
                    $randomId = $pool[array_rand($pool)];

                    // Ajouter une photo Unsplash valide
                    $listing->photos()->create([
                        'image_path' => "https://images.unsplash.com/photo-{$randomId}?auto=format&fit=crop&w=800&q=60",
                        'is_cover' => true,
                    ]);
                }
            }
        }
    }
}
