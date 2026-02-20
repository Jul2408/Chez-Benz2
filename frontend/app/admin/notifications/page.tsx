'use client';

import React, { useState, useEffect } from 'react';
import {
    BellRing,
    Send,
    ShieldAlert,
    Loader2,
    Clock,
    Trash2,
    MailOpen,
    Megaphone,
    CheckCircle2,
    Inbox
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    sendBroadcastNotification,
    getNotifications,
    deleteNotificationDetail,
    markNotificationAsRead
} from '@/utils/supabase-helpers';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AdminNotificationsPage() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        action_url: ''
    });

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setFetching(true);
        try {
            const data = await getNotifications();
            setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setFetching(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch {
            toast.error('Erreur lors du marquage.');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteNotificationDetail(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            toast.success('Notification supprimée.');
        } catch {
            toast.error('Erreur lors de la suppression.');
        }
    };

    const handleSend = async () => {
        if (!formData.title || !formData.message) {
            toast.error('Le titre et le message sont requis.');
            return;
        }
        setLoading(true);
        try {
            await sendBroadcastNotification(formData);
            toast.success('Notification envoyée à tous les utilisateurs !');
            setFormData({ title: '', message: '', action_url: '' });
        } catch {
            toast.error("Erreur lors de l'envoi.");
        } finally {
            setLoading(false);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black font-outfit tracking-tight text-slate-900 dark:text-white">
                        Centre de Notifications
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Gérez vos alertes personnelles et communiquez avec la communauté.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-6 py-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                    <ShieldAlert className="size-5 text-amber-600" />
                    <span className="text-xs font-black text-amber-700 uppercase">Panel Admin</span>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="inbox" className="w-full">
                <TabsList className="bg-slate-100 dark:bg-white/5 p-2 rounded-2xl h-16 w-full max-w-sm grid grid-cols-2 mb-8">
                    <TabsTrigger
                        value="inbox"
                        className="rounded-xl font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-lg flex items-center gap-2"
                    >
                        <Inbox className="size-4" />
                        Réception
                        {unreadCount > 0 && (
                            <span className="size-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        value="broadcast"
                        className="rounded-xl font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-lg flex items-center gap-2"
                    >
                        <Megaphone className="size-4" />
                        Envoi Global
                    </TabsTrigger>
                </TabsList>

                {/* ── INBOX TAB ── */}
                <TabsContent value="inbox" className="outline-none space-y-4">
                    {fetching ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Loader2 className="size-10 text-primary animate-spin" />
                            <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                                Chargement des alertes...
                            </p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <Card className="border-dashed border-2 border-slate-200 dark:border-white/10 bg-transparent rounded-[2.5rem] p-20 text-center">
                            <div className="size-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <BellRing className="size-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-black text-slate-400">
                                Aucune notification pour le moment
                            </h3>
                            <p className="text-sm text-slate-400 mt-2 font-medium">
                                Les alertes système et les messages apparaîtront ici.
                            </p>
                        </Card>
                    ) : (
                        <>
                            {unreadCount > 0 && (
                                <div className="flex justify-end">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-primary font-bold text-xs"
                                        onClick={() => notifications.filter(n => !n.is_read).forEach(n => handleMarkAsRead(n.id))}
                                    >
                                        <CheckCircle2 className="size-4 mr-1" />
                                        Tout marquer comme lu
                                    </Button>
                                </div>
                            )}
                            <div className="grid gap-3">
                                {notifications.map((notif) => (
                                    <Card
                                        key={notif.id}
                                        className={`border-none shadow-lg rounded-[2rem] transition-all hover:scale-[1.005] overflow-hidden ${!notif.is_read
                                                ? 'bg-primary/5 ring-1 ring-primary/20'
                                                : 'bg-white dark:bg-slate-900'
                                            }`}
                                    >
                                        <CardContent className="p-5 flex items-center gap-5">
                                            {/* Icon */}
                                            <div className={`size-12 shrink-0 rounded-2xl flex items-center justify-center ${!notif.is_read
                                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                                    : 'bg-slate-100 dark:bg-white/10 text-slate-400'
                                                }`}>
                                                <BellRing className="size-5" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-black text-slate-900 dark:text-white truncate">
                                                        {notif.title || notif.message?.substring(0, 50)}
                                                    </h4>
                                                    {!notif.is_read && (
                                                        <Badge className="bg-primary text-white text-[8px] font-black uppercase shrink-0">
                                                            Nouveau
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-500 font-medium line-clamp-1">
                                                    {notif.message}
                                                </p>
                                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1">
                                                    <Clock className="size-3" />
                                                    {notif.created_at
                                                        ? formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: fr })
                                                        : 'Récemment'}
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1 shrink-0">
                                                {!notif.is_read && (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="rounded-xl text-primary hover:bg-primary/10"
                                                        onClick={() => handleMarkAsRead(notif.id)}
                                                        title="Marquer comme lu"
                                                    >
                                                        <MailOpen className="size-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="rounded-xl text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                                                    onClick={() => handleDelete(notif.id)}
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </>
                    )}
                </TabsContent>

                {/* ── BROADCAST TAB ── */}
                <TabsContent value="broadcast" className="outline-none">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form */}
                        <div className="lg:col-span-2">
                            <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden">
                                <CardHeader className="p-10 pb-4">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Send className="size-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-black font-outfit">
                                                Nouveau Message Broadcast
                                            </CardTitle>
                                            <CardDescription className="font-medium text-slate-400">
                                                Diffusez un message à toute la communauté Chez-BEN2.
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-10 pt-6 space-y-6">
                                    <div className="space-y-3">
                                        <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-2">
                                            Objet du Message
                                        </Label>
                                        <Input
                                            placeholder="Ex: Maintenance système, Nouvelle fonctionnalité..."
                                            className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold text-lg"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-2">
                                            Corps du Message
                                        </Label>
                                        <Textarea
                                            placeholder="Décrivez votre message en détail..."
                                            className="min-h-[160px] rounded-[2rem] bg-slate-50 dark:bg-white/5 border-none font-medium p-6 resize-none"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-2">
                                            Lien d'Action (Optionnel)
                                        </Label>
                                        <Input
                                            placeholder="Ex: /annonces/123"
                                            className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-medium"
                                            value={formData.action_url}
                                            onChange={(e) => setFormData({ ...formData, action_url: e.target.value })}
                                        />
                                    </div>

                                    <Button
                                        onClick={handleSend}
                                        disabled={loading}
                                        className="w-full h-16 rounded-[2rem] bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all"
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin size-5" />
                                        ) : (
                                            <>
                                                DIFFUSER LE MESSAGE
                                                <Send className="ml-3 size-5" />
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Info Card */}
                        <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-[3rem] p-10 flex flex-col justify-between">
                            <div className="space-y-6">
                                <div className="size-16 rounded-3xl bg-white/10 flex items-center justify-center">
                                    <Megaphone className="size-8 opacity-80" />
                                </div>
                                <h3 className="text-2xl font-black font-outfit leading-tight">
                                    Portée du Message
                                </h3>
                                <p className="text-indigo-100 font-medium opacity-80 leading-relaxed">
                                    En envoyant ce message, tous les utilisateurs inscrits recevront
                                    une notification instantanée dans leur centre personnel.
                                </p>
                            </div>
                            <div className="pt-10">
                                <div className="p-6 bg-white/10 rounded-3xl border border-white/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">
                                        Conseil Admin
                                    </p>
                                    <p className="text-xs font-bold leading-relaxed">
                                        Soyez clair et concis. Les messages courts ont un meilleur taux de lecture.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
