'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchHeader } from '@/components/annonces/SearchHeader';
import { AnnonceGrid } from '@/components/annonces/AnnonceGrid';
import { AnnonceCard, PaginationState } from '@/types';

interface SearchContentWrapperProps {
    annonces: AnnonceCard[];
    total: number;
    pagination: PaginationState;
}

export function SearchContentWrapper({ annonces, total, pagination }: SearchContentWrapperProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`/annonces?${params.toString()}`);
    };

    return (
        <div className="space-y-6">
            <SearchHeader
                totalResults={total}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            <AnnonceGrid
                annonces={annonces}
                pagination={pagination}
                onPageChange={handlePageChange}
                viewMode={viewMode}
            />
        </div>
    );
}
