'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Loader2,
    Check,
    X,
    Eye,
    Image as ImageIcon,
    User,
    Search,
    CheckCircle2
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
import { getModerationListings, approveListing, rejectListing } from '@/utils/supabase-helpers';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdminModerationPage() {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchListings = async () => {
        setLoading(true);
        const data = await getModerationListings();
        setListings(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const handleApprove = async (id: string, title: string) => {
        try {
            await approveListing(id);
            toast.success(`Annonce "${title}" approuvée.`);
            fetchListings();
        } catch (error) {
            toast.error("Erreur lors de l'approbation.");
        }
    };

    const handleReject = async (id: string, title: string) => {
        try {
            await rejectListing(id);
            toast.error(`Annonce "${title}" rejetée.`);
            fetchListings();
        } catch (error) {
            toast.error("Erreur lors du rejet.");
        }
    };

    const filteredListings = listings.filter(l =>
        (l.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (l.user_name?.toLowerCase() || '').includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black font-outfit tracking-tight">Modération</h1>
                    <p className="text-slate-500 font-medium mt-1">Approuvez ou rejetez les contenus suspects de la plateforme.</p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-2xl border border-gray-100 dark:bg-white/5 dark:border-white/5">
                    <Button variant="ghost" className={cn("rounded-xl h-10 px-6 font-black", listings.length > 0 ? "bg-white shadow-sm dark:bg-slate-800" : "text-slate-400")}>
                        En attente ({listings.length})
                    </Button>
                    <Button variant="ghost" className="rounded-xl h-10 px-6 font-black text-slate-400">Signalés (0)</Button>
                </div>
            </div>

            {/* Moderation Queue */}
            <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden">
                <div className="p-10 pb-4 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                            placeholder="Chercher une annonce ..."
                            className="h-12 pl-12 rounded-xl bg-slate-50 dark:bg-white/5 border-none font-bold"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="px-10 py-6">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center gap-4">
                            <Loader2 className="h-10 w-10 text-primary animate-spin" />
                            <p className="text-slate-400 font-bold tracking-widest uppercase text-[10px]">Chargement de la file...</p>
                        </div>
                    ) : filteredListings.length > 0 ? (
                        <Table>
                            <TableHeader className="bg-slate-50/50 dark:bg-white/5">
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-slate-400 px-8">Contenu</TableHead>
                                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-slate-400 px-8">Utilisateur</TableHead>
                                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-slate-400 px-8">Prix</TableHead>
                                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-slate-400 px-8">Date</TableHead>
                                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-slate-400 px-8">Statut</TableHead>
                                    <TableHead className="h-16 text-right px-8"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredListings.map((item) => (
                                    <TableRow key={item.id} className="border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                        <TableCell className="px-8 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="size-14 rounded-2xl bg-slate-100 dark:bg-white/10 shrink-0 flex items-center justify-center relative overflow-hidden">
                                                    {item.cover_image ? (
                                                        <img src={item.cover_image} alt="" className="size-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="size-6 text-slate-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-extrabold text-slate-900 dark:text-white line-clamp-1">{item.title}</p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">{item.category_name}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-8">
                                            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                                                <User className="size-4" /> {item.user_name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-8 text-xs font-black text-slate-900 dark:text-white">
                                            {new Intl.NumberFormat('fr-FR').format(item.price)} FCFA
                                        </TableCell>
                                        <TableCell className="px-8 py-8 text-xs font-bold text-slate-400">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="px-8 py-8">
                                            <Badge className="rounded-lg font-black text-[10px] px-3 py-1 border-none bg-orange-100 text-orange-600">
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-8 py-8 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-10 rounded-xl bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white transition-all shadow-lg shadow-green-500/10"
                                                    onClick={() => handleApprove(item.id, item.title)}
                                                >
                                                    <Check className="size-5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-10 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
                                                    onClick={() => handleReject(item.id, item.title)}
                                                >
                                                    <X className="size-5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="size-10 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 shadow-lg" asChild>
                                                    <Link href={`/annonces/${item.slug}`} target="_blank">
                                                        <Eye className="size-5" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="py-24 text-center space-y-4">
                            <div className="size-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-300">
                                <CheckCircle2 className="size-10" />
                            </div>
                            <h3 className="text-xl font-black font-outfit">Tout est propre !</h3>
                            <p className="text-slate-400 font-medium">Aucune annonce en attente de modération.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
