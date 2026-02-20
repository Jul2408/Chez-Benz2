'use client';

import React from 'react';
import Link from 'next/link';
import { signOut } from '@/utils/supabase-helpers';
import {
    Search,
    Bell,
    User,
    Maximize,
    Settings,
    Command,
    Globe,
    Moon,
    Sun,
    LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from 'next-themes';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function AdminHeader({ user }: any) {
    const { theme, setTheme } = useTheme();

    return (
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
            {/* Barre de recherche globale Admin */}
            <div className="flex-1 max-w-xl hidden md:flex">
                <div className="relative w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Chercher un utilisateur, une annonce, une transaction... (⌘+K)"
                        className="w-full bg-slate-50 dark:bg-white/5 border-none h-12 pl-12 pr-12 rounded-2xl font-medium focus-visible:ring-2 focus-visible:ring-primary/20"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 px-2 py-1 rounded bg-white dark:bg-white/10 border border-gray-100 dark:border-white/5 text-[10px] font-black text-slate-400 uppercase">
                        <Command className="size-3" />
                        <span>K</span>
                    </div>
                </div>
            </div>

            {/* Actions & Profil */}
            <div className="flex items-center gap-4">
                {/* Switcher Langue/Site */}
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500" asChild title="Voir le site public">
                    <a href="/" target="_blank">
                        <Globe className="size-5" />
                    </a>
                </Button>

                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
                </Button>

                {/* Notifications Admin */}
                <div className="relative">
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500" asChild>
                        <Link href="/admin/notifications">
                            <Bell className="size-5" />
                            <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                        </Link>
                    </Button>
                </div>

                <div className="w-px h-8 bg-gray-100 dark:bg-white/5 mx-2" />

                {/* Profil Admin */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="pl-2 pr-4 h-12 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 gap-3 border border-transparent hover:border-gray-100 dark:hover:border-white/5">
                            <Avatar className="size-8 rounded-xl ring-2 ring-primary/10">
                                <AvatarImage src={user.profile?.avatar_url} />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                    {user.profile?.full_name?.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start">
                                <span className="text-xs font-black text-foreground leading-none">
                                    {user.profile?.full_name || 'Admin'}
                                </span>
                                <span className="text-[10px] font-bold text-primary uppercase mt-1">
                                    {user.profile?.role}
                                </span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-3 rounded-3xl border-gray-100 dark:border-white/5 shadow-2xl">
                        <DropdownMenuLabel className="font-black font-outfit px-3 py-2">Mon Panneau</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href="/admin/profile">
                            <DropdownMenuItem className="rounded-2xl h-12 font-bold focus:bg-primary/5 cursor-pointer gap-3">
                                <User className="size-4 text-slate-500" /> Profil Admin
                            </DropdownMenuItem>
                        </Link>
                        <Link href="/admin/profile">
                            <DropdownMenuItem className="rounded-2xl h-12 font-bold focus:bg-primary/5 cursor-pointer gap-3">
                                <Settings className="size-4 text-slate-500" /> Sécurité
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="rounded-2xl h-12 font-bold focus:bg-primary/5 cursor-pointer gap-3 text-red-500 focus:bg-red-50 dark:focus:bg-red-500/10" onClick={() => signOut()}>
                            <LogOutIcon className="size-4" /> Déconnexion
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

function LogOutIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
    )
}
