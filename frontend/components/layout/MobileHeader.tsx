'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Bell, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getUnreadNotificationsCount } from '@/utils/supabase-helpers';
import { ThemeToggle } from './ThemeToggle';
import { useAuthStore } from '@/store';
import { useNotifications } from '@/hooks';

export function MobileHeader() {
    const [searchQuery, setSearchQuery] = useState('');
    const { unreadNotifications } = useNotifications();
    const router = useRouter();
    const { user } = useAuthStore();

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            router.push(`/annonces?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full md:hidden">
            {/* The header needs to be vibrant red/coral */}
            <div className="bg-primary px-5 pt-8 pb-6 text-white rounded-b-[2rem] shadow-2xl shadow-primary/30 relative overflow-hidden">
                {/* Background Pattern - Subtle curves */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between mb-6">
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 opacity-90">
                            <MapPin className="size-3.5" />
                            <span className="text-xs font-medium">Localisation</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-black tracking-tight text-white">Douala, Cameroun</span>
                            <div className="size-5 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <span className="text-[8px] rotate-90 text-white font-bold">›</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 relative">
                        <ThemeToggle className="size-11 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/10" />
                        <div className="relative">
                            <Link href="/dashboard/notifications">
                                <Button variant="ghost" size="icon" className="size-11 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/10">
                                    <Bell className="size-5 text-white" />
                                    {unreadNotifications > 0 && (
                                        <span className="absolute top-2.5 right-3 size-2 bg-yellow-400 rounded-full border border-primary animate-pulse" />
                                    )}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Search Bar - Matching Image Design */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-3.5 size-5 text-gray-400" />
                        <Input
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            className="h-12 w-full pl-11 pr-4 rounded-2xl border-none bg-white text-foreground shadow-sm placeholder:text-gray-400 font-medium"
                        />
                    </div>
                    <div className="size-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm shrink-0">
                        {/* Filter Icon customized */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                            <path d="M4 6C4 5.44772 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6C20 6.55228 19.5523 7 19 7H5C4.44772 7 4 6.55228 4 6Z" fill="currentColor" />
                            <path d="M18.5 6C18.5 7.38071 17.3807 8.5 16 8.5C14.6193 8.5 13.5 7.38071 13.5 6C13.5 4.61929 14.6193 3.5 16 3.5C17.3807 3.5 18.5 4.61929 18.5 6Z" fill="currentColor" />
                            <path d="M4 18C4 17.4477 4.44772 17 5 17H19C19.5523 17 20 17.4477 20 18C20 18.5523 19.5523 19 19 19H5C4.44772 19 4 18.5523 4 18Z" fill="currentColor" />
                            <path d="M10.5 18C10.5 19.3807 9.38071 20.5 8 20.5C6.61929 20.5 5.5 19.3807 5.5 18C5.5 16.6193 6.61929 15.5 8 15.5C9.38071 15.5 10.5 16.6193 10.5 18Z" fill="currentColor" />
                        </svg>
                    </div>
                </div>
            </div>
        </header>
    );
}
