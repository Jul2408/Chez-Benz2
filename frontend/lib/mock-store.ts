
export interface MockAnnonce {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    category_id: string;
    images: string[];
    city: string;
    user_id: string;
    status: 'ACTIVE' | 'DRAFT' | 'SOLD';
    created_at: string;
    slug: string;
    is_urgent?: boolean;
    is_featured?: boolean;
    views?: number;
    user?: {
        full_name: string;
        avatar_url?: string | null;
        rating?: number;
    };
}

const MOCK_DATA_KEY = 'chezben2_mock_annonces';

export const MockStore = {
    getInitial: (): MockAnnonce[] => {
        return INITIAL_MOCK_DATA;
    },

    getAll: (): MockAnnonce[] => {
        if (typeof window === 'undefined') return INITIAL_MOCK_DATA;
        const stored = localStorage.getItem(MOCK_DATA_KEY);
        if (!stored) {
            localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(INITIAL_MOCK_DATA));
            return INITIAL_MOCK_DATA;
        }
        return JSON.parse(stored);
    },

    getBySlug: (slug: string): MockAnnonce | undefined => {
        const all = MockStore.getAll();
        return all.find(a => a.slug === slug);
    },

    add: (annonce: Omit<MockAnnonce, 'id' | 'created_at' | 'slug' | 'views'>) => {
        const all = MockStore.getAll();
        const newAnnonce: MockAnnonce = {
            ...annonce,
            id: `mock-${Date.now()}`,
            created_at: new Date().toISOString(),
            slug: annonce.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000),
            views: 0,
        };
        const updated = [newAnnonce, ...all];
        if (typeof window !== 'undefined') {
            localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(updated));
        }
        return newAnnonce;
    },

    reset: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(MOCK_DATA_KEY);
        }
        return INITIAL_MOCK_DATA;
    }
};

const INITIAL_MOCK_DATA: MockAnnonce[] = [
    {
        id: 'mock-1',
        title: 'Toyota RAV4 2020 - Excellent état',
        description: 'Je vends ma Toyota RAV4 année 2020, très propre, climatisée, moteur impeccable. Entretien régulier chez le concessionnaire.',
        price: 15000000,
        currency: 'XAF',
        category_id: 'v2222222-2222-2222-2222-222222222222',
        images: [
            'https://images.unsplash.com/photo-1621007947382-bb3c3968e398?w=800&q=80',
            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80'
        ],
        city: 'Douala',
        user_id: 'mock-user-1',
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
        slug: 'toyota-rav4-2020-excellent-etat',
        is_featured: true,
        user: {
            full_name: 'Jean Auto',
            rating: 4.8
        }
    },
    {
        id: 'mock-2',
        title: 'Appartement Meublé - Bonapriso',
        description: 'Magnifique appartement 2 chambres salon, entièrement meublé et équipé. Idéal pour expatriés ou longs séjours.',
        price: 500000,
        currency: 'XAF',
        category_id: 'i3333333-3333-3333-3333-333333333333',
        images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
            'https://images.unsplash.com/photo-1502005229762-cf1afd34cd75?w=800&q=80'
        ],
        city: 'Douala',
        user_id: 'mock-user-2',
        status: 'ACTIVE',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        slug: 'appartement-meuble-bonapriso',
        is_urgent: true,
        user: {
            full_name: 'Immo Pro 237',
            rating: 5.0
        }
    },
    {
        id: 'mock-3',
        title: 'iPhone 13 Pro Max 256GB',
        description: 'iPhone 13 Pro Max en parfait état, batterie 90%. Vendu avec chargeur et coque de protection.',
        price: 650000,
        currency: 'XAF',
        category_id: 'e1111111-1111-1111-1111-111111111111',
        images: [
            'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&q=80',
            'https://images.unsplash.com/photo-1691432746404-368686762308?w=800&q=80'
        ],
        city: 'Yaoundé',
        user_id: 'mock-user-3',
        status: 'ACTIVE',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        slug: 'iphone-13-pro-max-256gb',
        user: {
            full_name: 'High Tech Deals',
            avatar_url: null,
            rating: 4.5
        }
    },
    {
        id: 'mock-4',
        title: 'Canapé d\'angle gris moderne',
        description: 'Grand canapé confortable, tissu gris chiné. Quelques traces d\'usure mais bon état général. À récupérer sur place.',
        price: 150000,
        currency: 'XAF',
        category_id: 'maison-jardin',
        images: [
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'
        ],
        city: 'Douala',
        user_id: 'mock-user-4',
        status: 'ACTIVE',
        created_at: new Date(Date.now() - 200000).toISOString(),
        slug: 'canape-angle-gris-moderne',
        user: {
            full_name: 'Sarah M.',
            rating: 4.0
        }
    },
    {
        id: 'mock-5',
        title: 'Services de Jardinage Pro',
        description: 'Jardinier expérimenté propose ses services : tonte, taille de haies, création de massifs. Devis gratuit.',
        price: 0,
        currency: 'XAF',
        category_id: 'emploi-services',
        images: [
            'https://images.unsplash.com/photo-1599309995116-f643e6224168?w=800&q=80'
        ],
        city: 'Yaoundé',
        user_id: 'mock-user-5',
        status: 'ACTIVE',
        created_at: new Date(Date.now() - 500000).toISOString(),
        slug: 'services-de-jardinage-pro',
        user: {
            full_name: 'Nature Verte',
            rating: 4.9
        }
    }
];
