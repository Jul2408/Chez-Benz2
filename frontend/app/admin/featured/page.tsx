'use client';

import React, { useState, useEffect } from 'react';
import {
    Star,
    Zap,
    Calendar,
    Search,
    Filter,
    ExternalLink,
    CheckCircle2,
    ArrowUpRight,
    BadgeCheck,
    Clock,
    Wallet,
    TrendingUp,
    MoreHorizontal,
    Plus,
    X,
    Loader2,
    Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getAdminBoosts, deleteBoost, formatPrice } from '@/utils/supabase-helpers';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdminFeaturedAnnoncesPage() {
    const [boosts, setBoosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchBoosts = async () => {
        setLoading(true);
        const data = await getAdminBoosts();
        setBoosts(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchBoosts();
    }, []);

    const handleDeleteBoost = async (id: string) => {
        if (!confirm("Voulez-vous vraiment annuler ce boost ?")) return;
        try {
            await deleteBoost(id);
            toast.success("Boost annulé.");
            fetchBoosts();
        } catch (error) {
            toast.error("Erreur lors de l'annulation.");
        }
    };

    const filteredBoosts = boosts.filter(b =>
        (b.listing_title?.toLowerCase() || '').includes(search.toLowerCase())
    );

    const activeBoostsCount = boosts.filter(b => b.is_active).length;
    const totalRevenue = boosts.reduce((acc, b) => acc + (parseFloat(b.amount) || 0), 0);

    return (
        <div className="space-y-10">
            {/* Header / Stats Summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black font-outfit tracking-tight text-slate-900 dark:text-white">Annonces à la Une</h1>
                    <p className="text-slate-500 font-medium mt-1">Gérez les mises en avant payantes et les boosts actifs.</p>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-100 dark:border-white/5 font-bold gap-2 bg-white dark:bg-slate-900">
                        <Filter className="size-4 text-slate-400" /> Filtres
                    </Button>
                    <Button className="h-12 px-8 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20 bg-primary text-white border-none">
                        <Plus className="size-5" /> Offrir un Boost
                    </Button>
                </div>
            </div>

            {/* Performance Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="border-none shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2.5rem] p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                        <TrendingUp className="size-32" />
                    </div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="size-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 text-primary">
                            <Wallet className="size-6" />
                        </div>
                        <p className="text-4xl font-black font-outfit">{formatPrice(totalRevenue)}</p>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Revenu Total Boosts</p>
                    </div>
                </Card>

                <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 group">
                    <div className="flex items-center justify-between mb-8">
                        <div className="size-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                            <Star className="size-6 fill-current" />
                        </div>
                        <Badge className="bg-amber-500/10 text-amber-600 border-none font-bold">LIVE</Badge>
                    </div>
                    <p className="text-4xl font-black font-outfit text-slate-900 dark:text-white">{activeBoostsCount}</p>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Boosts Actifs</p>
                </Card>

                <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 group">
                    <div className="flex items-center justify-between mb-8">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <Zap className="size-6" />
                        </div>
                        <Badge className="bg-primary/10 text-primary border-none font-bold">Stable</Badge>
                    </div>
                    <p className="text-4xl font-black font-outfit text-slate-900 dark:text-white">{boosts.length}</p>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Total Historique</p>
                </Card>
            </div>

            {/* Main Table Card */}
            <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden">
                <div className="p-10 pb-0 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Chercher une annonce boostée ..."
                            className="h-12 pl-12 rounded-xl bg-slate-50 dark:bg-white/5 border-none font-bold"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="p-10">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center gap-4">
                            <Loader2 className="h-10 w-10 text-primary animate-spin" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Chargement des boosts...</p>
                        </div>
                    ) : filteredBoosts.length > 0 ? (
                        <div className="border border-slate-100 dark:border-white/5 rounded-[2rem] overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50 dark:bg-white/5">
                                    <TableRow className="hover:bg-transparent border-none">
                                        <TableHead className="h-16 px-8 font-black uppercase tracking-widest text-[10px] text-slate-400">ID Annonce</TableHead>
                                        <TableHead className="h-16 px-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Durée (Jours)</TableHead>
                                        <TableHead className="h-16 px-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Montant</TableHead>
                                        <TableHead className="h-16 px-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Date Début</TableHead>
                                        <TableHead className="h-16 px-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Expiration</TableHead>
                                        <TableHead className="h-16 px-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Statut</TableHead>
                                        <TableHead className="h-16 px-8 text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBoosts.map((item) => (
                                        <TableRow key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 border-slate-100 dark:border-white/5 transition-colors group">
                                            <TableCell className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-extrabold text-slate-900 dark:text-white">Listing #{item.listing}</span>
                                                    <span className="text-[10px] font-bold text-slate-400">TRANS: {item.transaction_id || 'N/A'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-8 py-6 font-bold text-slate-700 dark:text-slate-300">
                                                {item.duration_days} jours
                                            </TableCell>
                                            <TableCell className="px-8 py-6 font-black text-green-600">
                                                {formatPrice(parseFloat(item.amount))}
                                            </TableCell>
                                            <TableCell className="px-8 py-6 text-xs font-bold text-slate-500">
                                                {new Date(item.start_date).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-slate-500 font-bold">
                                                    <Clock className="size-4" />
                                                    {new Date(item.end_date).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-8 py-6">
                                                <Badge variant="outline" className={cn(
                                                    "rounded-full font-bold border-2",
                                                    item.is_active ? "border-green-500/20 text-green-500 bg-green-50 dark:bg-green-500/10" : "border-slate-200 text-slate-400 bg-slate-50 dark:bg-white/5"
                                                )}>
                                                    {item.is_active ? 'ACTIF' : 'EXPIRÉ'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-8 py-6 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                                    onClick={() => handleDeleteBoost(item.id)}
                                                >
                                                    <Trash2 className="size-5" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <Zap className="size-12 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-xl font-black">Aucun boost trouvé</h3>
                            <p className="text-slate-400 font-medium">Les annonces boostées apparaîtront ici.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
