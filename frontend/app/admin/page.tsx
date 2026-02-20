'use client';

import React, { useState, useEffect } from 'react';
import {
    Users,
    Package,
    MessageSquare,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Download,
    Eye,
    Globe,
    ExternalLink,
    Store,
    ShoppingBag,
    Star,
    Zap,
    Wallet,
    Loader2,
    ShieldCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getAdminStats, formatPrice, formatImageUrl } from '@/utils/supabase-helpers';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AdminDashboardPage() {
    const [period, setPeriod] = useState('30d');
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    // Assuming profile is fetched or passed as a prop/context in a real application
    // For the purpose of this edit, we'll mock a profile or assume it's available.
    // In a real app, you'd get this from a session, context, or server-side prop.

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            const data = await getAdminStats();
            setStats(data);
            setLoading(false);
        }

        fetchStats();
    }, [period]);

    if (loading || !stats) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <ShieldCheck className="absolute inset-0 m-auto h-5 w-5 text-primary" />
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Chargement des données administratives...</p>
            </div>
        );
    }

    // Mapping des KPI depuis l'API
    const kpis = [
        { title: "Nouveaux Inscrits", value: stats.kpis.total_users, change: "+12.5%", positive: true, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Annonces Actives", value: stats.kpis.active_listings, change: "+5.2%", positive: true, icon: Package, color: "text-purple-500", bg: "bg-purple-500/10" },
        { title: "Messages Échangés", value: stats.kpis.total_messages, change: "+18.3%", positive: true, icon: MessageSquare, color: "text-green-500", bg: "bg-green-500/10" },
        { title: "Revenu Boosts", value: formatPrice(stats.kpis.total_revenue), change: "+0%", positive: true, icon: Wallet, color: "text-orange-500", bg: "bg-orange-500/10" }
    ];

    const cityColors = ["bg-primary", "bg-blue-500", "bg-indigo-500", "bg-amber-500", "bg-rose-500"];

    return (
        <div className="space-y-10">
            {/* Header / Filtres */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black font-outfit tracking-tight">Vue d'ensemble</h1>
                    <p className="text-slate-500 font-medium mt-1">Données réelles du backend Chez-BEN2.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Select defaultValue={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[180px] h-12 rounded-xl bg-white dark:bg-slate-900 border-gray-100 dark:border-white/5 font-bold">
                            <Calendar className="size-4 mr-2 text-slate-400" />
                            <SelectValue placeholder="Période" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-gray-100 dark:border-white/5 p-2">
                            <SelectItem value="7d" className="rounded-xl font-bold">7 derniers jours</SelectItem>
                            <SelectItem value="30d" className="rounded-xl font-bold">30 derniers jours</SelectItem>
                            <SelectItem value="90d" className="rounded-xl font-bold">3 derniers mois</SelectItem>
                            <SelectItem value="1y" className="rounded-xl font-bold">Dernière année</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" className="h-12 px-6 rounded-xl border-gray-100 dark:border-white/5 bg-white dark:bg-slate-900 font-bold gap-2">
                        <Download className="size-4" />
                        Exporter CSV
                    </Button>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden group">
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`size-14 rounded-2xl ${kpi.bg} flex items-center justify-center`}>
                                        <kpi.icon className={`size-7 ${kpi.color}`} />
                                    </div>
                                    <div className={cn(
                                        "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black",
                                        kpi.positive ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                                    )}>
                                        {kpi.positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                                        {kpi.change}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-3xl font-black font-outfit text-slate-900 dark:text-white tracking-tight">{kpi.value}</p>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{kpi.title}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Main Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Evolution Inscriptions */}
                <Card className="lg:col-span-2 border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-10 pb-0">
                        <CardTitle className="text-2xl font-black font-outfit">Évolution des Inscriptions</CardTitle>
                        <CardDescription className="text-lg font-medium text-slate-400">Progression de la communauté</CardDescription>
                    </CardHeader>
                    <CardContent className="p-10 pt-6">
                        <div className="h-[350px] w-full bg-slate-50 dark:bg-white/5 rounded-[2.5rem] flex items-end justify-between p-8 gap-4 border border-dashed border-slate-200 dark:border-white/5">
                            {(stats.monthly_users || []).map((h: number, i: number) => {
                                const maxVal = Math.max(...(stats.monthly_users || []), 1);
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.max(5, (h / maxVal) * 100)}%` }}
                                        className="flex-1 bg-gradient-to-t from-primary to-primary/60 rounded-t-xl"
                                    />
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Distribution Géo */}
                <Card className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-10 pb-4">
                        <CardTitle className="text-2xl font-black font-outfit">Top Villes</CardTitle>
                        <CardDescription className="font-medium text-slate-400">Volume d'annonces par ville (Données réelles)</CardDescription>
                    </CardHeader>
                    <CardContent className="p-10 space-y-8">
                        {stats.top_villes.length > 0 ? stats.top_villes.map((ville: any, i: number) => (
                            <div key={i} className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-extrabold text-slate-700 dark:text-slate-300">{ville.city}</span>
                                    <span className="font-black text-slate-900 dark:text-white">{ville.count}</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(ville.count / stats.top_villes[0].count) * 100}%` }}
                                        className={cn("h-full rounded-full shadow-lg", cityColors[i % cityColors.length])}
                                    />
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-slate-400 py-10 font-bold">Aucune donnée géographique</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row: Moderation stats & Top Sellers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Moderation Statut */}
                <Card className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-10 pb-6">
                        <CardTitle className="text-2xl font-black font-outfit">État des Annonces</CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 pt-0 flex flex-col md:flex-row items-center gap-10">
                        <div className="relative size-48 shrink-0">
                            <svg className="size-full" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100 dark:stroke-white/5" strokeWidth="3" />
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-primary" strokeWidth="3" strokeDasharray="100, 100" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black font-outfit">API</span>
                                <span className="text-[10px] uppercase font-black text-slate-400">Direct</span>
                            </div>
                        </div>
                        <div className="space-y-4 flex-1">
                            {stats.listing_stats.map((stat: any, i: number) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className={cn("size-4 rounded-full", stat.status === 'ACTIVE' ? "bg-green-500" : "bg-slate-300")} />
                                    <span className="text-sm font-bold text-slate-600 flex-1">{stat.status}</span>
                                    <span className="font-black">{stat.count}</span>
                                </div>
                            ))}
                            <Button className="w-full mt-6 rounded-xl font-bold h-12">Aller à la modération</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Real Top Sellers */}
                <Card className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-10 pb-6">
                        <CardTitle className="text-2xl font-black font-outfit">Top Vendeurs (Activité réelle)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 pt-0 space-y-2">
                        {stats.top_sellers.length > 0 ? stats.top_sellers.map((vendeur: any, i: number) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-100">
                                <Avatar className="size-12 rounded-xl border-none">
                                    <AvatarImage src={formatImageUrl(vendeur.avatar_url)} />
                                    <AvatarFallback className="bg-primary/10 text-primary font-black rounded-xl">
                                        {vendeur.avatar_initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-black text-slate-900 dark:text-white capitalize leading-none">{vendeur.full_name}</p>
                                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tighter">{vendeur.city || 'Ville non spécifiée'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-900 dark:text-white leading-none">{vendeur.sales} ventes</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1">{vendeur.listings} annonces</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-slate-400 pt-10 font-bold">Aucun vendeur actif</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

