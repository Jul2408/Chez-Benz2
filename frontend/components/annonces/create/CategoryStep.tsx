'use client';

import React, { useState } from 'react';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Check, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategoryStepProps {
    initialCategories: Category[];
    onSelect: (category: Category, path: Category[]) => void;
    currentSelection: string | null;
}

export function CategoryStep({ initialCategories, onSelect, currentSelection }: CategoryStepProps) {
    const [history, setHistory] = useState<Category[][]>([initialCategories]);
    const [path, setPath] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    const currentLevelCategories = history[history.length - 1];

    const handleCategoryClick = async (category: Category) => {
        setLoading(true);
        // Mock checking for children
        // In a real app we'd fetch children. Here we assume no children for deeper levels or just use a mock function if needed.
        // For now, let's assume all categories passed are leaf nodes or we treat them as such for simplicity in this refactor,
        // OR we can import getCategories from helpers if we want to simulate hierarchy.

        // Let's assume for this mock that if it has a specific ID pattern it might have children, 
        // but for now let's make it simple: first level selection is final.
        // If you want multi-level, we need a mock strategy for children.

        await new Promise(resolve => setTimeout(resolve, 500)); // Simulating network delay

        setLoading(false);

        // For the purpose of this refactor, we'll treat all categories as selectable leaf nodes immediately
        // unless we want to mock a hierarchy.
        // Let's just select it directly.
        onSelect(category as Category, [...path, category as Category]);
    };

    const handleBack = () => {
        if (history.length > 1) {
            setHistory(history.slice(0, -1));
            setPath(path.slice(0, -1));
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 bg-muted/30 p-3 rounded-lg">
                <span className={cn(path.length === 0 && "font-semibold text-primary")}>Toutes les catégories</span>
                {path.map((cat: Category, idx: number) => (
                    <div key={cat.id} className="flex items-center gap-2">
                        <ChevronRight className="size-4" {...({} as any)} />
                        <span className={cn(idx === path.length - 1 && "font-semibold text-primary")}>
                            {cat.name}
                        </span>
                    </div>
                ))}
            </div>

            <div className="border rounded-xl overflow-hidden bg-card">
                {/* Header with Back button */}
                {history.length > 1 && (
                    <div className="p-2 border-b bg-muted/10">
                        <Button
                            {...({
                                variant: "ghost",
                                size: "sm",
                                onClick: handleBack,
                                className: "gap-2"
                            } as any)}
                        >
                            <ChevronLeft className="size-4" {...({} as any)} />
                            Retour
                        </Button>
                    </div>
                )}

                <ScrollArea {...({ className: "h-[400px]" } as any)}>
                    <div className="p-2">
                        {loading ? (
                            <div className="p-8 text-center text-muted-foreground">Chargement...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {currentLevelCategories.map((category: Category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryClick(category)}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-lg border text-left transition-all hover:border-primary hover:bg-primary/5",
                                            currentSelection === category.id && "border-primary bg-primary/10"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                                {/* We could use category.icon here if we had an icon map or dynamic icons */}
                                                <Folder className="size-5" {...({} as any)} />
                                            </div>
                                            <div>
                                                <p className="font-medium">{category.name}</p>
                                                {category.description && (
                                                    <p className="text-xs text-muted-foreground line-clamp-1">{category.description}</p>
                                                )}
                                            </div>
                                        </div>
                                        {currentSelection === category.id ? (
                                            <Check className="size-5 text-primary" {...({} as any)} />
                                        ) : (
                                            <ChevronRight className="size-5 text-muted-foreground/50" {...({} as any)} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {!loading && currentLevelCategories.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground">
                                Aucune catégorie trouvée ici.
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            <div className="text-right text-xs text-muted-foreground">
                * Sélectionnez une catégorie pour continuer
            </div>
        </div>
    );
}
