'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Menu,
    X,
    Home,
    LayoutDashboard,
    Package,
    MessageSquare,
    Heart,
    Settings,
    LogOut,
    ShoppingBag,
    Store,
    Bell
} from 'lucide-react';
import { useNotifications } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { signOut } from '@/utils/supabase-helpers';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function DashboardMobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const { unreadNotifications, unreadMessages } = useNotifications();

    const handleSignOut = async () => {
        try {
            await signOut();
            toast.success("À bientôt !");
            window.location.href = '/';
        } catch (error) {
            toast.error("Erreur de déconnexion");
        }
    };

    const menuItems = [
        { title: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
        { title: "Mes Annonces", href: "/dashboard/annonces", icon: Package },
        { title: "Notifications", href: "/dashboard/notifications", icon: Bell },
        { title: "Messages", href: "/dashboard/messages", icon: MessageSquare },
        { title: "Mes Favoris", href: "/dashboard/favoris", icon: Heart },
        { title: "Mes Achats", href: "/dashboard/achats", icon: ShoppingBag },
        { title: "Mon Profil", href: "/dashboard/settings", icon: Settings },
    ];

    return (
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-white/5 sticky top-0 z-50">
            <Link href="/" className="flex items-center gap-2">
                <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
                    <Home className="text-white size-4" />
                </div>
                <span className="font-black text-lg font-outfit">Chez-BEN2</span>
            </Link>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-xl bg-gray-50 dark:bg-white/5">
                        <Menu className="size-6 text-foreground" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85%] p-0 border-none bg-white dark:bg-slate-950">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="p-6 border-b border-gray-100 dark:border-white/5 text-left">
                            <SheetTitle className="flex items-center gap-3">
                                <div className="size-10 bg-primary rounded-xl flex items-center justify-center">
                                    <Store className="text-white size-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-xl font-outfit leading-none">Mon Espace</span>
                                    <span className="text-[10px] uppercase tracking-widest text-primary font-bold mt-1">Chez-BEN2 Cameroun</span>
                                </div>
                            </SheetTitle>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2 mt-4">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            "flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all",
                                            isActive
                                                ? "bg-primary text-white shadow-lg shadow-primary/30"
                                                : "text-muted-foreground hover:bg-gray-50 dark:hover:bg-white/5"
                                        )}
                                    >
                                        <item.icon className="size-5" />
                                        <span className="flex-1">{item.title}</span>
                                        {((item.title === "Notifications" && unreadNotifications > 0) || (item.title === "Messages" && unreadMessages > 0)) && (
                                            <span className="bg-white text-primary text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                                                {item.title === "Notifications" ? unreadNotifications : unreadMessages}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="p-6 border-t border-gray-100 dark:border-white/5 space-y-3">
                            <Button variant="outline" className="w-full justify-start gap-3 h-14 rounded-2xl font-bold" asChild>
                                <Link href="/">
                                    <Home className="size-5" />
                                    Retour à l'accueil
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 h-14 rounded-2xl text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-500/10"
                                onClick={handleSignOut}
                            >
                                <LogOut className="size-5" />
                                Déconnexion
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
