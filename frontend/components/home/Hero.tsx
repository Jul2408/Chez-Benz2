'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { SearchBar } from '@/components/annonces/SearchBar';
import { MAJOR_CITIES } from '@/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function Hero() {
    const router = useRouter();
    const [selectedCity, setSelectedCity] = useState('');
    const allCities = Object.values(MAJOR_CITIES).flat().sort();

    const handleCityChange = (city: string) => {
        setSelectedCity(city);
        if (city && city !== 'all') {
            router.push(`/annonces?city=${city}`);
        }
    };

    return (
        <section className="relative min-h-[600px] flex items-center justify-center bg-primary text-white overflow-hidden">
            {/* Arrière-plan décoratif - opacité gérée pour ne pas gêner les textes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <svg className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 w-[800px] h-[800px] opacity-10" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#FFFFFF" d="M42.7,-62.9C50.9,-52.8,50.1,-34.4,51.7,-19.2C53.4,-4,57.4,8,54,17.7C50.6,27.4,39.8,34.8,29.1,41.7C18.4,48.6,7.7,55,-3.6,59.9C-14.9,64.9,-26.9,68.4,-36.8,63.2C-46.7,58,-54.5,44.1,-58.5,30.3C-62.5,16.5,-62.7,2.8,-58.9,-9.2C-55.1,-21.2,-47.3,-31.5,-37.7,-41C-28.1,-50.5,-16.7,-59.2,-2.7,-55.5C11.3,-51.8,22.6,-35.7,34.5,-73.1L42.7,-62.9Z" transform="translate(100 100)" />
                </svg>
            </div>

            <div className="relative container mx-auto px-4 py-20 z-10">
                <div className="max-w-5xl mx-auto text-center space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-9xl font-black mb-8 tracking-tighter leading-[0.85] drop-shadow-sm">
                            ACHETEZ & VENDEZ <br />
                            <span className="text-yellow-300">PRÈS DE CHEZ VOUS.</span>
                        </h1>
                        <p className="text-xl md:text-3xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
                            La place de marché ultime au Cameroun. <br className="hidden md:block" />
                            Immobilier, Véhicules, Tech & bien plus.
                        </p>
                    </motion.div>

                    {/* Bloc de Recherche - Garde un fond contrasté pour être l'élément central */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white dark:bg-gray-100 p-4 rounded-[2.5rem] shadow-2xl shadow-black/20 max-w-4xl mx-auto flex flex-col md:flex-row gap-3 ring-8 ring-white/10"
                    >
                        {/* Sélecteur de ville - S'adapte au mode sombre pour ne pas être trop vif */}
                        <div className="w-full md:w-56 shrink-0">
                            <Select onValueChange={handleCityChange}>
                                <SelectTrigger className="h-16 border-0 bg-gray-50 hover:bg-gray-200 text-gray-800 rounded-[1.8rem] font-bold focus:ring-0 px-6 transition-colors">
                                    <div className="flex items-center gap-3 truncate">
                                        <MapPin className="size-6 text-primary shrink-0" />
                                        <SelectValue placeholder="Toutes les villes" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl bg-white dark:bg-white text-gray-900">
                                    <SelectItem value="all">Tout le Cameroun</SelectItem>
                                    <SelectItem value="Douala">Douala</SelectItem>
                                    <SelectItem value="Yaoundé">Yaoundé</SelectItem>
                                    <SelectItem value="Bafoussam">Bafoussam</SelectItem>
                                    <SelectItem value="Garoua">Garoua</SelectItem>
                                    <SelectItem value="Kribi">Kribi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Composant Barre de recherche - Enveloppé pour garantir le contraste */}
                        <div className="flex-1 text-gray-900">
                            <SearchBar className="dark:text-gray-900" />
                        </div>
                    </motion.div>

                    {/* Tags populaires - Haute visibilité */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="flex flex-wrap justify-center gap-4 text-sm md:text-base text-white font-bold"
                    >
                        <span className="opacity-70">En ce moment :</span>
                        {['iPhone 15', 'Toyota Yaris', 'Terrain Kribi', 'PS5', 'Douala', 'Yaoundé'].map(tag => (
                            <button key={tag} className="hover:text-yellow-300 hover:underline underline-offset-4 transition-all">
                                {tag}
                            </button>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
