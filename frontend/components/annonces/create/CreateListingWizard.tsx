'use client';

import * as ReactModule from 'react';
const React = ReactModule as any;
import { Category } from '@/types';
import { CreateListingState, INITIAL_STATE, CreateListingStep } from './types';
import { CategoryStep } from './CategoryStep';
import { DetailsStep } from './DetailsStep';
import { PhotosStep } from './PhotosStep';
import { LocationStep } from './LocationStep';
import { ReviewStep } from './ReviewStep';
import { Progress } from '@/components/ui/progress';
import { createListing } from '@/app/annonces/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface CreateListingWizardProps {
    initialCategories: Category[];
    initialData?: Partial<CreateListingState>;
}

const STEPS_ORDER: CreateListingStep[] = ['CATEGORY', 'DETAILS', 'PHOTOS', 'LOCATION', 'REVIEW'];
const STEP_TITLES: Record<CreateListingStep, string> = {
    CATEGORY: 'Catégorie',
    DETAILS: 'Détails',
    PHOTOS: 'Photos',
    LOCATION: 'Localisation',
    REVIEW: 'Récapitulatif'
};

export function CreateListingWizard({ initialCategories, initialData }: CreateListingWizardProps) {
    const router = useRouter();
    const [state, setState] = React.useState({
        ...INITIAL_STATE,
        ...initialData,
        // Ensure price is string for the form
        price: initialData?.price?.toString() || INITIAL_STATE.price
    } as CreateListingState);

    const currentStepIndex = STEPS_ORDER.indexOf(state.step);
    const progress = ((currentStepIndex + 1) / STEPS_ORDER.length) * 100;

    const navigateStep = (direction: 'next' | 'back') => {
        if (direction === 'next') {
            const nextIndex = currentStepIndex + 1;
            if (nextIndex < STEPS_ORDER.length) {
                setState((prev: any) => ({ ...prev, step: STEPS_ORDER[nextIndex] }));
                window.scrollTo(0, 0);
            }
        } else {
            const prevIndex = currentStepIndex - 1;
            if (prevIndex >= 0) {
                setState((prev: any) => ({ ...prev, step: STEPS_ORDER[prevIndex] }));
                window.scrollTo(0, 0);
            }
        }
    };

    const handleCategorySelect = (category: Category, path: Category[]) => {
        setState((prev: any) => ({
            ...prev,
            categoryId: category.id,
            categoryPath: path,
            step: 'DETAILS'
        }));
    };

    const handleDetailsSubmit = (values: Partial<CreateListingState>) => {
        setState((prev: any) => ({ ...prev, ...values, step: 'PHOTOS' }));
    };

    const handlePhotosSubmit = (values: { images: CreateListingState['images'] }) => {
        setState((prev: any) => ({ ...prev, images: values.images, step: 'LOCATION' }));
    };

    const handleLocationSubmit = (values: Partial<CreateListingState>) => {
        setState((prev: any) => ({ ...prev, ...values, step: 'REVIEW' }));
    };

    const handleFinalSubmit = async () => {
        setState((prev: any) => ({ ...prev, isSubmitting: true, error: null }));

        const files = (state.images as any[])
            .filter((img: any) => img.file)
            .map((img: any) => img.file as File);

        try {
            const { createAnnonce, updateAnnonce } = await import('@/utils/supabase-helpers');

            let result;
            if (state.isEditing && state.id) {
                result = await updateAnnonce(state.id, state, files);
                toast.success("Votre annonce a été mise à jour !");
            } else {
                result = await createAnnonce(state, files);
                toast.success("Votre annonce a été publiée avec succès !");
            }

            // Redirect to the new/updated listing's slug or ID
            router.push(`/annonces/${result.slug || result.id}`);
            router.refresh();

        } catch (err: any) {
            console.error("Submission error", err);
            setState((prev: any) => ({
                ...prev,
                isSubmitting: false,
                error: err.message || "Impossible de traiter l'annonce."
            }));
            toast.error("Erreur : " + (err.message || "Erreur serveur"));
        }
    };

    return (
        <div className="space-y-8">
            {/* Progress Bar */}
            <div className="space-y-3 bg-muted/10 p-6 rounded-[2rem] border-2 border-primary/5">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Étape {currentStepIndex + 1} / {STEPS_ORDER.length}</p>
                        <h2 className="text-xl font-black font-outfit">{STEP_TITLES[state.step as CreateListingStep]}</h2>
                    </div>
                </div>
                <Progress value={progress} className="h-3 rounded-full bg-primary/10" {...({} as any)} />
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
                {state.step === 'CATEGORY' && (
                    <CategoryStep
                        initialCategories={initialCategories}
                        onSelect={handleCategorySelect}
                        currentSelection={state.categoryId}
                    />
                )}

                {state.step === 'DETAILS' && (
                    <DetailsStep
                        defaultValues={state}
                        onNext={handleDetailsSubmit}
                        onBack={() => navigateStep('back')}
                    />
                )}

                {state.step === 'PHOTOS' && (
                    <PhotosStep
                        defaultValues={state}
                        onNext={handlePhotosSubmit}
                        onBack={() => navigateStep('back')}
                    />
                )}

                {state.step === 'LOCATION' && (
                    <LocationStep
                        defaultValues={state}
                        onNext={handleLocationSubmit}
                        onBack={() => navigateStep('back')}
                    />
                )}

                {state.step === 'REVIEW' && (
                    <ReviewStep
                        data={state}
                        onSubmit={handleFinalSubmit}
                        onBack={() => navigateStep('back')}
                        onEditStep={(step: any) => setState((prev: any) => ({ ...prev, step }))}
                    />
                )}
            </div>
        </div>
    );
}
