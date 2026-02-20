'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Profile, ProfileFormData } from '@/types';
import { AvatarUpload } from './AvatarUpload';
import { CoverUpload } from './CoverUpload';
import { Store, User, MapPin, Shield, Bell, Save, Globe, Facebook, Instagram, Briefcase, MessageSquare } from 'lucide-react';
import { updateProfile, requestPasswordReset } from '@/utils/supabase-helpers';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';

interface ProfileSettingsFormProps {
    profile: Profile;
}

interface FullProfileFormData extends ProfileFormData {
    email?: string;
    avatar_url: string | null;
    cover_url: string | null;
    address?: string;
    notification_email: boolean;
    notification_push: boolean;
    notification_sms: boolean;
    latitude?: number | null;
    longitude?: number | null;
}

export function ProfileSettingsForm({ profile }: ProfileSettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FullProfileFormData>({
        full_name: profile.full_name || '',
        username: profile.username || '',
        avatar_url: profile.avatar_url || null,
        cover_url: profile.cover_url || null,
        phone: profile.phone || '',
        whatsapp: profile.whatsapp || '',
        facebook: profile.facebook || '',
        instagram: profile.instagram || '',
        website: profile.website || '',
        experience: profile.experience || 0,
        bio: profile.bio || '',
        city: profile.city || '',
        region: profile.region || '',
        address: profile.address || '',
        notification_email: profile.notification_email ?? true,
        notification_push: profile.notification_push ?? true,
        notification_sms: profile.notification_sms ?? false,
        latitude: profile.latitude ?? null,
        longitude: profile.longitude ?? null,
    });

    useEffect(() => {
        setFormData({
            full_name: profile.full_name || '',
            username: profile.username || '',
            avatar_url: profile.avatar_url || null,
            cover_url: profile.cover_url || null,
            phone: profile.phone || '',
            whatsapp: profile.whatsapp || '',
            facebook: profile.facebook || '',
            instagram: profile.instagram || '',
            website: profile.website || '',
            experience: profile.experience || 0,
            bio: profile.bio || '',
            city: profile.city || '',
            region: profile.region || '',
            address: profile.address || '',
            notification_email: profile.notification_email ?? true,
            notification_push: profile.notification_push ?? true,
            notification_sms: profile.notification_sms ?? false,
            latitude: profile.latitude ?? null,
            longitude: profile.longitude ?? null,
        });
    }, [profile]);

    const router = useRouter();
    const { refreshProfile } = useAuthContext();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (url: string | File) => {
        setFormData((prev: any) => ({ ...prev, avatar_url: url }));
    };

    const handleCoverChange = (url: string | File) => {
        setFormData((prev: any) => ({ ...prev, cover_url: url }));
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData((prev: any) => ({ ...prev, [name]: checked }));
    };

    const handlePasswordReset = async () => {
        try {
            await requestPasswordReset(profile.email);
            toast.success('Un code de réinitialisation a été envoyé à ' + profile.email);
        } catch (error: any) {
            toast.error('Erreur: ' + error.message);
        }
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        try {
            await updateProfile(formData);
            await refreshProfile();
            toast.success('Profil professionnel mis à jour avec succès !');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error("Erreur lors de la mise à jour du profil");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-12 pb-32 max-w-5xl mx-auto px-4 md:px-0">

            {/* Header Profil avec Cover et Avatar */}
            <div className="relative mb-20">
                <CoverUpload
                    currentCoverUrl={formData.cover_url}
                    onCoverChange={handleCoverChange}
                    className="shadow-2xl"
                />
                <div className="absolute -bottom-16 left-8 flex flex-col md:flex-row items-end gap-6">
                    <AvatarUpload
                        currentAvatarUrl={formData.avatar_url}
                        onAvatarChange={handleAvatarChange}
                        fullName={formData.full_name}
                        className="shrink-0 scale-110 md:scale-125 origin-bottom-left"
                    />
                    <div className="mb-2 space-y-1 pb-4">
                        <h1 className="text-3xl md:text-5xl font-black font-outfit text-slate-900 dark:text-white drop-shadow-sm flex items-center gap-3">
                            {formData.full_name || 'Votre Profil'}
                            {profile.is_verified && (
                                <div className="bg-primary p-1 rounded-full">
                                    <Shield className="size-4 md:size-5 text-white fill-current" />
                                </div>
                            )}
                        </h1>
                        <div className="flex flex-wrap gap-2 text-sm font-bold">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full backdrop-blur-md">
                                {profile.role === 'USER' ? 'Vendeur Certifié' : profile.role}
                            </span>
                            <span className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full flex items-center gap-1 backdrop-blur-md">
                                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                Boutique Ouverte
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-8 grid grid-cols-1 gap-8">
                {/* Section 1 : Identité Professionnelle */}
                <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="bg-gradient-to-br from-primary/5 via-transparent to-transparent p-8 md:p-10 border-b border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-5">
                            <div className="size-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/30 rotate-3">
                                <Store className="size-7" />
                            </div>
                            <div>
                                <CardTitle className="font-outfit font-black text-2xl md:text-3xl">Identité de Marque</CardTitle>
                                <CardDescription className="text-base">Comment vos clients vous perçoivent sur la plateforme.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 md:p-10 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label htmlFor="full_name" className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Nom Commercial / Complet</Label>
                                <Input
                                    id="full_name"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="ex: Chez Ben Electronics, Jean Dupont"
                                    className="rounded-2xl h-16 bg-gray-50 dark:bg-black/20 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-black/40 transition-all font-bold text-xl shadow-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="username" className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Nom d'utilisateur unique</Label>
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-black text-xl">@</span>
                                    <Input
                                        id="username"
                                        name="username"
                                        value={formData.username || ''}
                                        onChange={handleChange}
                                        placeholder="nom_unique"
                                        className="pl-12 rounded-2xl h-16 bg-gray-50 dark:bg-black/20 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-black/40 transition-all font-bold text-xl shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label htmlFor="experience" className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Années d'expérience</Label>
                                <div className="relative">
                                    <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground size-5" />
                                    <Input
                                        id="experience"
                                        name="experience"
                                        type="number"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        className="pl-14 rounded-2xl h-16 bg-gray-50 dark:bg-black/20 border-2 border-transparent focus:border-primary transition-all font-bold text-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="bio" className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">À propos de vous / Votre Boutique</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                value={formData.bio || ''}
                                onChange={handleChange}
                                placeholder="Décrivez votre expertise, vos horaires, vos valeurs professionnelles..."
                                className="min-h-[200px] rounded-[2rem] bg-gray-50 dark:bg-black/20 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-black/40 transition-all p-6 resize-none text-lg leading-relaxed shadow-sm"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Section 2 : Présence Digitale (PRO) */}
                <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="bg-gradient-to-br from-blue-500/5 via-transparent to-transparent p-8 md:p-10 border-b border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="size-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/30 -rotate-3">
                                <Globe className="size-7" />
                            </div>
                            <div>
                                <CardTitle className="font-outfit font-black text-2xl md:text-3xl">Réseaux & Contact PRO</CardTitle>
                                <CardDescription className="text-base">Facilitez la prise de contact pour vos clients.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 md:p-10 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label htmlFor="whatsapp" className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <MessageSquare className="size-4 text-emerald-500" /> WhatsApp Business
                                </Label>
                                <Input
                                    id="whatsapp"
                                    name="whatsapp"
                                    value={formData.whatsapp || ''}
                                    onChange={handleChange}
                                    placeholder="+237 ..."
                                    className="rounded-2xl h-16 bg-gray-50 dark:bg-black/20 border-2 border-transparent focus:border-emerald-500 transition-all font-bold text-lg"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="website" className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Globe className="size-4 text-primary" /> Site Web
                                </Label>
                                <Input
                                    id="website"
                                    name="website"
                                    value={formData.website || ''}
                                    onChange={handleChange}
                                    placeholder="https://votre-site.com"
                                    className="rounded-2xl h-16 bg-gray-50 dark:bg-black/20 border-2 border-transparent focus:border-primary transition-all font-medium text-lg"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label htmlFor="facebook" className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Facebook className="size-4 text-blue-600" /> Facebook
                                </Label>
                                <Input
                                    id="facebook"
                                    name="facebook"
                                    value={formData.facebook || ''}
                                    onChange={handleChange}
                                    placeholder="Lien vers votre page..."
                                    className="rounded-2xl h-16 bg-gray-50 dark:bg-black/20 border-2 border-transparent focus:border-blue-500 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="instagram" className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Instagram className="size-4 text-pink-600" /> Instagram
                                </Label>
                                <Input
                                    id="instagram"
                                    name="instagram"
                                    value={formData.instagram || ''}
                                    onChange={handleChange}
                                    placeholder="@votre_boutique"
                                    className="rounded-2xl h-16 bg-gray-50 dark:bg-black/20 border-2 border-transparent focus:border-pink-500 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 3 : Localisation */}
                <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="bg-gray-50/50 dark:bg-white/5 p-8 border-b border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="size-14 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
                                <MapPin className="size-7" />
                            </div>
                            <div>
                                <CardTitle className="font-outfit font-black text-2xl md:text-3xl">Localisation Physique</CardTitle>
                                <CardDescription className="text-base">Permettez à vos clients de vous rendre visite.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <Label htmlFor="city" className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Ville</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    value={formData.city || ''}
                                    onChange={handleChange}
                                    placeholder="ex: Douala"
                                    className="rounded-2xl h-16 bg-gray-50 dark:bg-black/20 border-2 border-transparent focus:border-primary transition-all font-bold text-lg"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="region" className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Région</Label>
                                <Input
                                    id="region"
                                    name="region"
                                    value={formData.region || ''}
                                    onChange={handleChange}
                                    placeholder="ex: Littoral"
                                    className="rounded-2xl h-16 bg-gray-50 dark:bg-black/20 border-2 border-transparent focus:border-primary transition-all font-bold text-lg"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <Label htmlFor="latitude" className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Latitude</Label>
                                <Input
                                    id="latitude"
                                    name="latitude"
                                    type="number"
                                    step="any"
                                    value={formData.latitude || ''}
                                    onChange={handleChange}
                                    placeholder="ex: 4.0511"
                                    className="rounded-2xl h-16 bg-gray-50 dark:bg-black/20 border-2 border-transparent focus:border-primary transition-all font-bold text-lg"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="longitude" className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Longitude</Label>
                                <Input
                                    id="longitude"
                                    name="longitude"
                                    type="number"
                                    step="any"
                                    value={formData.longitude || ''}
                                    onChange={handleChange}
                                    placeholder="ex: 9.7679"
                                    className="rounded-2xl h-16 bg-gray-50 dark:bg-black/20 border-2 border-transparent focus:border-primary transition-all font-bold text-lg"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="address" className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Adresse Détaillée / Quartier</Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address || ''}
                                onChange={handleChange}
                                placeholder="ex: Akwa, Rue de la Liberté, Face Pharmacie..."
                                className="rounded-2xl h-16 bg-gray-50 dark:bg-black/20 border-2 border-transparent focus:border-primary transition-all font-bold text-lg shadow-sm"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications & Sécurité Combo */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
                    <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-8 border-b border-gray-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                            <div className="flex items-center gap-4">
                                <Bell className="size-6 text-purple-500" />
                                <CardTitle className="font-outfit font-black text-xl">Préférences & Notifications</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-3">
                                <Label htmlFor="email" className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Adresse E-mail du compte</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email || profile.email}
                                    disabled
                                    className="rounded-2xl h-16 bg-gray-100 dark:bg-black/40 border-none font-bold text-lg cursor-not-allowed opacity-70"
                                />
                                <p className="text-[10px] text-muted-foreground font-medium ml-2 uppercase tracking-widest">L'email est utilisé pour vos identifiants.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                                <div className="flex flex-col gap-4 p-5 rounded-3xl bg-gray-50 dark:bg-white/5">
                                    <Label className="text-xs font-black uppercase">E-mails</Label>
                                    <div className="flex items-center justify-between">
                                        <Switch
                                            checked={formData.notification_email}
                                            onCheckedChange={(checked) => handleSwitchChange('notification_email', checked)}
                                            className="data-[state=checked]:bg-primary"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 p-5 rounded-3xl bg-gray-50 dark:bg-white/5">
                                    <Label className="text-xs font-black uppercase">Push</Label>
                                    <div className="flex items-center justify-between">
                                        <Switch
                                            checked={formData.notification_push}
                                            onCheckedChange={(checked) => handleSwitchChange('notification_push', checked)}
                                            className="data-[state=checked]:bg-primary"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 p-5 rounded-3xl bg-gray-50 dark:bg-white/5">
                                    <Label className="text-xs font-black uppercase">SMS</Label>
                                    <div className="flex items-center justify-between">
                                        <Switch
                                            checked={formData.notification_sms}
                                            onCheckedChange={(checked) => handleSwitchChange('notification_sms', checked)}
                                            className="data-[state=checked]:bg-primary"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border-2 border-slate-100 dark:border-white/5">
                        <CardHeader className="p-8 bg-slate-900 text-white">
                            <div className="flex items-center gap-4">
                                <Shield className="size-6 text-primary" />
                                <CardTitle className="font-outfit font-black text-xl text-white">Sécurité du Compte</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase text-slate-400">Changer de mot de passe</Label>
                                    <Input
                                        type="password"
                                        placeholder="Ancien mot de passe"
                                        id="old_password"
                                        className="rounded-2xl h-14 bg-slate-50 dark:bg-white/5 border-none font-bold"
                                    />
                                    <Input
                                        type="password"
                                        placeholder="Nouveau mot de passe"
                                        id="new_password"
                                        className="rounded-2xl h-14 bg-slate-50 dark:bg-white/5 border-none font-bold"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    onClick={async () => {
                                        const oldP = (document.getElementById('old_password') as HTMLInputElement)?.value;
                                        const newP = (document.getElementById('new_password') as HTMLInputElement)?.value;
                                        if (!oldP || !newP) {
                                            toast.error("Veuillez remplir les deux champs de mot de passe.");
                                            return;
                                        }
                                        try {
                                            await import('@/utils/supabase-helpers').then(m => m.changePassword(oldP, newP));
                                            toast.success("Mot de passe mis à jour avec succès !");
                                            (document.getElementById('old_password') as HTMLInputElement).value = '';
                                            (document.getElementById('new_password') as HTMLInputElement).value = '';
                                        } catch (e: any) {
                                            toast.error(e.message || "Erreur lors du changement.");
                                        }
                                    }}
                                    className="w-full rounded-2xl h-14 font-black bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20"
                                >
                                    METTRE À JOUR LE MOT DE PASSE
                                </Button>
                                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5">
                                    <button
                                        type="button"
                                        onClick={handlePasswordReset}
                                        className="text-xs font-bold text-primary hover:underline uppercase tracking-widest"
                                    >
                                        Mot de passe oublié ?
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Actions Footer - Premium Floating */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl z-50">
                <div className="bg-slate-900/90 dark:bg-white/90 backdrop-blur-2xl px-8 py-5 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.4)] flex items-center justify-between gap-6 border border-white/10 dark:border-black/10">
                    <div className="hidden md:block">
                        <p className="text-white dark:text-slate-900 font-bold text-lg">Prêt à briller ?</p>
                        <p className="text-white/60 dark:text-slate-900/60 text-xs font-medium uppercase tracking-widest">Enregistrez vos changements</p>
                    </div>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        size="lg"
                        className="flex-1 md:flex-none rounded-full px-12 h-16 text-xl font-black font-outfit shadow-2xl bg-primary hover:bg-primary/90 text-white transition-all hover:scale-[1.05] active:scale-95 group"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-3">
                                <span className="size-6 border-4 border-white border-t-transparent animate-spin rounded-full" />
                                OPTIMISATION...
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Save className="size-6 transition-transform group-hover:rotate-12" />
                                PUBLIER LES MISES À JOUR
                            </div>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
}
