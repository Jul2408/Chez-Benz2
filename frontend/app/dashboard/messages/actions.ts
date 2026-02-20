'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getCurrentProfile } from '@/utils/supabase-helpers';

const sendMessageSchema = z.object({
    conversationId: z.string(),
    content: z.string().min(1, "Message cannot be empty"),
});

export async function startConversation(annonceId: string, initialMessage?: string) {
    const { createConversation, sendMessage } = await import('@/utils/supabase-helpers');
    const user = await getCurrentProfile();

    if (!user) {
        redirect(`/connexion?next=/annonces/${annonceId}`);
    }

    try {
        const conversation = await createConversation(annonceId);

        if (conversation && conversation.id) {
            if (initialMessage) {
                await sendMessage(conversation.id, initialMessage);
            }
            revalidatePath('/dashboard/messages');
            redirect(`/dashboard/messages/${conversation.id}`);
        } else {
            // Handle error
            console.error("Failed to create conversation");
            // redirect(`/annonces/${annonceId}?error=create_conv_failed`);
        }
    } catch (error) {
        console.error("Start conversation error:", error);
    }
}

export async function sendMessage(formData: FormData) {
    const { sendMessage: apiSendMessage } = await import('@/utils/supabase-helpers');
    const user = await getCurrentProfile();

    if (!user) {
        return { success: false, error: "Non autorisé" };
    }

    const conversationId = formData.get('conversationId') as string;
    const content = formData.get('content') as string;

    if (!conversationId || !content) {
        return { success: false, error: "Missing fields" };
    }

    try {
        await apiSendMessage(conversationId, content);
        revalidatePath(`/dashboard/messages/${conversationId}`);
        revalidatePath('/dashboard/messages');
        return { success: true };
    } catch (error) {
        console.error("Send message error:", error);
        return { success: false, error: "Failed to send message" };
    }
}

export async function markAsSold(conversationId: string) {
    const user = await getCurrentProfile();

    if (!user) {
        return { success: false, error: "Non autorisé" };
    }

    console.log(`[Mock] Marking item as sold via conversation ${conversationId}`);

    revalidatePath(`/dashboard/messages/${conversationId}`);
    return { success: true };
}

export async function sendOffer(formData: FormData) {
    const user = await getCurrentProfile();

    if (!user) return { success: false, error: "Non autorisé" };

    const conversationId = formData.get('conversationId') as string;
    const amount = parseFloat(formData.get('amount') as string);

    if (isNaN(amount) || amount <= 0) {
        return { success: false, error: "Montant invalide" };
    }

    console.log(`[Mock] Sending offer of ${amount} to conversation ${conversationId}`);

    revalidatePath(`/dashboard/messages/${conversationId}`);
    return { success: true };
}

export async function acceptOffer(messageId: string) {
    const user = await getCurrentProfile();

    if (!user) return { success: false, error: "Non autorisé" };

    console.log(`[Mock] Accepting offer ${messageId}`);

    // Since we don't have the conversation ID easily here in mock without DB, 
    // we would typically fetch it. For now, assuming revalidation happens on general path
    revalidatePath('/dashboard/messages');
    return { success: true };
}

export async function rejectOffer(messageId: string) {
    const user = await getCurrentProfile();

    if (!user) return { success: false, error: "Non autorisé" };

    console.log(`[Mock] Rejecting offer ${messageId}`);

    revalidatePath('/dashboard/messages');
    return { success: true };
}
