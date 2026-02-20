import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Profile, Annonce } from '@/types'; // Changed from @/types/supabase to @/types index

// ============================================
// Auth Store
// ============================================
interface AuthState {
    user: Profile | null;
    isLoading: boolean;
    setUser: (user: Profile | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,
    setUser: (user) => set({ user, isLoading: false }),
    setLoading: (isLoading) => set({ isLoading }),
    logout: () => set({ user: null, isLoading: false }),
}));

// ============================================
// Search Store (persisté)
// ============================================
interface SearchState {
    query: string;
    category: string;
    city: string;
    region: string;
    minPrice: number | null;
    maxPrice: number | null;
    condition: string[];
    sortBy: 'date' | 'price_asc' | 'price_desc' | 'relevance';
    setQuery: (query: string) => void;
    setCategory: (category: string) => void;
    setCity: (city: string) => void;
    setRegion: (region: string) => void;
    setPriceRange: (min: number | null, max: number | null) => void;
    setCondition: (condition: string[]) => void;
    setSortBy: (sort: 'date' | 'price_asc' | 'price_desc' | 'relevance') => void;
    resetFilters: () => void;
}

const initialSearchState = {
    query: '',
    category: '',
    city: '',
    region: '',
    minPrice: null,
    maxPrice: null,
    condition: [],
    sortBy: 'date' as const,
};

export const useSearchStore = create<SearchState>()(
    persist(
        (set) => ({
            ...initialSearchState,
            setQuery: (query) => set({ query }),
            setCategory: (category) => set({ category }),
            setCity: (city) => set({ city }),
            setRegion: (region) => set({ region }),
            setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice }),
            setCondition: (condition) => set({ condition }),
            setSortBy: (sortBy) => set({ sortBy }),
            resetFilters: () => set(initialSearchState),
        }),
        {
            name: 'chez-ben2-search',
            partialize: (state) => ({
                city: state.city,
                region: state.region,
            }),
        }
    )
);

// ============================================
// Favorites Store (persisté localement)
// ============================================
interface FavoritesState {
    favorites: string[];
    addFavorite: (listingId: string) => void;
    removeFavorite: (listingId: string) => void;
    toggleFavorite: (listingId: string) => void;
    isFavorite: (listingId: string) => boolean;
    clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favorites: [],
            addFavorite: (listingId) =>
                set((state) => ({
                    favorites: [...state.favorites, listingId],
                })),
            removeFavorite: (listingId) =>
                set((state) => ({
                    favorites: state.favorites.filter((id) => id !== listingId),
                })),
            toggleFavorite: (listingId) => {
                const { favorites } = get();
                if (favorites.includes(listingId)) {
                    set({ favorites: favorites.filter((id) => id !== listingId) });
                } else {
                    set({ favorites: [...favorites, listingId] });
                }
            },
            isFavorite: (listingId) => get().favorites.includes(listingId),
            clearFavorites: () => set({ favorites: [] }),
        }),
        {
            name: 'chez-ben2-favorites',
        }
    )
);

// ============================================
// UI Store
// ============================================
interface UIState {
    isSidebarOpen: boolean;
    isMobileMenuOpen: boolean;
    isSearchOpen: boolean;
    theme: 'light' | 'dark' | 'system';
    toggleSidebar: () => void;
    toggleMobileMenu: () => void;
    toggleSearch: () => void;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isSidebarOpen: true,
    isMobileMenuOpen: false,
    isSearchOpen: false,
    theme: 'system',
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
    toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
    setTheme: (theme) => set({ theme }),
    closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}));

// ============================================
// Notifications Store
// ============================================
interface NotificationsState {
    unreadCount: number;
    unreadMessages: number;
    setUnreadCount: (count: number) => void;
    setUnreadMessages: (count: number) => void;
    refresh: () => Promise<void>;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
    unreadCount: 0,
    unreadMessages: 0,
    setUnreadCount: (unreadCount) => set({ unreadCount }),
    setUnreadMessages: (unreadMessages) => set({ unreadMessages }),
    refresh: async () => {
        try {
            const { getUnreadNotificationsCount, getUnreadMessagesCount } = await import('@/utils/supabase-helpers');
            const [notifCount, msgCount] = await Promise.all([
                getUnreadNotificationsCount(),
                getUnreadMessagesCount()
            ]);
            set({ unreadCount: notifCount, unreadMessages: msgCount });
        } catch (error) {
            console.error('Error refreshing notifications in store:', error);
        }
    }
}));

// ============================================
// Listing Draft Store (pour sauvegarder le brouillon)
// ============================================
interface ListingDraftState {
    draft: Partial<Annonce> | null;
    setDraft: (draft: Partial<Annonce>) => void;
    updateDraft: (updates: Partial<Annonce>) => void;
    clearDraft: () => void;
}

export const useListingDraftStore = create<ListingDraftState>()(
    persist(
        (set) => ({
            draft: null,
            setDraft: (draft) => set({ draft }),
            updateDraft: (updates) =>
                set((state) => ({
                    draft: state.draft ? { ...state.draft, ...updates } : updates,
                })),
            clearDraft: () => set({ draft: null }),
        }),
        {
            name: 'chez-ben2-listing-draft',
        }
    )
);
