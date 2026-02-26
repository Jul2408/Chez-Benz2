'use client';

import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { ChatWindow } from '@/components/dashboard/ChatWindow';
import { getConversation, getMessages } from '@/utils/supabase-helpers';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { Loader2 } from 'lucide-react';

interface MessagePageProps {
    params: {
        id: string;
    }
}

export default function MessagePage({ params }: MessagePageProps) {
    const { user, isLoading: authLoading } = useAuthContext();
    const [conversation, setConversation] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            if (!user) return;

            try {
                const [convData, msgsData] = await Promise.all([
                    getConversation(params.id),
                    getMessages(params.id)
                ]);

                if (!convData) {
                    router.push('/dashboard/messages');
                    return;
                }

                setConversation(convData);
                setMessages(msgsData);
            } catch (err) {
                console.error('Error fetching conversation details:', err);
            } finally {
                setLoading(false);
            }
        }

        if (!authLoading) {
            if (!user) {
                router.push('/connexion');
            } else {
                fetchData();
            }
        }
    }, [user, authLoading, params.id, router]);

    if (authLoading || loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium tracking-tight">Chargement de la discussion...</p>
            </div>
        );
    }

    if (!conversation) {
        return null; // Will redirect in useEffect
    }

    // Check if current user is seller
    const isSeller = conversation.listing?.user_id === user?.id ||
        conversation.listing?.user === user?.id ||
        conversation.listing?.user?.id === user?.id;

    return (
        <div className="w-full h-full md:container md:py-8 animate-in fade-in duration-500">
            <ChatWindow
                conversationId={params.id}
                initialMessages={messages}
                currentUserId={user?.id.toString() || ''}
                isSeller={isSeller}
                otherUser={{
                    full_name: conversation.otherUser.full_name,
                    avatar_url: conversation.otherUser.avatar_url,
                    is_verified: conversation.otherUser.is_verified
                }}
                annonceTitle={conversation.listing?.title || 'Annonce'}
            />
        </div>
    );
}
