import Link from 'next/link';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { getCategories } from '@/utils/supabase-helpers';

export default async function CategoriesPage() {
    // Mock Data Fetching using mocked helper
    const categories = await getCategories();

    // Mock count
    const categoriesWithCounts = categories.map(c => ({
        ...c,
        count: Math.floor(Math.random() * 50) + 1
    }));

    const totalAnnonces = categoriesWithCounts.reduce((sum, cat) => sum + cat.count, 0);

    return (
        <div className="min-h-screen bg-background pb-24 md:pb-12">
            <MobileHeader />

            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/" className="p-2 hover:bg-muted rounded-full transition-colors md:hidden">
                        <ArrowLeft className="size-6" {...({} as any)} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold font-outfit">Toutes les catégories</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {categoriesWithCounts.length} catégories · {totalAnnonces} annonces actives
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoriesWithCounts.map((category) => {
                        const IconComponent = (Icons as any)[category.icon || 'Package'] || Icons.Package;

                        return (
                            <Link
                                key={category.id}
                                href={`/annonces?category=${category.slug}`}
                                className="flex items-center justify-between p-6 bg-card rounded-2xl border shadow-sm hover:shadow-md transition-all group hover:border-primary/50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <IconComponent className="h-7 w-7 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{category.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {category.count} annonce{category.count > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors" {...({} as any)} />
                            </Link>
                        );
                    })}
                </div>

                {categoriesWithCounts.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <Icons.Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>Aucune catégorie disponible pour le moment</p>
                    </div>
                )}
            </div>
        </div>
    );
}
