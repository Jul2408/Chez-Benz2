'use client';

import { useState, useEffect, useCallback, RefObject } from 'react';
import { useNotificationsStore } from '@/store';

/**
 * Hook pour gérer les media queries
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        setMatches(media.matches);

        const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
        media.addEventListener('change', listener);

        return () => media.removeEventListener('change', listener);
    }, [query]);

    return matches;
}

/**
 * Hook pour détecter si on est sur mobile
 */
export function useIsMobile(): boolean {
    return useMediaQuery('(max-width: 768px)');
}

/**
 * Hook pour détecter si on est sur desktop
 */
export function useIsDesktop(): boolean {
    return useMediaQuery('(min-width: 1024px)');
}

/**
 * Hook pour le debounce
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Hook pour le local storage
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') return initialValue;

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = useCallback(
        (value: T | ((val: T) => T)) => {
            try {
                const valueToStore = value instanceof Function ? value(storedValue) : value;
                setStoredValue(valueToStore);
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                }
            } catch (error) {
                console.error(error);
            }
        },
        [key, storedValue]
    );

    return [storedValue, setValue];
}

/**
 * Hook pour détecter si l'élément est visible
 */
export function useOnScreen<T extends Element>(
    ref: React.RefObject<T>,
    rootMargin = '0px'
): boolean {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIntersecting(entry.isIntersecting),
            { rootMargin }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [ref, rootMargin]);

    return isIntersecting;
}

/**
 * Hook pour copier dans le presse-papier
 */
export function useCopyToClipboard(): [boolean, (text: string) => Promise<void>] {
    const [copied, setCopied] = useState(false);

    const copy = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    }, []);

    return [copied, copy];
}

/**
 * Hook pour gérer le scroll lock
 */
export function useScrollLock(): [boolean, () => void, () => void] {
    const [isLocked, setIsLocked] = useState(false);

    const lock = useCallback(() => {
        document.body.style.overflow = 'hidden';
        setIsLocked(true);
    }, []);

    const unlock = useCallback(() => {
        document.body.style.overflow = '';
        setIsLocked(false);
    }, []);

    useEffect(() => {
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return [isLocked, lock, unlock];
}

/**
 * Hook pour détecter le scroll vers le haut ou le bas
 */
export function useScrollDirection(): 'up' | 'down' | null {
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const updateScrollDirection = () => {
            const scrollY = window.scrollY;
            const direction = scrollY > lastScrollY ? 'down' : 'up';
            if (
                direction !== scrollDirection &&
                Math.abs(scrollY - lastScrollY) > 10
            ) {
                setScrollDirection(direction);
            }
            lastScrollY = scrollY > 0 ? scrollY : 0;
        };

        window.addEventListener('scroll', updateScrollDirection);
        return () => window.removeEventListener('scroll', updateScrollDirection);
    }, [scrollDirection]);

    return scrollDirection;
}

/**
 * Hook pour détecter le clic en dehors d'un élément
 */
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T>,
    handler: (event: MouseEvent | TouchEvent) => void
): void {
    useEffect(
        () => {
            const listener = (event: MouseEvent | TouchEvent) => {
                const el = ref?.current;
                // Do nothing if clicking ref's element or descendent elements
                if (!el || el.contains(event.target as Node)) {
                    return;
                }
                handler(event);
            };
            document.addEventListener('mousedown', listener);
            document.addEventListener('touchstart', listener);
            return () => {
                document.removeEventListener('mousedown', listener);
                document.removeEventListener('touchstart', listener);
            };
        },
        [ref, handler]
    );
}
/**
 * Hook pour gérer les notifications et messages non lus
 */
export function useNotifications() {
    const { unreadCount, unreadMessages, refresh } = useNotificationsStore();
    const [loading, setLoading] = useState(true);

    const refreshCounts = useCallback(async () => {
        setLoading(true);
        await refresh();
        setLoading(false);
    }, [refresh]);

    useEffect(() => {
        refreshCounts();
        // Poll toutes les minutes au cas où
        const interval = setInterval(refreshCounts, 60000);
        return () => clearInterval(interval);
    }, [refreshCounts]);

    return {
        unreadNotifications: unreadCount,
        unreadMessages,
        loading,
        refreshCounts
    };
}
