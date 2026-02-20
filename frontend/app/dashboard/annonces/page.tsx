'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Plus, Search, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { STATUT_LABELS } from '@/types';
import { ListingActions } from '@/components/dashboard/ListingActions';
import { getUserListings, deleteListing } from '@/utils/supabase-helpers';
import { toast } from 'sonner';

export default function MyListingsPage() {
    const [listings, setListings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    async function fetchListings() {
        setIsLoading(true);
        const data = await getUserListings();
        setListings(data);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchListings();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Voulez-vous vraiment supprimer cette annonce ?')) return;

        try {
            await deleteListing(id);
            toast.success("Annonce supprimée avec succès");
            fetchListings();
        } catch (error) {
            toast.error("Erreur lors de la suppression");
        }
    };

    const filteredListings = listings.filter(l =>
        l.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium">Chargement de vos annonces...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mes Annonces</h1>
                    <p className="text-muted-foreground">
                        Gérez vos annonces, suivez leurs performances et boostez leur visibilité.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/annonces/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Déposer une annonce
                    </Link>
                </Button>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Rechercher une annonce..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px] hidden sm:table-cell">Image</TableHead>
                            <TableHead>Titre</TableHead>
                            <TableHead>Prix</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead className="hidden md:table-cell">Vues</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredListings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    {searchTerm ? "Aucune annonce ne correspond à votre recherche." : "Vous n'avez pas encore déposé d'annonce."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredListings.map((listing: any) => (
                                <TableRow key={listing.id}>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="relative aspect-square w-12 overflow-hidden rounded-md bg-muted">
                                            {listing.cover_image ? (
                                                <Image
                                                    src={listing.cover_image}
                                                    alt={listing.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                                    Img
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium max-w-[200px] truncate">
                                        <Link href={`/annonces/${listing.slug || listing.id}`} className="hover:underline">
                                            {listing.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{formatPrice(listing.price)}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                listing.status === 'ACTIVE' ? 'default' :
                                                    listing.status === 'PENDING' ? 'outline' :
                                                        'secondary'
                                            }
                                        >
                                            {STATUT_LABELS[listing.status as keyof typeof STATUT_LABELS] || listing.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground">
                                        {new Date(listing.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                            {listing.views_count}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <ListingActions
                                            listing={listing}
                                            categorySlug={listing.category?.slug}
                                            onDelete={() => handleDelete(listing.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
