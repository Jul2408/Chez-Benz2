'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Grid,
    Car,
    Home,
    Smartphone,
    Shirt,
    Armchair,
    Dog,
    Briefcase,
    Music,
    MoreHorizontal,
    Bookmark,
    Clock,
    Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
    className?: string;
}

const CATEGORIES = [
    { label: 'Tous', icon: Grid, href: '/annonces' },
    { label: 'Véhicules', icon: Car, href: '/annonces?category=vehicules' },
    { label: 'Immobilier', icon: Home, href: '/annonces?category=immobilier' },
    { label: 'Multimédia', icon: Smartphone, href: '/annonces?category=multimedia' },
    { label: 'Mode', icon: Shirt, href: '/annonces?category=mode' },
    { label: 'Maison', icon: Armchair, href: '/annonces?category=maison' },
    { label: 'Animaux', icon: Dog, href: '/annonces?category=animaux' },
    { label: 'Emploi', icon: Briefcase, href: '/annonces?category=emploi' },
    { label: 'Loisirs', icon: Music, href: '/annonces?category=loisirs' },
    { label: 'Autres', icon: MoreHorizontal, href: '/annonces?category=autres' },
];

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={cn('pb-12 w-64 flex-col gap-8 hidden lg:flex', className)}>
            {/* Catégories */}
            <div className="space-y-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                        Catégories
                    </h2>
                    <div className="space-y-1">
                        {CATEGORIES.map((category) => {
                            const Icon = category.icon;
                            // Simple logic to determine active state from href
                            // In real app, check search params
                            const isActive = pathname === '/annonces' && category.label === 'Tous';

                            return (
                                <Button
                                    key={category.label}
                                    variant={isActive ? 'secondary' : 'ghost'}
                                    className={cn(
                                        'w-full justify-start gap-3 h-10',
                                        isActive && 'bg-primary/10 text-primary hover:bg-primary/20'
                                    )}
                                    asChild
                                >
                                    <Link href={category.href}>
                                        <Icon className="size-4" />
                                        {category.label}
                                    </Link>
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Mes Filtres / Favoris */}
            <div className="space-y-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                        Mes raccourcis
                    </h2>
                    <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start gap-3 h-10">
                            <Bookmark className="size-4" />
                            Annonces favorites
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-3 h-10">
                            <Filter className="size-4" />
                            Recherches sauvegardées
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-3 h-10">
                            <Clock className="size-4" />
                            Consultées récemment
                        </Button>
                    </div>
                </div>
            </div>

            {/* Pub / Promo */}
            <div className="mx-4 p-4 rounded-xl bg-gradient-to-br from-primary/80 to-primary/40 text-white shadow-lg shadow-primary/20">
                <h3 className="font-bold text-lg mb-1">Boostez vos ventes !</h3>
                <p className="text-xs opacity-90 mb-3">
                    Mettez vos annonces en avant pour vendre 3x plus vite.
                </p>
                <Button size="sm" variant="secondary" className="w-full bg-white text-primary hover:bg-white/90">
                    En savoir plus
                </Button>
            </div>
        </aside>
    );
}
