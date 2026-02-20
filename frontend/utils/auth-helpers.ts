import { Database } from '@/types/database.types';

type UserRole = Database['public']['Enums']['user_role'];

export const ROLE_HIERARCHY: Record<UserRole, number> = {
    USER: 1,
    MODERATOR: 2,
    ADMIN: 3,
    SUPER_ADMIN: 4,
};

/**
 * Check if a user has the required role or higher
 */
export function hasRole(userRole: UserRole | null | undefined, requiredRole: UserRole): boolean {
    if (!userRole) return false;
    return (ROLE_HIERARCHY[userRole] || 0) >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Check if user is an admin or super_admin
 */
export function isAdmin(userRole: UserRole | null | undefined): boolean {
    return hasRole(userRole, 'ADMIN');
}

/**
 * Check if user is a moderator or higher
 */
export function isModerator(userRole: UserRole | null | undefined): boolean {
    return hasRole(userRole, 'MODERATOR');
}

/**
 * Check if user can access admin dashboard
 */
export function canAccessAdmin(userRole: UserRole | null | undefined): boolean {
    return isModerator(userRole);
}

/**
 * Format full name from first and last name if needed, or just return display name
 */
export function formatUserName(profile: { full_name?: string; email?: string } | null): string {
    if (!profile) return 'Utilisateur';
    return profile.full_name || profile.email?.split('@')[0] || 'Utilisateur';
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
    return name
        .match(/(\w)\w*/g)
        ?.slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join('') || 'U';
}
