<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Listing;
use App\Models\Message;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    /**
     * Liste toutes les conversations de l'utilisateur connecté.
     */
    public function index(Request $request)
    {
        $user = auth('sanctum')->user() ?: $request->user();
        if (!$user) return response()->json([], 401);

        $conversations = $user->conversations()
            ->with(['listing.photos', 'participants.profile', 'latestMessage'])
            ->latest()
            ->get()
            ->map(function ($conv) use ($user) {
                $conv->last_message = $conv->latestMessage;

                // Compute unread count for this conv
                $conv->unread_count = $conv->messages()
                    ->where('sender_id', '!=', $user->id)
                    ->where('is_read', false)
                    ->count();

                return $conv;
            });

        return response()->json($conversations);
    }

    /**
     * Affiche une conversation avec ses messages.
     */
    public function show(Request $request, $id)
    {
        $user = auth('sanctum')->user() ?: $request->user();
        if (!$user) return response()->json(['error' => 'Unauthenticated'], 401);

        $conversation = $user->conversations()
            ->with(['messages.sender.profile', 'listing.photos', 'participants.profile', 'latestMessage'])
            ->findOrFail($id);

        $conversation->last_message = $conversation->latestMessage;

        // Mark all unread messages in this conversation as read for this user
        $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json($conversation);
    }

    /**
     * Liste les messages d'une conversation.
     */
    public function messages(Request $request, $id)
    {
        $user = auth('sanctum')->user() ?: $request->user();
        if (!$user) return response()->json([], 401);

        $conversation = $user->conversations()->findOrFail($id);

        // Mark as read
        $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $messages = $conversation->messages()->with('sender.profile')->oldest()->get();
        return response()->json($messages);
    }

    /**
     * Envoie un message dans une conversation existante.
     */
    public function sendMessage(Request $request, $id)
    {
        $request->validate([
            'content' => 'required|string|max:5000',
        ]);

        $user = auth('sanctum')->user() ?: $request->user();
        if (!$user) return response()->json(['error' => 'Unauthenticated'], 401);

        $conversation = $user->conversations()->findOrFail($id);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id'       => $user->id,
            'content'         => $request->content,
            'is_read'         => false,
        ]);

        return response()->json($message->load('sender.profile'), 201);
    }

    /**
     * Crée une nouvelle conversation (ou réutilise une existante)
     * et envoie le premier message.
     *
     * Champs attendus :
     * - listing_id  (obligatoire)
     * - content     (obligatoire) — le premier message
     * - recipient_id (optionnel) — si omis, on utilise le propriétaire de l'annonce
     */
    public function store(Request $request)
    {
        $request->validate([
            'listing_id'   => 'required|exists:listings,id',
            'content'      => 'required|string|max:5000',
            'recipient_id' => 'nullable|exists:users,id',
        ]);

        $user = auth('sanctum')->user() ?: $request->user();
        if (!$user) return response()->json(['error' => 'Unauthenticated'], 401);

        // Resolve recipient: use provided ID or fallback to listing owner
        $recipientId = $request->recipient_id;

        if (!$recipientId) {
            $listing = Listing::find($request->listing_id);
            if (!$listing) {
                return response()->json(['error' => 'Annonce introuvable.'], 404);
            }
            $recipientId = $listing->user_id;
        }

        // Prevent messaging yourself
        if ((int) $recipientId === (int) $user->id) {
            return response()->json([
                'error' => 'Vous ne pouvez pas vous envoyer un message à vous-même.'
            ], 422);
        }

        // Find or create conversation between buyer & seller for this listing
        $conversation = Conversation::where('listing_id', $request->listing_id)
            ->whereHas('participants', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->whereHas('participants', function ($q) use ($recipientId) {
                $q->where('user_id', $recipientId);
            })
            ->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'listing_id' => $request->listing_id,
            ]);
            $conversation->participants()->attach([$user->id, $recipientId]);
        }

        // Send the first (or follow-up) message
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id'       => $user->id,
            'content'         => $request->content,
            'is_read'         => false,
        ]);

        return response()->json([
            'conversation' => $conversation->load(['participants.profile', 'listing.photos', 'latestMessage']),
            'message'      => $message->load('sender.profile'),
        ], 201);
    }

    /**
     * Compte les messages non-lus de l'utilisateur.
     */
    public function unreadCount(Request $request)
    {
        $user = auth('sanctum')->user() ?: $request->user();
        if (!$user) return response()->json(['count' => 0], 200);

        $count = Message::whereHas('conversation', function ($query) use ($user) {
            $query->whereHas('participants', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        })
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->count();

        return response()->json(['unread_count' => $count]);
    }
    /**
     * Supprime une conversation pour l'utilisateur (se détache).
     */
    public function destroy(Request $request, $id)
    {
        $user = auth('sanctum')->user() ?: $request->user();
        $conversation = $user->conversations()->findOrFail($id);

        $conversation->participants()->detach($user->id);

        return response()->json(['message' => 'Conversation supprimée']);
    }
}
