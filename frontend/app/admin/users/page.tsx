'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    User,
    Shield,
    Trash2,
    Edit,
    BadgeCheck,
    Mail,
    Phone,
    Calendar,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Loader2,
    Wallet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { getAdminUsers, updateAdminUser, deleteAdminUser } from '@/utils/supabase-helpers';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // Edit form state
    const [editForm, setEditForm] = useState({
        role: '',
        is_active: true,
        credits: 0
    });

    const fetchUsers = async () => {
        setLoading(true);
        const data = await getAdminUsers();
        setUsers(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const openEditDialog = (user: any) => {
        setSelectedUser(user);
        setEditForm({
            role: user.role,
            is_active: user.is_active,
            credits: user.profile?.credits || 0
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        try {
            const payload = {
                role: editForm.role,
                is_active: editForm.is_active,
                profile: {
                    credits: editForm.credits
                }
            };
            await updateAdminUser(selectedUser.id, payload);
            toast.success("Utilisateur mis à jour.");
            setIsEditDialogOpen(false);
            fetchUsers();
        } catch (error) {
            toast.error("Erreur lors de la mise à jour.");
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Voulez-vous vraiment supprimer l'utilisateur ${name} ?`)) return;
        try {
            await deleteAdminUser(id);
            toast.success("Utilisateur supprimé.");
            fetchUsers();
        } catch (error) {
            toast.error("Erreur lors de la suppression.");
        }
    };

    const filteredUsers = users.filter(u =>
        (u.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (u.profile?.full_name?.toLowerCase() || '').includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black font-outfit tracking-tight text-slate-900 dark:text-white">Exploration des Comptes</h1>
                    <p className="text-slate-500 font-medium mt-1">Gérez les permissions, les crédits et les accès de vos membres.</p>
                </div>

                <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-gray-100 dark:border-white/5">
                    <Button variant="ghost" className="rounded-xl h-10 px-6 font-black bg-white shadow-sm dark:bg-slate-800">Tous ({users.length})</Button>
                    <Button variant="ghost" className="rounded-xl h-10 px-6 font-black text-slate-400">Administrateurs</Button>
                </div>
            </div>

            {/* Users Table Card */}
            <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden">
                <div className="p-10 pb-4 border-b border-gray-100 dark:border-white/5">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                            placeholder="Chercher un utilisateur (Nom, Email)..."
                            className="h-12 pl-12 rounded-xl bg-slate-50 dark:bg-white/5 border-none font-bold"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="px-10 py-6">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center gap-4">
                            <Loader2 className="h-10 w-10 text-primary animate-spin" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Chargement des données...</p>
                        </div>
                    ) : filteredUsers.length > 0 ? (
                        <Table>
                            <TableHeader className="bg-slate-50/50 dark:bg-white/5">
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-slate-400 px-8">Identité</TableHead>
                                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-slate-400 px-8">Contact</TableHead>
                                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-slate-400 px-8">Rôle</TableHead>
                                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-slate-400 px-8">Portefeuille</TableHead>
                                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-slate-400 px-8">Inscrit le</TableHead>
                                    <TableHead className="h-16 text-right px-8"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((u) => (
                                    <TableRow key={u.id} className="border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                        <TableCell className="px-8 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                                    {u.profile?.avatar ? (
                                                        <img src={u.profile.avatar} className="size-full object-cover rounded-2xl" alt="" />
                                                    ) : (
                                                        <User className="size-6 text-primary" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-extrabold text-slate-900 dark:text-white">{u.profile?.full_name || 'Utilisateur'}</p>
                                                    <Badge variant="outline" className={cn(
                                                        "rounded-lg font-black text-[9px] h-5 border-none px-2",
                                                        u.is_active ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                                    )}>
                                                        {u.is_active ? 'ACTIF' : 'SUSPENDU'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-8">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                                                    <Mail className="size-3" /> {u.email}
                                                </div>
                                                {u.profile?.phone && (
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                                        <Phone className="size-3" /> {u.profile.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-8">
                                            <Badge className={cn(
                                                "rounded-xl font-black text-[10px] px-3 py-1 border-none",
                                                u.role === 'ADMIN' ? "bg-purple-600 text-white" :
                                                    u.role === 'MODERATOR' ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-600"
                                            )}>
                                                {u.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-8 py-8">
                                            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                                                <Wallet className="size-4 text-orange-500" />
                                                {u.profile?.credits || 0} <span className="text-[10px] text-slate-400">CREDITS</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-8 text-xs font-bold text-slate-400">
                                            {new Date(u.date_joined).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="px-8 py-8 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-10 rounded-xl bg-blue-500/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-lg shadow-blue-500/10"
                                                    onClick={() => openEditDialog(u)}
                                                >
                                                    <Edit className="size-5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-10 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-lg shadow-red-500/10"
                                                    onClick={() => handleDelete(u.id, u.profile?.full_name || u.email)}
                                                >
                                                    <Trash2 className="size-5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="py-24 text-center">
                            <h3 className="text-xl font-black">Aucun utilisateur trouvé</h3>
                            <p className="text-slate-400 font-medium">Réessayez avec un autre terme de recherche.</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Edit User Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md rounded-[2.5rem] p-10 bg-white dark:bg-slate-900 border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black font-outfit text-slate-900 dark:text-white">Modifier l'utilisateur</DialogTitle>
                        <DialogDescription className="font-bold text-slate-400">{selectedUser?.email}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-8 py-6">
                        <div className="space-y-4">
                            <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 px-2">Rôle Système</Label>
                            <Select value={editForm.role} onValueChange={(val) => setEditForm({ ...editForm, role: val })}>
                                <SelectTrigger className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl p-2 bg-white dark:bg-slate-800 border-gray-100 dark:border-white/5">
                                    <SelectItem value="USER" className="rounded-xl font-bold">Utilisateur Standard</SelectItem>
                                    <SelectItem value="MODERATOR" className="rounded-xl font-bold">Modérateur</SelectItem>
                                    <SelectItem value="ADMIN" className="rounded-xl font-bold">Administrateur</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 px-2">Solde Crédits</Label>
                            <div className="relative">
                                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-orange-500" />
                                <Input
                                    type="number"
                                    className="h-14 pl-12 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-black text-xl"
                                    value={editForm.credits}
                                    onChange={(e) => setEditForm({ ...editForm, credits: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                            <div>
                                <p className="font-black text-slate-900 dark:text-white">Compte Actif</p>
                                <p className="text-xs font-bold text-slate-400">Désactiver pour suspendre l'accès</p>
                            </div>
                            <Button
                                variant={editForm.is_active ? 'default' : 'outline'}
                                className={cn("rounded-2xl font-black", editForm.is_active ? "bg-green-500 hover:bg-green-600" : "text-red-500 border-red-500/20")}
                                onClick={() => setEditForm({ ...editForm, is_active: !editForm.is_active })}
                            >
                                {editForm.is_active ? 'OUI' : 'NON'}
                            </Button>
                        </div>
                    </div>

                    <DialogFooter className="gap-4">
                        <Button variant="outline" className="flex-1 h-14 rounded-2xl font-black border-slate-100 dark:border-white/5" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
                        <Button className="flex-1 h-14 rounded-2xl font-black bg-primary text-white" onClick={handleUpdate}>Sauvegarder</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
