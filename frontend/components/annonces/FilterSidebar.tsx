'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn, formatPrice } from '@/lib/utils';
import { CAMEROON_REGIONS, MAJOR_CITIES, Category } from '@/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';

interface FilterSidebarProps {
    categories: Category[];
}

function FilterSidebarContent({ categories }: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State derived from URL
    const [priceRange, setPriceRange] = useState([
        Number(searchParams.get('minPrice')) || 0,
        Number(searchParams.get('maxPrice')) || 10000000
    ]);
    const selectedCategory = searchParams.get('category');
    const selectedRegion = searchParams.get('region');
    const selectedCity = searchParams.get('city');
    const selectedEtats = searchParams.getAll('etat');

    // Debounced URL update for sliders
    useEffect(() => {
        const timer = setTimeout(() => {
            updateFilters({
                minPrice: priceRange[0] > 0 ? priceRange[0] : null,
                maxPrice: priceRange[1] < 10000000 ? priceRange[1] : null,
            });
        }, 500);
        return () => clearTimeout(timer);
    }, [priceRange]);

    const updateFilters = (updates: Record<string, string | number | string[] | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        // Reset page on filter change
        params.set('page', '1');

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        });

        router.push(`/annonces?${params.toString()}`);
    };

    const resetFilters = () => {
        router.push('/annonces');
        setPriceRange([0, 10000000]);
    };

    return (
        <div className="space-y-6">
            {/* Categories */}
            <div className="space-y-3">
                <h3 className="font-semibold text-sm">Catégories</h3>
                <ScrollArea className="h-48 pr-2">
                    <div className="space-y-1">
                        <Button
                            variant={!selectedCategory ? "secondary" : "ghost"}
                            size="sm"
                            className="w-full justify-start text-xs font-normal"
                            onClick={() => updateFilters({ category: null })}
                        >
                            Toutes les catégories
                        </Button>
                        {categories.map((cat) => (
                            <Button
                                key={cat.id}
                                variant={selectedCategory === cat.slug ? "secondary" : "ghost"}
                                size="sm"
                                className="w-full justify-start text-xs font-normal"
                                onClick={() => updateFilters({ category: cat.slug })}
                            >
                                <span className="mr-2">{cat.icon}</span>
                                {cat.name}
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            <Separator />

            {/* Prix */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Prix</h3>
                    <span className="text-xs text-muted-foreground">
                        {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}+
                    </span>
                </div>
                <Slider
                    defaultValue={[0, 10000000]}
                    max={10000000}
                    step={50000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="py-4"
                />
                <div className="flex gap-2">
                    <Input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="h-8 text-xs"
                    />
                    <Input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="h-8 text-xs"
                    />
                </div>
            </div>

            <Separator />

            {/* Région & Ville */}
            <div className="space-y-3">
                <h3 className="font-semibold text-sm">Localisation</h3>

                {/* Region Selector */}
                <div className="grid grid-cols-2 gap-2">
                    {CAMEROON_REGIONS.slice(0, 6).map((region) => (
                        <div
                            key={region}
                            className={cn(
                                "flex items-center gap-2 text-[10px] p-2 rounded-md border cursor-pointer transition-colors",
                                selectedRegion === region ? "border-primary bg-primary/5" : "hover:bg-muted"
                            )}
                            onClick={() => updateFilters({
                                region: selectedRegion === region ? null : region,
                                city: null // Reset city when changing region
                            })}
                        >
                            <div className={cn(
                                "size-3 rounded-full border flex items-center justify-center shrink-0",
                                selectedRegion === region ? "bg-primary border-primary" : "border-muted-foreground"
                            )} />
                            <span className="truncate">{region}</span>
                        </div>
                    ))}
                </div>

                {/* City Selector (if region selected) */}
                {selectedRegion && MAJOR_CITIES[selectedRegion as keyof typeof MAJOR_CITIES] && (
                    <div className="mt-2 pt-2 border-t">
                        <Label className="text-xs text-muted-foreground mb-2 block">Ville dans {selectedRegion}</Label>
                        <div className="flex flex-wrap gap-1">
                            {MAJOR_CITIES[selectedRegion as keyof typeof MAJOR_CITIES].map(city => (
                                <Badge
                                    key={city}
                                    variant={selectedCity === city ? "default" : "outline"}
                                    className="cursor-pointer font-normal"
                                    onClick={() => updateFilters({ city: selectedCity === city ? null : city })}
                                >
                                    {city}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Separator />

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-lg">Filtres</h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-muted-foreground hover:text-red-500 gap-1"
                        onClick={resetFilters}
                    >
                        <RotateCcw className="size-3" />
                        Réinitialiser
                    </Button>
                </div>
            </div>
        </div>
    );
}

export function FilterSidebar(props: FilterSidebarProps) {
    const searchParams = useSearchParams();

    // Calculer le nombre de filtres actifs
    const getActiveFiltersCount = () => {
        let count = 0;
        if (searchParams.get('category')) count++;
        if (searchParams.get('region')) count++;
        if (searchParams.get('city')) count++;
        if (searchParams.get('minPrice') && searchParams.get('minPrice') !== '0') count++;
        if (searchParams.get('maxPrice') && searchParams.get('maxPrice') !== '10000000') count++;
        if (searchParams.getAll('etat').length > 0) count++;
        return count;
    };

    const activeFiltersCount = getActiveFiltersCount();

    return (
        <>
            {/* Desktop View */}
            <div className="hidden lg:block w-72 space-y-6 sticky top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 scrollbar-thin">
                <Suspense fallback={<div>Chargement filtres...</div>}>
                    <FilterSidebarContent {...props} />
                </Suspense>
            </div>

            {/* Mobile View */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden gap-2 relative">
                        <Filter className="size-4" />
                        Filtres
                        {activeFiltersCount > 0 && (
                            <Badge variant="default" className="absolute -top-2 -right-2 size-5 flex items-center justify-center p-0 rounded-full text-[10px]">
                                {activeFiltersCount}
                            </Badge>
                        )}
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:w-[400px] overflow-y-auto">
                    <SheetHeader className="mb-6">
                        <SheetTitle>Filtrer les résultats</SheetTitle>
                    </SheetHeader>
                    <Suspense fallback={<div>Chargement filtres...</div>}>
                        <FilterSidebarContent {...props} />
                    </Suspense>
                    <SheetFooter className="mt-8">
                        <SheetClose asChild>
                            <Button className="w-full">Voir les résultats</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    );
}
