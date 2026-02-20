'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AnnonceGrid } from '@/components/annonces/AnnonceGrid';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Star, Clock, Grid } from 'lucide-react';
import { AnnonceCard } from '@/types';
import { cn } from '@/lib/utils';

interface HomeListingsProps {
    initialRecent: AnnonceCard[];
    initialFeatured: AnnonceCard[];
    initialUrgent: AnnonceCard[];
}

export function HomeListings({ initialRecent, initialFeatured, initialUrgent }: HomeListingsProps) {
    const [activeTab, setActiveTab] = useState('recent');

    return (
        <section className="py-10 md:py-20 container mx-auto px-5">
            <div className="flex flex-col gap-6 mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <Zap className="size-6 md:size-10 text-primary fill-primary animate-pulse" />
                            <h2 className="text-xl md:text-5xl font-black tracking-tight text-foreground italic uppercase">Vente Flash</h2>
                        </div>
                        <p className="text-muted-foreground text-xs md:text-lg font-medium">Offres à durée limitée sur des articles premium</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs md:text-lg font-bold text-foreground/80 bg-muted/30 md:bg-transparent p-3 md:p-0 rounded-2xl border md:border-none">
                        <Clock className="size-5 md:size-6 text-primary" />
                        <span className="hidden sm:inline">Finit dans :</span>
                        <div className="flex gap-1.5 items-center">
                            <span className="bg-primary text-white px-2.5 py-1.5 rounded-xl font-black min-w-[38px] text-center shadow-lg shadow-primary/20">02</span>
                            <span className="text-primary">:</span>
                            <span className="bg-primary text-white px-2 py-1 rounded-lg font-black min-w-[35px] text-center shadow-sm shadow-primary/20">12</span>
                            <span className="text-primary">:</span>
                            <span className="bg-primary text-white px-2 py-1 rounded-lg font-black min-w-[35px] text-center shadow-sm shadow-primary/20">56</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 md:overflow-visible">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={cn("px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap border-2 flex items-center gap-2",
                            activeTab === 'all'
                                ? "bg-primary text-white border-primary shadow-xl shadow-primary/30"
                                : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground")}
                    >
                        <Grid className="size-4" />
                        Tout
                    </button>
                    <button
                        onClick={() => setActiveTab('recent')}
                        className={cn("px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap border-2 flex items-center gap-2",
                            activeTab === 'recent'
                                ? "bg-primary text-white border-primary shadow-xl shadow-primary/30"
                                : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground")}
                    >
                        <Clock className="size-4" />
                        Nouveautés
                    </button>
                    <button
                        onClick={() => setActiveTab('featured')}
                        className={cn("px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap border-2 flex items-center gap-2",
                            activeTab === 'featured'
                                ? "bg-primary text-white border-primary shadow-xl shadow-primary/30"
                                : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground")}
                    >
                        <Star className="size-4" />
                        Populaire
                    </button>
                    <button
                        onClick={() => setActiveTab('urgent')}
                        className={cn("px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap border-2 flex items-center gap-2",
                            activeTab === 'urgent'
                                ? "bg-primary text-white border-primary shadow-xl shadow-primary/30"
                                : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground")}
                    >
                        <Zap className="size-4" />
                        Urgent
                    </button>
                </div>
            </div>

            <div className="min-h-[400px]">
                <AnnonceGrid annonces={activeTab === 'featured' ? initialFeatured : activeTab === 'urgent' ? initialUrgent : initialRecent} />
            </div>

            <div className="mt-12 text-center">
                <Button variant="outline" className="rounded-full px-12 h-16 text-lg font-bold border-2 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-lg hover:shadow-primary/30 group">
                    Voir plus d&apos;annonces
                    <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                </Button>
            </div>
        </section>
    );
}
