<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'admin:create 
                            {email : Email de l\'administrateur}
                            {password : Mot de passe de l\'administrateur}
                            {--name= : Nom complet de l\'administrateur}';

    /**
     * The console command description.
     */
    protected $description = 'Créer un utilisateur administrateur unique pour accéder au dashboard';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email    = $this->argument('email');
        $password = $this->argument('password');
        $name     = $this->option('name') ?? 'Administrateur';

        // Check if a user with this email already exists
        $existing = User::where('email', $email)->first();

        if ($existing) {
            // Upgrade existing user to ADMIN
            $existing->update([
                'password' => Hash::make($password),
                'role'     => 'ADMIN',
            ]);

            if ($existing->profile) {
                $existing->profile->update(['full_name' => $name]);
            }

            $this->info("✅ Compte mis à jour : {$email} → ADMIN");
            return self::SUCCESS;
        }

        // Create a brand-new admin user
        $user = User::create([
            'email'    => $email,
            'password' => Hash::make($password),
            'role'     => 'ADMIN',
        ]);

        // Update profile name (auto-created by User::booted)
        $user->profile()->update(['full_name' => $name]);

        $this->info("✅ Compte administrateur créé avec succès !");
        $this->line("   Email    : {$email}");
        $this->line("   Rôle     : ADMIN");
        $this->line("   Dashboard: http://localhost:8000/admin");

        return self::SUCCESS;
    }
}
