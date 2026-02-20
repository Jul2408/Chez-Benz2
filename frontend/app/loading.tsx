'use client';

import React from 'react';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
            <div className="relative flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full mb-4 animate-spin" />

                <div className="text-center">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">Chargement...</h2>
                    <p className="text-muted-foreground text-sm">Chez-BEN2 prépare votre expérience</p>
                </div>

                <div className="mt-8 w-48 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-1/3 animate-pulse" />
                </div>
            </div>
        </div>
    );
}
