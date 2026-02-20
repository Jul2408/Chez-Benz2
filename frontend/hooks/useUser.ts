import { useAuthContext } from '@/components/providers/AuthProvider';

export const useUser = () => {
    const { user, profile, isLoading, refreshProfile } = useAuthContext();
    return {
        user,
        profile,
        isLoading,
        isAuthenticated: !!user,
        refreshProfile,
    };
};
