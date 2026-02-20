'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardMobileNav } from '@/components/dashboard/DashboardMobileNav';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuthContext();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/connexion?next=/dashboard');
            } else {
                setIsChecking(false);
            }
        }
    }, [user, isLoading, router]);

    if (isLoading || isChecking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="text-slate-500 font-medium tracking-wide">Vérification de l'accès...</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 flex-col md:flex-row">
            {/* Navigation Mobile */}
            <DashboardMobileNav />

            {/* Sidebar fixe sur Desktop */}
            <aside className="hidden md:block w-72 shrink-0 border-r bg-white dark:bg-slate-900 border-gray-100 dark:border-white/5 sticky top-0 h-screen">
                <DashboardSidebar profile={user as any} />
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 p-4 md:p-10 lg:p-12">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
