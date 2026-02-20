'use client';

import { AnnonceCard } from './AnnonceCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AnnonceCard as AnnonceCardType, PaginationState } from '@/types';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TimeAgo } from '@/components/ui/time-ago';

interface AnnonceGridProps {
    annonces: AnnonceCardType[];
    isLoading?: boolean;
    pagination?: PaginationState;
    onPageChange?: (page: number) => void;
    viewMode?: 'grid' | 'list';
}

function AnnonceListItem({ annonce }: { annonce: AnnonceCardType }) {
    return (
        <Link href={`/annonces/${annonce.slug || annonce.id}`} className="group block">
            <div className="flex bg-card rounded-xl border overflow-hidden transition-all hover:shadow-md h-40">
                {/* Image */}
                <div className="relative w-48 shrink-0 bg-muted">
                    {annonce.cover_image ? (
                        <Image
                            src={annonce.cover_image}
                            alt={annonce.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                            <span className="text-xs">Pas d'image</span>
                        </div>
                    )}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {annonce.is_urgent && (
                            <Badge {...({ variant: "destructive", className: "text-[10px] px-1.5 h-5 shadow-sm" } as any)}>URGENT</Badge>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start gap-2">
                            <div>
                                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                    {annonce.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">{(annonce.category as any).name} • {annonce.city}</p>
                            </div>
                            <Badge {...({ variant: "secondary", className: "font-bold shrink-0" } as any)}>
                                {formatPrice(annonce.price)}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                                <div className="relative size-5 rounded-full overflow-hidden bg-muted">
                                    {annonce.user.avatar_url && (
                                        <Image src={annonce.user.avatar_url} alt={annonce.user.full_name} fill className="object-cover" />
                                    )}
                                </div>
                                <span className="truncate max-w-[100px]">{annonce.user.full_name}</span>
                            </div>
                        </div>
                        <TimeAgo date={annonce.created_at} />
                    </div>
                </div>
            </div>
        </Link>
    )
}

export function AnnonceGrid({
    annonces,
    isLoading,
    pagination,
    onPageChange,
    viewMode = 'grid',
}: AnnonceGridProps) {
    if (isLoading) {
        return (
            <div className={cn(
                "gap-4 md:gap-6",
                viewMode === 'grid'
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    : "flex flex-col space-y-4"
            )}>
                {Array.from({ length: 8 }).map((_, i) => (
                    viewMode === 'grid' ? (
                        <div key={i} className="space-y-3">
                            <Skeleton {...({ className: "aspect-[4/3] w-full rounded-xl" } as any)} />
                            <div className="space-y-2">
                                <Skeleton {...({ className: "h-4 w-3/4" } as any)} />
                                <Skeleton {...({ className: "h-4 w-1/2" } as any)} />
                            </div>
                        </div>
                    ) : (
                        <div key={i} className="flex h-40 gap-4 rounded-xl border p-2">
                            <Skeleton {...({ className: "w-48 h-full rounded-lg" } as any)} />
                            <div className="flex-1 space-y-3 py-2">
                                <Skeleton {...({ className: "h-6 w-3/4" } as any)} />
                                <Skeleton {...({ className: "h-4 w-1/4" } as any)} />
                                <Skeleton {...({ className: "h-10 w-full mt-4" } as any)} />
                            </div>
                        </div>
                    )
                ))}
            </div>
        );
    }

    if (!isLoading && annonces.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <AlertCircle className="size-8 text-muted-foreground" {...({} as any)} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Aucune annonce trouvée</h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                    Essayez de modifier vos filtres ou effectuez une nouvelle recherche.
                </p>
                <Button {...({ onClick: () => window.history.back() } as any)}>
                    Retour
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className={cn(
                "gap-3 md:gap-6",
                viewMode === 'grid'
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    : "flex flex-col space-y-3"
            )}>
                {annonces.map((annonce) => (
                    viewMode === 'grid' ? (
                        <AnnonceCard key={annonce.id} annonce={annonce} {...({} as any)} />
                    ) : (
                        <AnnonceListItem key={annonce.id} annonce={annonce} {...({} as any)} />
                    )
                ))}
            </div>

            {(pagination as any)?.total_pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    <Button
                        {...({
                            variant: "outline",
                            size: "sm",
                            onClick: () => onPageChange?.((pagination as any).page - 1),
                            disabled: !(pagination as any).has_prev
                        } as any)}
                    >
                        Précédent
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        Page {(pagination as any).page} sur {(pagination as any).total_pages}
                    </div>
                    <Button
                        {...({
                            variant: "outline",
                            size: "sm",
                            onClick: () => onPageChange?.((pagination as any).page + 1),
                            disabled: !(pagination as any).has_next
                        } as any)}
                    >
                        Suivant
                    </Button>
                </div>
            )}
        </div>
    );
}
