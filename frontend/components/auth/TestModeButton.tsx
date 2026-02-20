'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { TEST_MODE_CONFIG } from '@/config/test-mode';
import { toast } from 'sonner';

export function TestModeButton() {
    const [loading, setLoading] = React.useState(false);

    const handleTestLogin = async () => {
        if (!TEST_MODE_CONFIG.enabled) return;

        setLoading(true);
        try {
            toast.success(`Mode Test : Connexion en tant que ${TEST_MODE_CONFIG.testEmail}`);

            // Simulation de session
            if (typeof window !== 'undefined') {
                localStorage.setItem(TEST_MODE_CONFIG.storageKey, 'true');
                document.cookie = `${TEST_MODE_CONFIG.cookieKey}=true; path=/; max-age=3600`;
            }

            const searchParams = new URLSearchParams(window.location.search);
            const next = searchParams.get('next') || '/dashboard';

            setTimeout(() => {
                window.location.href = next;
            }, 500);
        } catch (error) {
            toast.error("Erreur lors de la connexion test");
        } finally {
            // Pas besoin de reset loading car on redirige
        }
    };

    if (!TEST_MODE_CONFIG.enabled) return null;

    return (
        <Button
            variant="outline"
            className="w-full py-6 rounded-2xl border-dashed border-2 border-primary/30 hover:border-primary hover:bg-primary/5 group transition-all"
            onClick={handleTestLogin}
            disabled={loading}
        >
            {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
                <ShieldCheck className="mr-2 h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
            )}
            <div className="flex flex-col items-start text-xs">
                <span className="font-bold text-primary">Connexion Test Rapide</span>
                <span className="text-muted-foreground">{TEST_MODE_CONFIG.testEmail}</span>
            </div>
        </Button>
    );
}
