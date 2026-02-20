// ============================================
// CHEZ-BEN2 - Helpers pour le traitement d'images
// ============================================

import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

// ============================================
// Configuration
// ============================================

const CONFIG = {
    maxFileSize: 5 * 1024 * 1024, // 5 Mo
    maxWidth: 1200,
    maxHeight: 1200,
    thumbnailWidth: 400,
    thumbnailHeight: 400,
    quality: 80,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    outputFormat: 'webp' as const,
};

// ============================================
// Types
// ============================================

export interface ValidationResult {
    valid: boolean;
    error?: string;
    mimeType?: string;
    width?: number;
    height?: number;
}

export interface CompressedImage {
    buffer: Buffer;
    width: number;
    height: number;
    mimeType: string;
    size: number;
}

// ============================================
// Validation
// ============================================

/**
 * Valider une image (taille, format, dimensions)
 */
export async function validateImage(
    buffer: Buffer,
    filename: string
): Promise<ValidationResult> {
    // Vérifier la taille du fichier
    if (buffer.length > CONFIG.maxFileSize) {
        return {
            valid: false,
            error: `L'image dépasse la taille maximale de ${CONFIG.maxFileSize / 1024 / 1024} Mo`,
        };
    }

    // Vérifier l'extension
    const ext = filename.toLowerCase().match(/\.[^.]+$/)?.[0];
    if (!ext || !CONFIG.allowedExtensions.includes(ext)) {
        return {
            valid: false,
            error: `Format non supporté. Formats acceptés: ${CONFIG.allowedExtensions.join(', ')}`,
        };
    }

    try {
        // Lire les métadonnées de l'image avec Sharp
        const metadata = await sharp(buffer).metadata();

        if (!metadata.format || !metadata.width || !metadata.height) {
            return {
                valid: false,
                error: 'Impossible de lire les informations de l\'image',
            };
        }

        // Vérifier le format
        const mimeType = `image/${metadata.format}`;
        if (!CONFIG.allowedMimeTypes.includes(mimeType)) {
            return {
                valid: false,
                error: `Format d'image non supporté: ${metadata.format}`,
            };
        }

        return {
            valid: true,
            mimeType,
            width: metadata.width,
            height: metadata.height,
        };
    } catch (error) {
        console.error('Error validating image:', error);
        return {
            valid: false,
            error: 'Fichier image invalide ou corrompu',
        };
    }
}

// ============================================
// Compression
// ============================================

/**
 * Compresser une image avec Sharp
 * - Redimensionne à max 1200px
 * - Convertit en WebP
 * - Qualité 80%
 */
export async function compressImage(buffer: Buffer): Promise<CompressedImage> {
    try {
        const metadata = await sharp(buffer).metadata();

        let sharpInstance = sharp(buffer)
            .rotate() // Auto-rotation selon EXIF
            .resize({
                width: CONFIG.maxWidth,
                height: CONFIG.maxHeight,
                fit: 'inside',
                withoutEnlargement: true,
            });

        // Convertir en WebP pour de meilleures performances
        sharpInstance = sharpInstance.webp({
            quality: CONFIG.quality,
            effort: 4, // Balance entre vitesse et compression
        });

        const compressedBuffer = await sharpInstance.toBuffer();
        const compressedMetadata = await sharp(compressedBuffer).metadata();

        return {
            buffer: compressedBuffer,
            width: compressedMetadata.width!,
            height: compressedMetadata.height!,
            mimeType: 'image/webp',
            size: compressedBuffer.length,
        };
    } catch (error) {
        console.error('Error compressing image:', error);
        throw new Error('Erreur lors de la compression de l\'image');
    }
}

/**
 * Générer un thumbnail
 * - Redimensionne à 400px
 * - Convertit en WebP
 * - Qualité 80%
 */
export async function generateThumbnail(buffer: Buffer): Promise<CompressedImage> {
    try {
        const thumbnailBuffer = await sharp(buffer)
            .rotate()
            .resize({
                width: CONFIG.thumbnailWidth,
                height: CONFIG.thumbnailHeight,
                fit: 'cover',
                position: 'centre',
            })
            .webp({
                quality: CONFIG.quality,
            })
            .toBuffer();

        const metadata = await sharp(thumbnailBuffer).metadata();

        return {
            buffer: thumbnailBuffer,
            width: metadata.width!,
            height: metadata.height!,
            mimeType: 'image/webp',
            size: thumbnailBuffer.length,
        };
    } catch (error) {
        console.error('Error generating thumbnail:', error);
        throw new Error('Erreur lors de la génération du thumbnail');
    }
}

// ============================================
// Utilitaires
// ============================================

/**
 * Générer un nom de fichier unique
 */
export function generateUniqueFilename(originalFilename: string): string {
    const uuid = uuidv4().slice(0, 8);
    const timestamp = Date.now();
    const ext = '.webp'; // Toujours WebP après compression

    // Nettoyer le nom original (sans extension)
    const baseName = originalFilename
        .replace(/\.[^.]+$/, '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 50);

    return `${baseName}-${timestamp}-${uuid}${ext}`;
}

/**
 * Extraire le nom du fichier depuis une URL
 */
export function getFilenameFromUrl(url: string): string {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        return pathname.split('/').pop() || '';
    } catch {
        return url.split('/').pop() || '';
    }
}

/**
 * Générer un blurhash pour le placeholder (optionnel)
 */
export async function generateBlurhash(buffer: Buffer): Promise<string | null> {
    try {
        const { encode } = await import('blurhash');

        const { data, info } = await sharp(buffer)
            .resize(32, 32, { fit: 'inside' })
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const blurhash = encode(
            new Uint8ClampedArray(data),
            info.width,
            info.height,
            4,
            3
        );

        return blurhash;
    } catch {
        return null;
    }
}

/**
 * Obtenir les dimensions optimales pour l'affichage
 */
export function getDisplayDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
): { width: number; height: number } {
    const aspectRatio = originalWidth / originalHeight;

    let width = originalWidth;
    let height = originalHeight;

    if (width > maxWidth) {
        width = maxWidth;
        height = Math.round(width / aspectRatio);
    }

    if (height > maxHeight) {
        height = maxHeight;
        width = Math.round(height * aspectRatio);
    }

    return { width, height };
}
