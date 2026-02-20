'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TimeAgo } from '@/components/ui/time-ago';
import { Share2, MapPin, Flag, Shield, MessageCircle, Phone, Calendar, Eye } from 'lucide-react';
import { AnnonceWithRelations } from '@/types';
import { ImageGallery } from './ImageGallery';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface AnnonceDetailsProps {
    annonce: AnnonceWithRelations;
}

export function AnnonceDetails({ annonce }: AnnonceDetailsProps) {
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: annonce.title,
                text: `Regardez cette annonce : ${annonce.title}`,
                url: window.location.href,
            });
        } else {
            // Fallback copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            // Could show toast here
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne Gauche: Images & Description */}
            <div className="lg:col-span-2 space-y-8">
                {/* Gallery */}
                <ImageGallery images={annonce.photos || []} title={annonce.title} />

                {/* Mobile Title Block (visible only on mobile) */}
                <div className="lg:hidden space-y-4">
                    <h1 className="text-2xl font-bold">{annonce.title}</h1>
                    <div className="text-3xl font-bold text-primary">
                        {formatPrice(annonce.price)}
                    </div>
                    {annonce.price_negotiable && (
                        <Badge variant="outline">Prix négociable</Badge>
                    )}
                </div>

                {/* Description */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Description</h2>
                    <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                        {annonce.description}
                    </div>

                    <Separator className="my-6" />

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex flex-col">
                            <span className="text-muted-foreground">Catégorie</span>
                            <span className="font-medium">{annonce.category?.name}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-muted-foreground">État</span>
                            <span className="font-medium">{annonce.etat}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-muted-foreground">Publié</span>
                            <span className="font-medium capitalize">
                                {formatDistanceToNow(new Date(annonce.created_at), { addSuffix: true, locale: fr })}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-muted-foreground">Vues</span>
                            <span className="font-medium flex items-center gap-1">
                                <Eye className="size-3" /> {annonce.views_count}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-muted-foreground">Localisation</span>
                            <span className="font-medium flex items-center gap-1">
                                <MapPin className="size-3" /> {annonce.city}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Colonne Droite: Info Vendeur & Actions (Sticky) */}
            <div className="space-y-6 lg:sticky lg:top-24 h-fit">
                {/* Desktop Title Block */}
                <div className="hidden lg:block space-y-4 p-6 bg-card rounded-xl border">
                    <h1 className="text-2xl font-bold leading-tight">{annonce.title}</h1>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-primary">
                            {formatPrice(annonce.price)}
                        </span>
                        {annonce.price_negotiable && (
                            <span className="text-sm text-muted-foreground mb-1.5 font-medium bg-muted px-2 py-0.5 rounded-full">Négociable</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="size-4" />
                        Publié le {new Date(annonce.created_at).toLocaleDateString()}
                    </div>
                </div>

                {/* Seller Card */}
                <Card className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="size-16 border-2 border-background shadow-md">
                            <AvatarImage src={annonce.user?.avatar_url || ''} />
                            <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                                {annonce.user?.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm text-muted-foreground">Vendu par</p>
                            <h3 className="font-bold text-lg flex items-center gap-1">
                                {annonce.user?.full_name || 'Utilisateur'}
                                {annonce.user?.is_verified && (
                                    <Shield className="size-4 fill-blue-500 text-white" />
                                )}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <MapPin className="size-3" />
                                {annonce.user?.city || 'Douala'}, Cameroun
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        <Button
                            className="w-full h-12 text-lg gap-2 shadow-lg shadow-primary/25 bg-green-600 hover:bg-green-700 text-white"
                            asChild
                        >
                            <Link href={`/dashboard/messages?sellerId=${annonce.user.id}&annonceId=${annonce.id}&intent=buy`}>
                                <Shield className="size-5" />
                                Acheter maintenant
                            </Link>
                        </Button>
                        <div className="grid grid-cols-2 gap-3">
                            <Button className="w-full h-12 text-lg gap-2" variant="secondary">
                                <Phone className="size-5" />
                                Appeler
                            </Button>
                            <Button variant="outline" className="w-full h-12 text-lg gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary" asChild>
                                <Link href={`/dashboard/messages?sellerId=${annonce.user.id}&annonceId=${annonce.id}`}>
                                    <MessageCircle className="size-5" />
                                    Message
                                </Link>
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Safety & Actions */}
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900 rounded-lg p-4 flex gap-3">
                        <Shield className="size-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100">Transaction sécurisée</h4>
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                Ne payez jamais avant d'avoir vu le produit. Méfiez-vous des offres trop alléchantes.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="ghost" size="sm" className="w-full gap-2" onClick={handleShare}>
                            <Share2 className="size-4" />
                            Partager
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full gap-2 text-muted-foreground hover:text-red-500">
                            <Flag className="size-4" />
                            Signaler
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
