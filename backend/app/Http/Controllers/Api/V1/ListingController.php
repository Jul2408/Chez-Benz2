<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\Category;
use Illuminate\Http\Request;

class ListingController extends Controller
{
    public function categories()
    {
        return response()->json(Category::with('children')->whereNull('parent_id')->get());
    }

    public function index(Request $request)
    {
        $listings = Listing::with(['category', 'photos', 'user.profile'])
            ->where('status', 'ACTIVE')
            ->latest()
            ->paginate(20);

        return response()->json($listings);
    }

    public function show($slug)
    {
        $listing = Listing::with(['category', 'photos', 'user.profile'])
            ->where('slug', $slug)
            ->firstOrFail();

        $listing->increment('views_count');

        return response()->json($listing);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'city' => 'required|string',
            'region' => 'required|string',
            'condition' => 'required|string',
            'photos' => 'nullable|array',
            'photos.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $listing = Listing::create([
            'user_id' => $request->user()->id,
            'category_id' => $request->category_id,
            'title' => $request->title,
            'description' => $request->description,
            'price' => $request->price,
            'city' => $request->city,
            'region' => $request->region,
            'condition' => $request->condition,
            'status' => 'ACTIVE',
        ]);

        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $index => $photo) {
                $path = $photo->store('listings', 'public');
                $listing->photos()->create([
                    'image_path' => $path,
                    'is_cover' => $index === 0,
                ]);
            }
        }

        return response()->json($listing->load('photos'), 201);
    }
}
