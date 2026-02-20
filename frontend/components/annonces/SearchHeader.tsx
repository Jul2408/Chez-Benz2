'use client';

import Link from 'next/link';
import { LayoutGrid, List as ListIcon, ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchHeaderProps {
    totalResults: number;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
}

export function SearchHeader({ totalResults, viewMode, setViewMode }: SearchHeaderProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || 'date';

    const handleSort = (sort: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', sort);
        router.push(`/annonces?${params.toString()}`);
    };

    const sortLabels: Record<string, string> = {
        'date': 'Plus récentes',
        'price_asc': 'Prix croissant',
        'price_desc': 'Prix décroissant',
        'views': 'Plus populaires',
    };

    return (
        <div className="space-y-4">
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
                <span className="mx-2">/</span>
                <span className="text-foreground font-medium">Recherche</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold">
                    {totalResults} résultats trouvés
                </h1>

                <div className="flex items-center gap-2">
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2 mr-2">
                        <span className="text-sm text-muted-foreground hidden sm:inline">Trier par :</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-9 gap-2">
                                    {sortLabels[currentSort]}
                                    <ChevronDown className="size-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleSort('date')}>
                                    Plus récentes
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSort('price_asc')}>
                                    Prix croissant
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSort('price_desc')}>
                                    Prix décroissant
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSort('views')}>
                                    Plus populaires
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* View Switcher */}
                    <div className="flex items-center rounded-md border p-1">
                        <Button
                            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-7 w-7 rounded-sm"
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid className="size-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-7 w-7 rounded-sm"
                            onClick={() => setViewMode('list')}
                        >
                            <ListIcon className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
