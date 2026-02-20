'use client';

import { motion } from 'framer-motion';
import { Users, ShoppingBag, MapPin, CheckCircle2 } from 'lucide-react';

const stats = [
    { label: 'Utilisateurs Actifs', value: '50K+', icon: Users },
    { label: 'Annonces Totales', value: '12K+', icon: ShoppingBag },
    { label: 'Villes Couvertes', value: '150+', icon: MapPin },
    { label: 'Taux de Succès', value: '98%', icon: CheckCircle2 },
];

export function Stats() {
    return (
        <section className="py-20 md:py-32 bg-muted/30 border-y border-border">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="flex flex-col items-center text-center space-y-5 p-6 md:p-10 rounded-[2.5rem] bg-card border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
                        >
                            <div className="size-16 md:size-24 rounded-[1.8rem] bg-primary/5 text-primary flex items-center justify-center transition-transform duration-500 group-hover:bg-primary group-hover:text-white group-hover:-translate-y-2">
                                <stat.icon className="size-7 md:size-10" strokeWidth={1.5} />
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                                    {stat.value}
                                </div>
                                <div className="text-xs md:text-sm text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                                    {stat.label}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
