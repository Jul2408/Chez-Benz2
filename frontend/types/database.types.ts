// ============================================
// CHEZ-BEN2 - Types de base de données Supabase
// ============================================
// Généré automatiquement - Ne pas modifier manuellement
// Commande: npx supabase gen types typescript --local > types/database.types.ts
// ============================================

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    phone: string | null;
                    phone_verified: boolean;
                    full_name: string;
                    username: string | null;
                    avatar_url: string | null;
                    bio: string | null;
                    city: string | null;
                    region: string | null;
                    address: string | null;
                    latitude: number | null;
                    longitude: number | null;
                    role: Database['public']['Enums']['user_role'];
                    status: Database['public']['Enums']['user_status'];
                    is_verified: boolean;
                    verified_at: string | null;
                    trust_score: number;
                    annonces_count: number;
                    ventes_count: number;
                    notification_email: boolean;
                    notification_push: boolean;
                    notification_sms: boolean;
                    last_login_at: string | null;
                    last_login_ip: string | null;
                    banned_at: string | null;
                    banned_reason: string | null;
                    banned_by: string | null;
                    banned_until: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['profiles']['Row'],
                    'created_at' | 'updated_at' | 'phone_verified' | 'is_verified' |
                    'trust_score' | 'annonces_count' | 'ventes_count'> & {
                        created_at?: string;
                        updated_at?: string;
                        phone_verified?: boolean;
                        is_verified?: boolean;
                        trust_score?: number;
                        annonces_count?: number;
                        ventes_count?: number;
                    };
                Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
                Relationships: [];
            };
            categories: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    icon: string | null;
                    image: string | null;
                    color: string | null;
                    parent_id: string | null;
                    level: number;
                    path: string | null;
                    order: number;
                    is_active: boolean;
                    is_featured: boolean;
                    annonces_count: number;
                    meta_title: string | null;
                    meta_description: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['categories']['Row'],
                    'id' | 'created_at' | 'updated_at' | 'level' | 'annonces_count'> & {
                        id?: string;
                        created_at?: string;
                        updated_at?: string;
                        level?: number;
                        annonces_count?: number;
                    };
                Update: Partial<Database['public']['Tables']['categories']['Insert']>;
                Relationships: [];
            };
            annonces: {
                Row: {
                    id: string;
                    user_id: string;
                    category_id: string;
                    title: string;
                    slug: string;
                    description: string;
                    price: number;
                    price_negotiable: boolean;
                    price_on_request: boolean;
                    original_price: number | null;
                    currency: string;
                    etat: Database['public']['Enums']['annonce_etat'];
                    statut: Database['public']['Enums']['annonce_statut'];
                    city: string;
                    region: string;
                    quartier: string | null;
                    address: string | null;
                    latitude: number | null;
                    longitude: number | null;
                    cover_image: string | null;
                    attributes: Json | null;
                    views_count: number;
                    favorites_count: number;
                    messages_count: number;
                    shares_count: number;
                    is_featured: boolean;
                    featured_until: string | null;
                    is_urgent: boolean;
                    urgent_until: string | null;
                    boost_level: number;
                    is_edited: boolean;
                    rejection_reason: string | null;
                    moderated_by: string | null;
                    moderated_at: string | null;
                    published_at: string | null;
                    expires_at: string;
                    sold_at: string | null;
                    renewed_at: string | null;
                    renew_count: number;
                    created_at: string;
                    updated_at: string;
                    deleted_at: string | null;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    category_id: string;
                    title: string;
                    slug: string;
                    description: string;
                    price: number;
                    expires_at: string;
                    city: string;
                    region: string;
                    price_negotiable?: boolean;
                    price_on_request?: boolean;
                    etat?: Database['public']['Enums']['annonce_etat'];
                    statut?: Database['public']['Enums']['annonce_statut'];
                    [key: string]: unknown;
                };
                Update: Partial<Database['public']['Tables']['annonces']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "annonces_category_id_fkey";
                        columns: ["category_id"];
                        isOneToOne: false;
                        referencedRelation: "categories";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "annonces_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            photos: {
                Row: {
                    id: string;
                    annonce_id: string;
                    user_id: string;
                    url: string;
                    thumbnail_url: string | null;
                    filename: string;
                    mime_type: string;
                    size: number;
                    width: number | null;
                    height: number | null;
                    order: number;
                    is_cover: boolean;
                    alt: string | null;
                    blurhash: string | null;
                    exif_data: Json | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    annonce_id: string;
                    user_id: string;
                    url: string;
                    filename: string;
                    mime_type: string;
                    size: number;
                    thumbnail_url?: string | null;
                    width?: number | null;
                    height?: number | null;
                    order?: number;
                    is_cover?: boolean;
                    alt?: string | null;
                    blurhash?: string | null;
                    exif_data?: Json | null;
                    created_at?: string;
                };
                Update: Partial<Database['public']['Tables']['photos']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "photos_annonce_id_fkey";
                        columns: ["annonce_id"];
                        isOneToOne: false;
                        referencedRelation: "annonces";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "photos_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            conversations: {
                Row: {
                    id: string;
                    buyer_id: string;
                    seller_id: string;
                    annonce_id: string | null;
                    type: Database['public']['Enums']['conversation_type'];
                    last_message_at: string | null;
                    last_message_preview: string | null;
                    buyer_unread_count: number;
                    seller_unread_count: number;
                    is_buyer_archived: boolean;
                    is_seller_archived: boolean;
                    is_buyer_blocked: boolean;
                    is_seller_blocked: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    buyer_id: string;
                    seller_id: string;
                    annonce_id?: string | null;
                    type?: Database['public']['Enums']['conversation_type'];
                    [key: string]: unknown;
                };
                Update: Partial<Database['public']['Tables']['conversations']['Insert']>;
                Relationships: [];
            };
            messages: {
                Row: {
                    id: string;
                    conversation_id: string;
                    sender_id: string;
                    receiver_id: string;
                    content: string;
                    content_type: string;
                    attachments: Json | null;
                    offer_amount: number | null;
                    offer_status: string | null;
                    is_read: boolean;
                    read_at: string | null;
                    is_edited: boolean;
                    edited_at: string | null;
                    is_deleted: boolean;
                    deleted_at: string | null;
                    is_reported: boolean;
                    is_hidden: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    conversation_id: string;
                    sender_id: string;
                    receiver_id: string;
                    content: string;
                    content_type?: string;
                    attachments?: Json | null;
                    [key: string]: unknown;
                };
                Update: Partial<Database['public']['Tables']['messages']['Insert']>;
                Relationships: [];
            };
            favoris: {
                Row: {
                    id: string;
                    user_id: string;
                    annonce_id: string;
                    notify_price_drop: boolean;
                    last_notified_price: number | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    annonce_id: string;
                    notify_price_drop?: boolean;
                    last_notified_price?: number | null;
                    created_at?: string;
                };
                Update: Partial<Database['public']['Tables']['favoris']['Insert']>;
                Relationships: [];
            };
            signalements: {
                Row: {
                    id: string;
                    reporter_id: string;
                    annonce_id: string | null;
                    reported_user_id: string | null;
                    motif: Database['public']['Enums']['signalement_motif'];
                    description: string | null;
                    screenshots: Json | null;
                    statut: Database['public']['Enums']['signalement_statut'];
                    priority: number;
                    moderator_id: string | null;
                    moderator_note: string | null;
                    action_taken: string | null;
                    treated_at: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    reporter_id: string;
                    motif: Database['public']['Enums']['signalement_motif'];
                    annonce_id?: string | null;
                    reported_user_id?: string | null;
                    description?: string | null;
                    [key: string]: unknown;
                };
                Update: Partial<Database['public']['Tables']['signalements']['Insert']>;
                Relationships: [];
            };
            notifications: {
                Row: {
                    id: string;
                    user_id: string;
                    type: Database['public']['Enums']['notification_type'];
                    title: string;
                    body: string;
                    image_url: string | null;
                    action_url: string | null;
                    action_label: string | null;
                    data: Json | null;
                    is_read: boolean;
                    read_at: string | null;
                    sent_email: boolean;
                    sent_push: boolean;
                    sent_sms: boolean;
                    scheduled_at: string | null;
                    sent_at: string | null;
                    expires_at: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    type: Database['public']['Enums']['notification_type'];
                    title: string;
                    body: string;
                    [key: string]: unknown;
                };
                Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
                Relationships: [];
            };
            recherches_sauvegardees: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    query: string | null;
                    category_id: string | null;
                    city: string | null;
                    region: string | null;
                    min_price: number | null;
                    max_price: number | null;
                    etat: Database['public']['Enums']['annonce_etat'] | null;
                    radius: number | null;
                    latitude: number | null;
                    longitude: number | null;
                    filters: Json | null;
                    alert_enabled: boolean;
                    alert_frequency: string;
                    last_alert_at: string | null;
                    results_count: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    [key: string]: unknown;
                };
                Update: Partial<Database['public']['Tables']['recherches_sauvegardees']['Insert']>;
                Relationships: [];
            };
            audit_logs: {
                Row: {
                    id: string;
                    user_id: string | null;
                    action: string;
                    resource: string;
                    resource_id: string | null;
                    old_data: Json | null;
                    new_data: Json | null;
                    ip_address: string | null;
                    user_agent: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    action: string;
                    resource: string;
                    [key: string]: unknown;
                };
                Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>;
                Relationships: [];
            };
            settings: {
                Row: {
                    id: string;
                    key: string;
                    value: Json;
                    type: string;
                    description: string | null;
                    is_public: boolean;
                    updated_by: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    key: string;
                    value: Json;
                    type?: string;
                    [key: string]: unknown;
                };
                Update: Partial<Database['public']['Tables']['settings']['Insert']>;
                Relationships: [];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            increment_views: {
                Args: { annonce_id: string };
                Returns: void;
            };
        };
        Enums: {
            user_role: 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';
            user_status: 'ACTIF' | 'SUSPENDU' | 'BANNI';
            annonce_etat: 'NEUF' | 'OCCASION' | 'RECONDITIONNE';
            annonce_statut: 'BROUILLON' | 'EN_ATTENTE' | 'ACTIVE' | 'EXPIREE' | 'SUPPRIMEE' | 'REJETEE';
            signalement_motif: 'SPAM' | 'ARNAQUE' | 'CONTENU_INAPPROPRIE' | 'ANNONCE_DOUBLON' |
            'FAUSSES_INFORMATIONS' | 'PRIX_SUSPECT' | 'PRODUIT_INTERDIT' | 'HARCELEMENT' | 'AUTRE';
            signalement_statut: 'EN_ATTENTE' | 'EN_COURS' | 'RESOLU' | 'REJETE' | 'ESCALADE';
            notification_type: 'MESSAGE' | 'ANNONCE_APPROUVEE' | 'ANNONCE_REJETEE' | 'ANNONCE_EXPIREE' |
            'NOUVEAU_FAVORI' | 'BAISSE_PRIX' | 'NOUVELLE_ANNONCE_CATEGORIE' | 'SIGNALEMENT_TRAITE' |
            'COMPTE_VERIFIE' | 'SYSTEME';
            conversation_type: 'ANNONCE' | 'SUPPORT' | 'MODERATION';
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};

// Type Helpers
export type Tables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Update'];
export type Enums<T extends keyof Database['public']['Enums']> =
    Database['public']['Enums'][T];
