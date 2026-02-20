// ============================================
// CHEZ-BEN2 - Client DigitalOcean Spaces
// ============================================

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { compressImage, generateThumbnail, generateUniqueFilename, validateImage } from './helpers';

// ============================================
// Configuration S3 Client pour DO Spaces
// ============================================

const s3Client = new S3Client({
    endpoint: process.env.DO_SPACES_ENDPOINT!,
    region: process.env.DO_SPACES_REGION!,
    credentials: {
        accessKeyId: process.env.DO_SPACES_KEY!,
        secretAccessKey: process.env.DO_SPACES_SECRET!,
    },
    forcePathStyle: false,
});

const BUCKET = process.env.DO_SPACES_BUCKET!;
const CDN_ENDPOINT = process.env.DO_SPACES_CDN_ENDPOINT || process.env.DO_SPACES_ENDPOINT;

// ============================================
// Types
// ============================================

export interface UploadResult {
    success: boolean;
    url: string;
    thumbnailUrl: string;
    filename: string;
    originalFilename: string;
    size: number;
    width: number;
    height: number;
    mimeType: string;
}

export interface UploadError {
    success: false;
    error: string;
    filename?: string;
}

export type UploadResponse = UploadResult | UploadError;

// ============================================
// Fonctions principales
// ============================================

/**
 * Upload une image vers DO Spaces avec compression
 * @param file - Buffer ou File de l'image
 * @param folder - Dossier de destination (annonces, avatars, etc.)
 * @param originalFilename - Nom original du fichier
 */
export async function uploadImage(
    file: Buffer,
    folder: string,
    originalFilename: string
): Promise<UploadResponse> {
    try {
        // Valider l'image
        const validation = await validateImage(file, originalFilename);
        if (!validation.valid) {
            return { success: false, error: validation.error! };
        }

        // Compresser l'image principale
        const compressed = await compressImage(file);

        // Générer le thumbnail
        const thumbnail = await generateThumbnail(file);

        // Générer les noms de fichiers uniques
        const filename = generateUniqueFilename(originalFilename);
        const thumbnailFilename = `thumb_${filename}`;

        // Chemins complets
        const imagePath = `${folder}/${filename}`;
        const thumbnailPath = `${folder}/thumbnails/${thumbnailFilename}`;

        // Upload image principale
        await s3Client.send(
            new PutObjectCommand({
                Bucket: BUCKET,
                Key: imagePath,
                Body: compressed.buffer,
                ContentType: compressed.mimeType,
                ACL: 'public-read',
                CacheControl: 'max-age=31536000', // 1 an
                Metadata: {
                    originalFilename,
                    width: compressed.width.toString(),
                    height: compressed.height.toString(),
                },
            })
        );

        // Upload thumbnail
        await s3Client.send(
            new PutObjectCommand({
                Bucket: BUCKET,
                Key: thumbnailPath,
                Body: thumbnail.buffer,
                ContentType: thumbnail.mimeType,
                ACL: 'public-read',
                CacheControl: 'max-age=31536000',
            })
        );

        // Construire les URLs
        const baseUrl = CDN_ENDPOINT?.replace(/\/$/, '') || `https://${BUCKET}.${process.env.DO_SPACES_REGION}.digitaloceanspaces.com`;
        const url = `${baseUrl}/${imagePath}`;
        const thumbnailUrl = `${baseUrl}/${thumbnailPath}`;

        return {
            success: true,
            url,
            thumbnailUrl,
            filename,
            originalFilename,
            size: compressed.buffer.length,
            width: compressed.width,
            height: compressed.height,
            mimeType: compressed.mimeType,
        };
    } catch (error) {
        console.error('Error uploading image:', error);
        return {
            success: false,
            error: 'Erreur lors de l\'upload de l\'image',
            filename: originalFilename,
        };
    }
}

/**
 * Upload plusieurs images en parallèle
 * @param files - Liste des fichiers avec buffer et nom
 * @param folder - Dossier de destination
 * @param maxImages - Nombre maximum d'images (défaut: 8)
 */
export async function uploadMultipleImages(
    files: Array<{ buffer: Buffer; filename: string }>,
    folder: string,
    maxImages: number = 8
): Promise<UploadResponse[]> {
    // Limiter le nombre d'images
    const filesToUpload = files.slice(0, maxImages);

    // Upload en parallèle avec limite de concurrence
    const results = await Promise.all(
        filesToUpload.map((file) => uploadImage(file.buffer, folder, file.filename))
    );

    return results;
}

/**
 * Supprimer une image de DO Spaces
 * @param url - URL complète de l'image ou chemin relatif
 */
export async function deleteImage(url: string): Promise<boolean> {
    try {
        // Extraire le chemin du fichier depuis l'URL
        let key = url;

        if (url.startsWith('http')) {
            const urlObj = new URL(url);
            key = urlObj.pathname.slice(1); // Enlever le / initial
        }

        // Supprimer l'image principale
        await s3Client.send(
            new DeleteObjectCommand({
                Bucket: BUCKET,
                Key: key,
            })
        );

        // Essayer de supprimer le thumbnail associé
        const parts = key.split('/');
        const filename = parts.pop();
        const folder = parts.join('/');
        const thumbnailKey = `${folder}/thumbnails/thumb_${filename}`;

        try {
            await s3Client.send(
                new DeleteObjectCommand({
                    Bucket: BUCKET,
                    Key: thumbnailKey,
                })
            );
        } catch {
            // Ignorer si le thumbnail n'existe pas
        }

        return true;
    } catch (error) {
        console.error('Error deleting image:', error);
        return false;
    }
}

/**
 * Supprimer plusieurs images
 */
export async function deleteMultipleImages(urls: string[]): Promise<boolean[]> {
    return Promise.all(urls.map((url) => deleteImage(url)));
}

/**
 * Générer une URL signée pour upload direct (optionnel)
 */
export async function getPresignedUploadUrl(
    folder: string,
    filename: string,
    contentType: string,
    expiresIn: number = 3600
): Promise<string> {
    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');

    const uniqueFilename = generateUniqueFilename(filename);
    const key = `${folder}/${uniqueFilename}`;

    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: contentType,
        ACL: 'public-read',
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });

    return signedUrl;
}
