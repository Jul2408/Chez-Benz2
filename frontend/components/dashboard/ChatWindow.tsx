'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Send,
    Image as ImageIcon,
    MessageCircle,
    Loader2,
    MoreVertical,
    ShieldCheck,
    Smile,
    ChevronLeft,
    Phone,
    Info,
    Trash2,
    Check,
    Plus
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { sendMessage, getMessages } from '@/utils/supabase-helpers';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks';

// Emojis organisés par catégories pour un look plus pro
const EMOJI_LIST = ["😊", "😂", "🥰", "👍", "🙏", "🔥", "💯", "🤝", "💰", "📦", "📍", "👋", "✨", "🙌", "❤️", "😜"];

interface Message {
    id: string;
    sender_id?: string;
    sender?: {
        id: string;
        email: string;
        full_name?: string;
    };
    content: string;
    created_at: string;
    content_type?: string;
    offer_amount?: number;
    offer_status?: 'pending' | 'accepted' | 'rejected';
}

interface ChatWindowProps {
    conversationId: string;
    initialMessages: any[];
    currentUserId: string;
    isSeller: boolean;
    otherUser: {
        full_name: string;
        avatar_url: string | null;
        is_verified?: boolean;
    };
    annonceTitle: string;
}

export function ChatWindow({
    conversationId,
    initialMessages,
    currentUserId,
    isSeller,
    otherUser,
    annonceTitle
}: ChatWindowProps) {
    const { refreshCounts } = useNotifications();
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior
            });
        }
    };

    useEffect(() => {
        scrollToBottom('auto');
        refreshCounts();
    }, [refreshCounts]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const interval = setInterval(async () => {
            const newMsgs = await getMessages(conversationId);
            if (newMsgs && newMsgs.length > 0) {
                setMessages(newMsgs);
                // Puisque getMessages marque les messages comme lus côté serveur,
                // on rafraîchit les compteurs globaux pour faire disparaître les badges
                refreshCounts();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [conversationId, refreshCounts]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || sending) return;

        setSending(true);
        const tempId = Math.random().toString();
        const optimisticMsg: Message = {
            id: tempId,
            sender_id: currentUserId,
            content: input,
            created_at: new Date().toISOString()
        };

        setMessages((prev: Message[]) => [...prev, optimisticMsg]);
        const currentInput = input;
        setInput('');
        setShowEmojis(false);

        try {
            const result = await sendMessage(conversationId, currentInput);

            // Replaces optimistic message with real one from server to ensure correct ID and format
            setMessages((prev: Message[]) =>
                prev.map(m => m.id === tempId ? result : m)
            );

            refreshCounts();
        } catch (error) {
            toast.error("Échec de l'envoi");
            setMessages((prev: Message[]) => prev.filter(m => m.id !== tempId));
            setInput(currentInput);
        }
        setSending(false);
    };

    const insertEmoji = (emoji: string) => {
        setInput(prev => prev + emoji);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-12rem)] bg-[#F8FAFC] dark:bg-slate-950 md:rounded-[2.5rem] overflow-hidden shadow-2xl relative font-inter border border-slate-200/50 dark:border-white/5">

            {/* Header: Épuré & Élégant */}
            <div className="px-4 py-3 md:px-8 md:py-6 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex items-center justify-between z-40">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden rounded-full h-10 w-10 -ml-2"
                        onClick={() => router.push('/dashboard/messages')}
                    >
                        <ChevronLeft className="size-6 text-slate-600" />
                    </Button>

                    <div className="relative">
                        <Avatar className="h-10 w-10 md:h-12 md:w-12 ring-2 ring-white dark:ring-slate-800 shadow-sm">
                            <AvatarImage src={otherUser.avatar_url || undefined} className="object-cover" />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">{otherUser.full_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 size-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                    </div>

                    <div className="flex flex-col">
                        <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                            {otherUser.full_name}
                            {otherUser.is_verified && <ShieldCheck className="size-4 text-primary fill-primary/10" />}
                        </h3>
                        <span className="text-[10px] md:text-xs font-medium text-slate-400 truncate max-w-[140px] md:max-w-xs">
                            {annonceTitle}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-0.5 md:gap-2">
                    <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full text-slate-400 hover:text-primary transition-colors">
                        <Phone className="size-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-primary transition-colors">
                        <Info className="size-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-primary transition-colors">
                        <MoreVertical className="size-5" />
                    </Button>
                </div>
            </div>

            {/* Zone de Messages: Avec fond texturé discret */}
            <div
                className="flex-1 overflow-y-auto p-4 md:p-10 space-y-4 scrollbar-none relative"
                ref={scrollRef}
            >
                {/* Background Pattern: Subtile Dots/Gird */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] dark:opacity-[0.05]" />

                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-40">
                        <div className="size-20 bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm flex items-center justify-center">
                            <MessageCircle className="h-10 w-10 text-slate-300" />
                        </div>
                        <p className="font-medium text-slate-500">Commencez la discussion sur cet article</p>
                    </div>
                ) : (
                    messages.map((msg: Message, idx: number) => {
                        const messageSenderId = msg.sender?.id?.toString() || msg.sender_id?.toString();
                        const isMe = messageSenderId === currentUserId?.toString();

                        const prevMsg = messages[idx - 1];
                        const prevSenderId = prevMsg?.sender?.id?.toString() || prevMsg?.sender_id?.toString();
                        const isSameSender = prevSenderId === messageSenderId;

                        return (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={msg.id}
                                className={cn(
                                    "flex w-full",
                                    isMe ? 'justify-end' : 'justify-start',
                                    isSameSender ? 'mt-1' : 'mt-4'
                                )}
                            >
                                <div className={cn(
                                    "relative max-w-[85%] md:max-w-[70%] px-4 py-2.5 shadow-sm transition-all",
                                    isMe
                                        ? 'bg-primary text-white rounded-[1.25rem] rounded-tr-[0.25rem]'
                                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-white/5 rounded-[1.25rem] rounded-tl-[0.25rem]'
                                )}>
                                    <p className="text-[15px] font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                                    <div className={cn(
                                        "flex items-center gap-1 mt-1 justify-end opacity-40 text-[9px] font-black uppercase tracking-tighter",
                                        isMe ? 'text-white/80' : 'text-slate-400'
                                    )}>
                                        {formatDistanceToNow(new Date(msg.created_at), { addSuffix: false, locale: fr })}
                                        {isMe && <Check className="size-2.5" />}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Input Floating Style: Confortable & Complet */}
            <div className="p-4 md:p-8 pt-0 bg-transparent">
                <AnimatePresence>
                    {showEmojis && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-full left-4 right-4 mb-4 p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-2xl z-50"
                        >
                            <div className="grid grid-cols-8 gap-1">
                                {EMOJI_LIST.map(emoji => (
                                    <button
                                        key={emoji}
                                        onClick={() => insertEmoji(emoji)}
                                        className="size-10 flex items-center justify-center text-xl hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors active:scale-90"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-end gap-2 md:gap-4 relative max-w-5xl mx-auto">
                    {/* Action Additionnelle (Photo) */}
                    <button className="flex-shrink-0 size-12 flex items-center justify-center bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-white/10 text-slate-400 hover:text-primary transition-all shadow-sm active:scale-90">
                        <Plus className="size-6" />
                    </button>

                    <div className="flex-1 relative bg-white dark:bg-slate-900 rounded-[1.75rem] border border-slate-200 dark:border-white/10 shadow-lg px-2 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all flex items-center">
                        <button
                            onClick={() => setShowEmojis(!showEmojis)}
                            className={cn(
                                "size-9 flex-shrink-0 flex items-center justify-center rounded-full transition-colors",
                                showEmojis ? "text-primary bg-primary/5" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <Smile className="size-6" />
                        </button>

                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            placeholder="Votre message..."
                            className="bg-transparent border-none focus-visible:ring-0 h-9 text-[15px] font-semibold placeholder:text-slate-300 placeholder:font-medium pl-2 pr-2"
                            disabled={sending}
                        />

                        <button className="hidden sm:flex size-9 flex-shrink-0 items-center justify-center text-slate-400 hover:text-primary transition-colors">
                            <ImageIcon className="size-5" />
                        </button>
                    </div>

                    <Button
                        onClick={() => handleSend()}
                        disabled={!input.trim() || sending}
                        className="flex-shrink-0 bg-primary hover:bg-primary/90 text-white size-12 rounded-full shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-90 p-0 border-none"
                    >
                        {sending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Send className="h-5 w-5 ml-1" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
