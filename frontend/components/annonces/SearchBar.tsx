'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, History, TrendingUp, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { useOnClickOutside, useDebounce } from '@/hooks'; // Assuming hooks exist
import { cn } from '@/lib/utils';

// Mock data for demo
const SUGGESTIONS = [
    'iPhone 15 Pro Max',
    'Toyota Corolla',
    'Appartement meublé Douala',
    'PS5',
    'Terrain Yaoundé',
];

const RECENT_SEARCHES = ['Chaussures Nike', 'MacBook Air', 'Terrain Kribi'];

export function SearchBar({ className }: { className?: string }) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const debouncedQuery = useDebounce(query, 300);

    // Close when clicking outside
    // Using simple event listener if hook is not perfectly set up yet, but relying on hooks/index.ts usually
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (term: string) => {
        setIsOpen(false);
        setQuery(term);
        router.push(`/annonces?q=${encodeURIComponent(term)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch(query);
        }
    };

    return (
        <div ref={containerRef} className={cn('relative w-full max-w-2xl', className)}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Que recherchez-vous ?"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="pl-10 pr-12 h-12 rounded-full border-primary/20 focus-visible:ring-primary shadow-sm"
                />
                {query && (
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                        onClick={() => setQuery('')}
                    >
                        <X className="size-4" />
                    </Button>
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-background rounded-xl border shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                    <Command>
                        <CommandList>
                            {query === '' && (
                                <>
                                    <CommandGroup heading="Recherches récentes">
                                        {RECENT_SEARCHES.map((item) => (
                                            <CommandItem key={item} onSelect={() => handleSearch(item)} className="cursor-pointer">
                                                <History className="mr-2 h-4 w-4 text-muted-foreground" />
                                                {item}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                    <CommandGroup heading="Tendances">
                                        {SUGGESTIONS.slice(0, 3).map((item) => (
                                            <CommandItem key={item} onSelect={() => handleSearch(item)} className="cursor-pointer">
                                                <TrendingUp className="mr-2 h-4 w-4 text-primary" />
                                                {item}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </>
                            )}

                            {query !== '' && (
                                <CommandGroup heading="Suggestions">
                                    {SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase())).map((item) => (
                                        <CommandItem key={item} onSelect={() => handleSearch(item)} className="cursor-pointer">
                                            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                                            {item}
                                        </CommandItem>
                                    ))}
                                    <CommandItem onSelect={() => handleSearch(query)} className="cursor-pointer font-semibold text-primary">
                                        <Search className="mr-2 h-4 w-4" />
                                        Rechercher "{query}"
                                    </CommandItem>
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </div>
            )}
        </div>
    );
}
