'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminMobileNav } from '@/components/admin/AdminMobileNav';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function AdminLayout({
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
                router.push('/connexion?next=/admin');
            } else if ((user as any).role !== 'ADMIN' && (user as any).role !== 'SUPER_ADMIN') {
                router.push('/dashboard');
            } else {
                setIsChecking(false);
            }
        }
    }, [user, isLoading, router]);

    if (isLoading || isChecking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
                <div className="relative mb-6">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <ShieldCheck className="absolute inset-0 m-auto h-5 w-5 text-primary" />
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Vérification des accès administrateur...</p>
            </div>
        );
    }

    const userWithProfile = { user: user, profile: user };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex-col lg:flex-row">
            {/* Mobile Nav */}
            <AdminMobileNav />

            {/* Sidebar Admin - Premium & Dark Sidebar par défaut possible ou assortie */}
            <AdminSidebar user={userWithProfile as any} />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Header Admin avec recherche globale admin, notifications et profil */}
                <div className="hidden lg:block">
                    <AdminHeader user={userWithProfile as any} />
                </div>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
                    <div className="max-w-[1600px] mx-auto space-y-10">
                        {children}
                    </div>
                </main>
            </div>
        </div >
    );
}
