'use client';

import React from 'react';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { Loader2, Shield, Lock, Mail, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { changePassword } from '@/utils/supabase-helpers';

export default function AdminProfilePage() {
    const { user, profile, isLoading } = useAuthContext();

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Chargement de votre profil admin...</p>
            </div>
        );
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const oldPassword = formData.get('old_password') as string;
        const newPassword = formData.get('new_password') as string;
        const confirmPassword = formData.get('confirm_password') as string;

        if (newPassword !== confirmPassword) {
            toast.error("Les nouveaux mots de passe ne correspondent pas.");
            return;
        }

        try {
            await changePassword(oldPassword, newPassword);
            toast.success("Votre mot de passe admin a été mis à jour.");
            (e.target as HTMLFormElement).reset();
        } catch (error: any) {
            toast.error(error.message || "Erreur lors du changement.");
        }
    };

    return (
        <div className="space-y-10 max-w-4xl">
            <div>
                <h1 className="text-4xl font-black font-outfit tracking-tight text-slate-900 dark:text-white">Sécurité Administrateur</h1>
                <p className="text-slate-500 font-medium mt-1">Gérez vos accès privilégiés et la sécurité de votre compte admin.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Identité Section */}
                <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-10 pb-4">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <User className="size-5" />
                            </div>
                            <CardTitle className="text-2xl font-black font-outfit">Identification</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10 pt-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-2">Email Administrateur</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-300" />
                                    <Input
                                        value={user?.email || ''}
                                        disabled
                                        className="h-14 pl-12 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold text-lg opacity-70"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-2">Rôle Système</Label>
                                <div className="relative">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-primary" />
                                    <Input
                                        value={user?.role || 'ADMIN'}
                                        disabled
                                        className="h-14 pl-12 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-black text-primary text-lg opacity-70"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Password Section */}
                <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-10 pb-4">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="size-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                                <Lock className="size-5" />
                            </div>
                            <CardTitle className="text-2xl font-black font-outfit">Changer le mot de passe</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10 pt-6">
                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Ancien mot de passe</Label>
                                    <Input
                                        name="old_password"
                                        type="password"
                                        required
                                        className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nouveau mot de passe</Label>
                                        <Input
                                            name="new_password"
                                            type="password"
                                            required
                                            className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Confirmer le mot de passe</Label>
                                        <Input
                                            name="confirm_password"
                                            type="password"
                                            required
                                            className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="h-16 px-12 rounded-[2rem] font-black bg-slate-900 dark:bg-primary text-white shadow-xl hover:scale-[1.02] transition-all"
                            >
                                METTRE À JOUR LA SÉCURITÉ
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
