'use client';

import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Layers,
    FolderTree,
    MoreVertical,
    Edit,
    Trash2,
    ChevronRight,
    ChevronDown,
    GripVertical,
    Save,
    X,
    Eye,
    Image as ImageIcon,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { getAdminCategories, createCategory, updateCategory, deleteCategory } from '@/utils/supabase-helpers';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdminCategoriesPage() {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        parent: 'none',
        icon: ''
    });

    const fetchCategories = async () => {
        setLoading(true);
        const data = await getAdminCategories();
        setCategories(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async () => {
        try {
            const payload = {
                name: formData.name,
                slug: formData.slug || formData.name.toLowerCase().replace(/ /g, '-'),
                parent: formData.parent === 'none' ? null : parseInt(formData.parent),
                icon: formData.icon
            };
            await createCategory(payload);
            toast.success("Catégorie créée avec succès !");
            setIsAddOpen(false);
            setFormData({ name: '', slug: '', parent: 'none', icon: '' });
            fetchCategories();
        } catch (error) {
            toast.error("Erreur lors de la création.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Voulez-vous vraiment supprimer cette catégorie ?")) return;
        try {
            await deleteCategory(id.toString());
            toast.success("Catégorie supprimée.");
            fetchCategories();
        } catch (error) {
            toast.error("Erreur lors de la suppression.");
        }
    };

    // Build tree structure
    const mainCategories = categories.filter(c => !c.parent).map(parent => ({
        ...parent,
        children: categories.filter(c => c.parent === parent.id)
    }));

    const filteredTree = mainCategories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.children.some((child: any) => child.name.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-10">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black font-outfit tracking-tight text-slate-900 dark:text-white">Gestion des Catégories</h1>
                    <p className="text-slate-500 font-medium mt-1">Structurez et organisez le catalogue de Chez-BEN2.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-slate-100 dark:bg-white/5 p-1 rounded-2xl flex border border-gray-100 dark:border-white/5">
                        <Button
                            variant={viewMode === 'tree' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('tree')}
                            className="rounded-xl font-bold px-4 transition-all"
                        >
                            <FolderTree className="size-4 mr-2" /> Arbre
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className="rounded-xl font-bold px-4 transition-all"
                        >
                            <Layers className="size-4 mr-2" /> Liste
                        </Button>
                    </div>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-12 px-8 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20 bg-primary hover:scale-[1.02] transition-transform text-white border-none">
                                <Plus className="size-5" /> Nouvelle Catégorie
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl rounded-[2.5rem] p-10 bg-white dark:bg-slate-900 border-none shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-3xl font-black font-outfit text-slate-900 dark:text-white">Ajouter une catégorie</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-8 py-4">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label className="font-bold text-slate-700 dark:text-slate-300">Nom de la catégorie</Label>
                                        <Input
                                            placeholder="Ex: Maison & Jardin"
                                            className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold focus:ring-2 ring-primary/20"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="font-bold text-slate-700 dark:text-slate-300">Lien (Slug)</Label>
                                        <Input
                                            placeholder="maison-jardin"
                                            className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold focus:ring-2 ring-primary/20"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label className="font-bold text-slate-700 dark:text-slate-300">Parent (Optionnel)</Label>
                                        <Select value={formData.parent} onValueChange={(val) => setFormData({ ...formData, parent: val })}>
                                            <SelectTrigger className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold">
                                                <SelectValue placeholder="Aucun (Niveau Racine)" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl p-2 bg-white dark:bg-slate-800 border-gray-100 dark:border-white/5">
                                                <SelectItem value="none" className="rounded-xl font-bold">Aucun (Niveau Racine)</SelectItem>
                                                {categories.filter(c => !c.parent).map(cat => (
                                                    <SelectItem key={cat.id} value={cat.id.toString()} className="rounded-xl font-bold">{cat.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="font-bold text-slate-700 dark:text-slate-300">Icône Lucide</Label>
                                        <Input
                                            placeholder="home, car, monitor..."
                                            className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold"
                                            value={formData.icon}
                                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button variant="outline" className="flex-1 h-14 rounded-2xl font-black border-slate-100 dark:border-white/5" onClick={() => setIsAddOpen(false)}>Annuler</Button>
                                    <Button className="flex-1 h-14 rounded-2xl font-black bg-primary text-white" onClick={handleSubmit}>Créer la catégorie</Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Search & Stats Card */}
                <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[3rem] p-8 h-fit lg:col-span-1">
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                            placeholder="Chercher..."
                            className="pl-10 h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-none font-bold"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="space-y-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Statistiques réelles</p>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Total Racine</span>
                                <span className="text-xl font-black text-blue-600">{mainCategories.length}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-green-500/5 rounded-2xl border border-green-500/10">
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Sous-Catégories</span>
                                <span className="text-xl font-black text-green-600">{categories.length - mainCategories.length}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Categories Tree Area */}
                <div className="lg:col-span-3 space-y-6">
                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl">
                            <Loader2 className="h-10 w-10 text-primary animate-spin" />
                            <p className="font-bold text-slate-400 text-sm uppercase tracking-widest">Calcul de la structure...</p>
                        </div>
                    ) : filteredTree.length > 0 ? (
                        filteredTree.map((cat, i) => (
                            <CategoryItem key={cat.id} category={cat} index={i} onDelete={fetchCategories} />
                        ))
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl text-center p-10">
                            <AlertCircle className="size-12 text-slate-200" />
                            <h3 className="text-xl font-black font-outfit">Aucune catégorie trouvée</h3>
                            <p className="text-slate-400 max-w-xs mx-auto">Commencez par créer une catégorie racine pour organiser le site.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function CategoryItem({ category, index, onDelete }: { category: any, index: number, onDelete: () => void }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleDelete = async (id: number) => {
        if (!confirm("Supprimer cette catégorie ?")) return;
        try {
            await deleteCategory(id.toString());
            toast.success("Supprimé.");
            onDelete();
        } catch (error) {
            toast.error("Erreur.");
        }
    };

    return (
        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden group">
            <div className="p-6 md:p-8 flex items-center gap-6">
                <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-primary transition-colors">
                    <GripVertical className="size-6" />
                </div>

                <div
                    className={cn(
                        "size-14 rounded-2xl flex items-center justify-center shrink-0 cursor-pointer transition-all",
                        isExpanded ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-slate-50 dark:bg-white/5 text-slate-400"
                    )}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {category.children && category.children.length > 0 ? (
                        isExpanded ? <ChevronDown className="size-6" /> : <ChevronRight className="size-6" />
                    ) : (
                        <div className="size-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                        <h3 className="font-black text-xl text-slate-900 dark:text-white font-outfit truncate">{category.name}</h3>
                        <Badge variant="outline" className="rounded-lg font-bold border-primary/20 text-primary bg-primary/5 uppercase text-[10px]">
                            {category.slug}
                        </Badge>
                    </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 hover:text-primary transition-all">
                        <Edit className="size-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-red-50 text-red-500 transition-all" onClick={() => handleDelete(category.id)}>
                        <Trash2 className="size-5" />
                    </Button>
                </div>
            </div>

            {isExpanded && category.children && (
                <div className="px-10 pb-8 space-y-3">
                    <div className="border-l-2 border-slate-100 dark:border-white/5 pl-10 space-y-3">
                        {category.children.map((sub: any) => (
                            <div key={sub.id} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-white/5 rounded-2xl group/sub hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="size-2 rounded-full bg-primary/40" />
                                    <div>
                                        <p className="font-black text-slate-800 dark:text-slate-200 leading-none">{sub.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{sub.slug}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="size-8 rounded-lg hover:bg-white dark:hover:bg-slate-800 hover:text-primary">
                                        <Edit className="size-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="size-8 rounded-lg hover:bg-red-50 hover:text-red-500" onClick={() => handleDelete(sub.id)}>
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}
