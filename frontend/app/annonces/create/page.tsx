import { redirect } from 'next/navigation';
import { CreateListingWizard } from '@/components/annonces/create/CreateListingWizard';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Déposer une annonce | Chez-BEN2',
    description: 'Vendez vos articles rapidement sur Chez-BEN2',
};

export const dynamic = 'force-dynamic';

import { getCategories } from '@/utils/supabase-helpers';

export default async function CreateListingPage() {
    const categories = await getCategories();

    return (
        <div className="container py-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Déposer une annonce</h1>
            <CreateListingWizard initialCategories={categories} />
        </div>
    );
}
