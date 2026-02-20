'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail,
    Lock,
    ShieldCheck,
    ArrowRight,
    ArrowLeft,
    KeyRound,
    CheckCircle2,
    Loader2,
    Eye,
    EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { requestPasswordReset, confirmPasswordReset } from '@/utils/supabase-helpers';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            await requestPasswordReset(email);
            toast.success("Si un compte existe, un code a été envoyé à " + email);
            setStep(2);
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de l'envoi du code.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code || !newPassword) return;

        setIsLoading(true);
        try {
            await confirmPasswordReset(email, code, newPassword);
            toast.success("Votre mot de passe a été réinitialisé !");
            router.push('/connexion');
        } catch (error: any) {
            toast.error(error.message || "Code invalide ou expiré.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-outfit">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
                <Link href="/" className="inline-flex items-center gap-2 group">
                    <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-[-10deg] transition-transform">
                        <KeyRound className="text-white size-6" />
                    </div>
                </Link>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {step === 1 ? "Mot de passe oublié ?" : "Vérification du code"}
                </h1>
                <p className="text-slate-500 font-medium">
                    {step === 1
                        ? "Pas d'inquiétude, nous allons vous envoyer un code de récupération."
                        : `Entrez le code à 6 chiffres envoyé à ${email}`}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900">
                    <CardContent className="p-8 md:p-10">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.form
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleRequestCode}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Votre Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                placeholder="ex: jean@email.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="h-14 pl-12 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold text-lg"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-16 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" /> : (
                                            <>
                                                ENVOYER LE CODE <ArrowRight className="ml-2 size-5" />
                                            </>
                                        )}
                                    </Button>
                                    <Link href="/connexion" className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors">
                                        <ArrowLeft className="size-4" /> Retour à la connexion
                                    </Link>
                                </motion.form>
                            ) : (
                                <motion.form
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleConfirmReset}
                                    className="space-y-6"
                                >
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="code" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Code de validation (6 chiffres)</Label>
                                            <div className="relative">
                                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                                                <Input
                                                    id="code"
                                                    required
                                                    placeholder="000000"
                                                    maxLength={6}
                                                    value={code}
                                                    onChange={(e) => setCode(e.target.value)}
                                                    className="h-14 pl-12 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-black text-2xl tracking-[0.5em] text-center"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="new_password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nouveau Mot de Passe</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                                                <Input
                                                    id="new_password"
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="h-14 pl-12 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold text-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                                >
                                                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-16 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" /> : (
                                            <>
                                                RÉINITIALISER <CheckCircle2 className="ml-2 size-5" />
                                            </>
                                        )}
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="w-full text-center text-sm font-bold text-slate-400 hover:text-primary"
                                    >
                                        Utiliser un autre email
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Besoin d'aide ? <Link href="/contact" className="text-primary hover:underline">Contactez le Support</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
