'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { fetchApi } from '@/lib/api-client';

interface FollowButtonProps {
    sellerId: string;
    initialFollowing: boolean;
}

export function FollowButton({ sellerId, initialFollowing }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialFollowing);
    const [loading, setLoading] = useState(false);

    const handleToggleFollow = async () => {
        setLoading(true);
        try {
            const endpoint = `/auth/users/${sellerId}/${isFollowing ? 'unfollow' : 'follow'}/`;
            await fetchApi(endpoint, {
                method: 'POST',
            });

            setIsFollowing(!isFollowing);
            toast.success(isFollowing ? 'Vous ne suivez plus ce vendeur' : 'Vous suivez maintenant ce vendeur');
        } catch (error: any) {
            console.error('Follow error:', error);
            toast.error(error.message || 'Impossible de modifier le suivi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleToggleFollow}
            disabled={loading}
            variant={isFollowing ? 'outline' : 'default'}
            size="lg"
            className="gap-2"
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : isFollowing ? (
                <UserMinus className="h-4 w-4" />
            ) : (
                <UserPlus className="h-4 w-4" />
            )}
            {isFollowing ? 'Ne plus suivre' : 'Suivre'}
        </Button>
    );
}
