import { z } from 'zod';
import { listingConfig } from '@/config/site';

/**
 * Schéma de validation pour la création/mise à jour d'une annonce
 */
export const listingSchema = z.object({
    title: z
        .string()
        .min(listingConfig.minTitleLength, `Le titre doit contenir au moins ${listingConfig.minTitleLength} caractères`)
        .max(listingConfig.maxTitleLength, `Le titre ne peut pas dépasser ${listingConfig.maxTitleLength} caractères`),
    description: z
        .string()
        .min(listingConfig.minDescriptionLength, `La description doit contenir au moins ${listingConfig.minDescriptionLength} caractères`)
        .max(listingConfig.maxDescriptionLength, `La description ne peut pas dépasser ${listingConfig.maxDescriptionLength} caractères`),
    price: z
        .number()
        .min(listingConfig.minPrice, 'Le prix doit être positif')
        .max(listingConfig.maxPrice, 'Le prix est trop élevé'),
    priceNegotiable: z.boolean().default(false),
    categoryId: z.string().uuid('Catégorie invalide'),
    condition: z.enum(['new', 'like_new', 'good', 'fair', 'parts'], {
        errorMap: () => ({ message: "État de l'article invalide" }),
    }),
    city: z.string().min(2, 'Ville requise'),
    region: z.string().min(2, 'Région requise'),
    location: z.string().min(2, 'Adresse requise'),
    images: z
        .array(z.string().url())
        .min(1, 'Au moins une image est requise')
        .max(listingConfig.maxImages, `Maximum ${listingConfig.maxImages} images`),
});

export type ListingFormData = z.infer<typeof listingSchema>;

/**
 * Schéma de validation pour l'inscription
 */
export const registerSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Le nom doit contenir au moins 2 caractères')
        .max(100, 'Le nom est trop long'),
    email: z.string().email('Email invalide'),
    phone: z
        .string()
        .regex(
            /^(237)?[62]\d{8}$/,
            'Numéro de téléphone camerounais invalide (ex: 6XXXXXXXX)'
        )
        .optional()
        .or(z.literal('')),
    password: z
        .string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
        .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
        .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
        .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Schéma de validation pour la connexion
 */
export const loginSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(1, 'Mot de passe requis'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Schéma de validation pour la connexion par téléphone/OTP
 */
export const phoneLoginSchema = z.object({
    phone: z
        .string()
        .regex(
            /^(237)?[62]\d{8}$/,
            'Numéro de téléphone camerounais invalide'
        ),
});

export type PhoneLoginFormData = z.infer<typeof phoneLoginSchema>;

export const otpVerifySchema = z.object({
    phone: z.string(),
    otp: z.string().length(6, 'Le code OTP doit contenir 6 chiffres'),
});

export type OtpVerifyFormData = z.infer<typeof otpVerifySchema>;

/**
 * Schéma de validation pour le profil
 */
export const profileSchema = z.object({
    fullName: z.string().min(2, 'Nom trop court').max(100, 'Nom trop long'),
    bio: z.string().max(500, 'Bio trop longue').optional(),
    location: z.string().max(100, 'Localisation trop longue').optional(),
    phone: z
        .string()
        .regex(/^(237)?[62]\d{8}$/, 'Numéro de téléphone invalide')
        .optional()
        .or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * Schéma de validation pour les messages
 */
export const messageSchema = z.object({
    content: z
        .string()
        .min(1, 'Le message ne peut pas être vide')
        .max(2000, 'Le message est trop long'),
});

export type MessageFormData = z.infer<typeof messageSchema>;

/**
 * Schéma de validation pour les signalements
 */
export const reportSchema = z.object({
    reason: z.enum(['spam', 'fraud', 'inappropriate', 'duplicate', 'other']),
    description: z.string().max(1000, 'Description trop longue').optional(),
});

export type ReportFormData = z.infer<typeof reportSchema>;

/**
 * Schéma de recherche
 */
export const searchSchema = z.object({
    query: z.string().optional(),
    category: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    condition: z.array(z.string()).optional(),
    sortBy: z.enum(['date', 'price_asc', 'price_desc', 'relevance']).optional(),
});

export type SearchFormData = z.infer<typeof searchSchema>;
