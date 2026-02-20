'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Menu,
    LayoutDashboard,
    Layers,
    ShieldCheck,
    BellRing,
    Settings2,
    Activity,
    Star,
    Users,
    ShoppingBag,
    PieChart,
    LogOut,
    Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { signOut } from '@/utils/supabase-helpers';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function AdminMobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const menuSections = [
        {
            label: "Général",
            items: [
                { title: "Vue d'ensemble", href: "/admin", icon: LayoutDashboard },
                { title: "Analytics", href: "/admin/analytics", icon: PieChart },
            ]
        },
        {
            label: "Gestion Contenu",
            items: [
                { title: "Catégories", href: "/admin/categories", icon: Layers },
                { title: "Toutes les Annonces", href: "/admin/annonces", icon: ShoppingBag },
                { title: "Annonces à la Une", href: "/admin/featured", icon: Star },
                { title: "Modération", href: "/admin/moderation", icon: ShieldCheck },
            ]
        },
        {
            label: "Utilisateurs & Com",
            items: [
                { title: "Utilisateurs", href: "/admin/users", icon: Users },
                { title: "Centre de Com", href: "/admin/notifications", icon: BellRing },
            ]
        },
        {
            label: "Configuration",
            items: [
                { title: "Paramètres Platform", href: "/admin/settings", icon: Settings2 },
                { title: "Logs d'activité", href: "/admin/logs", icon: Activity },
            ]
        }
    ];

    const handleSignOut = async () => {
        try {
            await signOut();
            toast.success("Déconnexion réussie");
            window.location.href = '/';
        } catch (error) {
            toast.error("Erreur de déconnexion");
        }
    };

    return (
        <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-white/5 sticky top-0 z-50">
            <Link href="/admin" className="flex items-center gap-2">
                <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
                    <ShieldCheck className="text-white size-4" />
                </div>
                <div className="flex flex-col">
                    <span className="font-black text-sm font-outfit leading-none">ADMIN</span>
                    <span className="text-[8px] uppercase tracking-widest text-primary font-bold">Chez-BEN2</span>
                </div>
            </Link>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-xl bg-gray-50 dark:bg-white/5">
                        <Menu className="size-6 text-foreground" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85%] p-0 border-none bg-slate-900 text-slate-300">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="p-6 border-b border-white/5 text-left">
                            <SheetTitle className="flex items-center gap-3">
                                <div className="size-10 bg-primary rounded-xl flex items-center justify-center">
                                    <ShieldCheck className="text-white size-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-xl font-outfit leading-none text-white tracking-tighter">ADMIN PANEL</span>
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mt-1">Chez-BEN2</span>
                                </div>
                            </SheetTitle>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto p-4 space-y-6 mt-4 scrollbar-hide">
                            {menuSections.map((section, idx) => (
                                <div key={idx} className="space-y-2">
                                    <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                        {section.label}
                                    </h3>
                                    <div className="space-y-1">
                                        {section.items.map((item) => {
                                            const isActive = pathname === item.href;
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setOpen(false)}
                                                    className={cn(
                                                        "flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold transition-all",
                                                        isActive
                                                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                                                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                                                    )}
                                                >
                                                    <item.icon className="size-5" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 border-t border-white/5 space-y-3">
                            <Button variant="ghost" className="w-full justify-start gap-3 h-14 rounded-2xl font-bold text-slate-400 hover:text-white hover:bg-white/5" asChild>
                                <Link href="/">
                                    <Home className="size-5" />
                                    Retour au Site
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 h-14 rounded-2xl text-red-400 font-bold hover:bg-red-500/10"
                                onClick={handleSignOut}
                            >
                                <LogOut className="size-5" />
                                Quitter le Panel
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
