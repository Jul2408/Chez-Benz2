'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-24 text-center">
            <div className="max-w-md w-full">
                <div className="relative mb-8">
                    <h1 className="text-[12rem] font-black leading-none text-primary/10 select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-primary">
                            <Search size={120} strokeWidth={1} />
                        </div>
                    </div>
                </div>

                <h2 className="text-3xl font-black text-foreground mb-4">
                    Oups ! Page introuvable
                </h2>
                <p className="text-muted-foreground text-lg mb-10">
                    La page que vous recherchez semble avoir disparu ou l&apos;adresse est incorrecte.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild size="lg" className="rounded-full px-8 font-bold shadow-lg shadow-primary/25">
                        <Link href="/">
                            <Home className="mr-2 h-5 w-5" />
                            Retour à l&apos;accueil
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-full px-8 font-bold border-2">
                        <Link href="/annonces">
                            Explorer les annonces
                        </Link>
                    </Button>
                </div>

                <div className="mt-12">
                    <button
                        onClick={() => window.history.back()}
                        className="text-muted-foreground hover:text-primary transition-colors flex items-center justify-center mx-auto gap-2 font-medium"
                    >
                        <ArrowLeft size={18} />
                        Revenir à la page précédente
                    </button>
                </div>
            </div>
        </main>
    );
}
