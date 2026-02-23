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
}
