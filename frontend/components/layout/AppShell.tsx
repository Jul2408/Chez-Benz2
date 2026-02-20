'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { MobileHeaderCompact } from '@/components/layout/MobileHeaderCompact';
import { Footer } from '@/components/layout/Footer';

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // Hide ONLY on auth pages and full dashboard (but keep on listing details)
    const isAuthPage = pathname?.includes('/connexion') || pathname?.includes('/inscription') || pathname?.includes('/attente-verification');
    const isDashboard = pathname?.startsWith('/dashboard');
    const isAdmin = pathname?.startsWith('/admin');
    const isHome = pathname === '/';

    // We want the main nav/footer everywhere except auth, dashboard and admin
    const hideLayout = isAuthPage || isDashboard || isAdmin;

    return (
        <div className="relative flex min-h-screen flex-col">
            {!hideLayout && <Header />}
            {/* Show compact mobile header on all non-home pages (home has its own MobileHeader) */}
            {!hideLayout && !isHome && <MobileHeaderCompact />}
            <main className="flex-1">
                {children}
            </main>
            {!hideLayout && <Footer />}
            {!hideLayout && <MobileNav />}
        </div>
    );
}
