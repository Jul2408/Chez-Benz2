'use client';

import { MobileHeader } from '@/components/layout/MobileHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function GenericPage({ title, description }: { title: string, description: string }) {
    return (
        <main className="min-h-screen bg-background pb-20 md:pb-0">
            <MobileHeader />

            <div className="container mx-auto px-4 py-12 md:py-20">
                <Button variant="ghost" asChild className="mb-8 -ml-4">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour à l'accueil
                    </Link>
                </Button>

                <div className="max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">{title}</h1>
                    <p className="text-xl text-muted-foreground leading-relaxed mb-12">
                        {description}
                    </p>

                    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                        <p>Cette page est en cours de construction. Nous travaillons dur pour vous fournir les meilleures informations possibles sur Chez-BEN2.</p>
                        <p>En attendant, vous pouvez explorer nos catégories d'annonces ou nous contacter si vous avez des questions urgentes.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
