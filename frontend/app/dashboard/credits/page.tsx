'use client';

import React, { useState } from 'react';
import { Rocket, ShieldCheck, Zap, Wallet, History, CreditCard, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { formatPrice } from '@/lib/utils';
import { fetchApi } from '@/lib/api-client';

const CREDIT_PACKS = [
    { amount: 5000, label: 'Pack Découverte', bonus: 0, icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50' },
    { amount: 15000, label: 'Pack Croissance', bonus: 1500, icon: Rocket, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { amount: 45000, label: 'Pack Business', bonus: 8000, icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

export default function CreditsPage() {
    const { user, refreshProfile } = useAuthContext();
    const [loadingPack, setLoadingPack] = useState<number | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'OM' | 'MOMO'>('OM');

    const handleBuyPack = async (amount: number, index: number) => {
        if (!phoneNumber) {
            toast.error('Veuillez entrer un numéro de téléphone pour le paiement');
            return;
        }

        setLoadingPack(index);
        try {
            await fetchApi('/auth/buy-credits/', {
                method: 'POST',
                body: JSON.stringify({ amount }),
            });

            toast.success(`Succès ! ${amount} crédits ont été ajoutés à votre compte.`);
            refreshProfile();
        } catch (error) {
            toast.error('Une erreur est survenue lors de l\'achat.');
        } finally {
            setLoadingPack(null);
        }
    };

    return (
        <div className="container max-w-5xl py-10 space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="relative z-10 space-y-2">
                    <h1 className="text-3xl font-black font-outfit">Mon Portefeuille Pro</h1>
                    <p className="text-slate-400 font-medium">Gérez vos crédits pour booster vos annonces et vendre plus vite.</p>
                </div>
                <div className="relative z-10 flex flex-col items-end gap-2">
                    <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20 text-center min-w-[200px]">
                        <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">Solde Actuel</p>
                        <p className="text-4xl font-black font-outfit">{user?.credits || 0} <span className="text-sm">Crédits</span></p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {CREDIT_PACKS.map((pack, i) => (
                    <Card key={i} className="border-none shadow-lg rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all hover:-translate-y-2">
                        <CardHeader className={`${pack.bg} p-8 text-center space-y-4`}>
                            <div className={`size-16 rounded-3xl ${pack.color} bg-white mx-auto flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                                <pack.icon className="size-8" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black">{pack.label}</CardTitle>
                                <CardDescription className="font-bold text-lg text-slate-900 mt-2">
                                    {formatPrice(pack.amount)}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <ul className="space-y-3 text-sm font-medium text-slate-600">
                                <li className="flex items-center gap-2">
                                    <div className="size-1.5 rounded-full bg-emerald-500" />
                                    {pack.amount.toLocaleString()} Crédits
                                </li>
                                {pack.bonus > 0 && (
                                    <li className="flex items-center gap-2 text-emerald-600 font-black">
                                        <Zap className="size-4" />
                                        +{pack.bonus.toLocaleString()} Crédits Bonus
                                    </li>
                                )}
                                <li className="flex items-center gap-2">
                                    <div className="size-1.5 rounded-full bg-slate-300" />
                                    Boosts prioritaires
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter className="p-8 pt-0">
                            <Button
                                className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs"
                                variant={i === 1 ? 'default' : 'outline'}
                                onClick={() => handleBuyPack(pack.amount + pack.bonus, i)}
                                disabled={loadingPack !== null}
                            >
                                {loadingPack === i ? <Loader2 className="size-4 animate-spin" /> : 'Acheter'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="rounded-[2rem] border-none shadow-xl">
                    <CardHeader className="p-8">
                        <CardTitle className="text-2xl font-black font-outfit flex items-center gap-3">
                            <CreditCard className="text-primary" />
                            Mode de paiement
                        </CardTitle>
                        <CardDescription>Configurez votre compte de paiement mobile</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setPaymentMethod('OM')}
                                className={`flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${paymentMethod === 'OM' ? 'border-[#FF7900] bg-[#FF7900]/5' : 'border-slate-100 opacity-40 grayscale hover:grayscale-0'}`}
                            >
                                <div className="h-6 w-6 rounded-full bg-[#FF7900] flex items-center justify-center text-white text-[8px] font-black">OM</div>
                                <span className="font-bold text-sm">Orange Money</span>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('MOMO')}
                                className={`flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${paymentMethod === 'MOMO' ? 'border-[#FFCC00] bg-[#FFCC00]/5' : 'border-slate-100 opacity-40 grayscale hover:grayscale-0'}`}
                            >
                                <div className="h-6 w-6 rounded-full bg-[#FFCC00] flex items-center justify-center text-black text-[8px] font-black">MTN</div>
                                <span className="font-bold text-sm">Mobile Money</span>
                            </button>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Numéro de téléphone</label>
                            <Input
                                type="tel"
                                placeholder="6XX XXX XXX"
                                className="h-14 rounded-2xl border-2 font-bold text-lg"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-none shadow-xl">
                    <CardHeader className="p-8">
                        <CardTitle className="text-2xl font-black font-outfit flex items-center gap-3">
                            <History className="text-primary" />
                            Historique récent
                        </CardTitle>
                        <CardDescription>Vos dernières transactions de crédits</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="space-y-4">
                            {[1, 2].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                            <Wallet className="size-5 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Achat de crédits</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-black">18 Fév, 2026</p>
                                        </div>
                                    </div>
                                    <p className="font-black text-emerald-600">+15,000 FCFA</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
