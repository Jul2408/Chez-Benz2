'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { type Profile } from '@/types';
import { toast } from 'sonner';
import { getCurrentProfile, signOut as apiSignOut } from '@/utils/supabase-helpers';
import { useAuthStore } from '@/store';

type AuthContextType = {
    user: Profile | null; // In our Django setup, User and Profile are linked
    profile: Profile | null;
    isLoading: boolean;
    isAdmin: boolean;
    isModerator: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const { user, setUser, logout: storeLogout } = useAuthStore();
    const router = useRouter();

    const fetchUser = async (force = false) => {
        // Vérifier si un token existe avant de faire un appel réseau
        const token = typeof window !== 'undefined' ? localStorage.getItem('chezben2_token') : null;
        if (!token || token === 'undefined' || token === 'null') {
            setIsLoading(false);
            return;
        }

        // Si on a déjà le user en store (navigation entre pages), on évite un appel réseau
        if (user && !force) {
            setIsLoading(false);
            return;
        }

        // Chargement avec un token valide → on récupère le profil
        setIsLoading(true);
        try {
            const profile = await getCurrentProfile();
            setUser(profile);
        } catch (error) {
            // Token invalide ou expiré → on nettoie
            if (typeof window !== 'undefined') {
                localStorage.removeItem('chezben2_token');
                localStorage.removeItem('chezben2_refresh_token');
            }
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const refreshProfile = async () => {
        await fetchUser(true);
    };

    const signOut = async () => {
        try {
            await apiSignOut();
            storeLogout();
            setUser(null);
            toast.success("Déconnexion réussie");
            router.push('/');
        } catch (error) {
            toast.error("Erreur lors de la déconnexion");
        }
    };

    const value = {
        user,
        profile: user,
        isLoading,
        isAdmin: user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
        isModerator: user?.role === 'MODERATOR' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
        signOut,
        refreshProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}
