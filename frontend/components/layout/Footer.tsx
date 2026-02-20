'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Twitter, Instagram, Linkedin, Heart, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-muted/50 border-t pt-16 pb-24 md:pb-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
                                B
                            </div>
                            <span className="font-outfit font-bold text-xl tracking-tight">
                                Chez-<span className="text-primary">BEN2</span>
                            </span>
                        </Link>
                        <p className="text-foreground/80 text-sm max-w-xs">
                            La meilleure plateforme pour acheter et vendre en toute confiance au Cameroun.
                            Simple, rapide et sécurisé.
                        </p>
                        <div className="flex items-center gap-4">
                            <SocialLink href="#" icon={Facebook} />
                            <SocialLink href="#" icon={Twitter} />
                            <SocialLink href="#" icon={Instagram} />
                            <SocialLink href="#" icon={Linkedin} />
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Liens rapides</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <FooterLink href="/a-propos">À propos</FooterLink>
                            <FooterLink href="/comment-ca-marche">Comment ça marche</FooterLink>
                            <FooterLink href="/securite">Conseils de sécurité</FooterLink>
                            <FooterLink href="/contact">Contact</FooterLink>
                            <FooterLink href="/aide">Centre d'aide</FooterLink>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-semibold mb-4">Catégories</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <FooterLink href="/annonces?category=vehicules">Véhicules</FooterLink>
                            <FooterLink href="/annonces?category=immobilier">Immobilier</FooterLink>
                            <FooterLink href="/annonces?category=multimedia">Multimédia</FooterLink>
                            <FooterLink href="/annonces?category=mode">Mode & Beauté</FooterLink>
                            <FooterLink href="/annonces?category=maison">Maison & Déco</FooterLink>
                        </ul>
                    </div>

                    {/* Newsletter / Contact */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Newsletter</h3>
                        <p className="text-sm text-muted-foreground">
                            Recevez les meilleures offres directement dans votre boîte mail.
                        </p>
                        <div className="flex gap-2">
                            <Input placeholder="Votre email" className="bg-background" />
                            <Button size="icon" className="shrink-0 bg-primary hover:bg-primary/90">
                                <Mail className="size-4" />
                            </Button>
                        </div>

                        <div className="space-y-2 pt-4 border-t border-border/50">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="size-4 text-primary" />
                                <span>+237 690 00 00 00</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="size-4 text-primary" />
                                <span>Douala, Cameroun</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <div>
                        &copy; {new Date().getFullYear()} Chez-BEN2. Tous droits réservés.
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/cgu" className="hover:text-primary transition-colors">CGU</Link>
                        <Link href="/confidentialite" className="hover:text-primary transition-colors">Confidentialité</Link>
                        <Link href="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
                        <div className="flex items-center gap-1 ml-4 text-xs font-medium">
                            Fait avec <Heart className="size-3 text-red-500 fill-current animate-pulse" /> au Cameroun
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon: Icon }: { href: string; icon: any }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="size-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all"
        >
            <Icon className="size-4" />
        </a>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="hover:text-primary hover:translate-x-1 block transition-all">
                {children}
            </Link>
        </li>
    );
}
