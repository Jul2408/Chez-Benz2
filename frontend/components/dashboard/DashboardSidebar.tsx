'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Package,
    MessageSquare,
    Heart,
    Settings,
    LogOut,
    PlusCircle,
    Home,
    ArrowLeft,
    ShoppingBag,
    Store,
    User,
    Wallet,
    Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from '@/utils/supabase-helpers';
import { toast } from 'sonner';
import { Profile } from '@/types';
import { useNotifications } from '@/hooks';

interface DashboardSidebarProps {
    profile?: Profile;
}

export function DashboardSidebar({ profile }: DashboardSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
            toast.success("À bientôt sur Chez-BEN2 !");
            window.location.href = '/';
        } catch (error) {
            toast.error("Erreur lors de la déconnexion");
        }
    };

    const sections = [
        {
            label: "Principal",
            items: [
                { title: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
                { title: "Notifications", href: "/dashboard/notifications", icon: Bell },
            ]
        },
        {
            label: "Vendre",
            items: [
                { title: "Mes Annonces", href: "/dashboard/annonces", icon: Package },
                { title: "Messages Ventes", href: "/dashboard/messages", icon: MessageSquare },
                { title: "Portefeuille Pro", href: "/dashboard/credits", icon: Wallet },
            ]
        },
        {
            label: "Acheter",
            items: [
                { title: "Mes Favoris", href: "/dashboard/favoris", icon: Heart },
                { title: "Mes Achats", href: "/dashboard/achats", icon: ShoppingBag },
            ]
        },
        {
            label: "Paramètres",
            items: [
                { title: "Mon Profil / Boutique", href: "/dashboard/settings", icon: Settings },
            ]
        }
    ];

    const { unreadNotifications, unreadMessages } = useNotifications();

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-white/5">
            {/* Logo & Retour Accueil */}
            <div className="p-8 pb-4">
                <Link href="/" className="flex items-center gap-3 group mb-8">
                    <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-[-10deg] transition-transform">
                        <Home className="text-white size-5" />
                    </div>
                    <span className="font-black text-xl font-outfit tracking-tighter text-slate-900 dark:text-white">Chez-BEN2</span>
                </Link>

                <div className="bg-slate-900 dark:bg-primary/20 rounded-[1.5rem] p-4 border border-white/10 shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="size-12 shrink-0 rounded-full border-2 border-white/20 overflow-hidden bg-slate-800">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.full_name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-white font-bold bg-primary">
                                    {profile?.full_name?.charAt(0).toUpperCase() || <User className="size-5" />}
                                </div>
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="font-bold text-white truncate text-sm">
                                {profile?.full_name || 'Utilisateur'}
                            </h3>
                            <p className="text-xs text-white/60 truncate flex items-center gap-1">
                                {profile?.username ? `@${profile.username}` : 'Vendeur'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Principale avec Sections */}
            <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar">
                {sections.map((section, idx) => (
                    <div key={idx} className="space-y-2">
                        <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                            {section.label}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href;
                                const badgeCount = item.title === "Notifications" ? unreadNotifications : (item.title === "Messages Ventes" ? unreadMessages : 0);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 group relative",
                                            isActive
                                                ? "bg-primary text-white shadow-lg shadow-primary/30"
                                                : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "h-5 w-5 transition-transform group-hover:scale-110",
                                            isActive ? "text-white" : "text-muted-foreground group-hover:text-primary"
                                        )} />
                                        <span>{item.title}</span>
                                        {badgeCount > 0 && (
                                            <div className="ml-auto bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg animate-pulse">
                                                {badgeCount > 99 ? '99+' : badgeCount}
                                            </div>
                                        )}
                                        {isActive && !badgeCount && (
                                            <div className="absolute right-3 size-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="px-6 pb-2">
                <Button
                    asChild
                    className="w-full rounded-2xl h-14 font-black shadow-xl shadow-primary/20 bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 transition-all hover:scale-[1.02]"
                >
                    <Link href="/annonces/create">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Vendre un truc
                    </Link>
                </Button>
            </div>

            {/* Footer de la Sidebar */}
            <div className="p-6 border-t border-gray-100 dark:border-white/5 space-y-3">
                <Button
                    variant="outline"
                    className="w-full justify-start gap-3 py-6 rounded-2xl border-2 border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 font-bold"
                    onClick={() => router.push('/')}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Retour au site
                </Button>

                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 py-6 rounded-2xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold"
                    onClick={handleSignOut}
                >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                </Button>
            </div>
        </div>
    );
}
