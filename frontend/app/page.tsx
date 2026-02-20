'use client';

import { Shirt, Smartphone, Footprints, Watch, Car, Home as HomeIcon, Grid, Gamepad2, Briefcase, Wrench, ArrowRight, Loader2, Tag } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { Hero } from '@/components/home/Hero';
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel';
import { HomeListings } from '@/components/home/HomeListings';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Stats } from '@/components/home/Stats';
import { useEffect, useState } from 'react';
import { getAnnonces, getCategories } from '@/utils/supabase-helpers';
import { AnnonceCard, Category } from '@/types';

// Palette de couleurs pour les catégories
const ICON_COLORS = [
    'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400',
    'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
    'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400',
];

export default function Home() {
    const [annonces, setAnnonces] = useState<AnnonceCard[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [annoncesRes, categoriesRes] = await Promise.all([
                    getAnnonces({ limit: 20 }),
                    getCategories()
                ]);
                setAnnonces(annoncesRes.data);
                setCategories(categoriesRes);
            } catch (error) {
                console.error('Failed to load home data:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const recentAnnonces = annonces;
    const featuredAnnonces = annonces.filter(a => a.is_featured);
    const urgentAnnonces = annonces.filter(a => a.is_urgent);

    return (
        <main className="min-h-screen bg-background text-foreground pb-24 md:pb-0 font-sans">
            <MobileHeader />

            <div className="hidden md:block">
                <Hero />
            </div>

            <FeaturedCarousel />

            <section className="py-10 md:py-20 bg-background">
                <div className="container mx-auto px-5">
                    <div className="flex items-center justify-between mb-8 md:mb-12">
                        <div className="space-y-1">
                            <h2 className="text-xl md:text-3xl font-black tracking-tight text-foreground">Parcourir les catégories</h2>
                            <p className="text-muted-foreground text-xs md:text-sm font-medium">Trouvez tout ce dont vous avez besoin au même endroit</p>
                        </div>
                        <Link href="/categories" className="text-primary font-bold text-sm md:text-base hover:underline">
                            Voir tout
                        </Link>
                    </div>

                    <div className="flex justify-between gap-4 md:gap-8 px-1 overflow-x-auto hide-scrollbar md:grid md:grid-cols-4 lg:grid-cols-8 md:overflow-visible">
                        {isLoading ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 animate-pulse">
                                    <div className="size-[70px] md:size-[90px] rounded-full bg-muted" />
                                    <div className="h-4 w-16 bg-muted rounded" />
                                </div>
                            ))
                        ) : (
                            categories.map((category, idx) => (
                                <Link
                                    key={category.id}
                                    href={`/annonces?category=${category.slug}`}
                                    className="flex flex-col items-center gap-3 min-w-[75px] md:min-w-0 group"
                                >
                                    <div className={cn(
                                        "size-[70px] md:size-[80px] lg:size-[90px] rounded-full flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20",
                                        ICON_COLORS[idx % ICON_COLORS.length]
                                    )}>
                                        <Tag className="size-8 md:size-10 group-hover:rotate-12 transition-transform" strokeWidth={1.5} />
                                    </div>
                                    <span className="font-bold text-xs md:text-sm text-center text-foreground group-hover:text-primary transition-colors">{category.name}</span>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {isLoading ? (
                <div className="container py-12 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-muted-foreground font-medium">Récupération des annonces récentes...</p>
                </div>
            ) : (
                <HomeListings
                    initialRecent={recentAnnonces}
                    initialFeatured={featuredAnnonces}
                    initialUrgent={urgentAnnonces}
                />
            )}

            <div className="hidden md:block">
                <HowItWorks />
                <Stats />
            </div>

            <section className="py-24 bg-[#121212] text-white relative overflow-hidden hidden md:block">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -ml-48 -mb-48" />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-6xl font-black mb-6 tracking-tight">Prêt à faire des affaires ?</h2>
                    <p className="text-lg md:text-2xl text-white/60 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
                        Rejoignez la communauté Chez-BEN2 et commencez à vendre ou acheter dès aujourd'hui sur la plateforme la plus dynamique au Cameroun.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-5">
                        <Link
                            href="/annonces/create"
                            className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-primary rounded-2xl hover:bg-primary-600 transition-all shadow-xl shadow-primary/30 active:scale-95"
                        >
                            Déposer une annonce maintenant
                            <ArrowRight className="ml-2 size-6" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
