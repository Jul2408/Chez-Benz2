import { Metadata, Viewport } from 'next';


import { Providers } from '@/components/providers';
import { AppShell } from '@/components/layout/AppShell';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { Inter, Outfit } from 'next/font/google';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });



export const metadata: Metadata = {
    title: {
        default: 'Chez-BEN2 - Petites annonces au Cameroun',
        template: '%s | Chez-BEN2',
    },
    description: 'Achetez et vendez facilement au Cameroun. Véhicules, Immobilier, Mode, Multimédia et plus encore.',
    keywords: ['Cameroun', 'Petites annonces', 'Vente', 'Achat', 'Douala', 'Yaoundé', 'Immobilier', 'Voitures'],
    authors: [{ name: 'Chez-BEN2 Team' }],
    creator: 'Chez-BEN2',
    metadataBase: new URL('https://chez-ben2.cm'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'fr_CM',
        url: 'https://chez-ben2.cm',
        title: 'Chez-BEN2 - Petites annonces au Cameroun',
        description: 'La meilleure plateforme pour acheter et vendre en toute confiance au Cameroun.',
        siteName: 'Chez-BEN2',
    },
};

export const viewport: Viewport = {
    themeColor: '#E63946',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <head />
            <body
                className={cn(
                    'min-h-screen bg-background font-sans antialiased text-foreground selection:bg-primary/20 selection:text-primary',
                    inter.variable,
                    outfit.variable
                )}
            >
                <Providers>
                    <AppShell>
                        {children}
                    </AppShell>
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
