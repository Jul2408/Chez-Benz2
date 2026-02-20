'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Mail,
    Lock,
    User,
    Loader2,
    ChevronRight,
    Star,
    Heart,
    Rocket,
    Eye,
    EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signUpWithEmail } from '@/utils/supabase-helpers';
import { toast } from 'sonner';

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await signUpWithEmail(email, password, fullName, 'USER');
            toast.success('Bienvenue chez nous ! Connectez-vous maintenant.');
            router.push('/connexion');
        } catch (error: any) {
            toast.error(error.message || 'Erreur lors de la création du compte');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden font-inter">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between px-6 py-6 sm:py-8">
                <Link href="/connexion" className="size-10 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-500 hover:text-primary hover:border-primary/20 transition-all active:scale-95">
                    <ArrowLeft className="size-5" />
                </Link>
                <div className="text-2xl font-black font-outfit text-primary tracking-tight">Chez-BEN2</div>
                <div className="size-10" /> {/* Spacer for centering */}
            </div>

            {/* Left Side: Image & Branding - hidden on mobile */}
            <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2 }}
                    className="absolute inset-0"
                >
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
                        alt="Background Register"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tl from-primary/80 via-primary/40 to-transparent mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900" />
                </motion.div>

                <div className="relative z-10 w-full flex flex-col justify-end p-20 text-white space-y-8">
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="space-y-6"
                    >
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="size-10 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-200">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" />
                                </div>
                            ))}
                            <div className="size-10 rounded-full border-2 border-slate-900 bg-secondary flex items-center justify-center text-[10px] font-black">
                                +10k
                            </div>
                        </div>

                        <h2 className="text-6xl font-black font-outfit leading-tight tracking-tighter">
                            Faites passer votre <br />
                            commerce au <span className="text-secondary italic underline underline-offset-8">niveau supérieur.</span>
                        </h2>

                        <p className="text-white/80 text-lg font-medium leading-relaxed max-w-md">
                            Créez votre boutique gratuitement et commencez à vendre vos produits dès maintenant.
                        </p>

                        <div className="flex items-center gap-8 pt-6">
                            <div className="flex items-center gap-2">
                                <div className="p-1 rounded-full bg-secondary/20">
                                    <Star className="size-4 text-secondary fill-secondary" />
                                </div>
                                <span className="text-sm font-bold">Confiance Mutuelle</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-1 rounded-full bg-secondary/20">
                                    <Heart className="size-4 text-secondary fill-secondary" />
                                </div>
                                <span className="text-sm font-bold">Support Dédié</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Decorative floating icon */}
                <motion.div
                    animate={{ y: [0, 15, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 left-20 size-24 rounded-3xl bg-secondary/20 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-2xl"
                >
                    <Rocket className="size-10 text-secondary" />
                </motion.div>
            </div>

            {/* Right Side: Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-20 relative z-10 py-4 lg:py-0 w-full"
            >
                <div className="max-w-md w-full mx-auto space-y-6 sm:space-y-8">
                    {/* Header */}
                    <div className="space-y-6">
                        <Link href="/connexion" className="hidden lg:inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-bold text-sm uppercase tracking-widest">Se connecter plutôt</span>
                        </Link>

                        <div className="space-y-2">
                            <h1 className="text-4xl sm:text-5xl font-black font-outfit tracking-tighter text-slate-900 leading-none">
                                Commencer <br />
                                l'aventure <span className="text-primary italic">ici.</span>
                            </h1>
                            <p className="text-slate-500 font-medium text-base sm:text-lg">
                                Rejoignez des milliers de vendeurs actifs.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Form */}
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nom complet ou Boutique</label>
                                <div className="group relative text-left">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-slate-50 text-slate-400 group-focus-within:text-primary group-focus-within:bg-primary/5 transition-all">
                                        <User className="size-4" />
                                    </div>
                                    <Input
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="ex: Jean Dupont"
                                        className="h-14 sm:h-16 pl-14 rounded-2xl border-2 border-slate-100 focus:border-primary/20 bg-slate-50/50 focus:bg-white transition-all font-semibold text-slate-900 placeholder:text-slate-300"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Adresse Email</label>
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

                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Mot de passe</label>
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

                            <Button
                                type="submit"
                                className="w-full h-14 sm:h-16 rounded-2xl text-base sm:text-lg font-black shadow-2xl shadow-primary/20 mt-4 group relative overflow-hidden active:scale-[0.98] transition-transform"
                                disabled={isLoading}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Créer mon compte'}
                                    {!isLoading && <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />}
                                </span>
                            </Button>
                        </form>

                        <p className="text-center text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">
                            En continuant, vous acceptez les <Link href="#" className="text-primary hover:underline">Conditions d'Utilisation</Link> <br />
                            et la <Link href="#" className="text-primary hover:underline">Politique de Confidentialité</Link> de Chez-BEN2.
                        </p>
                    </div>

                    {/* Footer minimal */}
                    <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        Chez-BEN2 © 2026
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
