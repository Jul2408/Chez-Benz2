'use client';

import { motion } from 'framer-motion';
import { Search, Camera, MessageCircle, ShoppingCart, Sparkles } from 'lucide-react';

const steps = [
    {
        title: 'Rechercher',
        description: 'Trouvez facilement ce dont vous avez besoin avec nos filtres avancés et la géolocalisation partout au Cameroun.',
        icon: Search,
        color: 'bg-primary/10 text-primary',
        label: '01'
    },
    {
        title: 'Contacter le vendeur',
        description: 'Discutez directement avec les vendeurs via notre messagerie sécurisée ou par téléphone.',
        icon: MessageCircle,
        color: 'bg-primary/10 text-primary',
        label: '02'
    },
    {
        title: 'Conclure l\'affaire',
        description: 'Rencontrez le vendeur, vérifiez le produit et concluez la vente en toute confiance.',
        icon: ShoppingCart,
        color: 'bg-primary/10 text-primary',
        label: '03'
    },
];

export function HowItWorks() {
    return (
        <section className="py-20 md:py-32 bg-background relative overflow-hidden">
            {/* Décoration d'arrière-plan - S'adapte au thème par l'opacité et la couleur de stroke */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold mb-4">
                        <Sparkles className="size-3" />
                        <span>GUIDE RAPIDE</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight text-foreground">Comment ça marche ?</h2>
                    <p className="text-muted-foreground text-base md:text-xl leading-relaxed">
                        Chez-BEN2 simplifie l'achat et la vente au Cameroun. <br className="hidden md:block" /> C'est rapide, sécurisé et toujours gratuit pour tous.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 md:gap-8 relative">
                    {/* Ligne de connexion (Desktop) - Couleur adaptative */}
                    <div className="hidden md:block absolute top-[20%] left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-border -z-0" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                            className="relative flex flex-col items-center text-center group"
                        >
                            <div className="relative mb-8">
                                <div className={`size-24 md:size-32 rounded-[2.5rem] ${step.color} shadow-2xl shadow-primary/5 flex items-center justify-center transition-all duration-500 group-hover:rotate-6 group-hover:scale-105 group-hover:shadow-primary/20`}>
                                    <step.icon className="size-10 md:size-14" strokeWidth={1.5} />
                                </div>
                                <div className="absolute -top-2 -right-2 size-10 bg-card shadow-lg rounded-2xl flex items-center justify-center text-primary font-black text-sm border-4 border-background">
                                    {step.label}
                                </div>
                            </div>
                            <h3 className="text-xl md:text-2xl font-black mb-4 text-foreground group-hover:text-primary transition-colors">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed max-w-xs text-sm md:text-base">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
