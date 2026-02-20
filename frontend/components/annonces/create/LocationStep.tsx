'use client';

import * as ReactModule from 'react';
const React = ReactModule as any;
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CreateListingState } from './types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CAMEROON_REGIONS, MAJOR_CITIES, CameroonRegion } from '@/types';

const locationSchema = z.object({
    region: z.string().min(1, "La région est requise"),
    city: z.string().min(1, "La ville est requise"),
    quartier: z.string().optional(),
    address: z.string().optional(),
});

type LocationFormValues = z.infer<typeof locationSchema>;

interface LocationStepProps {
    defaultValues: Partial<CreateListingState>;
    onNext: (values: Partial<CreateListingState>) => void;
    onBack: () => void;
}

export function LocationStep({ defaultValues, onNext, onBack }: LocationStepProps) {
    const form = useForm<LocationFormValues>({
        resolver: zodResolver(locationSchema),
        defaultValues: {
            region: defaultValues.region || '',
            city: defaultValues.city || '',
            quartier: defaultValues.quartier || '',
            address: defaultValues.address || '',
        },
    });

    const selectedRegion = form.watch('region') as CameroonRegion | '';

    const cities = selectedRegion && selectedRegion in MAJOR_CITIES
        ? MAJOR_CITIES[selectedRegion as CameroonRegion]
        : [];

    const onSubmit = (data: LocationFormValues) => {
        onNext(data);
    };

    return (
        <Form {...(form as any)}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Region */}
                    <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Région</FormLabel>
                                <Select
                                    onValueChange={(val) => {
                                        field.onChange(val);
                                        form.setValue('city', '');
                                    }}
                                    defaultValue={field.value}
                                    {...({} as any)}
                                >
                                    <FormControl>
                                        <SelectTrigger className="rounded-xl h-12">
                                            <SelectValue placeholder="Sélectionner une région" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {CAMEROON_REGIONS.map((region) => (
                                            <SelectItem key={region} value={region}>
                                                {region}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* City */}
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ville</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={!selectedRegion}
                                    {...({} as any)}
                                >
                                    <FormControl>
                                        <SelectTrigger className="rounded-xl h-12">
                                            <SelectValue placeholder="Sélectionner une ville" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {(cities || []).map((city) => (
                                            <SelectItem key={city} value={city}>
                                                {city}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Quartier */}
                <FormField
                    control={form.control}
                    name="quartier"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quartier (Optionnel)</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Bastos" {...field} className="rounded-xl h-12" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Address */}
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Adresse / Repère (Optionnel)</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Derrière la poste centrale" {...field} className="rounded-xl h-12" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-between pt-8">
                    <Button type="button" variant="ghost" onClick={onBack} className="rounded-xl">
                        Précédent
                    </Button>
                    <Button type="submit" className="rounded-xl px-10">
                        Suivant
                    </Button>
                </div>
            </form>
        </Form>
    );
}
