// ============================================
// CHEZ-BEN2 - API Helpers (Django Backend)
// ============================================

import type {
    Profile,
    Annonce,
    AnnonceWithRelations,
    AnnonceCard,
    Category,
    SearchParams,
    PaginatedResponse,
    UserRole,
} from '@/types';

import { fetchApi } from '@/lib/api-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Formater l'URL de l'image pour le backend (Django ou Laravel)
 */
export function formatImageUrl(url: string | null | undefined): string {
    // Return placeholder if url is null, undefined, or empty string (even with whitespace)
    if (!url || (typeof url === 'string' && url.trim() === '')) {
        return '/images/placeholders/car.png';
    }

    // If it's already a full URL, return it
    if (url.startsWith('http')) return url;

    // If it's a data URL (base64 preview), return it
    if (url.startsWith('data:')) return url;

    let baseDomain = 'http://localhost:8000';
    try {
        const urlObj = new URL(API_URL);
        baseDomain = `${urlObj.protocol}//${urlObj.host}`;
    } catch (e) {
        if (API_URL.includes('/api/v1')) {
            baseDomain = API_URL.split('/api/v1')[0];
        } else {
            baseDomain = API_URL;
        }
    }

    // Supprimer le slash final si présent
    if (baseDomain.endsWith('/')) {
        baseDomain = baseDomain.slice(0, -1);
    }

    // Gestion de la transition Django -> Laravel
    let cleanPath = url;
    if (!url.startsWith('/media/') && !url.startsWith('/storage/') && !url.startsWith('media/') && !url.startsWith('storage/')) {
        cleanPath = `/storage/${url.startsWith('/') ? url.slice(1) : url}`;
    } else {
        cleanPath = url.startsWith('/') ? url : `/${url}`;
    }

    return `${baseDomain}${cleanPath}`;
}

// ============================================
// Auth Helpers
// ============================================

/**
 * Inscription avec email et mot de passe
 */
export async function signUpWithEmail(
    email: string,
    password: string,
    fullName: string,
    role: string = 'USER'
) {
    try {
        const response = await fetchApi<any>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
                full_name: fullName,
                role,
            }),
        });

        return { success: true, data: response };
    } catch (error: any) {
        console.error('[API] signUpWithEmail error:', error);
        throw error;
    }
}

/**
 * Connexion avec email et mot de passe
 */
export async function signInWithEmail(email: string, password: string) {
    try {
        const response = await fetchApi<{ access: string; refresh: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (typeof window !== 'undefined') {
            localStorage.setItem('chezben2_token', response.access);
            localStorage.setItem('chezben2_refresh_token', response.refresh);
        }

        const profile = await getCurrentProfile();

        if (profile && typeof window !== 'undefined') {
            localStorage.setItem('chezben2_user_id', profile.id.toString());
        }

        return { user: profile, session: response };
    } catch (error: any) {
        console.error('[API] signInWithEmail error:', error);
        throw error;
    }
}

/**
 * Déconnexion
 */
export async function signOut() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('chezben2_token');
        localStorage.removeItem('chezben2_refresh_token');
    }
}

/**
 * Récupérer le profil de l'utilisateur connecté
 */
export async function getCurrentProfile(): Promise<Profile | null> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('chezben2_token') : null;
    if (!token) return null;

    try {
        const userData = await fetchApi<any>('/auth/me');

        // Map Django user + profile to frontend Profile type
        return {
            id: userData.id,
            email: userData.email,
            full_name: userData.profile?.full_name || '',
            username: userData.profile?.username || '',
            role: userData.role,
            avatar_url: formatImageUrl(userData.profile?.avatar),
            cover_url: formatImageUrl(userData.profile?.cover_image),
            phone: userData.profile?.phone,
            whatsapp: userData.profile?.whatsapp_number,
            facebook: userData.profile?.facebook_url,
            instagram: userData.profile?.instagram_url,
            website: userData.profile?.website_url,
            experience: userData.profile?.experience_years || 0,
            city: userData.profile?.city,
            region: userData.profile?.region,
            address: userData.profile?.address,
            bio: userData.profile?.bio,
            is_verified: userData.profile?.is_verified || false,
            notification_email: userData.profile?.notification_email ?? true,
            notification_push: userData.profile?.notification_push ?? true,
            notification_sms: userData.profile?.notification_sms ?? false,
            latitude: userData.profile?.latitude,
            longitude: userData.profile?.longitude,
            created_at: userData.date_joined,
            status: 'ACTIF',
            trust_score: 100,
            annonces_count: 0,
            ventes_count: 0,
        } as any;
    } catch (error) {
        console.error('[API] getCurrentProfile error:', error);
        // If 401/403, might be better to clear token
        return null;
    }
}

/**
 * Récupérer le profil public d'un utilisateur
 */
export async function getPublicProfile(userId: string): Promise<Profile | null> {
    try {
        const userData = await fetchApi<any>(`/auth/${userId}/`);

        return {
            id: userData.id,
            email: "", // Don't expose email publicly
            full_name: userData.profile?.full_name || 'Utilisateur',
            username: userData.profile?.username || '',
            role: 'USER',
            avatar_url: formatImageUrl(userData.profile?.avatar),
            cover_url: formatImageUrl(userData.profile?.cover_image),
            phone: userData.profile?.phone,
            whatsapp: userData.profile?.whatsapp_number,
            facebook: userData.profile?.facebook_url,
            instagram: userData.profile?.instagram_url,
            website: userData.profile?.website_url,
            experience: userData.profile?.experience_years || 0,
            city: userData.profile?.city,
            region: userData.profile?.region,
            address: userData.profile?.address,
            bio: userData.profile?.bio,
            is_verified: userData.profile?.is_verified || false,
            notification_email: userData.profile?.notification_email ?? true,
            notification_push: userData.profile?.notification_push ?? true,
            notification_sms: userData.profile?.notification_sms ?? false,
            created_at: userData.date_joined,
            status: 'ACTIF',
            trust_score: 100,
            annonces_count: 0, // Should be fetched separately or added to API
            ventes_count: 0,
        } as any;
    } catch (error) {
        console.error('[API] getPublicProfile error:', error);
        return null;
    }
}

/**
 * Mettre à jour le profil via l'API Django
 */
export async function updateProfile(updates: any) {
    try {
        const hasFiles = updates.avatar_url instanceof File || updates.cover_url instanceof File;

        if (hasFiles) {
            const formData = new FormData();
            formData.append('_method', 'PATCH');
            formData.append('full_name', updates.full_name || '');
            formData.append('username', updates.username || '');
            formData.append('phone', updates.phone || '');
            formData.append('city', updates.city || '');
            formData.append('region', updates.region || '');
            formData.append('address', updates.address || '');
            formData.append('bio', updates.bio || '');
            formData.append('whatsapp_number', updates.whatsapp || '');
            formData.append('facebook_url', updates.facebook || '');
            formData.append('instagram_url', updates.instagram || '');
            formData.append('website_url', updates.website || '');
            formData.append('experience_years', (updates.experience || 0).toString());

            formData.append('notification_email', updates.notification_email ? 'true' : 'false');
            formData.append('notification_push', updates.notification_push ? 'true' : 'false');
            formData.append('notification_sms', updates.notification_sms ? 'true' : 'false');

            if (updates.latitude !== undefined && updates.latitude !== null) {
                formData.append('latitude', updates.latitude.toString());
            }
            if (updates.longitude !== undefined && updates.longitude !== null) {
                formData.append('longitude', updates.longitude.toString());
            }

            if (updates.avatar_url instanceof File) {
                formData.append('avatar', updates.avatar_url);
            }
            if (updates.cover_url instanceof File) {
                formData.append('cover_image', updates.cover_url);
            }

            return await fetchApi<any>('/auth/me', {
                method: 'POST', // Laravel handling for multipart PATCH
                body: formData,
            });
        }

        // Prepare data for flat update
        const djangoData = {
            ...updates,
            whatsapp_number: updates.whatsapp,
            facebook_url: updates.facebook,
            instagram_url: updates.instagram,
            website_url: updates.website,
            experience_years: updates.experience,
        };

        return await fetchApi<any>('/auth/me', {
            method: 'PATCH',
            body: JSON.stringify(djangoData),
        });
    } catch (error) {
        console.error('[API] updateProfile error:', error);
        throw error;
    }
}

/**
 * Créer une annonce réelle sur le backend Django
 */
export async function createAnnonce(data: any, files: File[]) {
    try {
        const formData = new FormData();

        // Append basic fields
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('price', data.price.toString());
        formData.append('category_id', data.categoryId);
        formData.append('city', data.city);
        formData.append('region', data.region);

        // MAPPING: etat -> condition, priceNegotiable -> is_negotiable
        formData.append('condition', data.etat || data.condition || 'OCCASION');
        formData.append('is_negotiable', data.priceNegotiable ? 'true' : 'false');
        formData.append('status', 'ACTIVE');

        // MAPPING: attributes -> extra_attributes (JSON string for FormData)
        if (data.attributes && Object.keys(data.attributes).length > 0) {
            formData.append('extra_attributes', JSON.stringify(data.attributes));
        }

        // Append files
        files.forEach((file) => {
            formData.append('uploaded_photos[]', file);
        });

        return await fetchApi<any>('/listings', {
            method: 'POST',
            body: formData,
        });
    } catch (error) {
        console.error('[API] createAnnonce error:', error);
        throw error;
    }
}

/**
 * Mettre à jour une annonce réelle sur le backend Django
 */
export async function updateAnnonce(id: string, data: any, files: File[]) {
    try {
        const formData = new FormData();

        // Append basic fields if provided
        if (data.title) formData.append('title', data.title);
        if (data.description) formData.append('description', data.description);
        if (data.price) formData.append('price', data.price.toString());
        if (data.categoryId) formData.append('category_id', data.categoryId);
        if (data.city) formData.append('city', data.city);
        if (data.region) formData.append('region', data.region);

        // MAPPING: etat -> condition, priceNegotiable -> is_negotiable
        if (data.etat || data.condition) formData.append('condition', data.etat || data.condition);
        if (data.priceNegotiable !== undefined) formData.append('is_negotiable', data.priceNegotiable ? 'true' : 'false');

        // Handle status if provided
        if (data.status) formData.append('status', data.status);

        // MAPPING: attributes -> extra_attributes (JSON string for FormData)
        if (data.attributes && Object.keys(data.attributes).length > 0) {
            formData.append('extra_attributes', JSON.stringify(data.attributes));
        }

        // Append new files
        if (files && files.length > 0) {
            files.forEach((file) => {
                formData.append('uploaded_photos[]', file);
            });
        }

        // Laravel requirement: multipart/form-data + PATCH doesn't work well
        // We use POST + _method: PATCH
        formData.append('_method', 'PATCH');

        return await fetchApi<any>(`/listings/${id}`, {
            method: 'POST',
            body: formData,
        });
    } catch (error) {
        console.error('[API] updateAnnonce error:', error);
        throw error;
    }
}

/**
 * Changer le mot de passe (si connecté)
 */
export async function changePassword(oldPassword: string, newPassword: string) {
    try {
        return await fetchApi<any>('/auth/change-password/', {
            method: 'POST',
            body: JSON.stringify({
                old_password: oldPassword,
                new_password: newPassword,
            }),
        });
    } catch (error: any) {
        console.error('[API] changePassword error:', error);
        throw error;
    }
}

/**
 * Demander un code de réinitialisation de mot de passe
 */
export async function requestPasswordReset(email: string) {
    try {
        return await fetchApi<any>('/auth/password-reset', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    } catch (error: any) {
        console.error('[API] requestPasswordReset error:', error);
        throw error;
    }
}

/**
 * Confirmer la réinitialisation avec le code reçu et le nouveau mot de passe
 */
export async function confirmPasswordReset(email: string, code: string, newPassword: string) {
    try {
        return await fetchApi<any>('/auth/password-reset/confirm', {
            method: 'POST',
            body: JSON.stringify({
                email,
                code,
                new_password: newPassword,
            }),
        });
    } catch (error: any) {
        console.error('[API] confirmPasswordReset error:', error);
        throw error;
    }
}

// ============================================
// Annonces Helpers
// ============================================

/**
 * Récupérer les annonces avec pagination et filtres
 */
export async function getAnnonces(
    params: SearchParams = {}
): Promise<PaginatedResponse<AnnonceCard>> {
    try {
        const queryParams = new URLSearchParams();
        if (params.query) queryParams.set('search', params.query);
        if (params.category_id) {
            // If it's a number, it's an ID, otherwise it's a slug
            if (/^\d+$/.test(params.category_id.toString())) {
                queryParams.set('category', params.category_id.toString());
            } else {
                queryParams.set('category__slug', params.category_id.toString());
            }
        }
        if (params.city) queryParams.set('city', params.city);
        if (params.page) queryParams.set('page', params.page.toString());
        if (params.user_id) queryParams.set('user', params.user_id);

        console.log('[API] Fetching annonces with params:', params);
        const response = await fetchApi<any>(`/listings?${queryParams.toString()}`);

        const results = Array.isArray(response) ? response : (response.results || []);
        const total = response.count || results.length;

        console.log(`[API] Found ${results.length} listings`);

        return {
            data: results.map((item: any) => ({
                id: item.id,
                title: item.title,
                slug: item.slug,
                price: parseFloat(item.price),
                city: item.city,
                region: item.region,
                cover_image: formatImageUrl(item.photos?.find((p: any) => p.is_cover)?.image || item.photos?.[0]?.image || null),
                created_at: item.created_at,
                views_count: item.views_count,
                is_urgent: item.is_urgent || false,
                is_featured: item.is_featured || false,
                etat: item.condition,
                statut: item.status,
                user: {
                    id: item.user?.id,
                    full_name: item.user?.profile?.full_name || 'Utilisateur',
                    avatar_url: formatImageUrl(item.user?.profile?.avatar),
                    is_verified: item.user?.profile?.is_verified || false,
                },
                category: {
                    id: item.category?.id,
                    name: item.category?.name,
                    slug: item.category?.slug,
                }
            })),
            pagination: {
                total,
                page: params.page || 1,
                limit: 20,
                total_pages: Math.ceil(total / 20),
                has_next: !!response.next,
                has_prev: !!response.previous,
            }
        } as any;
    } catch (error) {
        console.error('[API] getAnnonces error:', error);
        return { data: [], pagination: { total: 0 } } as any;
    }
}

/**
 * Récupérer les annonces de l'utilisateur connecté
 */
export async function getUserListings(): Promise<AnnonceCard[]> {
    try {
        console.log('[API] Fetching user listings...');
        const response = await fetchApi<any>('/listings?my_listings=true');
        const results = Array.isArray(response) ? response : (response.results || []);

        console.log(`[API] Found ${results.length} user listings`);

        return results.map((item: any) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            price: parseFloat(item.price),
            city: item.city,
            region: item.region,
            cover_image: formatImageUrl(item.photos?.find((p: any) => p.is_cover)?.image || item.photos?.[0]?.image || null),
            created_at: item.created_at,
            views_count: item.views_count,
            statut: item.status,
            etat: item.condition,
            user: {
                id: item.user?.id,
                full_name: item.user?.profile?.full_name || 'Utilisateur',
                avatar_url: formatImageUrl(item.user?.profile?.avatar),
            },
            category: {
                id: item.category?.id,
                name: item.category?.name,
                slug: item.category?.slug,
            }
        })) as any;
    } catch (error) {
        console.error('[API] getUserListings error:', error);
        return [];
    }
}

/**
 * Récupérer une annonce par slug
 */
export async function getAnnonceBySlug(slug: string): Promise<AnnonceWithRelations | null> {
    try {
        const item = await fetchApi<any>(`/listings/detail_by_slug?slug=${slug}`);

        if (!item) return null;

        return {
            ...item,
            id: item.id,
            category_id: item.category?.id,
            cover_image: formatImageUrl(item.photos?.find((p: any) => p.is_cover)?.image || item.photos?.[0]?.image || null),
            photos: item.photos?.map((p: any) => ({ url: formatImageUrl(p.image), is_cover: p.is_cover })),
            user: {
                ...item.user?.profile,
                id: item.user?.id,
                email: item.user?.email,
                avatar_url: formatImageUrl(item.user?.profile?.avatar),
            }
        } as any;
    } catch (error) {
        console.error('[API] getAnnonceBySlug error:', error);
        return null;
    }
}

/**
 * Récupérer une annonce par ID
 */
export async function getAnnonceById(id: string): Promise<AnnonceWithRelations | null> {
    try {
        const item = await fetchApi<any>(`/listings/${id}`);

        if (!item) return null;

        return {
            ...item,
            id: item.id,
            category_id: item.category?.id,
            cover_image: formatImageUrl(item.photos?.find((p: any) => p.is_cover)?.image || item.photos?.[0]?.image || null),
            photos: item.photos?.map((p: any) => ({ url: formatImageUrl(p.image), is_cover: p.is_cover })),
            user: {
                ...item.user?.profile,
                id: item.user?.id,
                email: item.user?.email,
                avatar_url: formatImageUrl(item.user?.profile?.avatar),
            }
        } as any;
    } catch (error) {
        console.error('[API] getAnnonceById error:', error);
        return null;
    }
}

/**
 * Récupérer toutes les catégories actives
 */
export async function getCategories(): Promise<Category[]> {
    try {
        const response = await fetchApi<any>('/listings/categories');
        return Array.isArray(response) ? response : (response.results || []);
    } catch (error) {
        console.error('[API] getCategories error:', error);
        return [];
    }
}

// ============================================
// Notifications Helpers
// ============================================

/**
 * Récupérer le nombre de notifications non lues
 */
export async function getUnreadNotificationsCount(): Promise<number> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('chezben2_token') : null;
    if (!token || token === 'undefined' || token === 'null') return 0;

    try {
        const response = await fetchApi<any>('/notifications/?unread=true');
        // Handle both paginated results and direct arrays
        if (response.count !== undefined) return response.count;
        if (Array.isArray(response)) return response.length;
        if (response.results && Array.isArray(response.results)) return response.results.length;
        return 0;
    } catch (error) {
        return 0;
    }
}

/**
 * Récupérer toutes les notifications
 */
export async function getNotifications(): Promise<any[]> {
    try {
        const response = await fetchApi<any>('/notifications');
        return Array.isArray(response) ? response : (response.results || []);
    } catch (error) {
        console.error('[API] getNotifications error:', error);
        return [];
    }
}

/**
 * Marquer une notification comme lue
 */
export async function markNotificationAsRead(id: string) {
    try {
        return await fetchApi<any>(`/notifications/${id}/mark_as_read`, {
            method: 'POST',
        });
    } catch (error) {
        console.error('[API] markNotificationAsRead error:', error);
        throw error;
    }
}

/**
 * Supprimer une notification
 */
export async function deleteNotificationDetail(id: string) {
    try {
        return await fetchApi<any>(`/notifications/${id}/`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('[API] deleteNotification error:', error);
        throw error;
    }
}

// ============================================
// Dashboard Stats Helpers
// ============================================

/**
 * Récupérer les statistiques du tableau de bord
 */
export async function getDashboardStats() {
    try {
        return await fetchApi<any>('/listings/dashboard-stats/');
    } catch (error) {
        return {
            listingCount: 0,
            favoritesCount: 0,
            viewsCount: 0,
            messagesCount: 0
        };
    }
}

/**
 * Récupérer les statistiques administratives (REAL DATA)
 */
export async function getAdminStats() {
    try {
        return await fetchApi<any>('/listings/admin-stats/');
    } catch (error) {
        console.error('[API] getAdminStats error:', error);
        return {
            kpis: {
                total_users: 0,
                active_listings: 0,
                total_messages: 0,
                total_revenue: 0,
            },
            top_villes: [],
            listing_stats: [],
            top_sellers: []
        };
    }
}

/**
 * Récupérer les favoris de l'utilisateur
 */
export async function getFavorites(): Promise<AnnonceCard[]> {
    try {
        const response = await fetchApi<any>('/profile/favorites');
        const results = Array.isArray(response) ? response : (response.results || []);

        return results.map((fav: any) => {
            const item = fav.listing_detail;
            if (!item) return null;
            return {
                id: item.id || fav.listing,
                title: item.title,
                slug: item.slug,
                price: parseFloat(item.price),
                price_negotiable: item.is_negotiable || false,
                city: item.city,
                region: item.region,
                // Properly format the cover image URL
                cover_image: formatImageUrl(
                    item.photos?.find((p: any) => p.is_cover)?.image ||
                    item.photos?.[0]?.image ||
                    null
                ),
                created_at: item.created_at,
                views_count: item.views_count || 0,
                favorites_count: 0,
                is_urgent: item.is_urgent || false,
                is_featured: item.is_featured || false,
                etat: item.condition,
                statut: item.status,
                user: {
                    id: item.user?.id,
                    full_name: item.user?.profile?.full_name || 'Utilisateur',
                    avatar_url: formatImageUrl(item.user?.profile?.avatar),
                    is_verified: item.user?.profile?.is_verified || false,
                },
                category: {
                    id: item.category?.id,
                    name: item.category?.name,
                    slug: item.category?.slug,
                },
                fav_id: fav.id,
            };
        }).filter(Boolean) as AnnonceCard[];
    } catch (error) {
        console.error('[API] getFavorites error:', error);
        return [];
    }
}

/**
 * Ajouter/Supprimer un favori (Toggle)
 */
export async function toggleFavorite(listingId: string) {
    try {
        return await fetchApi<any>('/listings/favorites/', {
            method: 'POST',
            body: JSON.stringify({ listing: listingId }),
        });
    } catch (error) {
        console.error('[API] toggleFavorite error:', error);
        throw error;
    }
}

/**
 * Supprimer une annonce
 */
export async function deleteListing(listingId: string) {
    try {
        return await fetchApi<any>(`/listings/${listingId}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('[API] deleteListing error:', error);
        throw error;
    }
}

// ============================================
// Messaging Helpers
// ============================================

/**
 * Récupérer les conversations de l'utilisateur
 */
export async function getConversations() {
    try {
        const response = await fetchApi<any>('/messaging/conversations');
        const results = Array.isArray(response) ? response : (response.results || []);

        return results.map((conv: any) => {
            // Identifier l'autre participant
            const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('chezben2_user_id') : null;
            const otherUser = conv.participants?.find((p: any) => p.id?.toString() !== currentUserId) || conv.participants?.[0];

            return {
                id: conv.id,
                listing: conv.listing ? {
                    ...conv.listing,
                    cover_image: formatImageUrl(conv.listing.photos?.find((p: any) => p.is_cover)?.image_path || conv.listing.photos?.[0]?.image_path || null)
                } : null,
                otherUser: {
                    id: otherUser?.id,
                    full_name: otherUser?.profile?.full_name || 'Utilisateur',
                    avatar_url: formatImageUrl(otherUser?.profile?.avatar),
                },
                last_message_preview: conv.last_message?.content || 'Pas encore de message',
                last_message_at: conv.last_message?.created_at || conv.updated_at,
            };
        });
    } catch (error) {
        console.error('[API] getConversations error:', error);
        return [];
    }
}

/**
 * Récupérer une conversation par ID
 */
export async function getConversation(conversationId: string) {
    try {
        const conv = await fetchApi<any>(`/messaging/conversations/${conversationId}`);

        // Identifier l'autre participant
        const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('chezben2_user_id') : null;
        const otherUser = conv.participants?.find((p: any) => p.id?.toString() !== currentUserId) || conv.participants?.[0];

        return {
            id: conv.id,
            listing: conv.listing ? {
                ...conv.listing,
                cover_image: formatImageUrl(conv.listing.photos?.find((p: any) => p.is_cover)?.image_path || conv.listing.photos?.[0]?.image_path || null)
            } : null,
            otherUser: {
                id: otherUser?.id,
                full_name: otherUser?.profile?.full_name || 'Utilisateur',
                avatar_url: formatImageUrl(otherUser?.profile?.avatar),
            },
            last_message_preview: conv.last_message?.content || 'Pas encore de message',
            last_message_at: conv.last_message?.created_at || conv.updated_at,
        };
    } catch (error) {
        console.error('[API] getConversation error:', error);
        return null;
    }
}

/**
 * Récupérer les messages d'une conversation
 */
export async function getMessages(conversationId: string) {
    try {
        const response = await fetchApi<any>(`/messaging/conversations/${conversationId}/messages`);
        const messages = Array.isArray(response) ? response : (response.results || []);

        return messages.map((msg: any) => ({
            ...msg,
            sender: {
                ...msg.sender,
                full_name: msg.sender?.profile?.full_name || 'Utilisateur',
                avatar_url: formatImageUrl(msg.sender?.profile?.avatar),
            }
        }));
    } catch (error) {
        console.error('[API] getMessages error:', error);
        return [];
    }
}

/**
 * Envoyer un message dans une conversation
 */
export async function sendMessage(conversationId: string, content: string) {
    try {
        return await fetchApi<any>(`/messaging/conversations/${conversationId}/send_message`, {
            method: 'POST',
            body: JSON.stringify({ content }),
        });
    } catch (error) {
        console.error('[API] sendMessage error:', error);
        throw error;
    }
}

/**
 * Récupérer le nombre de messages non lus
 */
export async function getUnreadMessagesCount(): Promise<number> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('chezben2_token') : null;
    if (!token || token === 'undefined' || token === 'null') return 0;

    try {
        const response = await fetchApi<any>('/messaging/conversations/unread_count');
        return response.unread_count || 0;
    } catch (error) {
        return 0;
    }
}

/**
 * Créer une nouvelle conversation pour une annonce ET envoyer le premier message.
 * Le backend déduit automatiquement le destinataire (propriétaire de l'annonce).
 */
export async function createConversation(
    annonceId: string,
    content: string,
    recipientId?: string
): Promise<{ conversation: any; message: any }> {
    const body: any = {
        listing_id: annonceId,
        content,
    };
    if (recipientId) {
        body.recipient_id = recipientId;
    }
    return await fetchApi<any>('/messaging/messages', {
        method: 'POST',
        body: JSON.stringify(body),
    });
}

/**
 * Supprimer une conversation
 */
export async function deleteConversation(conversationId: string) {
    try {
        return await fetchApi<any>(`/messaging/conversations/${conversationId}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('[API] deleteConversation error:', error);
        throw error;
    }
}

// ============================================
// Utility Helpers
// ============================================

/**
 * Créer un boost pour des annonces
 */
export async function createBoost(data: {
    annonceIds: string[];
    duration: number;
    amount: number;
    paymentMethod: string;
    phoneNumber: string;
    category: string;
}) {
    try {
        return await fetchApi<any>('/listings/boost/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('[API] createBoost error:', error);
        throw error;
    }
}

/**
 * Récupérer les produits utilisateur par catégorie
 */
export async function getUserProductsByCategory(categorySlug: string) {
    try {
        const response = await fetchApi<any>(`/listings/?my_listings=true&category_slug=${categorySlug}`);
        const results = Array.isArray(response) ? response : (response.results || []);

        // Filter frontend side if backend filter not strict enough
        // Note: backend filter needs implementation or just filter here
        // Current backend 'my_listings' returns all.
        // We'll trust backend to add filtering later or filter here if needed.
        // For MVP, if backend doesn't support category_slug filter on my_listings list, we might get all.
        // Let's assume we filter here for safety.
        return results.filter((item: any) => !categorySlug || item.category?.slug === categorySlug).map((item: any) => ({
            id: item.id,
            title: item.title,
            price: parseFloat(item.price),
            cover_image: formatImageUrl(item.photos?.find((p: any) => p.is_cover)?.image || item.photos?.[0]?.image || null),
            is_featured: item.is_featured,
        }));
    } catch (error) {
        console.error('[API] getUserProductsByCategory error:', error);
        return [];
    }
}

// ============================================
// Admin & Moderation Helpers
// ============================================

/**
 * Récupérer toutes les annonces (Admin)
 */
export async function getAdminAllListings() {
    try {
        const response = await fetchApi<any>('/listings/admin-all');
        const results = Array.isArray(response) ? response : (response.results || []);

        return results.map((item: any) => ({
            ...item,
            cover_image: formatImageUrl(item.photos?.find((p: any) => p.is_cover)?.image || item.photos?.[0]?.image || null),
            user_name: item.user?.profile?.full_name || item.user?.email || 'Utilisateur',
            category_name: item.category?.name || 'Divers'
        }));
    } catch (error) {
        console.error('[API] getAdminAllListings error:', error);
        return [];
    }
}

/**
 * Récupérer les annonces pour modération
 */
export async function getModerationListings() {
    try {
        const response = await fetchApi<any>('/listings/?status=PENDING');
        const results = Array.isArray(response) ? response : (response.results || []);

        return results.map((item: any) => ({
            ...item,
            cover_image: formatImageUrl(item.photos?.find((p: any) => p.is_cover)?.image || item.photos?.[0]?.image || null),
            user_name: item.user?.profile?.full_name || 'Utilisateur',
            category_name: item.category?.name || 'Divers'
        }));
    } catch (error) {
        console.error('[API] getModerationListings error:', error);
        return [];
    }
}

/**
 * Approver une annonce
 */
export async function approveListing(id: string) {
    try {
        return await fetchApi<any>(`/listings/${id}/approve`, { method: 'POST' });
    } catch (error) {
        console.error('[API] approveListing error:', error);
        throw error;
    }
}

/**
 * Rejeter une annonce
 */
export async function rejectListing(id: string) {
    try {
        return await fetchApi<any>(`/listings/${id}/reject`, { method: 'POST' });
    } catch (error) {
        console.error('[API] rejectListing error:', error);
        throw error;
    }
}

/**
 * Récupérer toutes les catégories pour l'admin
 */
export async function getAdminCategories() {
    try {
        const response = await fetchApi<any>('/listings/categories');
        return Array.isArray(response) ? response : (response.results || []);
    } catch (error) {
        console.error('[API] getAdminCategories error:', error);
        return [];
    }
}

/**
 * Créer une catégorie
 */
export async function createCategory(data: any) {
    try {
        return await fetchApi<any>('/listings/categories', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('[API] createCategory error:', error);
        throw error;
    }
}

/**
 * Mettre à jour une catégorie
 */
export async function updateCategory(id: string, data: any) {
    try {
        return await fetchApi<any>(`/listings/categories/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('[API] updateCategory error:', error);
        throw error;
    }
}

/**
 * Supprimer une catégorie
 */
export async function deleteCategory(id: string) {
    try {
        return await fetchApi<any>(`/listings/categories/${id}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('[API] deleteCategory error:', error);
        throw error;
    }
}

/**
 * Récupérer tous les utilisateurs (Admin)
 */
export async function getAdminUsers() {
    try {
        const response = await fetchApi<any>('/auth/users');
        return Array.isArray(response) ? response : (response.results || []);
    } catch (error) {
        console.error('[API] getAdminUsers error:', error);
        return [];
    }
}

/**
 * Mettre à jour un utilisateur (Admin)
 */
export async function updateAdminUser(id: string, data: any) {
    try {
        return await fetchApi<any>(`/auth/users/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('[API] updateAdminUser error:', error);
        throw error;
    }
}

/**
 * Supprimer un utilisateur (Admin)
 */
export async function deleteAdminUser(id: string) {
    try {
        return await fetchApi<any>(`/auth/users/${id}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('[API] deleteAdminUser error:', error);
        throw error;
    }
}

/**
 * Récupérer les paramètres de la plateforme (Admin)
 */
export async function getPlatformSettings() {
    try {
        return await fetchApi<any>('/settings');
    } catch (error) {
        console.error('[API] getPlatformSettings error:', error);
        return null;
    }
}

/**
 * Mettre à jour les paramètres de la plateforme (Admin)
 */
export async function updatePlatformSettings(data: any) {
    try {
        return await fetchApi<any>('/settings', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('[API] updatePlatformSettings error:', error);
        throw error;
    }
}

/**
 * Récupérer les boosts (Admin)
 */
export async function getAdminBoosts() {
    try {
        const response = await fetchApi<any>('/listings/boost');
        return Array.isArray(response) ? response : (response.results || []);
    } catch (error) {
        console.error('[API] getAdminBoosts error:', error);
        return [];
    }
}

/**
 * Supprimer un boost (Admin)
 */
export async function deleteBoost(id: string) {
    try {
        return await fetchApi<any>(`/listings/boost/${id}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('[API] deleteBoost error:', error);
        throw error;
    }
}

/**
 * Envoyer une notification à tous les utilisateurs (Admin)
 */
export async function sendBroadcastNotification(data: { title: string, message: string, action_url?: string }) {
    try {
        return await fetchApi<any>('/notifications/broadcast', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('[API] sendBroadcastNotification error:', error);
        throw error;
    }
}

/**
 * Formater le prix en FCFA
 */
export function formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}


