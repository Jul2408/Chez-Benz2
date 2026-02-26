<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();
        $profile = $user->profile;

        // Support both flat data and nested 'profile' data from Django frontend
        $data = $request->all();
        
        // Extract from nested profile if exists
        if ($request->has('profile') && is_array($request->profile)) {
            $data = array_merge($data, $request->profile);
        }

        // Support dot notation like 'profile.full_name' for FormData
        foreach ($request->all() as $key => $value) {
            if (str_contains($key, '.')) {
                $cleanKey = substr($key, strrpos($key, '.') + 1);
                $data[$cleanKey] = $value;
            }
        }

        $request->validate([
            'full_name' => 'nullable|string|max:255',
            'username' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'city' => 'nullable|string|max:100',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
        ]);

        $updateData = [];
        $mappings = [
            'full_name' => 'full_name',
            'username' => 'username',
            'phone' => 'phone',
            'whatsapp' => 'whatsapp_number',
            'whatsapp_number' => 'whatsapp_number',
            'facebook' => 'facebook_url',
            'facebook_url' => 'facebook_url',
            'instagram' => 'instagram_url',
            'instagram_url' => 'instagram_url',
            'website' => 'website_url',
            'website_url' => 'website_url',
            'experience' => 'experience_years',
            'experience_years' => 'experience_years',
            'address' => 'address',
            'city' => 'city',
            'region' => 'region',
            'bio' => 'bio',
            'latitude' => 'latitude',
            'longitude' => 'longitude'
        ];

        foreach ($mappings as $requestKey => $dbColumn) {
            if (isset($data[$requestKey])) {
                $updateData[$dbColumn] = $data[$requestKey];
            }
        }

        // Handle File Uploads more robustly
        foreach (['avatar', 'cover_image'] as $fileKey) {
            // Check flat name, nested name, and dot name
            $file = $request->file($fileKey) 
                 ?: ($request->file("profile.$fileKey") 
                 ?: $request->file("profile_{$fileKey}"));
            
            if ($file) {
                $folder = ($fileKey === 'avatar') ? 'avatars' : 'covers';
                $path = $file->store($folder, 'public');
                $updateData[$fileKey] = $path;
            }
        }

        if (!empty($updateData)) {
            $profile->update($updateData);
        }

        return response()->json($profile->fresh());
    }

    public function favorites(Request $request)
    {
        $favorites = $request->user()->favorites()->with(['category', 'photos', 'user.profile'])->get();
        
        // Django format for favorites often returns an object with the listing nested as 'listing_detail'
        $results = $favorites->map(function($listing) {
            return [
                'id' => $listing->id,
                'listing' => $listing->id,
                'listing_detail' => $listing
            ];
        });

        return response()->json($results);
    }

    public function toggleFavorite(Request $request)
    {
        $listingId = $request->listing;
        if (!$listingId && $request->route('listingId')) {
            $listingId = $request->route('listingId');
        }

        $user = $request->user();
        $user->favorites()->toggle($listingId);
        return response()->json(['message' => 'Favori mis à jour']);
    }
}
