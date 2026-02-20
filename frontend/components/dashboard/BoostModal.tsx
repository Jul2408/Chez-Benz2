'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Loader2, Rocket, Phone, CheckCircle2, Building, Car, Package, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { BOOST_PRICING, calculateBoostPrice } from '@/lib/boost-config';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';

interface BoostModalProps {
    isOpen: boolean;
    onClose: () => void;
    annonceId?: string;
    annonceTitle?: string;
    categorySlug?: string;
}

const CATEGORIES = [
    { label: 'Véhicules', value: 'vehicules', icon: Car },
    { label: 'Immobilier', value: 'immobilier', icon: Building },
    { label: 'Autres Catégories', value: 'autres', icon: Package },
];

export function BoostModal({
    isOpen,
    onClose,
    annonceId,
    annonceTitle,
    categorySlug,
}: BoostModalProps) {
    const [selectedDuration, setSelectedDuration] = useState<number>(3);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>(categorySlug || '');
    const [paymentMethod, setPaymentMethod] = useState<'OM' | 'MOMO' | 'CREDITS'>('OM');
    const [userProducts, setUserProducts] = useState<any[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<string[]>(annonceId ? [annonceId] : []);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const { user, refreshProfile } = require('@/components/providers/AuthProvider').useAuthContext();
    const currentCredits = user?.credits || 0;

    // Mettre à jour la catégorie si la prop change
    useEffect(() => {
        if (categorySlug) setSelectedCategory(categorySlug);
    }, [categorySlug]);

    // Charger les produits quand la catégorie change
    useEffect(() => {
        if (selectedCategory && !annonceId) {
            fetchUserProducts();
        }
    }, [selectedCategory]);

    const fetchUserProducts = async () => {
        setLoadingProducts(true);
        try {
            // Import dynamically to avoid circular dependency if any (or just import normally if guaranteed)
            // But we'll just import at top level usually. Assuming imports available.
            // Using require here just in case imports are tricky with replace_content tool context

            const { getUserProductsByCategory } = await import('@/utils/supabase-helpers');
            const products = await getUserProductsByCategory(selectedCategory);

            if (products) {
                // Ensure proper mapping to BoostModal product format
                setUserProducts(products);
            } else {
                toast.error('Erreur lors du chargement des produits');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Erreur lors du chargement des produits');
        } finally {
            setLoadingProducts(false);
        }
    };

    const toggleProductSelection = (productId: string) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const unitPrice = calculateBoostPrice(selectedCategory || 'default', selectedDuration);
    const totalPrice = selectedProducts.length * unitPrice;

    const handleBoost = async () => {
        if (!selectedCategory) {
            toast.error('Veuillez choisir une catégorie');
            return;
        }
        if (selectedProducts.length === 0) {
            toast.error('Veuillez sélectionner au moins un produit à booster');
            return;
        }
        if (paymentMethod !== 'CREDITS' && !phoneNumber) {
            toast.error('Veuillez entrer votre numéro de téléphone');
            return;
        }

        if (paymentMethod === 'CREDITS' && currentCredits < totalPrice) {
            toast.error('Crédits insuffisants pour ce boost.');
            return;
        }

        setLoading(true);
        try {
            const { createBoost } = await import('@/utils/supabase-helpers');

            await createBoost({
                annonceIds: selectedProducts,
                category: selectedCategory,
                duration: selectedDuration,
                paymentMethod,
                phoneNumber,
                amount: totalPrice
            });

            toast.success('Paiement initié ! Veuillez valider sur votre téléphone.');
            onClose();

            // Simulate webhook/processing delay
            setTimeout(() => {
                toast.success(`Boost activé avec succès pour ${selectedDuration} jours !`);
                window.location.reload();
            }, 3000);

        } catch (error) {
            toast.error('Une erreur est survenue lors de la création du boost.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white dark:bg-slate-900 border-none shadow-2xl rounded-[2rem]">
                <div className="bg-gradient-to-r from-primary to-orange-500 p-6 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                        <Rocket className="w-32 h-32" />
                    </div>
                    <DialogTitle className="flex flex-col items-center gap-2 relative z-10">
                        <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                            <Rocket className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-2xl font-black font-outfit">Booster votre visibilité</span>
                    </DialogTitle>
                    <DialogDescription className="text-white/80 text-center relative z-10 mt-2 font-medium">
                        Devenez la star de {selectedCategory ? CATEGORIES.find(c => c.value === selectedCategory)?.label : 'votre catégorie'} !
                    </DialogDescription>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Étape 1 : Choix de la catégorie (si non définie) */}
                    {!categorySlug && (
                        <div className="space-y-3">
                            <Label className="text-base font-bold flex items-center gap-2">
                                <Building className="w-4 h-4 text-primary" />
                                Choisir la catégorie
                            </Label>
                            <div className="grid grid-cols-3 gap-3">
                                {CATEGORIES.map((cat) => (
                                    <div
                                        key={cat.value}
                                        onClick={() => setSelectedCategory(cat.value)}
                                        className={`cursor-pointer rounded-xl border-2 p-3 text-center transition-all flex flex-col items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 ${selectedCategory === cat.value ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-100 dark:border-white/10'}`}
                                    >
                                        <cat.icon className={`w-6 h-6 ${selectedCategory === cat.value ? 'text-primary' : 'text-muted-foreground'}`} />
                                        <span className={`text-xs font-bold ${selectedCategory === cat.value ? 'text-primary' : 'text-muted-foreground'}`}>{cat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Étape 2: Sélection des produits (si pas d'annonceId spécifique) */}
                    {selectedCategory && !annonceId && (
                        <div className="space-y-3">
                            <Label className="text-base font-bold flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-primary" />
                                Sélectionner les produits à booster
                                {selectedProducts.length > 0 && (
                                    <Badge variant="secondary" className="ml-2">
                                        {selectedProducts.length} sélectionné{selectedProducts.length > 1 ? 's' : ''}
                                    </Badge>
                                )}
                            </Label>

                            {loadingProducts ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                    <span className="ml-2 text-sm text-muted-foreground">Chargement des produits...</span>
                                </div>
                            ) : userProducts.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Package className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">Aucun produit actif dans cette catégorie</p>
                                </div>
                            ) : (
                                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                                    {userProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            onClick={() => toggleProductSelection(product.id)}
                                            className={`cursor-pointer rounded-xl border-2 p-3 transition-all flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 ${selectedProducts.includes(product.id)
                                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                : 'border-gray-100 dark:border-white/10'
                                                }`}
                                        >
                                            <Checkbox
                                                checked={selectedProducts.includes(product.id)}
                                                onCheckedChange={() => toggleProductSelection(product.id)}
                                                className="shrink-0"
                                            />
                                            {product.cover_image && (
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                                                    <Image
                                                        src={product.cover_image}
                                                        alt={product.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm truncate">{product.title}</p>
                                                <p className="text-xs text-muted-foreground">{formatPrice(product.price)}</p>
                                                {product.is_featured && (
                                                    <Badge variant="outline" className="mt-1 text-[10px] border-yellow-500 text-yellow-600">
                                                        Déjà boosté
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Étape 3 : Durée */}
                    <div className="space-y-3">
                        <Label className="text-base font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            Choisir la durée
                        </Label>
                        <RadioGroup
                            value={selectedDuration.toString()}
                            onValueChange={(val) => setSelectedDuration(parseInt(val))}
                            className="grid grid-cols-2 gap-3"
                        >
                            {BOOST_PRICING.DURATIONS.map((days) => {
                                const currentPrice = calculateBoostPrice(selectedCategory || 'default', days);
                                const discount = BOOST_PRICING.DURATION_DISCOUNTS[days] || 0;

                                return (
                                    <div key={days} className="relative">
                                        <RadioGroupItem
                                            value={days.toString()}
                                            id={`option-${days}`}
                                            className="peer sr-only"
                                        />
                                        <Label
                                            htmlFor={`option-${days}`}
                                            className="flex flex-col items-center justify-between rounded-xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-slate-800 p-4 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-white/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                                        >
                                            <span className="font-black text-xl mb-1">{days} Jours</span>
                                            <span className="text-sm font-bold text-muted-foreground">
                                                {formatPrice(currentPrice)}
                                            </span>
                                            {discount > 0 && (
                                                <Badge className="absolute -top-2 -right-2 bg-green-500 hover:bg-green-600 text-white border-none shadow-sm text-[10px]">
                                                    -{discount * 100}%
                                                </Badge>
                                            )}
                                        </Label>
                                    </div>
                                );
                            })}
                        </RadioGroup>
                    </div>

                    {/* Étape 3 : Paiement */}
                    <div className="space-y-4 pt-2 border-t border-dashed">
                        <div className="flex flex-wrap gap-3">
                            <div
                                onClick={() => setPaymentMethod('OM')}
                                className={`flex-1 min-w-[120px] cursor-pointer rounded-xl border-2 p-3 flex items-center justify-center gap-2 transition-all ${paymentMethod === 'OM' ? 'border-[#FF7900] bg-[#FF7900]/10' : 'border-gray-100 grayscale opacity-60 hover:opacity-100 hover:grayscale-0'}`}
                            >
                                <div className="w-5 h-5 rounded-full bg-[#FF7900] flex items-center justify-center text-white text-[8px] font-bold">OM</div>
                                <span className="font-bold text-xs">Orange</span>
                            </div>
                            <div
                                onClick={() => setPaymentMethod('MOMO')}
                                className={`flex-1 min-w-[120px] cursor-pointer rounded-xl border-2 p-3 flex items-center justify-center gap-2 transition-all ${paymentMethod === 'MOMO' ? 'border-[#FFCC00] bg-[#FFCC00]/10' : 'border-gray-100 grayscale opacity-60 hover:opacity-100 hover:grayscale-0'}`}
                            >
                                <div className="w-5 h-5 rounded-full bg-[#FFCC00] flex items-center justify-center text-black text-[8px] font-bold">MTN</div>
                                <span className="font-bold text-xs">Mobile</span>
                            </div>
                            <div
                                onClick={() => setPaymentMethod('CREDITS')}
                                className={`flex-1 min-w-[120px] cursor-pointer rounded-xl border-2 p-3 flex items-center justify-center gap-2 transition-all ${paymentMethod === 'CREDITS' ? 'border-primary bg-primary/10' : 'border-gray-100 grayscale opacity-60 hover:opacity-100 hover:grayscale-0'}`}
                            >
                                <Rocket className="w-5 h-5 text-primary" />
                                <div className="flex flex-col">
                                    <span className="font-bold text-xs">Mes Crédits</span>
                                    <span className="text-[9px] opacity-70">{formatPrice(currentCredits)}</span>
                                </div>
                            </div>
                        </div>

                        {paymentMethod !== 'CREDITS' ? (
                            <div className="relative">
                                <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="Numéro de paiement (6XX...)"
                                    className="pl-10 h-12 rounded-xl border-2 focus-visible:ring-0 focus-visible:border-primary text-base"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                        ) : (
                            <div className={`p-4 rounded-xl border-2 flex items-center gap-3 ${currentCredits >= totalPrice ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-red-100 bg-red-50 text-red-700'}`}>
                                {currentCredits >= totalPrice ? (
                                    <>
                                        <CheckCircle2 className="w-5 h-5" />
                                        <p className="text-xs font-medium">Solde suffisant pour le boost !</p>
                                    </>
                                ) : (
                                    <>
                                        <Package className="w-5 h-5" />
                                        <p className="text-xs font-medium">Il vous manque {formatPrice(totalPrice - currentCredits)} pour ce boost.</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="p-6 pt-2 bg-gray-50 dark:bg-slate-800/50">
                    <div className="w-full flex flex-col gap-4">
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total à payer</span>
                            <span className="text-2xl font-black text-primary">{formatPrice(totalPrice)}</span>
                        </div>
                        <Button onClick={handleBoost} disabled={loading} size="lg" className="w-full rounded-xl font-black h-14 text-lg shadow-xl shadow-primary/20">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Traitement en cours...
                                </>
                            ) : (
                                `Payer avec ${paymentMethod === 'OM' ? 'Orange' : 'MTN'}`
                            )}
                        </Button>
                        <Button variant="ghost" onClick={onClose} disabled={loading} className="text-muted-foreground hover:bg-transparent hover:text-foreground">
                            Annuler
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
