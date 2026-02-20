'use client';

import * as ReactModule from 'react';
const React = ReactModule as any;
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CreateListingState } from './types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getCategoryFields, hasDynamicFields, type CategoryField } from '@/lib/category-fields-config';

// Schéma de base pour tous les formulaires
const baseSchema = z.object({
    title: z.string().min(5, "Le titre doit contenir au moins 5 caractères").max(100),
    description: z.string().min(20, "La description doit être détaillée (min 20 caractères)"),
    price: z.string().regex(/^\d+$/, "Le prix doit être un nombre valide"),
    priceNegotiable: z.boolean().default(false),
    etat: z.enum(['NEUF', 'OCCASION', 'RECONDITIONNE']),
    attributes: z.record(z.any()).default({}),
});

type DetailsFormValues = z.infer<typeof baseSchema>;

interface DetailsStepProps {
    defaultValues: Partial<CreateListingState>;
    onNext: (values: Partial<CreateListingState>) => void;
    onBack: () => void;
}

export function DetailsStep({ defaultValues, onNext, onBack }: DetailsStepProps) {
    // Récupérer le slug de la catégorie parente pour les champs dynamiques
    const categoryPath = defaultValues.categoryPath || [];
    const parentCategory = categoryPath[0];
    const categorySlug = parentCategory?.slug || '';

    // Récupérer les champs dynamiques pour cette catégorie
    const dynamicFields = getCategoryFields(categorySlug);
    const hasDynamic = hasDynamicFields(categorySlug);

    const form = useForm<DetailsFormValues>({
        resolver: zodResolver(baseSchema),
        defaultValues: {
            title: defaultValues.title || '',
            description: defaultValues.description || '',
            price: defaultValues.price || '',
            priceNegotiable: defaultValues.priceNegotiable || false,
            etat: defaultValues.etat || 'OCCASION',
            attributes: defaultValues.attributes || {},
        },
    });

    const onSubmit = (data: DetailsFormValues) => {
        onNext(data);
    };

    // Fonction pour rendre un champ dynamique
    const renderDynamicField = (field: CategoryField, index: number) => {
        const fieldName = `attributes.${field.name}` as any;

        switch (field.type) {
            case 'text':
                return (
                    <FormField
                        key={index}
                        control={form.control}
                        name={fieldName}
                        render={({ field: formField }) => (
                            <FormItem>
                                <FormLabel>
                                    {field.label}
                                    {field.required && <span className="text-destructive ml-1">*</span>}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={field.placeholder}
                                        {...formField}
                                        className="rounded-xl h-11 bg-background"
                                    />
                                </FormControl>
                                {field.description && <FormDescription>{field.description}</FormDescription>}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                );

            case 'number':
                return (
                    <FormField
                        key={index}
                        control={form.control}
                        name={fieldName}
                        render={({ field: formField }) => (
                            <FormItem>
                                <FormLabel>
                                    {field.label}
                                    {field.required && <span className="text-destructive ml-1">*</span>}
                                    {field.unit && <span className="text-muted-foreground ml-1">({field.unit})</span>}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder={field.placeholder}
                                        min={field.min}
                                        max={field.max}
                                        {...formField}
                                        className="rounded-xl h-11 bg-background"
                                    />
                                </FormControl>
                                {field.description && <FormDescription>{field.description}</FormDescription>}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                );

            case 'select':
                return (
                    <FormField
                        key={index}
                        control={form.control}
                        name={fieldName}
                        render={({ field: formField }) => (
                            <FormItem>
                                <FormLabel>
                                    {field.label}
                                    {field.required && <span className="text-destructive ml-1">*</span>}
                                </FormLabel>
                                <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                                    <FormControl>
                                        <SelectTrigger className="rounded-xl h-11 bg-background">
                                            <SelectValue placeholder={field.placeholder || "Sélectionner"} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="rounded-xl">
                                        {field.options?.map((option, idx) => {
                                            const value = typeof option === 'string' ? option : option.value;
                                            const label = typeof option === 'string' ? option : option.label;
                                            return (
                                                <SelectItem key={idx} value={value}>
                                                    {label}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                {field.description && <FormDescription>{field.description}</FormDescription>}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                );

            case 'boolean':
                return (
                    <FormField
                        key={index}
                        control={form.control}
                        name={fieldName}
                        render={({ field: formField }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-xl border p-4 bg-muted/5">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base font-medium">
                                        {field.label}
                                    </FormLabel>
                                    {field.description && <FormDescription>{field.description}</FormDescription>}
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={formField.value}
                                        onCheckedChange={formField.onChange}
                                        {...({} as any)}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                );

            case 'textarea':
                return (
                    <FormField
                        key={index}
                        control={form.control}
                        name={fieldName}
                        render={({ field: formField }) => (
                            <FormItem className="col-span-full">
                                <FormLabel>
                                    {field.label}
                                    {field.required && <span className="text-destructive ml-1">*</span>}
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder={field.placeholder}
                                        className="min-h-[100px] rounded-[1.5rem]"
                                        {...formField}
                                    />
                                </FormControl>
                                {field.description && <FormDescription>{field.description}</FormDescription>}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <Form {...(form as any)}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto pb-10">
                {/* Titre */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Titre de l'annonce</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Toyota Camry 2018 - Très bon état" {...field} className="rounded-xl h-12" />
                            </FormControl>
                            <FormDescription>Soyez précis et concis.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* CHAMPS DYNAMIQUES PAR CATÉGORIE */}
                {hasDynamic && dynamicFields.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                        <h3 className="col-span-full font-outfit font-bold text-primary flex items-center gap-2">
                            <span className="size-2 bg-primary rounded-full" />
                            Informations spécifiques
                        </h3>
                        {dynamicFields.map((field, index) => renderDynamicField(field, index))}
                    </div>
                )}

                {/* État du produit */}
                <FormField
                    control={form.control}
                    name="etat"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>État du produit</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3"
                                    {...({} as any)}
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-[1.25rem] hover:bg-primary/5 hover:border-primary/30 cursor-pointer transition-all flex-1">
                                        <FormControl>
                                            <RadioGroupItem value="NEUF" {...({} as any)} />
                                        </FormControl>
                                        <FormLabel className="font-medium cursor-pointer flex-1">Neuf</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-[1.25rem] hover:bg-primary/5 hover:border-primary/30 cursor-pointer transition-all flex-1">
                                        <FormControl>
                                            <RadioGroupItem value="OCCASION" {...({} as any)} />
                                        </FormControl>
                                        <FormLabel className="font-medium cursor-pointer flex-1">Occasion</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-[1.25rem] hover:bg-primary/5 hover:border-primary/30 cursor-pointer transition-all flex-1">
                                        <FormControl>
                                            <RadioGroupItem value="RECONDITIONNE" {...({} as any)} />
                                        </FormControl>
                                        <FormLabel className="font-medium cursor-pointer flex-1">Reconditionné</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Prix et Négociable */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Prix (FCFA)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Ex: 50000" {...field} className="rounded-xl h-12" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="priceNegotiable"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-xl border p-4 bg-muted/5 h-12">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base font-bold text-sm">Négociable</FormLabel>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        {...({} as any)}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Description */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description détaillée</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Décrivez votre produit en détail : caractéristiques, défauts éventuels, raison de la vente..."
                                    className="min-h-[180px] rounded-[1.5rem]"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-right text-[10px] font-mono">
                                {field.value.length} / 5000
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Boutons de navigation */}
                <div className="flex justify-between pt-8">
                    <Button type="button" variant="ghost" onClick={onBack} className="rounded-xl h-11 px-8">
                        Précédent
                    </Button>
                    <Button type="submit" className="rounded-xl px-10 h-11 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                        Suivant
                    </Button>
                </div>
            </form>
        </Form>
    );
}
