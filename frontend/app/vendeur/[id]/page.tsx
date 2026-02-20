import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SellerLocationMap } from '@/components/seller/SellerLocationMap';
import { FollowButton } from '@/components/seller/FollowButton';
import { MapPin, Calendar, Package, ShoppingBag, CheckCircle2, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { getAnnonces, getCurrentProfile, getPublicProfile } from '@/utils/supabase-helpers';

export default async function SellerProfilePage({ params }: { params: { id: string } }) {
    const currentUser = await getCurrentProfile();

    // Fetch real data
    const [seller, listingsData] = await Promise.all([
        getPublicProfile(params.id),
        getAnnonces({ user_id: params.id, limit: 12 })
    ]);

    if (!seller) {
        notFound();
    }

    const listings = listingsData.data;
    const totalListings = listingsData.pagination.total;
    const followersCount = 45; // Mock for now
    const isFollowing = false; // Mock for now
    const hasLocation = seller.latitude && seller.longitude;

    return (
        <div className="container py-8 space-y-8">
            {/* Profile Header */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={seller.avatar_url || undefined} />
                            <AvatarFallback className="text-3xl">
                                {seller.full_name?.charAt(0)?.toUpperCase() || '?'}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-3xl font-black">{seller.full_name}</h1>
                                {seller.is_verified && (
                                    <Badge variant="default" className="gap-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Vérifié
                                    </Badge>
                                )}
                            </div>

                            {seller.bio && (
                                <p className="text-muted-foreground max-w-2xl">{seller.bio}</p>
                            )}

                            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Membre depuis {formatDistanceToNow(new Date(seller.created_at), { locale: fr, addSuffix: false })}
                                </div>
                                {seller.city && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        {seller.city}
                                    </div>
                                )}
                            </div>
                        </div>

                        {currentUser && currentUser.id !== params.id && (
                            <FollowButton sellerId={params.id} initialFollowing={isFollowing} />
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Statistics Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Statistiques</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Package className="h-4 w-4" />
                                    <span>Annonces actives</span>
                                </div>
                                <span className="font-bold">{listings?.length || 0}</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <ShoppingBag className="h-4 w-4" />
                                    <span>Total annonces</span>
                                </div>
                                <span className="font-bold">{totalListings || 0}</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>Followers</span>
                                </div>
                                <span className="font-bold">{followersCount || 0}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location Card */}
                    {hasLocation && seller.latitude && seller.longitude && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Localisation
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Suspense fallback={<div className="h-[300px] bg-muted rounded-xl animate-pulse" />}>
                                    <SellerLocationMap
                                        latitude={seller.latitude}
                                        longitude={seller.longitude}
                                        sellerName={seller.full_name}
                                        city={seller.city || ''}
                                    />
                                </Suspense>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Listings */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Annonces de {seller.full_name} ({listings?.length || 0})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {listings && listings.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {listings.map((listing: any) => (
                                        <Link
                                            key={listing.id}
                                            href={`/annonces/${listing.slug || listing.id}`}
                                            className="group"
                                        >
                                            <div className="border rounded-xl overflow-hidden hover:shadow-lg transition-all">
                                                <div className="relative aspect-video bg-muted">
                                                    {listing.cover_image && (
                                                        <Image
                                                            src={listing.cover_image}
                                                            alt={listing.title}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform"
                                                        />
                                                    )}
                                                    {listing.is_featured && (
                                                        <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600">
                                                            Boosté
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="p-3 space-y-1">
                                                    <h3 className="font-bold line-clamp-1 group-hover:text-primary transition-colors">
                                                        {listing.title}
                                                    </h3>
                                                    <p className="text-xl font-black text-primary">
                                                        {formatPrice(listing.price)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(new Date(listing.created_at), {
                                                            locale: fr,
                                                            addSuffix: true
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                    <p>Aucune annonce active pour le moment</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
