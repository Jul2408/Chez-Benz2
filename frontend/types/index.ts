// ============================================
// CHEZ-BEN2 - Types Applicatifs
// ============================================

import type { Database } from './database.types';

// ============================================
// Types de base (extraits de la DB)
// ============================================

export type Profile = Database['public']['Tables']['profiles']['Row'] & {
    username?: string | null;
    avatar_url?: string | null;
    cover_url?: string | null;
    whatsapp?: string | null;
    facebook?: string | null;
    instagram?: string | null;
    website?: string | null;
    experience?: number;
    address?: string | null;
    credits?: number;
};
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Category = Database['public']['Tables']['categories']['Row'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
export type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

export type Annonce = Database['public']['Tables']['annonces']['Row'];
export type AnnonceInsert = Database['public']['Tables']['annonces']['Insert'];
export type AnnonceUpdate = Database['public']['Tables']['annonces']['Update'];

export type Photo = Database['public']['Tables']['photos']['Row'];
export type PhotoInsert = Database['public']['Tables']['photos']['Insert'];

export type Conversation = Database['public']['Tables']['conversations']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];

export type Favori = Database['public']['Tables']['favoris']['Row'];
export type Signalement = Database['public']['Tables']['signalements']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type RechercheSauvegardee = Database['public']['Tables']['recherches_sauvegardees']['Row'];

// ============================================
// Enums
// ============================================

export type UserRole = Database['public']['Enums']['user_role'];
export type UserStatus = Database['public']['Enums']['user_status'];
export type AnnonceEtat = Database['public']['Enums']['annonce_etat'];
export type AnnonceStatut = Database['public']['Enums']['annonce_statut'];
export type SignalementMotif = Database['public']['Enums']['signalement_motif'];
export type SignalementStatut = Database['public']['Enums']['signalement_statut'];
export type NotificationType = Database['public']['Enums']['notification_type'];
export type ConversationType = Database['public']['Enums']['conversation_type'];

// ============================================
// Types enrichis avec relations
// ============================================

/** Annonce avec ses relations */
export interface AnnonceWithRelations extends Annonce {
    user: Profile;
    category: Category;
    photos: Photo[];
    _count?: {
        favoris: number;
        messages: number;
    };
}

/** Annonce pour les cartes de liste */
export interface AnnonceCard {
    id: string;
    title: string;
    slug: string;
    price: number;
    price_negotiable: boolean;
    city: string;
    region: string;
    cover_image: string | null;
    etat: AnnonceEtat;
    statut: AnnonceStatut;
    is_featured: boolean;
    is_urgent: boolean;
    created_at: string;
    views_count: number;
    favorites_count: number;
    user: {
        id: string;
        full_name: string;
        avatar_url: string | null;
        is_verified: boolean;
    };
    category: {
        id: string;
        name: string;
        slug: string;
    };
}

/** Conversation avec messages et participants */
export interface ConversationWithDetails extends Conversation {
    buyer: Profile;
    seller: Profile;
    annonce: Annonce | null;
    messages: Message[];
}

/** Message avec expéditeur */
export interface MessageWithSender extends Message {
    sender: Profile;
}

/** Catégorie avec enfants */
export interface CategoryWithChildren extends Category {
    children: CategoryWithChildren[];
}

/** Profil utilisateur avec statistiques */
export interface ProfileWithStats extends Profile {
    annonces: Annonce[];
    _count?: {
        annonces: number;
        favoris: number;
    };
}

// ============================================
// Types pour les formulaires
// ============================================

export interface AnnonceFormData {
    title: string;
    description: string;
    category_id: string;
    price: number;
    price_negotiable: boolean;
    price_on_request: boolean;
    etat: AnnonceEtat;
    city: string;
    region: string;
    quartier?: string;
    address?: string;
    attributes?: Record<string, unknown>;
    photos: File[];
}

export interface ProfileFormData {
    full_name: string;
    username?: string;
    phone?: string;
    whatsapp?: string;
    facebook?: string;
    instagram?: string;
    website?: string;
    experience?: number;
    bio?: string;
    city?: string;
    region?: string;
    address?: string;
    notification_email: boolean;
    notification_push: boolean;
    notification_sms: boolean;
}

// ============================================
// Types pour la recherche et filtres
// ============================================

export interface SearchFilters {
    query?: string;
    category_id?: string;
    city?: string;
    region?: string;
    min_price?: number;
    max_price?: number;
    etat?: AnnonceEtat[];
    sort_by?: 'date' | 'price_asc' | 'price_desc' | 'relevance' | 'views';
    radius?: number;
    latitude?: number;
    longitude?: number;
    user_id?: string;
}

export interface SearchParams extends SearchFilters {
    page?: number;
    limit?: number;
}

// ============================================
// Types pour la pagination
// ============================================

export interface PaginationState {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationState;
}

// ============================================
// Types pour les réponses API
// ============================================

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    };
}

export interface ApiError {
    code: string;
    message: string;
    status: number;
}

// ============================================
// Constantes - Régions du Cameroun
// ============================================

export const CAMEROON_REGIONS = [
    'Adamaoua',
    'Centre',
    'Est',
    'Extrême-Nord',
    'Littoral',
    'Nord',
    'Nord-Ouest',
    'Ouest',
    'Sud',
    'Sud-Ouest',
] as const;

export type CameroonRegion = (typeof CAMEROON_REGIONS)[number];

export const MAJOR_CITIES: Record<CameroonRegion, string[]> = {
    'Adamaoua': ['Ngaoundéré', 'Meiganga', 'Tibati'],
    'Centre': ['Yaoundé', 'Mbalmayo', 'Obala', 'Bafia'],
    'Est': ['Bertoua', 'Batouri', 'Abong-Mbang'],
    'Extrême-Nord': ['Maroua', 'Kousseri', 'Mokolo', 'Mora'],
    'Littoral': ['Douala', 'Edéa', 'Nkongsamba', 'Loum'],
    'Nord': ['Garoua', 'Guider', 'Poli'],
    'Nord-Ouest': ['Bamenda', 'Kumbo', 'Ndop', 'Wum'],
    'Ouest': ['Bafoussam', 'Dschang', 'Mbouda', 'Foumban'],
    'Sud': ['Ebolowa', 'Kribi', 'Sangmélima'],
    'Sud-Ouest': ['Buea', 'Limbe', 'Kumba', 'Tiko'],
};

// ============================================
// Labels pour l'affichage
// ============================================

export const ETAT_LABELS: Record<AnnonceEtat, string> = {
    NEUF: 'Neuf',
    OCCASION: 'Occasion',
    RECONDITIONNE: 'Reconditionné',
};

export const STATUT_LABELS: Record<string, string> = {
    DRAFT: 'Brouillon',
    ACTIVE: 'Actif',
    SOLD: 'Vendu',
    ARCHIVED: 'Archivé',
};

export const ROLE_LABELS: Record<UserRole, string> = {
    USER: 'Utilisateur',
    MODERATOR: 'Modérateur',
    ADMIN: 'Administrateur',
    SUPER_ADMIN: 'Super Administrateur',
};

export const SIGNALEMENT_MOTIF_LABELS: Record<SignalementMotif, string> = {
    SPAM: 'Spam / Publicité',
    ARNAQUE: 'Arnaque suspectée',
    CONTENU_INAPPROPRIE: 'Contenu inapproprié',
    ANNONCE_DOUBLON: 'Annonce en double',
    FAUSSES_INFORMATIONS: 'Fausses informations',
    PRIX_SUSPECT: 'Prix suspect',
    PRODUIT_INTERDIT: 'Produit interdit',
    HARCELEMENT: 'Harcèlement',
    AUTRE: 'Autre',
};
