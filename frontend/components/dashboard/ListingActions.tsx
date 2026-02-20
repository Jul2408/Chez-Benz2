'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Trash2, Eye, MoreHorizontal, Rocket } from 'lucide-react';
import { BoostModal } from './BoostModal';
import { Annonce } from '@/types';

interface ListingActionsProps {
    listing: Annonce;
    categorySlug?: string;
    onDelete?: () => void;
}

export function ListingActions({ listing, categorySlug = 'default', onDelete }: ListingActionsProps) {
    const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link href={`/annonces/${listing.slug || listing.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/annonces/edit/${listing.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            setIsBoostModalOpen(true);
                        }}
                        className="text-yellow-600 focus:text-yellow-600 cursor-pointer"
                    >
                        <Rocket className="mr-2 h-4 w-4" />
                        Booster l'annonce
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onSelect={() => onDelete?.()}
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <BoostModal
                isOpen={isBoostModalOpen}
                onClose={() => setIsBoostModalOpen(false)}
                annonceId={listing.id}
                annonceTitle={listing.title}
                categorySlug={categorySlug}
            />
        </>
    );
}
