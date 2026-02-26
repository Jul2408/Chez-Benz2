<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = auth('sanctum')->user() ?: $request->user();
        if (!$user) return response()->json([]);

        if ($request->has('unread') && $request->unread == 'true') {
            $notifications = $user->unreadNotifications;
        } else {
            $notifications = $user->notifications;
        }
        
        $mapped = $notifications->map(function($notif) {
            $data = is_array($notif->data) ? $notif->data : json_decode($notif->data, true);
            return [
                'id' => $notif->id,
                'type' => $notif->type,
                'title' => $data['title'] ?? 'Notification',
                'content' => $data['message'] ?? ($data['content'] ?? ''),
                'is_read' => !is_null($notif->read_at),
                'created_at' => $notif->created_at,
                'action_url' => $data['action_url'] ?? null,
            ];
        });

        // If requested from getUnreadNotificationsCount, we might need a count format
        if ($request->has('unread') && $request->unread == 'true' && !$request->has('results_only')) {
            // Check if caller expects just a list or an object with count
            // The frontend getUnreadNotificationsCount expects an object with .count or length
        }

        return response()->json($mapped);
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();
        return response()->json(['message' => 'Notification marquée comme lue']);
    }

    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();
        return response()->json(['message' => 'Toutes les notifications ont été marquées comme lues']);
    }

    public function broadcast(Request $request)
    {
        $user = auth('sanctum')->user();
        if (!$user || $user->role !== 'ADMIN') {
            return response()->json(['error' => 'Accès interdit'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'action_url' => 'nullable|string',
        ]);

        $users = \App\Models\User::all();
        \Illuminate\Support\Facades\Notification::send(
            $users,
            new \App\Notifications\BroadcastNotification(
                $request->title,
                $request->message,
                $request->action_url
            )
        );

        return response()->json(['message' => 'Notification diffusée à tous les utilisateurs']);
    }
    public function destroy(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->delete();
        return response()->json(['message' => 'Notification supprimée']);
    }
}
