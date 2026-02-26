<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Listing;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function users()
    {
        $this->authorizeAdmin();
        return response()->json(User::with('profile')->latest()->get());
    }

    public function updateUser(Request $request, $id)
    {
        $this->authorizeAdmin();
        $user = User::findOrFail($id);
        
        $request->validate([
            'role' => 'sometimes|string|in:USER,MODERATOR,ADMIN',
            'is_active' => 'sometimes|boolean',
            'profile.credits' => 'sometimes|numeric',
        ]);

        if ($request->has('role')) {
            $user->role = $request->role;
        }
        
        // Note: is_active might need a column in users table or profile
        // For now let's assume it's extra or we add it to user
        
        $user->save();

        if ($request->has('profile.credits')) {
            $user->profile->update([
                'credits' => $request->input('profile.credits')
            ]);
        }

        return response()->json($user->load('profile'));
    }

    public function deleteUser($id)
    {
        $this->authorizeAdmin();
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé']);
    }

    private function authorizeAdmin()
    {
        $user = auth('sanctum')->user();
        if (!$user || $user->role !== 'ADMIN') {
            response()->json(['error' => 'Accès interdit'], 403)->send();
            exit;
        }
    }
}
