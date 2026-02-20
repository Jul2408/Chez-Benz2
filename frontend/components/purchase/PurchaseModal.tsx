'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Smartphone, CreditCard } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

interface PurchaseModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    annonceId: string;
    price: number;
    title: string;
}

export function PurchaseModal({ open, onOpenChange, annonceId, price, title }: PurchaseModalProps) {
    const [paymentMethod, setPaymentMethod] = useState<'ORANGE_MONEY' | 'MTN_MONEY'>('ORANGE_MONEY');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const platformFee = price * 0.05; // 5% platform fee
    const totalAmount = price + platformFee;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!phone || phone.length < 9) {
            toast.error('Veuillez entrer un numéro de téléphone valide');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/purchase/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    annonce_id: annonceId,
                    payment_method: paymentMethod,
                    phone: phone,
                    amount: price,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Paiement initié avec succès !');
                toast.info('Veuillez confirmer le paiement sur votre téléphone');
                onOpenChange(false);

                // Redirect to purchase tracking page
                if (data.transaction_id) {
                    window.location.href = `/dashboard/purchases/${data.transaction_id}`;
                }
            } else {
                toast.error(data.message || 'Erreur lors du paiement');
            }
        } catch (error) {
            console.error('Purchase error:', error);
            toast.error('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black">Acheter maintenant</DialogTitle>
                    <DialogDescription>
                        Complétez votre achat de manière sécurisée
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Info */}
                    <div className="bg-muted/50 p-4 rounded-xl space-y-2">
                        <p className="font-bold text-sm text-muted-foreground">Produit</p>
                        <p className="font-black text-lg">{title}</p>
                        <div className="flex justify-between items-center pt-2 border-t border-border">
                            <span className="text-sm">Prix</span>
                            <span className="font-bold">{formatPrice(price)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Frais de plateforme (5%)</span>
                            <span className="font-bold">{formatPrice(platformFee)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-border">
                            <span className="font-bold">Total</span>
                            <span className="font-black text-xl text-primary">{formatPrice(totalAmount)}</span>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-3">
                        <Label className="font-bold">Méthode de paiement</Label>
                        <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
                            <div className="flex items-center space-x-3 border-2 border-border rounded-xl p-4 hover:border-primary transition-colors cursor-pointer">
                                <RadioGroupItem value="ORANGE_MONEY" id="orange" />
                                <Label htmlFor="orange" className="flex items-center gap-3 cursor-pointer flex-1">
                                    <div className="size-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                        <Smartphone className="size-6 text-white" />
                                    </div>
                                    <span className="font-bold">Orange Money</span>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-3 border-2 border-border rounded-xl p-4 hover:border-primary transition-colors cursor-pointer">
                                <RadioGroupItem value="MTN_MONEY" id="mtn" />
                                <Label htmlFor="mtn" className="flex items-center gap-3 cursor-pointer flex-1">
                                    <div className="size-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                                        <CreditCard className="size-6 text-white" />
                                    </div>
                                    <span className="font-bold">MTN Mobile Money</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="font-bold">Numéro de téléphone</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="6 XX XX XX XX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="h-12 text-lg"
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Vous recevrez une notification pour confirmer le paiement
                        </p>
                    </div>

                    {/* Security Notice */}
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
                        <p className="text-sm text-emerald-800 dark:text-emerald-200 font-medium">
                            🔒 <strong>Paiement sécurisé</strong> - Vos fonds seront conservés en sécurité jusqu'à ce que vous confirmiez la réception du produit.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full h-14 text-lg font-bold"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 size-5 animate-spin" />
                                Traitement en cours...
                            </>
                        ) : (
                            `Payer ${formatPrice(totalAmount)}`
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
