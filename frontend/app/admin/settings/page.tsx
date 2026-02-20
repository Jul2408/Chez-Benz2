'use client';

import React, { useState, useEffect } from 'react';
import {
    Settings2,
    Globe,
    Shield,
    Wallet,
    Bell,
    Mail,
    Phone,
    MapPin,
    Facebook,
    MessageCircle,
    Save,
    RotateCcw,
    Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { getPlatformSettings, updatePlatformSettings } from '@/utils/supabase-helpers';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            const data = await getPlatformSettings();
            if (data) setSettings(data);
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updatePlatformSettings(settings);
            toast.success("Paramètres enregistrés avec succès.");
        } catch (error) {
            toast.error("Erreur lors de l'enregistrement.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Chargement des configurations...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black font-outfit tracking-tight text-slate-900 dark:text-white">Configuration Globale</h1>
                    <p className="text-slate-500 font-medium mt-1">Pilotez les paramètres fondamentaux de Chez-BEN2.</p>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl font-bold border-gray-100 dark:border-white/5" onClick={() => window.location.reload()}>
                        <RotateCcw className="size-4 mr-2" /> Réinitialiser
                    </Button>
                    <Button className="h-12 px-8 rounded-xl font-black bg-primary text-white shadow-xl shadow-primary/20" onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
                        Enregistrer les modifications
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Site Identity */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-10 pb-4">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                                    <Globe className="size-5" />
                                </div>
                                <CardTitle className="text-2xl font-black font-outfit">Identité de la Plateforme</CardTitle>
                            </div>
                            <CardDescription className="font-medium text-slate-400">Nom du site et informations publiques</CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 pt-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-2">Nom de la Plateforme</Label>
                                    <Input
                                        className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold text-lg"
                                        value={settings?.site_name}
                                        onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-2">Email de Contact</Label>
                                    <Input
                                        className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold text-lg"
                                        value={settings?.contact_email}
                                        onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-2">Téléphone Support</Label>
                                    <Input
                                        className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold text-lg"
                                        value={settings?.contact_phone}
                                        onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-2">WhatsApp Business</Label>
                                    <Input
                                        className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold text-lg"
                                        value={settings?.whatsapp_number}
                                        onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-2">Adresse du Siège</Label>
                                <Input
                                    className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold text-lg"
                                    value={settings?.address}
                                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-10 pb-4">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                                    <Wallet className="size-5" />
                                </div>
                                <CardTitle className="text-2xl font-black font-outfit">Tarification & Économie</CardTitle>
                            </div>
                            <CardDescription className="font-medium text-slate-400">Paramètres financiers et prix des crédits</CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 pt-6 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-2">Prix par Crédit (XAF)</Label>
                                        <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">LIVE</span>
                                    </div>
                                    <div className="relative">
                                        <Wallet className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-orange-500" />
                                        <Input
                                            type="number"
                                            className="h-20 pl-14 rounded-3xl bg-slate-50 dark:bg-white/5 border-none font-black text-3xl"
                                            value={settings?.credit_price_xaf}
                                            onChange={(e) => setSettings({ ...settings, credit_price_xaf: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <p className="text-xs font-medium text-slate-400 ml-2 italic">Ce prix s'applique lors de l'achat direct de crédits par les utilisateurs.</p>
                                </div>
                                <div className="space-y-4">
                                    <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-2">Commission de Plateforme (%)</Label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-2xl text-slate-300">%</span>
                                        <Input
                                            type="number"
                                            className="h-20 pl-14 rounded-3xl bg-slate-50 dark:bg-white/5 border-none font-black text-3xl"
                                            value={settings?.commission_percentage}
                                            onChange={(e) => setSettings({ ...settings, commission_percentage: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <p className="text-xs font-medium text-slate-400 ml-2 italic">Pourcentage prélevé sur les ventes garanties (si activé).</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* System & Status */}
                <div className="space-y-8">
                    <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black font-outfit flex items-center gap-3">
                                <Shield className="size-5 text-red-500" /> État du Système
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-4 space-y-6">
                            <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                                <div>
                                    <p className="font-black text-slate-900 dark:text-white">Mode Maintenance</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Bloquer l'accès public</p>
                                </div>
                                <Switch
                                    checked={settings?.maintenance_mode}
                                    onCheckedChange={(val) => setSettings({ ...settings, maintenance_mode: val })}
                                />
                            </div>

                            <Separator className="bg-gray-100 dark:bg-white/5" />

                            <div className="space-y-4">
                                <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-2">Notifications System</Label>
                                <div className="space-y-3">
                                    {['Email Transactionnel', 'Alertes Push', 'Logs d\'activité'].map((item) => (
                                        <div key={item} className="flex items-center justify-between px-4 py-2">
                                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{item}</span>
                                            <BadgeCheck className="size-5 text-green-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-2xl bg-gradient-to-br from-primary to-primary-600 text-white rounded-[2.5rem] overflow-hidden p-8">
                        <div className="space-y-6">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 text-center">Statistiques Platform</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <p className="text-3xl font-black font-outfit">99.9%</p>
                                    <p className="text-[10px] font-black uppercase opacity-70">Uptime</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-black font-outfit">24ms</p>
                                    <p className="text-[10px] font-black uppercase opacity-70">Latence</p>
                                </div>
                            </div>
                            <Button className="w-full bg-white text-primary rounded-2xl font-black h-12 shadow-xl">
                                Voir les Logs Serveur
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function BadgeCheck({ className, ...props }: any) {
    return (
        <div className={className} {...props}>
            <div className="size-full bg-current rounded-full flex items-center justify-center">
                <Save className="text-white size-3" />
            </div>
        </div>
    );
}
