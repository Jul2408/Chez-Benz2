'use client';

import * as ReactModule from 'react';
const React = ReactModule as any;
import { CreateListingState } from './types';
import { Button } from '@/components/ui/button';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface PhotosStepProps {
    defaultValues: Partial<CreateListingState>;
    onNext: (data: { images: CreateListingState['images'] }) => void;
    onBack: () => void;
}

export function PhotosStep({ defaultValues, onNext, onBack }: PhotosStepProps) {
    const [images, setImages] = React.useState((defaultValues.images || []) as CreateListingState['images']);
    const [uploading, setUploading] = React.useState(false);

    const onDrop = React.useCallback((acceptedFiles: File[]) => {
        const newImages = acceptedFiles.map(file => ({
            file,
            previewUrl: URL.createObjectURL(file), // Local preview
            uploading: false
        }));

        setImages((prev: any[]) => {
            if (prev.length + newImages.length > 10) {
                toast.error("Maximum 10 images autorisées");
                return prev;
            }
            return [...prev, ...newImages];
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': []
        },
        maxSize: 5 * 1024 * 1024, // 5MB
    } as any);

    const removeImage = (index: number) => {
        setImages((prev: any[]) => {
            const newImages = [...prev];
            if (newImages[index].previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(newImages[index].previewUrl);
            }
            newImages.splice(index, 1);
            return newImages;
        });
    };

    const handleNext = async () => {
        if (images.length === 0) {
            toast.error("Veuillez ajouter au moins une photo");
            return;
        }

        setUploading(true);
        const updatedImages = [...images];

        // Convert images to base64 for local testing (no cloud upload)
        for (let i = 0; i < updatedImages.length; i++) {
            if (!updatedImages[i].uploadUrl && updatedImages[i].file) {
                updatedImages[i].uploading = true;
                setImages([...updatedImages]);

                try {
                    // Convert file to base64 data URL
                    const file = updatedImages[i].file as File;
                    const base64 = await new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });

                    // Use base64 as uploadUrl for local testing
                    updatedImages[i].uploadUrl = base64;
                    updatedImages[i].uploading = false;
                } catch (error) {
                    console.error("Image processing error", error);
                    // Even if conversion fails, use preview URL as fallback
                    updatedImages[i].uploadUrl = updatedImages[i].previewUrl;
                    updatedImages[i].uploading = false;
                }
                setImages([...updatedImages]);
            }
        }

        setUploading(false);
        toast.success("Images prêtes !");
        onNext({ images: updatedImages });
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="bg-muted/30 border-2 border-dashed rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer" {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Upload className="size-6" {...({} as any)} />
                    </div>
                    {isDragActive ? (
                        <p className="font-medium text-primary">Déposez les images ici...</p>
                    ) : (
                        <>
                            <p className="font-medium">Cliquez pour ajouter des photos</p>
                            <p className="text-sm text-muted-foreground">ou glissez-déposez vos fichiers ici (Max 10 images, 5Mo/image)</p>
                        </>
                    )}
                </div>
            </div>

            {/* Image Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img: any, idx: number) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border bg-background group shadow-sm">
                            <Image
                                src={img.previewUrl}
                                alt={`Aperçu ${idx}`}
                                fill
                                className="object-cover"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-start justify-end p-2 text-white">
                                <button
                                    onClick={(e: any) => { e.stopPropagation(); removeImage(idx); }}
                                    className="bg-red-500/90 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="size-4" {...({} as any)} />
                                </button>
                            </div>

                            {/* Status */}
                            {img.uploading && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white backdrop-blur-sm">
                                    <Loader2 className="size-8 animate-spin" {...({} as any)} />
                                </div>
                            )}

                            {img.error && (
                                <div className="absolute bottom-0 left-0 right-0 bg-red-600/90 text-white text-[10px] p-1 text-center font-bold uppercase tracking-wider">
                                    Échec du chargement
                                </div>
                            )}

                            {img.uploadUrl && !img.uploading && (
                                <div className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-1 shadow-md border-2 border-white">
                                    <CheckIcon />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-between pt-6">
                <Button variant="ghost" onClick={onBack} disabled={uploading} className="rounded-xl" {...({} as any)}>
                    Précédent
                </Button>
                <Button onClick={handleNext} disabled={uploading} className="rounded-xl px-8" {...({} as any)}>
                    {uploading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" {...({} as any)} />
                            Upload...
                        </>
                    ) : (
                        'Suivant'
                    )}
                </Button>
            </div>
        </div>
    );
}

function CheckIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="size-3"><polyline points="20 6 9 17 4 12" /></svg>
}
