'use client';

import React from 'react';
import { ArrowLeft, Bell, Search } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { useNotifications } from '@/hooks';
import { cn } from '@/lib/utils';

/**
 * Compact mobile header for inner pages (listing detail, categories, etc.)
 * Shows logo, back button, and notification bell.
 */
export function MobileHeaderCompact() {
    const router = useRouter();
    const pathname = usePathname();
    const { unreadNotifications } = useNotifications();

    // Determine page title based on pathname
    const getTitle = () => {
        if (pathname?.startsWith('/annonces/create')) return 'Déposer une annonce';
        if (pathname?.startsWith('/annonces/edit')) return 'Modifier l\'annonce';
        if (pathname?.startsWith('/annonces/')) return 'Détail annonce';
        if (pathname?.startsWith('/annonces')) return 'Annonces';
        if (pathname?.startsWith('/categories')) return 'Catégories';
        if (pathname?.startsWith('/vendeur')) return 'Profil vendeur';
        if (pathname?.startsWith('/favoris')) return 'Mes favoris';
        return 'Chez-BEN2';
    };

    return (
        <header className="sticky top-0 z-50 w-full md:hidden bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
            <div className="flex items-center justify-between h-16 px-4">
                {/* Back button */}
                <button
                    onClick={() => router.back()}
                    className="size-10 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 text-foreground transition-all active:scale-90"
                    aria-label="Retour"
                >
                    <ArrowLeft className="size-5" />
                </button>

                {/* Logo / Title */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary/20">
                        B
                    </div>
                    <span className="font-outfit font-black text-lg tracking-tight">
                        Chez-<span className="text-primary">BEN2</span>
                    </span>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <ThemeToggle className="size-10 rounded-full" />
                    <div className="relative">
                        <Link href="/dashboard/notifications">
                            <Button variant="ghost" size="icon" className="size-10 rounded-full">
                                <Bell className="size-5" />
                                {unreadNotifications > 0 && (
                                    <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border border-background animate-pulse" />
                                )}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
