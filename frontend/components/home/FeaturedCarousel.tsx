'use client';

import { useRef, useEffect, useState } from 'react';
import { Card } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { getAnnonces, formatImageUrl } from '@/utils/supabase-helpers';
import { AnnonceCard } from '@/types';
import { Sparkles, Star, ArrowRight, BadgeCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Autoplay from "embla-carousel-autoplay"
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';

export function FeaturedCarousel() {
    const [featuredAds, setFeaturedAds] = useState<AnnonceCard[]>([]);
    const [loading, setLoading] = useState(true);

    const plugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    )

    useEffect(() => {
        async function fetchFeatured() {
            try {
                // Fetch listings that are marked as featured
                const res = await getAnnonces({ limit: 6 });
                // For now, if no featured, take the first ones or those marked featured if field exists
                // The backend has is_featured field in model
                setFeaturedAds(res.data.filter(a => a.is_featured).slice(0, 5));

                // If no featured ones yet, just show recent ones for demo
                if (res.data.filter(a => a.is_featured).length === 0) {
                    setFeaturedAds(res.data.slice(0, 5));
                }
            } catch (error) {
                console.error('Error fetching featured ads:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchFeatured();
    }, []);

    return (
        <section className="py-20 bg-background relative overflow-hidden">
            <div className="container px-4 mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-widest mb-4">
                            <Sparkles className="size-4" />
                            Premium Selection
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tighter">
                            Les Meilleures <span className="text-primary italic">Occasions</span> du Moment
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-xl">
                            Découvrez une sélection exclusive d'articles premium, vérifiés et certifiés par nos experts pour votre tranquillité.
                        </p>
                    </div>
                    <Link href="/annonces" className="group/link flex items-center gap-2 text-primary font-black text-lg transition-all hover:gap-4">
                        <span>Voir tout</span>
                        <ArrowRight className="size-6 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                </div>

                <div className="relative">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="aspect-[1.8/1] bg-muted rounded-[2rem] animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <Carousel
                            plugins={[plugin.current]}
                            className="w-full"
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                        >
                            <CarouselContent className="">
                                {featuredAds.map((ad) => (
                                    <CarouselItem key={ad.id} className="basis-full md:basis-1/2 lg:basis-1/3">
                                        <FeaturedItem ad={ad} />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            {/* Desktop Arrows */}
                            <div className="hidden md:flex absolute -right-5 -left-5 top-1/2 -translate-y-1/2 justify-between pointer-events-none z-20">
                                <CarouselPrevious className="relative left-0 pointer-events-auto bg-card/10 hover:bg-primary border-primary/20 text-foreground dark:text-white backdrop-blur-md size-12 shadow-xl" />
                                <CarouselNext className="relative right-0 pointer-events-auto bg-card/10 hover:bg-primary border-primary/20 text-foreground dark:text-white backdrop-blur-md size-12 shadow-xl" />
                            </div>
                        </Carousel>
                    )}
                </div>
            </div>
        </section>
    );
}

function FeaturedItem({ ad }: { ad: AnnonceCard }) {
    const [imgSrc, setImgSrc] = useState(ad.cover_image || '/images/placeholders/car.png');

    return (
        <div className="px-1 md:px-2 h-full">
            <Card className="border-none shadow-none overflow-hidden rounded-[2rem] relative aspect-[3/1.2] md:aspect-[1.8/1] bg-neutral-900 text-white group cursor-pointer h-full">
                <Link href={`/annonces/${ad.slug}`} className="absolute inset-0 z-20" />

                {/* Background fixed dark layer for the card content to always pop */}
                <div className="absolute inset-0 bg-neutral-900/50 z-0" />

                {/* Content Layer - Left Side */}
                <div className="absolute inset-0 z-10 p-5 pl-7 md:p-10 md:pl-12 flex flex-col justify-center items-start w-[70%] text-white">
                    <div className="bg-primary px-3 py-1 rounded-full text-[10px] md:text-sm font-black mb-3 flex items-center gap-2 shadow-lg shadow-primary/20">
                        <Sparkles className="size-3 fill-white" />
                        {ad.is_featured ? 'Offre Premium' : (ad.is_urgent ? 'Urgent' : 'Nouveau')}
                    </div>

                    <h4 className="font-black text-xl md:text-3xl leading-tight mb-2 group-hover:text-primary transition-colors tracking-tighter line-clamp-2">
                        {ad.title}
                    </h4>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl md:text-4xl font-black text-yellow-400">{formatPrice(ad.price)}</span>
                        </div>
                        <div className="h-10 w-[1px] bg-white/20 mx-1 hidden md:block" />
                        <div className="hidden md:flex flex-col">
                            <span className="text-xs opacity-50 uppercase tracking-widest font-bold">{ad.city}</span>
                            <span className="text-sm font-bold">Garantie</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="bg-white text-primary hover:bg-primary hover:text-white text-xs md:text-base font-black px-6 py-2.5 md:px-8 md:py-3 rounded-2xl transition-all active:scale-95 shadow-2xl shadow-white/10 group/btn flex items-center gap-2">
                            Voir l'offre
                            <ArrowRight className="size-4 md:size-5 transition-transform group-hover/btn:translate-x-1" />
                        </button>

                        <div className="hidden sm:flex flex-col gap-1">
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs md:text-sm font-bold truncate max-w-[80px]">{ad.user?.full_name}</span>
                                <BadgeCheck className="size-3 md:size-4 text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <p className="hidden md:block text-[8px] md:text-[11px] opacity-40 font-bold uppercase tracking-[0.2em] mt-4">Offre exclusive Chez-BEN2 | T&C Appliqués</p>
                </div>

                {/* Image Layer - Right Side */}
                <div className="absolute right-[-5%] bottom-0 w-[55%] h-[110%] transition-transform duration-700 group-hover:scale-105 z-10">
                    {ad.cover_image ? (
                        <Image
                            src={imgSrc}
                            alt={ad.title}
                            fill
                            className="object-cover object-center translate-y-2"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            style={{ maskImage: 'linear-gradient(to right, transparent, black 15%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%)' }}
                            onError={() => setImgSrc('/images/placeholders/car.png')}
                            unoptimized={imgSrc.startsWith('data:')}
                        />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground italic text-xs">
                            Sans image
                        </div>
                    )}
                </div>

                {/* Decorative Overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/90 to-transparent z-[5] pointer-events-none" />
            </Card>
        </div>
    );
}
