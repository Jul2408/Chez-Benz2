'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCcw, Home, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Root Error Boundary caught an error:', error);
    }, [error]);

    return (
        <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-24 text-center">
            <div className="max-w-xl w-full">
                <div className="bg-destructive/10 text-destructive w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <AlertCircle size={40} />
                </div>

                <h1 className="text-3xl font-black text-foreground mb-4">
                    Mince ! Quelque chose s&apos;est mal passé
                </h1>
                <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                    Une erreur inattendue est survenue dans l&apos;application. Notre équipe technique a été informée.
                </p>

                {error.digest && (
                    <p className="text-xs font-mono text-muted-foreground/60 mb-8 bg-muted/30 p-2 rounded select-all">
                        ID Erreur : {error.digest}
                    </p>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        onClick={() => reset()}
                        size="lg"
                        className="rounded-full px-8 font-bold shadow-lg shadow-primary/25"
                    >
                        <RefreshCcw className="mr-2 h-5 w-5" />
                        Réessayer
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-full px-8 font-bold border-2">
                        <Link href="/">
                            <Home className="mr-2 h-5 w-5" />
                            Page d&apos;accueil
                        </Link>
                    </Button>
                </div>

                <div className="mt-16 p-6 border border-dashed border-border rounded-3xl bg-muted/20">
                    <p className="text-sm text-foreground font-semibold mb-3 flex items-center justify-center gap-2">
                        <MessageSquare size={16} />
                        Besoin d&apos;aide ?
                    </p>
                    <p className="text-muted-foreground text-sm mb-4">
                        Si le problème persiste, n&apos;hésitez pas à contacter notre support technique.
                    </p>
                    <Link
                        href="/contact"
                        className="text-primary font-bold hover:underline underline-offset-4"
                    >
                        Contacter le support →
                    </Link>
                </div>
            </div>
        </main>
    );
}
