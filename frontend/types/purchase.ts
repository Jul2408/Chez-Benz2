// Purchase Transaction Types
export interface PurchaseTransaction {
    id: string;
    buyer_id: string;
    seller_id: string;
    annonce_id: string;
    amount: number;
    platform_fee: number;
    total_amount: number;
    payment_method: 'ORANGE_MONEY' | 'MTN_MONEY';
    payment_phone: string;
    status: 'PENDING' | 'PAID' | 'CONFIRMED' | 'RELEASED' | 'CANCELLED' | 'REFUNDED';
    escrow_released: boolean;
    buyer_confirmed_at?: string;
    created_at: string;
    updated_at: string;
}

export interface SellerBalance {
    id: string;
    seller_id: string;
    available_balance: number;
    pending_balance: number;
    total_withdrawn: number;
    updated_at: string;
}

export interface PurchaseFormData {
    payment_method: 'ORANGE_MONEY' | 'MTN_MONEY';
    phone: string;
    amount: number;
    annonce_id: string;
}

export interface PurchaseResponse {
    success: boolean;
    transaction_id?: string;
    message: string;
    redirect_url?: string;
}

// Follower Types
export interface Follower {
    id: string;
    follower_id: string;
    following_id: string;
    created_at: string;
}

export interface FollowStats {
    followers_count: number;
    following_count: number;
    is_following: boolean;
}
