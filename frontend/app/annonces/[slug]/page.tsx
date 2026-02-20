'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import {
    MapPin, Eye, Share2, Heart,
    MessageCircle, ShieldCheck, Clock, ListChecks
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ImageCarousel } from '@/components/annonces/ImageCarousel';
import { getAnnonceBySlug, getAnnonces } from '@/utils/supabase-helpers';
import { PurchaseModal } from '@/components/purchase/PurchaseModal';
import { MessageModal } from '@/components/messages/MessageModal';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { AnnonceCard } from '@/components/annonces/AnnonceCard';
import { ETAT_LABELS } from '@/types';
import { getCategoryFields } from '@/lib/category-fields-config';

interface ListingPageProps {
    params: {
        slug: string;
    };
}

export default function ListingPage({ params }: ListingPageProps) {
    const [listing, setListing] = useState<any | null>(null);
    const [similarListings, setSimilarListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
    const [messageModalOpen, setMessageModalOpen] = useState(false);
    // ✅ Hook toujours appelé en premier, avant tout return conditionnel
    const { user } = useAuthContext();

    useEffect(() => {
        async function fetchListing() {
            setLoading(true);
            try {
                const data = await getAnnonceBySlug(params.slug);
                setListing(data);

                // Fetch similar listings
                if (data?.category_id) {
                    const similar = await getAnnonces({ category_id: data.category_id, limit: 5 });
                    // Filter out current listing
                    setSimilarListings(similar.data.filter((l: any) => l.id !== data.id).slice(0, 4));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchListing();
    }, [params.slug]);

    if (loading) {
        return (
            <div className="container py-20 text-center space-y-4">
                <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-muted-foreground">Chargement de l'annonce...</p>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="container py-20 text-center space-y-6">
                <h1 className="text-3xl font-black">Oups ! Cette annonce a disparu.</h1>
                <p className="text-muted-foreground">Elle a peut-être été vendue ou supprimée.</p>
                <Button asChild>
                    <Link href="/">Retour à l'accueil</Link>
                </Button>
            </div>
        );
    }

    const images = listing.photos && listing.photos.length > 0
        ? listing.photos.map((p: any) => p.url)
        : (listing.cover_image ? [listing.cover_image] : []);

    const isOwner = user?.id?.toString() === listing.user?.id?.toString();

    return (
        <div className="container py-8 space-y-8 pb-28 md:pb-16">
            {/* Breadcrumb */}
            <nav className="flex items-center text-xs text-muted-foreground">
                <Link href="/" className="hover:text-primary">Accueil</Link>
                <span className="mx-2">/</span>
                <Link href={`/annonces?category=${listing.category?.slug || listing.category_id}`} className="hover:text-primary">
                    {listing.category?.name || 'Catégorie'}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-foreground font-medium truncate max-w-[200px]">{listing.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Gallery */}
                    <div className="rounded-3xl overflow-hidden shadow-2xl">
                        <ImageCarousel images={images} title={listing.title} />
                    </div>

                    {/* Title & Price */}
                    <div className="space-y-4 p-6 bg-card rounded-3xl border shadow-sm">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            <div className="space-y-2">
                                <h1 className="text-3xl md:text-4xl font-black font-outfit tracking-tight">{listing.title}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full">
                                        <MapPin className="size-4" />
                                        {listing.city}, {listing.region || 'Cameroun'}
                                    </span>
                                    <span className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full">
                                        <Clock className="size-4" />
                                        Publié {listing.created_at ? formatDistanceToNow(new Date(listing.created_at), { addSuffix: true, locale: fr }) : 'récemment'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-left md:text-right">
                                <div className="text-4xl font-black text-primary font-outfit">
                                    {formatPrice(listing.price)}
                                </div>
                                {listing.price_negotiable && (
                                    <Badge variant="outline" className="mt-2 bg-primary/5 text-primary border-primary/20">Négociable</Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-4 p-8 bg-card rounded-3xl border shadow-sm">
                        <h2 className="text-2xl font-bold font-outfit">Description</h2>
                        <div className="prose max-w-none text-muted-foreground leading-relaxed whitespace-pre-line text-lg">
                            {listing.description}
                        </div>
                    </div>

                    {/* Technical Characteristics */}
                    {Object.keys(listing.extra_attributes || {}).length > 0 && (
                        <div className="space-y-6 p-8 bg-card rounded-3xl border shadow-sm">
                            <h2 className="text-2xl font-bold font-outfit flex items-center gap-3">
                                <ListChecks className="size-6 text-primary" />
                                Caractéristiques techniques
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                {Object.entries(listing.extra_attributes).map(([key, value]) => {
                                    // Try to find a nice label from config
                                    const allFields = getCategoryFields(listing.category?.slug || '');
                                    const field = allFields.find(f => f.name === key);
                                    const label = field?.label || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                                    // Format Boolean values
                                    let displayValue = String(value);
                                    if (typeof value === 'boolean') displayValue = value ? 'Oui' : 'Non';
                                    if (field?.unit) displayValue = `${displayValue} ${field.unit}`;

                                    return (
                                        <div key={key} className="flex items-center justify-between py-3 border-b border-muted last:border-0">
                                            <span className="text-muted-foreground font-medium">{label}</span>
                                            <span className="font-bold text-foreground">{displayValue}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Attributes Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        <div className="p-6 bg-muted/30 rounded-3xl space-y-2">
                            <span className="text-xs text-muted-foreground uppercase font-black tracking-widest">État</span>
                            <p className="font-bold text-lg">{ETAT_LABELS[listing.condition as keyof typeof ETAT_LABELS] || listing.condition || 'Non spécifié'}</p>
                        </div>
                        <div className="p-6 bg-muted/30 rounded-3xl space-y-2">
                            <span className="text-xs text-muted-foreground uppercase font-black tracking-widest">Vues</span>
                            <p className="font-bold text-lg flex items-center gap-2">
                                <Eye className="size-5 text-muted-foreground" />
                                {listing.views_count}
                            </p>
                        </div>
                        <div className="p-6 bg-muted/30 rounded-3xl space-y-2">
                            <span className="text-xs text-muted-foreground uppercase font-black tracking-widest">Référence</span>
                            <p className="font-mono text-sm">#{String(listing.id || '').substring(0, 8)}</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-card border-none rounded-[2.5rem] p-8 space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />

                        <Link href={`/vendeur/${listing.user?.id}`} className="flex items-center gap-4 relative z-10 hover:bg-muted/20 p-3 -m-3 rounded-xl transition-colors group/seller">
                            <Avatar className="size-20 border-4 border-background shadow-xl group-hover/seller:ring-2 group-hover/seller:ring-primary transition-all">
                                <AvatarImage src={listing.user?.avatar_url || undefined} />
                                <AvatarFallback className="bg-primary text-white text-2xl font-black">{listing.user?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-black text-xl flex items-center gap-2 group-hover/seller:text-primary transition-colors">
                                    {listing.user?.full_name}
                                    {listing.user?.is_verified && <ShieldCheck className="size-5 text-blue-500" />}
                                </h3>
                                <p className="text-sm text-muted-foreground font-medium">
                                    Membre depuis {listing.user?.created_at ? new Date(listing.user.created_at).getFullYear() : '2024'}
                                </p>
                                <p className="text-xs text-primary font-bold mt-1">
                                    Voir le profil →
                                </p>
                            </div>
                        </Link>


                        <div className="grid gap-4 relative z-10">
                            {!isOwner ? (
                                <>
                                    <Button
                                        className="w-full h-16 rounded-2xl gap-3 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1 active:scale-95 bg-emerald-600 hover:bg-emerald-700"
                                        size="lg"
                                        onClick={() => setPurchaseModalOpen(true)}
                                    >
                                        <ShieldCheck className="size-5" />
                                        Acheter maintenant
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full h-16 rounded-2xl gap-3 text-lg font-bold border-2 hover:bg-muted/50 transition-all active:scale-95"
                                        size="lg"
                                        onClick={() => setMessageModalOpen(true)}
                                    >
                                        <MessageCircle className="size-5" />
                                        Envoyer un message
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full h-16 rounded-2xl gap-3 text-lg font-bold border-2 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-all"
                                    asChild
                                >
                                    <Link href={`/annonces/edit/${listing.id}`}>
                                        Modifier mon annonce
                                    </Link>
                                </Button>
                            )}
                        </div>

                        {/* Purchase Modal */}
                        <PurchaseModal
                            open={purchaseModalOpen}
                            onOpenChange={setPurchaseModalOpen}
                            annonceId={listing.id}
                            price={listing.price}
                            title={listing.title}
                        />

                        {/* Message Modal */}
                        <MessageModal
                            open={messageModalOpen}
                            onOpenChange={setMessageModalOpen}
                            annonceId={listing.id}
                            sellerId={listing.user?.id}
                            annonceTitle={listing.title}
                            annonceImage={images[0]}
                        />


                        <div className="flex items-center justify-around pt-2 border-t border-muted relative z-10">
                            <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-red-500 transition-colors">
                                <Heart className="size-6 font-bold" />
                                <span className="text-[10px] font-black uppercase">Sauver</span>
                            </button>
                            <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                                <Share2 className="size-6 font-bold" />
                                <span className="text-[10px] font-black uppercase">Partager</span>
                            </button>
                        </div>
                    </div>

                    {/* Safety Tips */}
                    <div className="bg-emerald-50 rounded-[2rem] p-8 space-y-4 border-2 border-emerald-100/50">
                        <h4 className="font-black text-emerald-800 flex items-center gap-2 uppercase tracking-tighter">
                            <ShieldCheck className="size-5" />
                            Conseils de sécurité
                        </h4>
                        <ul className="space-y-3 text-emerald-700/80 font-medium text-sm">
                            <li className="flex items-start gap-2">
                                <div className="size-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                Ne payez jamais d&apos;avance.
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="size-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                Vérifiez le produit avant l&apos;achat.
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="size-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                Privilégiez les lieux publics.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Similar Listings */}
            {similarListings.length > 0 && (
                <div className="pt-12">
                    <h2 className="text-3xl font-black font-outfit mb-8">Annonces similaires</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {similarListings.map((item) => (
                            <AnnonceCard key={item.id} annonce={item} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
