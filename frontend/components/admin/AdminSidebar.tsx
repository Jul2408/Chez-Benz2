'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Layers,
    ShieldCheck,
    BellRing,
    Settings2,
    Activity,
    Star,
    Users,
    ShoppingBag,
    ExternalLink,
    PieChart,
    ChevronLeft,
    LogOut,
    Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { signOut } from '@/utils/supabase-helpers';
import { toast } from 'sonner';

export function AdminSidebar({ user }: any) {
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
        await signOut();
        toast.success("Déconnexion réussie");
        window.location.href = '/';
    };

    return (
        <aside className="hidden lg:flex w-72 shrink-0 border-r bg-slate-900 border-white/5 flex-col h-screen sticky top-0 text-slate-300">
            {/* Logo de l'administration */}
            <div className="p-8 pb-4">
                <Link href="/admin" className="flex items-center gap-3 group mb-8">
                    <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-[-5deg] transition-transform shadow-primary/20">
                        <ShieldCheck className="text-white size-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-xl font-outfit tracking-tighter text-white">ADMIN</span>
                        <span className="text-[10px] text-primary font-black uppercase tracking-widest leading-none">Chez-BEN2</span>
                    </div>
                </Link>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                            <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white leading-none">Système On</p>
                            <p className="text-[10px] text-slate-400 mt-1">Serveur Cameroun 🇨🇲</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Sections */}
            <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto scrollbar-hide">
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
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 group relative",
                                            isActive
                                                ? "bg-primary text-white shadow-xl shadow-primary/20"
                                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "h-5 w-5 transition-transform group-hover:scale-110",
                                            isActive ? "text-white" : "text-slate-500 group-hover:text-white"
                                        )} />
                                        {item.title}
                                        {isActive && (
                                            <div className="absolute right-3 size-1 bg-white rounded-full" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-6 border-t border-white/5 space-y-3">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-bold"
                    asChild
                >
                    <Link href="/">
                        <Home className="h-4 w-4" />
                        Retour au Site
                    </Link>
                </Button>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 font-bold"
                    onClick={handleSignOut}
                >
                    <LogOut className="h-4 w-4" />
                    Quitter le Panel
                </Button>
            </div>
        </aside>
    );
}
