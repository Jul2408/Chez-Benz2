'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    BarChart3,
    MessageSquare,
    Package,
    TrendingUp,
    Plus,
    ArrowUpRight,
    Zap,
    Target,
    Heart,
    ShoppingBag,
    History,
    UserCircle,
    Store,
    Eye,
    ChevronRight,
    Search,
    Bell,
    ArrowRight,
    Settings
} from 'lucide-react';
import { BoostModal } from './BoostModal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks';

export default function DashboardClient({ user, profile, stats, recentListings = [], notificationsCount: initialNotifCount = 0 }: any) {
    const { unreadNotifications, unreadMessages, refreshCounts } = useNotifications();
    const [activeTab, setActiveTab] = useState('vendeur');
    const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="space-y-10">
            {/* Header de bienvenue dynamique avec effet parallaxe léger */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-slate-900 text-white p-8 md:p-12 rounded-[3rem] shadow-2xl"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -ml-32 -mb-32" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="relative shrink-0">
                            <div className="size-24 md:size-28 rounded-full border-4 border-white/10 overflow-hidden shadow-2xl bg-white/5">
                                {profile?.avatar_url ? (
                                    <img
                                        src={profile.avatar_url}
                                        alt={profile.full_name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-primary text-white text-3xl font-black">
                                        {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 bg-green-500 border-4 border-slate-900 rounded-full size-6 md:size-8" />
                        </div>
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-yellow-400 text-xs font-black uppercase tracking-[0.2em]">
                                <Zap className="size-3 fill-current" />
                                Statut {profile?.status || 'ACTIF'}
                            </div>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-outfit tracking-tight leading-none text-white">
                                Bienvenue, <br />
                                <span className="text-primary font-outfit">{profile?.full_name?.split(' ')[0] || 'Ami'}</span>.
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="rounded-2xl h-16 px-8 text-lg font-bold shadow-xl shadow-primary/40 hover:scale-[1.03] transition-all bg-primary hover:bg-primary/90" asChild>
                            <Link href="/annonces/create">
                                <Plus className="mr-2 h-6 w-6" />
                                Vendre un article
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" className="rounded-2xl h-16 px-8 text-lg font-bold border-white/20 hover:bg-white/10 text-white bg-transparent backdrop-blur-sm transition-all" asChild>
                            <Link href="/annonces">
                                <Search className="mr-2 h-6 w-6" />
                                Faire un achat
                            </Link>
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Sélecteur de rôle (Tabs) stylisé */}
            <Tabs defaultValue="vendeur" className="w-full" onValueChange={setActiveTab}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                    <TabsList className="bg-white dark:bg-slate-900 p-2 rounded-3xl h-20 w-full md:w-auto flex border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/20 dark:shadow-none">
                        <TabsTrigger value="vendeur" className="flex-1 md:w-48 rounded-2xl h-full font-black text-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 gap-3 transition-all duration-300">
                            <Store className="size-6" />
                            Vendeur
                        </TabsTrigger>
                        <TabsTrigger value="acheteur" className="flex-1 md:w-48 rounded-2xl h-full font-black text-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 gap-3 transition-all duration-300">
                            <ShoppingBag className="size-6" />
                            Acheteur
                        </TabsTrigger>
                    </TabsList>

                    <Link href="/dashboard/notifications" className="flex items-center gap-4 text-sm font-bold text-muted-foreground mr-4 hover:text-primary transition-colors group">
                        <div className="relative">
                            <Bell className="size-5 group-hover:rotate-12 transition-transform" />
                            {unreadNotifications > 0 && (
                                <span className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
                            )}
                        </div>
                        <span>Vous avez {unreadNotifications} notification{unreadNotifications > 1 ? 's' : ''}</span>
                    </Link>
                </div>

                <AnimatePresence mode="wait">
                    <TabsContent value="vendeur" key="vendeur" className="space-y-10 focus-visible:outline-none outline-none">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-10"
                        >
                            {/* Grille de stats Vendeur */}
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {[
                                    { title: "Mes Annonces", value: stats.listingCount, label: "En ligne", icon: Package, color: "text-blue-500", bg: "bg-blue-500/10", href: "/dashboard/annonces" },
                                    { title: "Visites", value: stats.viewsCount, label: "Cette semaine", icon: Eye, color: "text-purple-500", bg: "bg-purple-500/10", href: "/dashboard/annonces" },
                                    { title: "Demandes", value: stats.messagesCount, label: unreadMessages > 0 ? `${unreadMessages} nouveau${unreadMessages > 1 ? 'x' : ''}` : "Acheteurs", icon: MessageSquare, color: "text-green-500", bg: "bg-green-500/10", href: "/dashboard/messages" },
                                    {
                                        title: "Crédit Pub",
                                        value: formatPrice(user?.credits || 0),
                                        label: "Portefeuille",
                                        icon: Zap,
                                        color: "text-yellow-500",
                                        bg: "bg-yellow-500/10",
                                        href: "/dashboard/credits"
                                    }
                                ].map((stat, i) => (
                                    <Link href={stat.href || "#"} key={i} className="block">
                                        <Card className="border-none shadow-xl shadow-gray-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden group hover:scale-[1.02] transition-all h-full">
                                            <CardContent className="p-8">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className={`size-14 rounded-2xl ${stat.bg} flex items-center justify-center transition-all group-hover:rotate-12`}>
                                                        <stat.icon className={`h-7 w-7 ${stat.color}`} />
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">{stat.title}</p>
                                                        <p className="text-[10px] font-bold text-primary/60">{stat.label}</p>
                                                    </div>
                                                </div>
                                                <div className="text-4xl font-black font-outfit text-foreground">{stat.value}</div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>

                            {/* Section de gestion vendeur */}
                            <div className="grid gap-8 lg:grid-cols-5">
                                <Card className="lg:col-span-3 border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden">
                                    <CardHeader className="p-10 pb-0">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-3xl font-black font-outfit">Ventes récentes</CardTitle>
                                                <CardDescription className="text-lg">Suivez vos articles publiés.</CardDescription>
                                            </div>
                                            <Button variant="ghost" className="font-bold text-primary gap-2 h-12 rounded-xl" asChild>
                                                <Link href="/dashboard/annonces">
                                                    Voir tout <ArrowRight className="size-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-10">
                                        {recentListings.length > 0 ? (
                                            <div className="space-y-4">
                                                {recentListings.map((listing: any) => (
                                                    <div key={listing.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl hover:bg-muted/50 transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            <div className="size-12 rounded-xl bg-gray-200 overflow-hidden relative">
                                                                {listing.cover_image ? (
                                                                    <Image src={listing.cover_image} alt={listing.title} fill className="object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                        <Package className="size-6" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold truncate max-w-[150px]">{listing.title}</p>
                                                                <p className="text-xs text-muted-foreground">{new Date(listing.created_at).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-black text-primary">{new Intl.NumberFormat('fr-FR').format(listing.price)} FCFA</p>
                                                            <Badge variant="outline" className="text-[10px] h-5">{listing.status}</Badge>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-6 py-24 bg-gray-50 dark:bg-slate-800/40 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-white/5">
                                                {stats.listingCount > 0 && (
                                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-lg text-sm font-medium mb-4">
                                                        Vous avez {stats.listingCount} annonce(s) mais elles ne s'affichent pas ici ? Vérifiez la console (F12) pour les erreurs de chargement.
                                                    </div>
                                                )}
                                                <div className="size-24 rounded-[2rem] bg-white dark:bg-slate-900 flex items-center justify-center shadow-2xl transform group-hover:rotate-6 transition-transform">
                                                    <Package className="h-10 w-10 text-primary/30" />
                                                </div>
                                                <div className="text-center space-y-2">
                                                    <p className="font-black text-2xl text-foreground">Prêt à vendre ?</p>
                                                    <p className="text-muted-foreground max-w-xs mx-auto text-lg font-medium">Déposez votre première annonce et touchez des milliers de clients au Cameroun.</p>
                                                </div>
                                                <Button size="lg" className="rounded-2xl font-black h-16 px-10 shadow-lg shadow-primary/20" asChild>
                                                    <Link href="/annonces/create">Publier maintenant</Link>
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <div className="lg:col-span-2 space-y-8">
                                    <Card className="border-none shadow-2xl bg-gradient-to-br from-primary to-orange-500 text-white rounded-[3rem] p-10 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
                                            <Zap className="size-40" />
                                        </div>
                                        <h3 className="text-3xl font-black font-outfit mb-6">Boost PRO 🚀</h3>
                                        <p className="text-white/90 text-lg font-medium mb-8 leading-relaxed">
                                            Vendez plus vite ! Nos options de mise en avant augmentent votre visibilité de <span className="underline decoration-yellow-400 decoration-4">800%</span>.
                                        </p>
                                        <Button
                                            variant="secondary"
                                            className="w-full rounded-2xl font-black h-16 text-lg text-primary shadow-xl hover:scale-[1.02] transition-transform"
                                            onClick={() => setIsBoostModalOpen(true)}
                                        >
                                            Activer un Boost
                                        </Button>
                                    </Card>

                                    <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[3rem] p-10">
                                        <h3 className="text-2xl font-black font-outfit mb-8">Navigation Rapide</h3>
                                        <div className="space-y-4">
                                            {[
                                                { title: "Gérer mes annonces", href: "/dashboard/annonces" },
                                                { title: "Messages acheteurs", href: "/dashboard/messages" },
                                                { title: "Paramètres boutique", href: "/dashboard/settings" }
                                            ].map((link, i) => (
                                                <Link
                                                    key={i}
                                                    href={link.href}
                                                    className="flex items-center justify-between p-6 rounded-[1.5rem] bg-gray-50 dark:bg-slate-800/50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all group"
                                                >
                                                    <span className="font-black text-lg group-hover:text-primary transition-colors">{link.title}</span>
                                                    <div className="size-10 rounded-xl bg-white dark:bg-slate-900 shadow-md flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                                        <ArrowUpRight className="size-5" />
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="acheteur" key="acheteur" className="space-y-10 focus-visible:outline-none outline-none">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            {/* Grille de stats Acheteur */}
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 group overflow-hidden">
                                    <div className="flex items-center gap-6">
                                        <div className="size-16 rounded-2xl bg-red-500/10 flex items-center justify-center transition-transform group-hover:scale-110">
                                            <Heart className="size-8 text-red-500 fill-current" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Favoris</p>
                                            <p className="text-4xl font-black font-outfit">{stats.favoritesCount}</p>
                                        </div>
                                    </div>
                                </Card>
                                <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 group overflow-hidden">
                                    <div className="flex items-center gap-6">
                                        <div className="size-16 rounded-2xl bg-blue-500/10 flex items-center justify-center transition-transform group-hover:scale-110">
                                            <History className="size-8 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Vus récemment</p>
                                            <p className="text-4xl font-black font-outfit">{stats.historyCount || 0}</p>
                                        </div>
                                    </div>
                                </Card>
                                <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 group overflow-hidden">
                                    <div className="flex items-center gap-6">
                                        <div className="size-16 rounded-2xl bg-orange-500/10 flex items-center justify-center transition-transform group-hover:scale-110">
                                            <ShoppingBag className="size-8 text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Achats</p>
                                            <p className="text-4xl font-black font-outfit">{stats.purchasesCount || 0}</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden">
                                <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-3xl font-black font-outfit">Mes Favoris</CardTitle>
                                        <CardDescription className="text-lg">Les pépites que vous avez gardées.</CardDescription>
                                    </div>
                                    <Button variant="outline" className="rounded-2xl h-14 px-8 font-black gap-2" asChild>
                                        <Link href="/annonces">Scanner de nouvelles offres</Link>
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-10">
                                    <div className="flex flex-col items-center justify-center gap-6 py-24 bg-gray-50 dark:bg-slate-800/40 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-white/5">
                                        <div className="size-24 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-2xl">
                                            <Heart className="h-10 w-10 text-red-500 opacity-30" />
                                        </div>
                                        <div className="text-center space-y-2">
                                            <p className="font-black text-2xl text-foreground">Votre liste est vide</p>
                                            <p className="text-muted-foreground max-w-xs mx-auto text-lg font-medium">Cliquez sur l'icône cœur sur une annonce pour la sauvegarder ici.</p>
                                        </div>
                                        <Button size="lg" className="rounded-2xl font-black h-16 px-10" asChild>
                                            <Link href="/annonces">Découvrir le catalogue</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid gap-6 md:grid-cols-3">
                                {
                                    [
                                        { title: "Paramètres boutique", icon: Settings, href: "/dashboard/settings" },
                                        { title: "Historique des achats", icon: ShoppingBag, href: "/dashboard/achats" },
                                        { title: "Mon Profil", icon: UserCircle, href: "/dashboard/settings" }
                                    ].map((item, i) => (
                                        <Button key={i} variant="ghost" className="w-full justify-start h-20 rounded-3xl gap-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/20 dark:shadow-none hover:bg-primary/5 group px-6" asChild>
                                            <Link href={item.href}>
                                                <div className="size-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all">
                                                    <item.icon className="size-5" />
                                                </div>
                                                <span className="font-bold text-foreground">{item.title}</span>
                                                <ChevronRight className="ml-auto size-4 text-muted-foreground opacity-30 group-hover:opacity-100" />
                                            </Link>
                                        </Button>
                                    ))
                                }
                            </div>
                        </motion.div>
                    </TabsContent>
                </AnimatePresence>
            </Tabs>

            <BoostModal
                isOpen={isBoostModalOpen}
                onClose={() => setIsBoostModalOpen(false)}
                annonceTitle="Promotion Générale"
                annonceId="general-boost"
                categorySlug=""
            />
        </div>
    );
}
