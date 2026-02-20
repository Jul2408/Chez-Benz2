'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Mail,
    Lock,
    Loader2,
    ChevronRight,
    CheckCircle2,
    Store,
    Tag,
    Zap,
    Eye,
    EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signInWithEmail } from '@/utils/supabase-helpers';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const setUser = useAuthStore((state) => state.setUser);
    const nextPath = searchParams.get('next') || '/dashboard';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { user } = await signInWithEmail(email, password);
            if (user) {
                setUser(user);
                toast.success('Bon retour sur Chez-BEN2 !');
                // Redirect admin users to /admin, others to dashboard
                if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
                    router.push('/admin');
                } else {
                    router.push(nextPath);
                }
            }
        } catch (error: any) {
            toast.error(error.message || 'Email ou mot de passe incorrect');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden">
            {/* Mobile Header - visible only on small screens */}
            <div className="lg:hidden flex items-center justify-between px-6 py-6 sm:py-8">
                <Link href="/" className="size-10 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-500 hover:text-primary hover:border-primary/20 transition-all active:scale-95">
                    <ArrowLeft className="size-5" />
                </Link>
                <div className="text-2xl font-black font-outfit text-primary tracking-tight">Chez-BEN2</div>
                <div className="size-10" /> {/* Spacer for centering */}
            </div>

            {/* Left Side: Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-20 relative z-10 py-4 lg:py-0 w-full"
            >
                <div className="max-w-md w-full mx-auto space-y-6 sm:space-y-8">
                    {/* Header/Logo - hidden on mobile (shown in mobile header above) */}
                    <div className="space-y-6">
                        <Link href="/" className="hidden lg:inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-bold text-sm uppercase tracking-widest">Retour au site</span>
                        </Link>

                        <div className="space-y-2">
                            <h1 className="text-4xl sm:text-5xl font-black font-outfit tracking-tighter text-slate-900 leading-none">
                                Content de vous <br />
                                <span className="text-primary italic">revoir.</span>
                            </h1>
                            <p className="text-slate-500 font-medium text-base sm:text-lg">
                                Connectez-vous pour gérer vos ventes et achats.
                            </p>
                        </div>
                    </div>

                    {/* Login Form */}
                    <div className="bg-white rounded-[2rem] space-y-6">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email</label>
                                <div className="group relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-slate-50 text-slate-400 group-focus-within:text-primary group-focus-within:bg-primary/5 transition-all">
                                        <Mail className="size-4" />
                                    </div>
                                    <Input
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="votre@email.com"
                                        className="h-14 sm:h-16 pl-14 rounded-2xl border-2 border-slate-100 focus:border-primary/20 bg-slate-50/50 focus:bg-white transition-all font-semibold text-slate-900 placeholder:text-slate-300"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Mot de passe</label>
                                        <Link href="/mot-de-passe-oublie" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">Oublié ?</Link>
                                    </div>
                                    <div className="group relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-slate-50 text-slate-400 group-focus-within:text-primary group-focus-within:bg-primary/5 transition-all">
                                            <Lock className="size-4" />
                                        </div>
                                        <Input
                                            required
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="h-14 sm:h-16 pl-14 pr-14 rounded-2xl border-2 border-slate-100 focus:border-primary/20 bg-slate-50/50 focus:bg-white transition-all font-semibold text-slate-900 placeholder:text-slate-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-primary transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 sm:h-16 rounded-2xl text-base sm:text-lg font-black shadow-2xl shadow-primary/20 mt-4 group relative overflow-hidden active:scale-[0.98] transition-transform"
                                disabled={isLoading}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Se connecter'}
                                    {!isLoading && <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />}
                                </span>
                            </Button>
                        </form>

                        <div className="flex items-center gap-4 text-slate-300">
                            <div className="h-px flex-1 bg-slate-100" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Nouveau ici ?</span>
                            <div className="h-px flex-1 bg-slate-100" />
                        </div>

                        <div className="text-center">
                            <Link
                                href="/inscription"
                                className="inline-flex items-center gap-2 group py-4 px-8 rounded-2xl border-2 border-slate-100 hover:border-primary/20 hover:bg-primary/5 transition-all w-full justify-center"
                            >
                                <span className="font-bold text-slate-600 group-hover:text-primary transition-colors">Créer mon compte</span>
                                <CheckCircle2 className="size-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        </div>
                    </div>

                    {/* Footer minimal */}
                    <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        Chez-BEN2 © 2026
                    </p>
                </div>
            </motion.div>

            {/* Right Side: Image & Branding - hidden on mobile */}
            <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2 }}
                    className="absolute inset-0"
                >
                    <img
                        src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=2070&auto=format&fit=crop"
                        alt="Background Login"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 via-primary/40 to-transparent mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900" />
                </motion.div>

                <div className="relative z-10 w-full flex flex-col justify-end p-20 text-white space-y-8">
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                            <Zap className="size-5 text-secondary fill-secondary" />
                            <span className="font-outfit font-bold tracking-tight">Vente Express activée</span>
                        </div>

                        <h2 className="text-6xl font-black font-outfit leading-tight tracking-tighter">
                            Vendez plus vite, <br />
                            gérez <span className="text-secondary italic underline underline-offset-8">mieux.</span>
                        </h2>

                        <div className="grid grid-cols-2 gap-8 pt-6">
                            <div className="space-y-2">
                                <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                    <Store className="size-6 text-white" />
                                </div>
                                <h3 className="font-bold text-lg">Ma Boutique</h3>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    Visualisez vos stocks et commandes en temps réel.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                    <Tag className="size-6 text-white" />
                                </div>
                                <h3 className="font-bold text-lg">Promotions</h3>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    Boostez la visibilité de vos articles.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Decorative floating B */}
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 right-20 size-32 rounded-[2.5rem] bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/20 flex items-center justify-center text-7xl font-black font-outfit text-white/40 shadow-2xl"
                >
                    B
                </motion.div>
            </div>
        </div>
    );
}
