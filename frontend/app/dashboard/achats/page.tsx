import React from 'react';
import { ShoppingBag, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AchatsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 max-w-2xl mx-auto">
            <div className="size-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="size-12 text-primary animate-pulse" />
            </div>

            <h1 className="text-4xl font-black font-outfit tracking-tighter text-foreground">
                Suivi de vos Achats
            </h1>

            <p className="text-muted-foreground text-lg leading-relaxed">
                Cette fonctionnalité est en cours de déploiement sur <span className="font-bold text-primary">Chez-BEN2.COM</span>.
                Bientôt, vous pourrez suivre vos commandes, vos factures et vos transactions directement ici.
            </p>

            <div className="bg-muted/50 p-6 rounded-[2rem] border-2 border-dashed border-primary/20 flex items-center gap-4">
                <Clock className="size-6 text-primary" />
                <p className="text-sm font-medium">Lancement prévu prochainement pour tous les utilisateurs au Cameroun.</p>
            </div>

            <Link href="/dashboard">
                <Button className="rounded-full px-8 py-6 h-auto text-lg font-bold shadow-xl shadow-primary/20">
                    Retour au Tableau de bord
                </Button>
            </Link>
        </div>
    );
}
