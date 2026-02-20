'use client';

import { Suspense, useEffect, useState } from 'react';
import { FilterSidebar } from '@/components/annonces/FilterSidebar';
import { listingConfig } from '@/config/site';
import { Category, AnnonceCard } from '@/types';
import { SearchContentWrapper } from './SearchContentWrapper';
import { getAnnonces, getCategories } from '@/utils/supabase-helpers';
import { Loader2 } from 'lucide-react';

interface SearchPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
    const [annonces, setAnnonces] = useState<AnnonceCard[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const page = Number(searchParams.page) || 1;
    const query = searchParams.q as string || '';
    const categoryId = searchParams.category as string || '';
    const city = searchParams.city as string || '';

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const [annoncesData, categoriesData] = await Promise.all([
                    getAnnonces({ page, query, category_id: categoryId, city }),
                    getCategories()
                ]);
                setAnnonces(annoncesData.data);
                setPagination(annoncesData.pagination);
                setCategories(categoriesData);
            } catch (error) {
                console.error('Failed to load search data:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [page, query, categoryId, city]);

    return (
        <div className="container py-8 min-h-[60vh]">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full lg:w-72 shrink-0">
                    <FilterSidebar categories={categories} />
                </aside>

                {/* Main Content */}
                <main className="flex-1 space-y-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Loader2 className="h-10 w-10 text-primary animate-spin" />
                            <p className="text-muted-foreground animate-pulse">Recherche des meilleures offres...</p>
                        </div>
                    ) : (
                        <Suspense fallback={<div>Chargement...</div>}>
                            <SearchContentWrapper
                                annonces={annonces}
                                total={pagination?.total || 0}
                                pagination={pagination}
                            />
                        </Suspense>
                    )}
                </main>
            </div>
        </div>
    );
}
