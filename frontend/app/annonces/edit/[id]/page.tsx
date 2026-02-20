'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAnnonceById, getCategories } from '@/utils/supabase-helpers';
import { CreateListingWizard } from '@/components/annonces/create/CreateListingWizard';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface EditListingPageProps {
    params: {
        id: string;
    };
}

export default function EditListingPage({ params }: EditListingPageProps) {
    const router = useRouter();
    const [listing, setListing] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [item, cats] = await Promise.all([
                    getAnnonceById(params.id),
                    getCategories()
                ]);

                if (!item) {
                    toast.error("Annonce introuvable");
                    router.push('/dashboard/annonces');
                    return;
                }

                setListing(item);
                setCategories(cats);
            } catch (error) {
                console.error("Error loading edit data:", error);
                toast.error("Erreur lors du chargement de l'annonce");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="container py-24 flex flex-col items-center justify-center gap-4">
                <Loader2 className="size-12 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium">Chargement des données de l'annonce...</p>
            </div>
        );
    }

    // Map listing data to Wizard state format
    const currentCategory = categories.find(c => c.id === listing.category_id);
    const categoryPath = currentCategory ? [currentCategory] : [];

    const initialState = {
        step: 'DETAILS' as any, // Start directly at details since category is already set
        categoryId: listing.category_id,
        categoryPath: categoryPath,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        priceNegotiable: listing.is_negotiable,
        etat: listing.condition,
        city: listing.city,
        region: listing.region,
        attributes: listing.extra_attributes || {},
        images: listing.photos?.map((p: any, i: number) => ({
            id: `old-${i}`,
            previewUrl: p.url,
            uploadUrl: p.url,
            isCover: p.is_cover,
            uploading: false
        })) || [],
        isEditing: true,
        id: listing.id
    };

    return (
        <div className="container py-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-black mb-8">Modifier votre annonce</h1>
            <CreateListingWizard
                initialCategories={categories}
                initialData={initialState}
            />
        </div>
    );
}
