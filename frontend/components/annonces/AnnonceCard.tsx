'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, MapPin, BadgeCheck, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnnonceCard as AnnonceCardType } from '@/types';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { differenceInDays } from 'date-fns';
import { TimeAgo } from '@/components/ui/time-ago';
import { toggleFavorite } from '@/utils/supabase-helpers';
import { toast } from 'sonner';
import { useState } from 'react';

interface AnnonceCardProps {
    annonce: AnnonceCardType;
    priority?: boolean;
}

export function AnnonceCard({ annonce, priority = false }: AnnonceCardProps) {
    const [isFavorited, setIsFavorited] = useState((annonce as any).is_favorited || false);
    const [isLiking, setIsLiking] = useState(false);
    const [imgSrc, setImgSrc] = useState(annonce.cover_image || '/images/placeholders/car.png');

    const isNew = differenceInDays(new Date(), new Date(annonce.created_at)) <= 3;
    const isUrgent = annonce.is_urgent && (!(annonce as any).urgent_until || new Date((annonce as any).urgent_until) > new Date());

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsLiking(true);
        try {
            const result = await toggleFavorite(annonce.id);
            setIsFavorited(result.status !== 'removed');
            toast.success(result.status === 'removed' ? "Retiré des favoris" : "Ajouté aux favoris");
        } catch (error) {
            toast.error("Veuillez vous connecter pour ajouter des favoris");
        } finally {
            setIsLiking(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-card rounded-xl border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Link href={`/annonces/${annonce.slug}`} className="block w-full h-full">
                    {annonce.cover_image ? (
                        <Image
                            src={imgSrc}
                            alt={annonce.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={priority}
                            unoptimized={imgSrc.startsWith('data:')}
                            onError={() => setImgSrc('/images/placeholders/car.png')}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            Sans image
                        </div>
                    )}
                </Link>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-1 z-10">
                    {isUrgent && (
                        <Badge variant="destructive" className="flex items-center gap-1 shadow-sm">
                            <Zap className="size-3 fill-current" />
                            URGENT
                        </Badge>
                    )}
                    {isNew && (
                        <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 shadow-sm">
                            NOUVEAU
                        </Badge>
                    )}
                </div>

                {/* Favorite Button */}
                <Button
                    onClick={handleToggleFavorite}
                    disabled={isLiking}
                    className={cn(
                        "absolute top-2 right-2 size-8 rounded-full transition-all bg-white/80 backdrop-blur-sm hover:bg-white",
                        isFavorited ? "text-red-500 opacity-100 scale-110 shadow-md" : "text-gray-500 opacity-0 group-hover:opacity-100 shadow-sm"
                    )}
                    size="icon" variant="secondary"
                >
                    <Heart className={cn("size-4", isFavorited && "fill-current")} />
                </Button>

                {/* Category Overlay (Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                    <Badge variant="secondary" className="bg-white/90 text-black text-[10px] hover:bg-white">
                        {annonce.category?.name}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="p-3 flex flex-col flex-1 gap-2">
                <div className="flex-1">
                    <Link href={`/annonces/${annonce.slug}`} className="group-hover:text-primary transition-colors">
                        <h3 className="font-semibold text-base line-clamp-2 leading-tight mb-1">
                            {annonce.title}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-1 text-primary font-bold text-lg">
                        {formatPrice(annonce.price)}
                        {annonce.price_negotiable && (
                            <span className="text-[10px] font-normal text-muted-foreground ml-1 px-1.5 py-0.5 rounded-full bg-muted">
                                Négociable
                            </span>
                        )}
                    </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 pt-2 border-t">
                    <div className="flex items-center gap-1 truncate max-w-[60%]">
                        <MapPin className="size-3 shrink-0" />
                        <span className="truncate">{annonce.city}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <Clock className="size-3" />
                        <TimeAgo date={annonce.created_at} />
                    </div>
                </div>

                {/* User Info (Optional - for list view or detailed cards) */}
                {annonce.user && (
                    <div className="flex items-center gap-2 mt-1">
                        <div className="size-5 rounded-full bg-muted overflow-hidden relative">
                            {annonce.user.avatar_url && annonce.user.avatar_url.trim() !== '' ? (
                                <Image src={annonce.user.avatar_url} alt={annonce.user.full_name || ''} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-[8px] text-primary font-bold">
                                    {annonce.user.full_name?.charAt(0) || 'U'}
                                </div>
                            )}
                        </div>
                        <span className="text-xs text-muted-foreground truncate flex-1">
                            {annonce.user.full_name}
                        </span>
                        {annonce.user.is_verified && (
                            <BadgeCheck className="size-3 text-blue-500" />
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
