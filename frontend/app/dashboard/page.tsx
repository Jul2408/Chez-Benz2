'use client';

import { useEffect, useState } from 'react';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getDashboardStats, getUserListings, getUnreadNotificationsCount } from '@/utils/supabase-helpers';

export default function DashboardPage() {
    const { user, profile, isLoading: authLoading } = useAuthContext();
    const router = useRouter();
    const [stats, setStats] = useState({
        listingCount: 0,
        favoritesCount: 0,
        viewsCount: 0,
        messagesCount: 0,
        historyCount: 0,
        purchasesCount: 0
    });
    const [recentListings, setRecentListings] = useState<any[]>([]);
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (user) {
                try {
                    const [statsData, listingsData, notifCount] = await Promise.all([
                        getDashboardStats(),
                        getUserListings(),
                        getUnreadNotificationsCount()
                    ]);
                    setStats(statsData);
                    setRecentListings(listingsData.slice(0, 5)); // Take 5 most recent
                    setNotificationsCount(notifCount);
                } catch (error) {
                    console.error("Dashboard fetch error", error);
                } finally {
                    setIsLoading(false);
                }
            }
        }
        fetchData();
    }, [user]);

    if (authLoading || !user || isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium">Chargement de votre tableau de bord...</p>
            </div>
        );
    }

    return (
        <DashboardClient
            user={user as any}
            profile={profile as any}
            stats={stats}
            recentListings={recentListings}
            notificationsCount={notificationsCount}
        />
    );
}
