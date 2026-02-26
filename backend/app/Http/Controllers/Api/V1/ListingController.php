<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\Category;
use App\Models\Message;
use Illuminate\Http\Request;

class ListingController extends Controller
{
    public function categories(Request $request)
    {
        // For admin tree view, we might want different structure or all categories
        $user = auth('sanctum')->user();
        if ($request->has('all') && $user && $user->role === 'ADMIN') {
            return response()->json(Category::all());
        }
        return response()->json(Category::with('children')->whereNull('parent_id')->get());
    }

    public function storeCategory(Request $request)
    {
        $user = auth('sanctum')->user();
        if (!$user || $user->role !== 'ADMIN') {
            return response()->json(['error' => 'Accès interdit'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories,slug',
            'parent_id' => 'nullable|exists:categories,id',
            'icon' => 'nullable|string',
        ]);

        $category = Category::create($request->only(['name', 'slug', 'parent_id', 'icon']));

        return response()->json($category, 201);
    }

    public function updateCategory(Request $request, $id)
    {
        $user = auth('sanctum')->user();
        if (!$user || $user->role !== 'ADMIN') {
            return response()->json(['error' => 'Accès interdit'], 403);
        }

        $category = Category::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|unique:categories,slug,' . $id,
            'parent_id' => 'nullable|exists:categories,id',
            'icon' => 'nullable|string',
        ]);

        $category->update($request->only(['name', 'slug', 'parent_id', 'icon']));

        return response()->json($category);
    }

    public function deleteCategory($id)
    {
        $user = auth('sanctum')->user();
        if (!$user || $user->role !== 'ADMIN') {
            return response()->json(['error' => 'Accès interdit'], 403);
        }

        $category = Category::findOrFail($id);
        
        // Check if there are listings or children
        if ($category->listings()->count() > 0 || $category->children()->count() > 0) {
            return response()->json(['error' => 'Impossible de supprimer une catégorie contenant des annonces ou des sous-catégories'], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Catégorie supprimée']);
    }

    public function index(Request $request)
    {
        $query = Listing::with(['category', 'photos', 'user.profile']);

        if ($request->has('my_listings') && $request->my_listings == 'true') {
            $user = auth('sanctum')->user();
            if (!$user) {
                return response()->json(['error' => 'Authentification requise pour voir vos annonces'], 401);
            }
            $query->where('user_id', $user->id);
        } elseif ($request->has('user')) {
             $query->where('user_id', $request->user);
        } else {
            // If admin requesting specific status
            $user = auth('sanctum')->user();
            if ($request->has('status') && $user && $user->role === 'ADMIN') {
                $query->where('status', $request->status);
            } else {
                $query->where('status', 'ACTIVE');
            }
        }

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }
        
        // ... rest of filters
        
        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }
        
        if ($request->has('category__slug')) {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('slug', $request->category__slug);
            });
        }

        if ($request->has('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        $listings = $query->latest()->paginate(20);

        return response()->json([
            'count' => $listings->total(),
            'next' => $listings->nextPageUrl(),
            'previous' => $listings->previousPageUrl(),
            'results' => $listings->items(),
        ]);
    }

    public function approve($id)
    {
        $user = auth('sanctum')->user();
        if (!$user || $user->role !== 'ADMIN') {
            return response()->json(['error' => 'Accès interdit'], 403);
        }

        $listing = Listing::findOrFail($id);
        $listing->update(['status' => 'ACTIVE']);

        return response()->json($listing);
    }

    public function reject($id)
    {
        $user = auth('sanctum')->user();
        if (!$user || $user->role !== 'ADMIN') {
            return response()->json(['error' => 'Accès interdit'], 403);
        }

        $listing = Listing::findOrFail($id);
        $listing->update(['status' => 'REJECTED']);

        return response()->json($listing);
    }

    public function detailBySlug(Request $request)
    {
        $slug = $request->query('slug');
        $listing = Listing::with(['category', 'photos', 'user.profile'])
            ->where('slug', $slug)
            ->firstOrFail();

        $listing->increment('views_count');

        return response()->json($listing);
    }

    public function dashboardStats(Request $request)
    {
        $user = auth('sanctum')->user() ?: $request->user();
        
        if (!$user) {
            return response()->json([
                'listingCount' => 0,
                'favoritesCount' => 0,
                'viewsCount' => 0,
                'messagesCount' => 0,
            ]);
        }

        return response()->json([
            'listingCount' => $user->listings()->count(),
            'favoritesCount' => $user->favorites()->count(),
            'viewsCount' => (int) $user->listings()->sum('views_count'),
            'messagesCount' => Message::whereHas('conversation', function($q) use ($user) {
                $q->whereHas('participants', function($pq) use ($user) {
                    $pq->where('user_id', $user->id);
                });
            })->where('sender_id', '!=', $user->id)->where('is_read', false)->count(),
        ]);
    }

    public function show($id)
    {
        // Many frontend calls use ID instead of slug in detail
        $listing = Listing::with(['category', 'photos', 'user.profile'])
            ->find($id);
            
        if (!$listing) {
            // fallback to slug if not found by ID
            $listing = Listing::with(['category', 'photos', 'user.profile'])
                ->where('slug', $id)
                ->firstOrFail();
        }

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
            'is_negotiable' => 'nullable',
            'extra_attributes' => 'nullable|string',
            'uploaded_photos' => 'nullable|array',
            'uploaded_photos.*' => 'image|mimes:jpeg,png,jpg,webp|max:10240',
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
            'is_negotiable' => $request->boolean('is_negotiable'),
            'extra_attributes' => $request->has('extra_attributes') ? json_decode($request->extra_attributes, true) : null,
            'status' => 'ACTIVE',
        ]);

        if ($request->hasFile('uploaded_photos')) {
            foreach ($request->file('uploaded_photos') as $index => $photo) {
                $path = $photo->store('listings', 'public');
                $listing->photos()->create([
                    'image_path' => $path,
                    'is_cover' => $index === 0,
                ]);
            }
        }

        return response()->json($listing->load('photos'), 201);
    }

    public function update(Request $request, $id)
    {
        $listing = Listing::findOrFail($id);

        if ($listing->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Action non autorisée'], 403);
        }

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'category_id' => 'sometimes|required|exists:categories,id',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric',
            'city' => 'sometimes|required|string',
            'region' => 'sometimes|required|string',
            'condition' => 'sometimes|required|string',
            'status' => 'sometimes|string',
            'is_negotiable' => 'nullable',
            'extra_attributes' => 'nullable|string',
            'uploaded_photos' => 'nullable|array',
            'uploaded_photos.*' => 'image|mimes:jpeg,png,jpg,webp|max:10240',
            'deleted_photos' => 'nullable|array',
        ]);

        $updateData = $request->only([
            'title', 'category_id', 'description', 'price', 
            'city', 'region', 'condition', 'status'
        ]);

        if ($request->has('is_negotiable')) {
            $updateData['is_negotiable'] = $request->boolean('is_negotiable');
        }

        if ($request->has('extra_attributes')) {
            $updateData['extra_attributes'] = json_decode($request->extra_attributes, true);
        }

        $listing->update($updateData);

        // Handle deleted photos
        if ($request->has('deleted_photos')) {
            $listing->photos()->whereIn('id', $request->deleted_photos)->delete();
        }

        // Handle new photos
        if ($request->hasFile('uploaded_photos')) {
            foreach ($request->file('uploaded_photos') as $photo) {
                $path = $photo->store('listings', 'public');
                $listing->photos()->create([
                    'image_path' => $path,
                    'is_cover' => false,
                ]);
            }
        }

        return response()->json($listing->load('photos'));
    }

    public function adminAll()
    {
        $user = auth('sanctum')->user();
        if (!$user || $user->role !== 'ADMIN') {
            return response()->json(['error' => 'Accès interdit'], 403);
        }

        $listings = Listing::with(['category', 'photos', 'user.profile'])
            ->latest()
            ->get();

        return response()->json($listings);
    }

    public function adminStats()
    {
        $user = auth('sanctum')->user();
        if (!$user || $user->role !== 'ADMIN') {
            return response()->json(['error' => 'Accès interdit'], 403);
        }

        // KPIs
        $totalUsers = \App\Models\User::count();
        $activeListings = Listing::where('status', 'ACTIVE')->count();
        $totalMessages = \App\Models\Message::count();
        $totalRevenue = \App\Models\Boost::where('is_active', true)->count() * 5000; // Mock revenue logic

        // Top Villes
        $topVilles = Listing::select('city', \DB::raw('count(*) as count'))
            ->groupBy('city')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        // Listing Stats (Status mapping)
        $listingStats = Listing::select('status', \DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        // Top Sellers
        $topSellers = \App\Models\User::with(['profile', 'listings'])
            ->withCount('listings')
            ->orderByDesc('listings_count')
            ->limit(5)
            ->get()
            ->map(function($u) {
                return [
                    'full_name' => $u->profile->full_name ?? $u->email,
                    'avatar_url' => $u->profile->avatar,
                    'avatar_initials' => strtoupper(substr($u->profile->full_name ?? $u->email, 0, 2)),
                    'city' => $u->profile->city,
                    'sales' => $u->listings()->where('status', 'SOLD')->count(),
                    'listings' => $u->listings_count,
                ];
            });

        // Monthly users (Last 6 months)
        $monthlyUsers = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $count = \App\Models\User::whereMonth('created_at', $month->month)
                ->whereYear('created_at', $month->year)
                ->count();
            $monthlyUsers[] = $count;
        }

        return response()->json([
            'kpis' => [
                'total_users' => $totalUsers,
                'active_listings' => $activeListings,
                'total_messages' => $totalMessages,
                'total_revenue' => $totalRevenue,
            ],
            'top_villes' => $topVilles,
            'listing_stats' => $listingStats,
            'top_sellers' => $topSellers,
            'monthly_users' => $monthlyUsers,
        ]);
    }
}
