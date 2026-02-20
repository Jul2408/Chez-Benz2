'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, PlusCircle, MessageCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store';

const navItems = [
    { label: 'Accueil', icon: Home, href: '/' },
    { label: 'Favoris', icon: Heart, href: '/favoris' },
    { label: 'Déposer', icon: PlusCircle, href: '/annonces/create', isPrimary: true },
    { label: 'Messages', icon: MessageCircle, href: '/dashboard/messages' },
    { label: 'Profil', icon: User, href: '/dashboard' },
];

export function MobileNav() {
    const pathname = usePathname();
    const { user } = useAuthStore();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
            {/* Frosted glass background layer */}
            <div className="absolute inset-0 bg-background/95 backdrop-blur-xl border-t border-border shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]" />

            <div className="relative flex items-center justify-between h-20 px-4 pb-safe">
                {navItems.map((item, index) => {
                    // Check if current path starts with the item href (except for home '/')
                    const isActive = item.href === '/'
                        ? pathname === '/'
                        : pathname?.startsWith(item.href);
                    const Icon = item.icon;
                    const isCenter = item.isPrimary;

                    // Redirection logic for Profile
                    let finalHref = item.href;
                    if (item.label === 'Profil' && !user) {
                        finalHref = '/connexion';
                    }

                    if (isCenter) {
                        return (
                            <Link
                                key={item.label}
                                href={finalHref}
                                className="relative -top-6 flex flex-col items-center group"
                            >
                                <div className="size-16 bg-primary rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(230,57,70,0.4)] text-white transition-all group-active:scale-90 ring-4 ring-background">
                                    <Icon className="size-8 stroke-[2.5px]" />
                                </div>
                                <span className={cn(
                                    "text-[11px] font-bold mt-2 transition-colors",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.label}
                            href={finalHref}
                            className={cn(
                                'flex flex-col items-center justify-center gap-1.5 w-16 h-full transition-all active:scale-90',
                                isActive ? 'text-primary' : 'text-muted-foreground'
                            )}
                        >
                            <div className="relative">
                                <Icon className={cn(
                                    'size-6 transition-all duration-300',
                                    isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'
                                )} />
                                {isActive && (
                                    <span className="absolute -top-1 -right-1 size-1.5 bg-primary rounded-full animate-pulse" />
                                )}
                            </div>
                            <span className={cn(
                                "text-[10px] font-semibold transition-colors duration-300",
                                isActive ? "opacity-100" : "opacity-80"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
