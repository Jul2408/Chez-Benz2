/**
 * Configuration globale de l'application Chez-BEN2
 */

export const siteConfig = {
    name: 'Chez-BEN2',
    description: 'La plateforme de petites annonces #1 au Cameroun',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://chez-ben2.cm',
    ogImage: '/og-image.png',
    links: {
        facebook: 'https://facebook.com/chezben2',
        twitter: 'https://twitter.com/chezben2',
        instagram: 'https://instagram.com/chezben2',
    },
    contact: {
        email: 'contact@chez-ben2.cm',
        phone: '+237 6XX XXX XXX',
        address: 'Douala, Cameroun',
    },
};

export const listingConfig = {
    // Durée de validité d'une annonce (en jours)
    expirationDays: 30,
    // Nombre max d'images par annonce
    maxImages: 10,
    // Taille max d'une image (en Mo)
    maxImageSize: 5,
    // Formats d'images acceptés
    acceptedImageFormats: ['image/jpeg', 'image/png', 'image/webp'],
    // Prix minimum
    minPrice: 0,
    // Prix maximum
    maxPrice: 999999999,
    // Longueur min du titre
    minTitleLength: 10,
    // Longueur max du titre
    maxTitleLength: 80,
    // Longueur min de la description
    minDescriptionLength: 30,
    // Longueur max de la description
    // Longueur max de la description
    maxDescriptionLength: 5000,
    // Elements par page
    itemsPerPage: 12,
};

export const paginationConfig = {
    // Nombre d'éléments par page par défaut
    defaultLimit: 20,
    // Limite max d'éléments par page
    maxLimit: 100,
};

export const uploadConfig = {
    // Bucket DigitalOcean Spaces
    bucket: process.env.DO_SPACES_BUCKET || 'chez-ben2',
    // Région
    region: process.env.DO_SPACES_REGION || 'fra1',
    // Endpoint CDN
    cdnEndpoint: process.env.DO_SPACES_CDN_ENDPOINT || '',
    // Dossiers
    folders: {
        listings: 'annonces',
        avatars: 'avatars',
        documents: 'documents',
    },
};

export const authConfig = {
    // Durée de session (en secondes)
    sessionDuration: 60 * 60 * 24 * 7, // 7 jours
    // Expiration OTP (en secondes)
    otpExpiration: 60 * 5, // 5 minutes
    // Tentatives max de connexion
    maxLoginAttempts: 5,
    // Durée de blocage après échecs (en minutes)
    lockoutDuration: 15,
};

export const moderationConfig = {
    // Mots interdits (exemples)
    forbiddenWords: [
        'arnaque',
        'gratuit',
        'urgent',
        // Ajouter d'autres mots
    ],
    // Délai de réponse modération (en heures)
    responseTimeTarget: 24,
};
