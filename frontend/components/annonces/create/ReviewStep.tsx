'use client';

import * as ReactModule from 'react';
const React = ReactModule as any;
import { CreateListingState } from './types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { Loader2, AlertCircle, Edit3, MapPin, Camera, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ReviewStepProps {
    data: CreateListingState;
    onSubmit: () => void;
    onBack: () => void;
    onEditStep: (step: CreateListingState['step']) => void;
}

export function ReviewStep({ data, onSubmit, onBack, onEditStep }: ReviewStepProps) {
    return (
        <div className="space-y-8 max-w-3xl mx-auto pb-10">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black font-outfit">Vérification</h2>
                <p className="text-muted-foreground">Relisez vos informations avant la mise en ligne.</p>
            </div>

            {/* Error Display */}
            {data.error && (
                <Alert variant="destructive" className="rounded-2xl border-2">
                    <AlertCircle className="h-5 w-5" {...({} as any)} />
                    <AlertTitle className="font-bold">Erreur de publication</AlertTitle>
                    <AlertDescription>
                        {data.error}
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6">
                {/* Info Card */}
                <Card className="rounded-[2rem] border-2 shadow-none overflow-hidden hover:border-primary/20 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between bg-muted/30 border-b p-6">
                        <div className="flex items-center gap-2">
                            <Info className="size-5 text-primary" {...({} as any)} />
                            <CardTitle className="text-xl font-bold font-outfit">Informations</CardTitle>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => onEditStep('DETAILS')} className="rounded-full gap-2 text-xs font-bold uppercase">
                            <Edit3 className="size-3" {...({} as any)} /> Modifier
                        </Button>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Titre</span>
                                <p className="font-bold text-lg leading-tight">{data.title}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Prix</span>
                                <p className="font-black text-2xl text-primary font-outfit">
                                    {formatPrice(Number(data.price))}
                                    <span className="text-muted-foreground text-xs font-medium ml-2 uppercase tracking-tighter">
                                        {data.priceNegotiable ? '• Négociable' : '• Prix Ferme'}
                                    </span>
                                </p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Catégorie</span>
                                <div className="flex flex-wrap gap-1 items-center">
                                    {data.categoryPath.map((cat, i) => (
                                        <React.Fragment key={cat.id}>
                                            <span className="font-bold text-sm bg-muted px-2 py-0.5 rounded-lg">
                                                {cat.name}
                                            </span>
                                            {i < data.categoryPath.length - 1 && <span className="text-muted-foreground/30 text-xs">/</span>}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">État</span>
                                <p className="font-bold uppercase tracking-wider text-sm">{data.etat}</p>
                            </div>

                            {/* Attributs Spécifiques */}
                            {Object.keys(data.attributes).length > 0 && (
                                <div className="col-span-full grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-dashed">
                                    {Object.entries(data.attributes).map(([key, value]) => (
                                        <div key={key} className="space-y-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{key.replace('_', ' ')}</span>
                                            <p className="font-bold text-sm">{String(value)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Description</span>
                            <p className="whitespace-pre-line text-sm text-muted-foreground leading-relaxed">{data.description}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Location Card */}
                <Card className="rounded-[2rem] border-2 shadow-none overflow-hidden hover:border-primary/20 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between bg-muted/30 border-b p-6">
                        <div className="flex items-center gap-2">
                            <MapPin className="size-5 text-primary" {...({} as any)} />
                            <CardTitle className="text-xl font-bold font-outfit">Localisation</CardTitle>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => onEditStep('LOCATION')} className="rounded-full gap-2 text-xs font-bold uppercase">
                            <Edit3 className="size-3" {...({} as any)} /> Modifier
                        </Button>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex flex-wrap gap-x-8 gap-y-4">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Région</span>
                                <p className="font-bold">{data.region}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Ville</span>
                                <p className="font-bold">{data.city}</p>
                            </div>
                            {data.quartier && (
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Quartier</span>
                                    <p className="font-bold">{data.quartier}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Photos Card */}
                <Card className="rounded-[2rem] border-2 shadow-none overflow-hidden hover:border-primary/20 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between bg-muted/30 border-b p-6">
                        <div className="flex items-center gap-2">
                            <Camera className="size-5 text-primary" {...({} as any)} />
                            <CardTitle className="text-xl font-bold font-outfit">Photos ({data.images.length})</CardTitle>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => onEditStep('PHOTOS')} className="rounded-full gap-2 text-xs font-bold uppercase">
                            <Edit3 className="size-3" {...({} as any)} /> Modifier
                        </Button>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
                            {data.images.map((img, idx) => (
                                <div key={idx} className="aspect-square relative rounded-xl overflow-hidden border-2 bg-muted shadow-sm hover:scale-105 transition-transform">
                                    <Image src={img.previewUrl} alt="Preview" fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-between pt-6">
                <Button type="button" variant="ghost" onClick={onBack} disabled={data.isSubmitting} className="rounded-xl">
                    Précédent
                </Button>
                <Button onClick={onSubmit} size="lg" disabled={data.isSubmitting} className="rounded-xl px-12 h-14 font-black font-outfit text-lg shadow-xl shadow-primary/20">
                    {data.isSubmitting ? (
                        <>
                            <Loader2 className="mr-3 h-5 w-5 animate-spin" {...({} as any)} />
                            Publication...
                        </>
                    ) : (
                        'Publier l\'annonce'
                    )}
                </Button>
            </div>
        </div>
    );
}
