<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function index(Request $request)
    {
        $conversations = $request->user()->conversations()
            ->with(['listing', 'participants', 'latestMessage'])
            ->get();

        return response()->json($conversations);
    }

    public function show(Request $request, $id)
    {
        $conversation = $request->user()->conversations()
            ->with(['messages.sender', 'listing', 'participants'])
            ->findOrFail($id);

        return response()->json($conversation);
    }

    public function store(Request $request)
    {
        $request->validate([
            'listing_id' => 'required|exists:listings,id',
            'content' => 'required|string',
            'recipient_id' => 'required|exists:users,id',
        ]);

        // Check if conversation already exists between these users for this listing
        $conversation = Conversation::where('listing_id', $request->listing_id)
            ->whereHas('participants', function($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->whereHas('participants', function($query) use ($request) {
                $query->where('user_id', $request->recipient_id);
            })
            ->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'listing_id' => $request->listing_id,
            ]);
            $conversation->participants()->attach([$request->user()->id, $request->recipient_id]);
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $request->user()->id,
            'content' => $request->content,
        ]);

        return response()->json($message->load('conversation'), 201);
    }
}
