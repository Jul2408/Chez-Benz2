'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Loader2,
    Eye,
    Search,
    ShoppingBag,
    Filter,
    MoreHorizontal,
    Trash2,
    CheckCircle2,
    XCircle,
    User,
    Tag,
    Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
import { getAdminAllListings, formatPrice } from '@/utils/supabase-helpers';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdminAllAnnoncesPage() {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchListings = async () => {
        setLoading(true);
        const data = await getAdminAllListings();
        setListings(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const filteredListings = listings.filter(l =>
        (l.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (l.user_name?.toLowerCase() || '').includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Header / Stats Summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black font-outfit tracking-tight text-slate-900 dark:text-white">Inventaire Global</h1>
                    <p className="text-slate-500 font-medium mt-1">Supervisez l'ensemble des annonces publiées sur la plateforme.</p>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-100 dark:border-white/5 font-bold gap-2 bg-white dark:bg-slate-900">
                        <Filter className="size-4 text-slate-400" /> Filtres Avancés
                    </Button>
                </div>
            </div>

            {/* Listings Table Card */}
            <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden">
                <div className="p-10 pb-4 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Chercher une annonce (ID, Titre, Vendeur)..."
                            className="h-12 pl-12 rounded-xl bg-slate-50 dark:bg-white/5 border-none font-bold"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex bg-slate-50 dark:bg-white/5 p-1 rounded-2xl border border-gray-100 dark:border-white/5">
                        <Button variant="ghost" className="rounded-xl h-10 px-6 font-black bg-white shadow-sm dark:bg-slate-800">Toutes ({listings.length})</Button>
                        <Button variant="ghost" className="rounded-xl h-10 px-6 font-black text-slate-400">Actives</Button>
                        <Button variant="ghost" className="rounded-xl h-10 px-6 font-black text-slate-400">Archivées</Button>
                    </div>
                </div>

                <div className="px-10 py-6">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center gap-4">
                            <Loader2 className="h-10 w-10 text-primary animate-spin" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Récupération de l'inventaire...</p>
                        </div>
                    ) : filteredListings.length > 0 ? (
                        <Table>
                            <TableHeader className="bg-slate-50/50 dark:bg-white/5">
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-slate-400 px-8">Annonce</TableHead>
                                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-slate-400 px-8">Vendeur</TableHead>
                                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-slate-400 px-8">Prix</TableHead>
                                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-slate-400 px-8">Statut</TableHead>
                                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-slate-400 px-8">Date</TableHead>
                                    <TableHead className="h-16 text-right px-8"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredListings.map((item) => (
                                    <TableRow key={item.id} className="border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                        <TableCell className="px-8 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="size-16 rounded-2xl bg-slate-100 dark:bg-white/10 shrink-0 flex items-center justify-center relative overflow-hidden ring-1 ring-gray-100 dark:ring-white/5">
                                                    {item.cover_image ? (
                                                        <img src={item.cover_image} alt="" className="size-full object-cover" />
                                                    ) : (
                                                        <ShoppingBag className="size-6 text-slate-300" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-extrabold text-slate-900 dark:text-white line-clamp-1">{item.title}</span>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="text-[9px] font-black tracking-widest py-0 border-primary/20 text-primary uppercase">
                                                            {item.category_name}
                                                        </Badge>
                                                        {item.is_featured && (
                                                            <Badge className="bg-amber-500 text-white text-[9px] font-black border-none py-0">BOOST</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-8">
                                            <div className="flex items-center gap-2 font-bold text-slate-600 dark:text-slate-300">
                                                <div className="size-6 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <User className="size-3 text-primary" />
                                                </div>
                                                <span className="truncate max-w-[120px]">{item.user_name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-8">
                                            <span className="font-black text-slate-900 dark:text-white">
                                                {formatPrice(item.price)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-8 py-8">
                                            <Badge className={cn(
                                                "rounded-full font-black text-[10px] px-3 py-1 border-none uppercase",
                                                item.status === 'ACTIVE' ? "bg-green-100 text-green-600" :
                                                    item.status === 'PENDING' ? "bg-orange-100 text-orange-600" :
                                                        "bg-slate-100 text-slate-400"
                                            )}>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-8 py-8">
                                            <div className="flex flex-col text-xs font-bold text-slate-400">
                                                <span className="flex items-center gap-1"><Clock className="size-3" /> {new Date(item.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-8 text-right">
                                            <div className="flex items-center justify-end gap-2 outline-none">
                                                <Button variant="ghost" size="icon" className="size-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all" asChild>
                                                    <Link href={`/annonces/${item.slug}`} target="_blank">
                                                        <Eye className="size-5" />
                                                    </Link>
                                                </Button>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="size-10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5">
                                                            <MoreHorizontal className="size-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-2xl p-2 bg-white dark:bg-slate-800 border-gray-100 dark:border-white/5 shadow-2xl">
                                                        <DropdownMenuItem className="rounded-xl font-bold cursor-pointer gap-2">
                                                            <CheckCircle2 className="size-4 text-green-500" /> Approuver
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-xl font-bold cursor-pointer gap-2">
                                                            <XCircle className="size-4 text-orange-500" /> Archiver
                                                        </DropdownMenuItem>
                                                        <Separator className="my-2 bg-gray-100 dark:bg-white/5" />
                                                        <DropdownMenuItem className="rounded-xl font-bold cursor-pointer gap-2 text-red-500 focus:bg-red-50 dark:focus:bg-red-500/10">
                                                            <Trash2 className="size-4" /> Supprimer définitivement
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="py-24 text-center">
                            <ShoppingBag className="size-16 text-slate-100 mx-auto mb-4" />
                            <h3 className="text-xl font-black font-outfit">Inventaire vide</h3>
                            <p className="text-slate-400 font-medium tracking-tight">Aucune annonce n'a été trouvée sur la plateforme.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
