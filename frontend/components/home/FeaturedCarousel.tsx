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
        Autoplay({ delay: 4000, stopOnInteraction: true })
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

    if (loading) return (
        <div className="container mx-auto px-5 py-4 min-h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground font-bold">Chargement des offres spéciales...</div>
        </div>
    );

    if (featuredAds.length === 0) return null;

    return (
        <section className="px-5 py-4 md:py-10 bg-background">
            <div className="container mx-auto">
                <div className="flex items-center justify-between mb-5 md:mb-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 md:p-3 rounded-2xl">
                            <Sparkles className="text-primary size-5 md:size-8" />
                        </div>
                        <h3 className="font-extrabold text-xl md:text-4xl tracking-tight text-foreground">#SpécialPourVous</h3>
                    </div>
                    <span className="text-primary font-bold text-sm md:text-lg cursor-pointer hover:underline flex items-center gap-1 group/link">
                        Voir tout
                        <ArrowRight className="size-4 md:size-5 transition-transform group-hover/link:translate-x-1" />
                    </span>
                </div>

                <Carousel
                    plugins={[plugin.current]}
                    className="w-full"
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                >
                    <CarouselContent className="">
                        {featuredAds.map((ad, index) => (
                            <CarouselItem key={ad.id} className="basis-full md:basis-1/2 lg:basis-1/3">
                                <div className="px-1 md:px-2">
                                    <Card className="border-none shadow-none overflow-hidden rounded-[2rem] relative aspect-[3/1.2] md:aspect-[1.8/1] bg-neutral-900 text-white group cursor-pointer">
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

                                            <div className="flex items-center gap-6 mb-6">
                                                <button className="bg-white text-primary hover:bg-primary hover:text-white text-xs md:text-base font-black px-6 py-2.5 md:px-8 md:py-3 rounded-2xl transition-all active:scale-95 shadow-2xl shadow-white/10 group/btn flex items-center gap-2">
                                                    Voir l&apos;offre
                                                    <ArrowRight className="size-4 md:size-5 transition-transform group-hover/btn:translate-x-1" />
                                                </button>

                                                <div className="hidden sm:flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-xs md:text-sm font-bold truncate max-w-[80px]">{ad.user?.full_name}</span>
                                                        <BadgeCheck className="size-3 md:size-4 text-blue-400" />
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-[8px] md:text-[11px] opacity-40 font-bold uppercase tracking-[0.2em]">Offre exclusive Chez-BEN2 | T&C Appliqués</p>
                                        </div>

                                        {/* Image Layer - Right Side */}
                                        <div className="absolute right-[-5%] bottom-0 w-[55%] h-[110%] transition-transform duration-700 group-hover:scale-105 z-10">
                                            {ad.cover_image ? (
                                                <Image
                                                    src={ad.cover_image}
                                                    alt={ad.title}
                                                    fill
                                                    className="object-cover object-center translate-y-2"
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                    style={{ maskImage: 'linear-gradient(to right, transparent, black 15%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%)' }}
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
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Desktop Arrows */}
                    <div className="hidden md:flex absolute -right-5 -left-5 top-1/2 -translate-y-1/2 justify-between pointer-events-none z-20">
                        <CarouselPrevious className="relative left-0 pointer-events-auto bg-card/10 hover:bg-primary border-primary/20 text-foreground dark:text-white backdrop-blur-md size-12 shadow-xl" />
                        <CarouselNext className="relative right-0 pointer-events-auto bg-card/10 hover:bg-primary border-primary/20 text-foreground dark:text-white backdrop-blur-md size-12 shadow-xl" />
                    </div>

                    {/* Dots indicator - Adaptive visibility */}
                    <div className="flex justify-center gap-2 mt-8">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className={cn(
                                "h-2 rounded-full transition-all duration-300",
                                i === 0 ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
                            )} />
                        ))}
                    </div>
                </Carousel>
            </div>
        </section>
    );
}
