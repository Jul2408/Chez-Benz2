'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, Loader2, ChevronRight, SlidersHorizontal, MessageCircle, ShieldCheck, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getConversations, createConversation, deleteConversation } from '@/utils/supabase-helpers';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
    const { user, isLoading: authLoading } = useAuthContext();
    const [conversations, setConversations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const searchParams = useSearchParams();
    const router = useRouter();

    const sellerId = searchParams.get('sellerId');
    const annonceId = searchParams.get('annonceId');

    useEffect(() => {
        async function init() {
            if (sellerId && annonceId && user && sellerId !== user.id.toString()) {
                try {
                    const newConv = await createConversation(annonceId);
                    router.push(`/dashboard/messages/${newConv.id}`);
                    return;
                } catch (err) {
                    console.error('Failed to create/get conversation:', err);
                }
            }

            const data = await getConversations();
            setConversations(data);
            setIsLoading(false);
        }

        if (!authLoading && user) {
            init();
        }
    }, [user, authLoading, sellerId, annonceId, router]);

    const handleDeleteConversation = async (e: React.MouseEvent, conversationId: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm('Voulez-vous vraiment supprimer cette conversation ?')) return;

        try {
            await deleteConversation(conversationId);
            setConversations(prev => prev.filter(c => c.id !== conversationId));
            toast.success('Conversation supprimée');
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const filteredConversations = conversations.filter(conv =>
        conv.otherUser.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.listing?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (authLoading || isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <MessageSquare className="absolute inset-0 m-auto h-5 w-5 text-primary" />
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Chargement de vos échanges...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col space-y-6 font-inter">
            {/* Header épuré */}
            <div className="flex items-center justify-between px-2">
                <div>
                    <h1 className="text-4xl font-black font-outfit tracking-tighter text-slate-900 leading-none">Messagerie</h1>
                    <p className="text-slate-400 font-medium text-sm mt-2">Gérez vos négociations en direct.</p>
                </div>
                <div className="size-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                    <MessageCircle className="size-6" />
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 h-full min-h-0">
                {/* Conversation List - Style Sidebar Premium */}
                <div className="md:col-span-4 flex flex-col bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/20 overflow-hidden">
                    <div className="p-6 border-b border-slate-50 dark:border-white/5 space-y-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Rechercher un vendeur ou un article..."
                                className="pl-11 h-12 bg-slate-50/50 dark:bg-slate-800/30 border-none rounded-2xl font-medium focus-visible:ring-2 focus-visible:ring-primary/10 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            {filteredConversations.length > 0 ? (
                                filteredConversations.map((conv: any) => (
                                    <Link
                                        key={conv.id}
                                        href={`/dashboard/messages/${conv.id}`}
                                        className="block p-4 rounded-[1.75rem] hover:bg-slate-50 dark:hover:bg-white/5 transition-all group relative border border-transparent hover:border-slate-100 dark:hover:border-white/5"
                                    >
                                        <div className="flex gap-4 items-center">
                                            <div className="relative">
                                                <Avatar className="size-12 rounded-2xl shadow-sm border-2 border-white dark:border-slate-800">
                                                    <AvatarImage src={conv.otherUser.avatar_url || undefined} className="object-cover" />
                                                    <AvatarFallback className="bg-primary/5 text-primary font-bold">{conv.otherUser.full_name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline mb-0.5">
                                                    <span className="font-bold text-slate-900 dark:text-white truncate text-[14px]">{conv.otherUser.full_name}</span>
                                                    {conv.last_message_at && (
                                                        <span className="text-[10px] font-black text-slate-300 uppercase shrink-0">
                                                            {formatDistanceToNow(new Date(conv.last_message_at), { locale: fr, addSuffix: false })}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] font-black text-primary/70 uppercase tracking-tighter mb-1 truncate leading-none">
                                                    {conv.listing?.title || 'Article'}
                                                </p>
                                                <p className="text-[13px] text-slate-400 truncate font-medium">
                                                    {conv.last_message_preview || 'Aucun message encore...'}
                                                </p>
                                            </div>

                                            <div className="flex flex-col items-end gap-2">
                                                <ChevronRight className="size-4 text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                                <button
                                                    onClick={(e) => handleDeleteConversation(e, conv.id)}
                                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-12 text-center space-y-4">
                                    <div className="size-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto opacity-40">
                                        <MessageSquare className="h-8 w-8 text-slate-300" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Aucune discussion</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Chat Area Placeholder - Style Dashboard */}
                <div className="hidden md:flex md:col-span-8 bg-white dark:bg-slate-900/50 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/20 items-center justify-center relative overflow-hidden">
                    {/* Subtle Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -ml-32 -mb-32" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-8 max-w-sm px-8 relative z-10"
                    >
                        <div className="relative inline-block group">
                            <div className="absolute inset-0 bg-primary/20 rounded-[3rem] blur-2xl group-hover:bg-primary/30 transition-all" />
                            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] relative border border-slate-100 dark:border-white/5 shadow-2xl transition-transform group-hover:scale-105 duration-500">
                                <MessageCircle className="h-16 w-16 text-primary" />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-outfit font-black text-3xl text-slate-900 dark:text-white mb-3 tracking-tight">Vos Discussions</h3>
                            <p className="text-slate-400 font-medium leading-relaxed">
                                Sélectionnez une conversation pour négocier, poser des questions ou finaliser une vente.
                            </p>
                        </div>

                        <div className="pt-4 flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-300">
                            <div className="flex items-center gap-2">
                                <div className="size-1.5 rounded-full bg-emerald-500" />
                                Support Local
                            </div>
                            <div className="size-1 bg-slate-200 rounded-full" />
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="size-4 text-emerald-500" />
                                Sécurisé
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
