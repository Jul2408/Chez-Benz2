'use client';

import React, { useState, useEffect } from 'react';
import {
    PieChart as PieChartIcon,
    BarChart3,
    TrendingUp,
    Users,
    Package,
    MapPin,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Download,
    Filter,
    CheckCircle2,
    Clock,
    ShoppingCart,
    Loader2,
    ShieldCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { motion } from 'framer-motion';
import { getAdminStats } from '@/utils/supabase-helpers';
import { cn } from '@/lib/utils';

export default function AdminAnalyticsPage() {
    const [period, setPeriod] = useState('30d');
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Analyse des flux en cours...</p>
            </div>
        );
    }

    const cityColors = ["bg-primary", "bg-blue-500", "bg-indigo-500", "bg-amber-500", "bg-rose-500"];

    return (
        <div className="space-y-10">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black font-outfit tracking-tight text-slate-900 dark:text-white">Analyses de Données</h1>
                    <p className="text-slate-500 font-medium mt-1">Exploration détaillée de la croissance de Chez-BEN2.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Select defaultValue={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[180px] h-12 rounded-xl bg-white dark:bg-slate-900 border-gray-100 dark:border-white/5 font-bold">
                            <Calendar className="size-4 mr-2 text-slate-400" />
                            <SelectValue placeholder="Période" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl p-2 bg-white dark:bg-slate-800 border-gray-100 dark:border-white/5">
                            <SelectItem value="7d" className="rounded-xl font-bold">7 derniers jours</SelectItem>
                            <SelectItem value="30d" className="rounded-xl font-bold">30 derniers jours</SelectItem>
                            <SelectItem value="90d" className="rounded-xl font-bold">3 derniers mois</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button className="h-12 px-6 rounded-xl font-bold gap-2 shadow-xl shadow-primary/20 bg-primary text-white border-none">
                        <Download className="size-4" /> Exporter CSV
                    </Button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Total Utilisateurs", value: stats.kpis.total_users, trend: "up", color: "text-blue-500" },
                    { title: "Annonces Actives", value: stats.kpis.active_listings, trend: "up", color: "text-green-500" },
                    { title: "Volume Messages", value: stats.kpis.total_messages, trend: "up", color: "text-slate-900 dark:text-white" },
                    { title: "Performance Revenue", value: "+15.2%", trend: "up", color: "text-primary" }
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden group">
                        <CardContent className="p-8">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{stat.title}</p>
                            <div className="flex items-end gap-3">
                                <h3 className={`text-3xl font-black font-outfit ${stat.color}`}>{stat.value}</h3>
                                <div className="mb-1">
                                    <ArrowUpRight className="size-5 text-green-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Evolution Graph (Semi-Real Mock) */}
                <Card className="lg:col-span-2 border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-10 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-black font-outfit text-slate-900 dark:text-white">Volume d'Annonces</CardTitle>
                                <CardDescription className="font-medium text-slate-400">Total des annonces traitées par jour</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10 pt-0">
                        <div className="h-[400px] w-full mt-6 flex items-end justify-between gap-2 p-4 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-slate-100 dark:border-white/5">
                            {Array.from({ length: 15 }).map((_, i) => {
                                const height = 40 + Math.random() * 50;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            className="w-full bg-primary rounded-t-lg group-hover:scale-y-105 transition-transform origin-bottom"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between mt-6 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span>Début Période</span>
                            <span>Aujourd'hui</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Distribution Géo Réelle */}
                <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[3rem] p-10">
                    <CardHeader className="p-0 mb-8">
                        <CardTitle className="text-2xl font-black font-outfit text-slate-900 dark:text-white">Géographie</CardTitle>
                        <CardDescription className="font-medium text-slate-400">Volume par ville (Données réelles)</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 space-y-8">
                        {stats.top_villes.length > 0 ? stats.top_villes.map((ville: any, i: number) => (
                            <div key={i} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-extrabold text-slate-700 dark:text-slate-300">{ville.city}</span>
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

                        <div className="mt-10 p-6 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-dashed border-slate-200 dark:border-white/10">
                            <div className="flex items-center gap-4 text-primary">
                                <TrendingUp className="size-6" />
                                <div>
                                    <p className="text-xs font-black uppercase">Répartition active</p>
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mt-1">
                                        {stats.top_villes[0]?.city || 'Douala'} concentre le plus gros flux.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row: Moderation stats & Top Sellers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[3rem] p-10">
                    <h3 className="text-2xl font-black font-outfit mb-8 text-slate-900 dark:text-white">Top Vendeurs (Réels)</h3>
                    <div className="space-y-4">
                        {stats.top_sellers.length > 0 ? stats.top_sellers.map((vendeur: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-colors border border-transparent hover:border-gray-100 dark:hover:border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                                        {vendeur.avatar_initials}
                                    </div>
                                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{vendeur.full_name}</span>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-900 dark:text-white">{vendeur.sales} ventes</p>
                                    <p className="text-[10px] font-black uppercase text-slate-400">
                                        {vendeur.listings} annonces
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-slate-400 py-10 font-bold">Aucune activité récente</p>
                        )}
                    </div>
                </Card>

                <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[3rem] p-10">
                    <h3 className="text-2xl font-black font-outfit mb-8 text-slate-900 dark:text-white">Flux de Modération</h3>
                    <div className="flex items-center justify-center py-10">
                        <div className="relative size-64">
                            <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100 dark:stroke-white/5" strokeWidth="4" />
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-primary" strokeWidth="4" strokeDasharray="100, 100" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black font-outfit text-slate-900 dark:text-white">{stats.kpis.active_listings}</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">Annonces en ligne</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        {stats.listing_stats.map((stat: any, i: number) => (
                            <div key={i} className="text-center p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                <p className="text-xl font-black text-slate-900 dark:text-white">{stat.count}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase">{stat.status}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
