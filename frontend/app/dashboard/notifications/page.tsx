'use client';

import React, { useEffect, useState } from 'react';
import { Bell, Check, Trash2, MessageSquare, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

import { getNotifications, markNotificationAsRead, deleteNotificationDetail } from '@/utils/supabase-helpers';
import { useNotifications } from '@/hooks';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

export default function NotificationsPage() {
    const { refreshCounts } = useNotifications();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNotification, setSelectedNotification] = useState<any>(null);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch (error) {
            toast.error('Erreur lors du chargement des notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
            refreshCounts();
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const markAllAsRead = async () => {
        try {
            const unread = notifications.filter(n => !n.is_read);
            await Promise.all(unread.map(n => markNotificationAsRead(n.id)));
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
            refreshCounts();
            toast.success('Toutes les notifications ont été marquées comme lues');
        } catch (error) {
            toast.error('Erreur lors de l\'opération');
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await deleteNotificationDetail(id);
            setNotifications(notifications.filter(n => n.id !== id));
            refreshCounts();
            toast.success('Notification supprimée');
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleNotificationClick = (notification: any) => {
        if (!notification.is_read) markAsRead(notification.id);
        setSelectedNotification(notification);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'MESSAGE': return <MessageSquare className="size-5 text-blue-500" />;
            case 'AD_APPROVED': return <Check className="size-5 text-green-500" />;
            case 'PROMO': return <Tag className="size-5 text-purple-500" />;
            default: return <Bell className="size-5 text-primary" />;
        }
    };

    return (
        <div className="container max-w-4xl py-10 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Mes Notifications</h1>
                    <p className="text-muted-foreground font-medium">Restez informé de votre activité sur Chez-BEN2.</p>
                </div>
                {notifications.some(n => !n.is_read) && (
                    <Button onClick={markAllAsRead} variant="outline" size="sm" className="rounded-full">
                        Tout marquer comme lu
                    </Button>
                )}
            </div>

            {loading ? (
                <div className="flex flex-col gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 w-full bg-muted animate-pulse rounded-2xl" />
                    ))}
                </div>
            ) : notifications.length === 0 ? (
                <Card className="border-dashed border-2 bg-muted/30 rounded-[2rem] p-20 flex flex-col items-center text-center gap-4">
                    <div className="size-20 rounded-full bg-background flex items-center justify-center text-muted-foreground shadow-sm">
                        <Bell className="size-10" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Aucune notification</h3>
                        <p className="text-muted-foreground">Vous n'avez pas encore de notifications.</p>
                    </div>
                </Card>
            ) : (
                <div className="flex flex-col gap-3">
                    {notifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={`border-none transition-all rounded-[1.5rem] shadow-sm hover:shadow-md cursor-pointer group active:scale-[0.98] ${!notification.is_read ? 'bg-primary/5 ring-1 ring-primary/10' : 'bg-card opacity-80 hover:opacity-100'}`}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <CardContent className="p-6 flex items-start gap-4">
                                <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${!notification.is_read ? 'bg-white shadow-sm' : 'bg-muted/50'}`}>
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h4 className={`font-bold truncate ${!notification.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {notification.title}
                                        </h4>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase whitespace-nowrap">
                                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: fr })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                        {notification.content || notification.message}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {!notification.is_read && (
                                                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                            )}
                                            <span className="text-[10px] font-black uppercase text-primary/60">
                                                Cliquer pour voir les détails
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(notification.id);
                                            }}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal de détails de notification */}
            <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
                <DialogContent className="sm:max-w-md rounded-[2rem] border-none shadow-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                {selectedNotification && getIcon(selectedNotification.type)}
                            </div>
                            <DialogTitle className="text-xl font-black">
                                {selectedNotification?.title}
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {selectedNotification && formatDistanceToNow(new Date(selectedNotification.created_at), { addSuffix: true, locale: fr })}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            {selectedNotification?.content || selectedNotification?.message}
                        </p>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        {selectedNotification?.action_url && (
                            <Button
                                className="flex-1 rounded-2xl h-12 font-bold shadow-lg shadow-primary/20"
                                onClick={() => {
                                    window.location.href = selectedNotification.action_url;
                                }}
                            >
                                Vérifier maintenant
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            className="flex-1 rounded-2xl h-12 font-bold"
                            onClick={() => setSelectedNotification(null)}
                        >
                            Fermer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
