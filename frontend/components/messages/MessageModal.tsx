'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { createConversation, sendMessage } from '@/utils/supabase-helpers';

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

        const token = typeof window !== 'undefined' ? localStorage.getItem('chezben2_token') : null;
        if (!token || token === 'undefined') {
            toast.error("Veuillez vous connecter pour envoyer un message.");
            window.location.href = `/connexion?next=${window.location.pathname}`;
            return;
        }

        const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('chezben2_user_id') : null;
        if (currentUserId?.toString() === sellerId?.toString()) {
            toast.error("Vous ne pouvez pas vous envoyer de message à vous-même.");
            onOpenChange(false);
            return;
        }

        if (!message.trim()) {
            toast.error('Veuillez entrer un message');
            return;
        }

        setLoading(true);

        try {
            // 1. Get or create conversation
            const conversation = await createConversation(annonceId);

            if (conversation && conversation.id) {
                // 2. Send message
                await sendMessage(conversation.id, message);

                toast.success('Message envoyé avec succès !');
                setMessage('');
                onOpenChange(false);
            } else {
                toast.error('Erreur lors de la création de la conversation');
            }
        } catch (error: any) {
            console.error('Message send error detail:', error);

            let errorMessage = 'Une erreur est survenue lors de l\'envoi.';
            if (typeof error === 'string') {
                errorMessage = error;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            if (errorMessage.includes('yourself')) {
                toast.error("Vous ne pouvez pas vous envoyer de message à vous-même");
            } else if (errorMessage.includes('not found')) {
                toast.error("L'annonce n'existe plus ou l'ID est invalide");
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black">Envoyer un message</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Preview */}
                    <div className="bg-muted/50 p-4 rounded-xl flex items-center gap-4">
                        {annonceImage && (
                            <div className="relative size-16 rounded-lg overflow-hidden shrink-0">
                                <Image
                                    src={annonceImage}
                                    alt={annonceTitle}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground font-medium">À propos de</p>
                            <p className="font-bold truncate">{annonceTitle}</p>
                        </div>
                    </div>

                    {/* Message Input */}
                    <div className="space-y-2">
                        <Textarea
                            placeholder="Bonjour, je suis intéressé par votre produit..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[150px] resize-none rounded-xl border-none bg-muted focus-visible:ring-2 focus-visible:ring-primary p-4"
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Le vendeur recevra une notification et verra votre message dans son tableau de bord.
                        </p>
                    </div>

                    {/* Info Notice */}
                    <div className="bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
                        <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                            💬 Messagerie sécurisée - Vos coordonnées ne seront pas partagées. Communiquez en toute sécurité via notre plateforme.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full h-14 text-lg font-bold shadow-lg"
                        disabled={loading}
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
