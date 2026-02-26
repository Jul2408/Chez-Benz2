<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
        ]);

        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'USER',
        ]);

        if ($request->has('full_name')) {
            $user->profile->update(['full_name' => $request->full_name]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access' => $token,
            'refresh' => $token,
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'profile' => $user->profile,
            ]
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::with('profile')->where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'detail' => 'Les identifiants sont incorrects.',
                'error' => 'Les identifiants sont incorrects.'
            ], 422);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access' => $token,
            'refresh' => $token, // Mock refresh with same token
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'profile' => $user->profile,
            ]
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'id' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
            'profile' => $user->profile,
            'date_joined' => $user->created_at,
        ]);
    }

    public function show($id)
    {
        $user = User::with('profile')->findOrFail($id);
        return response()->json([
            'id' => $user->id,
            'profile' => $user->profile,
            'date_joined' => $user->created_at,
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'old_password' => 'required',
            'new_password' => 'required|min:8',
        ]);

        if (!Hash::check($request->old_password, $request->user()->password)) {
            return response()->json(['error' => 'Ancien mot de passe incorrect'], 400);
        }

        $request->user()->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json(['message' => 'Mot de passe mis à jour']);
    }

    public function passwordReset(Request $request)
    {
        // Mock implementation for now
        return response()->json(['message' => 'Lien de réinitialisation envoyé']);
    }

    public function passwordResetConfirm(Request $request)
    {
        // Mock implementation for now
        return response()->json(['message' => 'Mot de passe réinitialisé']);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }
}
