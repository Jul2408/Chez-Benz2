'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Search,
    MapPin,
    Bell,
    PlusCircle,
    MessageCircle,
    LogOut,
    ShieldAlert
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';
import { getUnreadNotificationsCount } from '@/utils/supabase-helpers';
import { ThemeToggle } from './ThemeToggle';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { useNotifications } from '@/hooks';

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { unreadNotifications } = useNotifications();
    const { user } = useAuthStore();
    const { signOut } = useAuthContext();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={cn(
                'sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md transition-all duration-300 border-b hidden md:block',
                isScrolled ? 'shadow-sm' : 'border-transparent'
            )}
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                        B
                    </div>
                    <span className="font-outfit font-bold text-xl tracking-tight hidden sm:block">
                        Chez-
                        <span className="text-primary">BEN2</span>
                    </span>
                </Link>

                {/* Desktop Search Bar */}
                <div className={cn(
                    "hidden md:flex flex-1 max-w-xl mx-8 relative group transition-all duration-300",
                    pathname === '/' && !isScrolled ? 'opacity-0 translate-y-[-10px] pointer-events-none' : 'opacity-100 translate-y-0'
                )}>
                    <div className="absolute inset-y-0 left-3 flex items-center text-muted-foreground pointer-events-none">
                        <Search className="size-4" />
                    </div>
                    <Input
                        placeholder="Que recherchez-vous aujourd'hui ?"
                        className="pl-10 h-10 bg-muted/50 border-transparent focus:bg-background focus:border-primary/20 transition-all rounded-full"
                    />
                    <Button
                        size="sm"
                        className="absolute right-1 top-1 h-8 rounded-full px-4"
                    >
                        Rechercher
                    </Button>
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <ThemeToggle className="text-muted-foreground hover:text-primary" />

                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground hidden lg:flex">
                        <MapPin className="size-4" />
                        <span>Douala</span>
                    </Button>

                    {user ? (
                        <>
                            <Link href="/dashboard/notifications">
                                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary" title="Notifications">
                                    <Bell className="size-5" />
                                    {unreadNotifications > 0 && (
                                        <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full ring-2 ring-background animate-pulse" />
                                    )}
                                </Button>
                            </Link>

                            {(user as any)?.role === 'ADMIN' && (
                                <Link href="/admin">
                                    <Button variant="ghost" size="icon" className="text-amber-500 hover:text-amber-600 hover:bg-amber-50" title="Administration">
                                        <ShieldAlert className="size-5" />
                                    </Button>
                                </Link>
                            )}

                            <Link href="/dashboard/messages">
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                                    <MessageCircle className="size-5" />
                                </Button>
                            </Link>

                            <Button
                                asChild
                                className="bg-primary hover:bg-primary/90 text-white font-medium rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                            >
                                <Link href="/annonces/create">
                                    <PlusCircle className="size-4 mr-2" />
                                    Déposer une annonce
                                </Link>
                            </Button>

                            <Link href="/dashboard" className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold ring-2 ring-background ml-2 hover:bg-primary/20 transition-all" title="Aller au tableau de bord">
                                {(user as any).email?.charAt(0).toUpperCase()}
                            </Link>

                            <Button variant="ghost" size="icon" onClick={() => signOut()} className="text-muted-foreground hover:text-red-500" title="Déconnexion">
                                <LogOut className="size-5" />
                            </Button>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" asChild>
                                <Link href="/connexion">Se connecter</Link>
                            </Button>
                            <Button asChild className="rounded-full">
                                <Link href="/annonces/create">
                                    <PlusCircle className="size-4 mr-2" />
                                    Déposer
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
