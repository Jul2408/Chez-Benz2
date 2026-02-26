'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { createConversation } from '@/utils/supabase-helpers';

interface MessageModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    annonceId: string;
    sellerId: string;
    annonceTitle: string;
    annonceImage?: string;
}

export function MessageModal({
    open,
    onOpenChange,
    annonceId,
    sellerId,
    annonceTitle,
    annonceImage
}: MessageModalProps) {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Auth check
        const token = typeof window !== 'undefined' ? localStorage.getItem('chezben2_token') : null;
        if (!token || token === 'undefined') {
            toast.error("Veuillez vous connecter pour envoyer un message.");
            window.location.href = `/connexion?next=${window.location.pathname}`;
            return;
        }

        // Self-message guard
        const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('chezben2_user_id') : null;
        if (currentUserId?.toString() === sellerId?.toString()) {
            toast.error("Vous ne pouvez pas vous envoyer de message à vous-même.");
            onOpenChange(false);
            return;
        }

        if (!message.trim()) {
            toast.error('Veuillez entrer un message.');
            return;
        }

        setLoading(true);

        try {
            // Single API call: creates (or reuses) conversation AND sends the message
            const result = await createConversation(annonceId, message.trim(), sellerId);

            if (result && result.conversation) {
                toast.success('✅ Message envoyé ! Le vendeur a été notifié.');
                setMessage('');
                onOpenChange(false);
            } else {
                toast.error('Erreur lors de la création de la conversation. Réessayez.');
            }
        } catch (error: any) {
            console.error('Message send error:', error);

            const raw = error?.message || String(error || '');
            if (raw.includes('yourself') || raw.includes('vous-même')) {
                toast.error("Vous ne pouvez pas vous envoyer de message à vous-même.");
            } else if (raw.includes('not found') || raw.includes('introuvable')) {
                toast.error("L'annonce n'existe plus ou est invalide.");
            } else if (raw.includes('Unauthenticated') || raw.includes('401')) {
                toast.error("Session expirée. Veuillez vous reconnecter.");
                window.location.href = `/connexion?next=${window.location.pathname}`;
            } else {
                toast.error("Une erreur est survenue lors de l'envoi. Réessayez.");
            }
        } finally {
            setLoading(false);
        }
    };

    const quickMessages = [
        "Bonjour, est-ce que cet article est toujours disponible ?",
        "Bonjour, quel est votre meilleur prix ?",
        "Bonjour, est-il possible de voir l'article en personne ?",
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black flex items-center gap-2">
                        <MessageCircle className="size-6 text-primary" />
                        Envoyer un message
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Product Preview */}
                    <div className="bg-muted/50 p-4 rounded-xl flex items-center gap-4 border">
                        {annonceImage && (
                            <div className="relative size-16 rounded-lg overflow-hidden shrink-0 border">
                                <Image
                                    src={annonceImage}
                                    alt={annonceTitle}
                                    fill
                                    className="object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground font-medium">À propos de</p>
                            <p className="font-bold truncate text-sm">{annonceTitle}</p>
                        </div>
                    </div>

                    {/* Quick message suggestions */}
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Suggestions rapides</p>
                        <div className="flex flex-wrap gap-2">
                            {quickMessages.map((q, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setMessage(q)}
                                    className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors text-left"
                                >
                                    {q.length > 40 ? q.slice(0, 40) + '...' : q}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Message Input */}
                    <div className="space-y-2">
                        <Textarea
                            placeholder="Bonjour, je suis intéressé par votre produit..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[140px] resize-none rounded-xl bg-muted border-none focus-visible:ring-2 focus-visible:ring-primary p-4"
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            {message.length} caractère{message.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {/* Info Notice */}
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3">
                        <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                            💬 Le vendeur recevra votre message et pourra vous répondre directement.
                        </p>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full h-12 text-base font-bold shadow-lg"
                        disabled={loading || !message.trim()}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 size-5 animate-spin" />
                                Envoi en cours...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 size-5" />
                                Envoyer le message
                            </>
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
