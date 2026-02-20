'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Heart, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AnnonceCard } from '@/components/annonces/AnnonceCard';
import { AnnonceCard as AnnonceCardType } from '@/types';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { getFavorites } from '@/utils/supabase-helpers';

export default function FavorisPage() {
    const { user, isLoading: authLoading } = useAuthContext();
    const [favorites, setFavorites] = useState<AnnonceCardType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function fetchFavorites() {
            try {
                const data = await getFavorites();
                setFavorites(data);
            } catch (error) {
                console.error("Error fetching favorites", error);
            } finally {
                setIsLoading(false);
            }
        }

        if (!authLoading && user) {
            fetchFavorites();
        } else if (!authLoading && !user) {
            setIsLoading(false);
        }
    }, [user, authLoading]);

    const filteredFavorites = favorites.filter(f =>
        f.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (authLoading || isLoading) {
        return (
            <div className="h-[400px] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium">Chargement de vos favoris...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Mes Favoris</h1>
                <p className="text-muted-foreground">
                    Retrouvez ici toutes les annonces que vous avez enregistrées pour plus tard.
                </p>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Rechercher dans mes favoris..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredFavorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredFavorites.map((listing) => (
                        <AnnonceCard key={listing.id} annonce={listing} />
                    ))}
                </div>
            ) : (
                <Card className="flex flex-col items-center justify-center p-12 text-center bg-muted/20 border-dashed rounded-[2rem]">
                    <div className="bg-background p-4 rounded-full shadow-md mb-4">
                        <Heart className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="max-w-[400px] space-y-4">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-xl text-foreground">Aucun favori pour le moment</h3>
                            <p className="text-muted-foreground">
                                Vous n&apos;avez pas encore d&apos;annonces enregistrées. Parcourez la plateforme pour trouver des perles rares !
                            </p>
                        </div>
                        <Button asChild className="mt-4 rounded-xl">
                            <Link href="/annonces">
                                Parcourir les annonces
                            </Link>
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
}
