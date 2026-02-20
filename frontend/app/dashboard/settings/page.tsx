'use client';

import React from 'react';
import { ProfileSettingsForm } from '@/components/dashboard/ProfileSettingsForm';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
    const { profile, isLoading } = useAuthContext();

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium">Chargement de vos paramètres...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                Erreur lors du chargement de votre profil. Veuillez vous reconnecter.
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Paramètres</h1>
                <p className="text-muted-foreground">
                    Personnalisez les informations de votre boutique et votre profil public.
                </p>
            </div>

            <ProfileSettingsForm profile={profile} />
        </div>
    );
}
