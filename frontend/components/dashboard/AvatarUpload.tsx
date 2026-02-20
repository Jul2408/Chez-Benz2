'use client';

import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Camera, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AvatarUploadProps {
    currentAvatarUrl: string | null;
    onAvatarChange: (file: File | string) => void;
    editable?: boolean;
    className?: string;
    fullName?: string;
}

export function AvatarUpload({
    currentAvatarUrl,
    onAvatarChange,
    editable = true,
    className,
    fullName = 'User'
}: AvatarUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl);

    React.useEffect(() => {
        setPreviewUrl(currentAvatarUrl);
    }, [currentAvatarUrl]);

    // Initiales pour le fallback
    const initials = fullName
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation locale
        if (!file.type.startsWith('image/')) {
            toast.error('Veuillez sélectionner une image valide.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('L\'image ne doit pas dépasser 5 Mo.');
            return;
        }

        // Prévisualisation locale immédiate
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // On passe le fichier au parent pour l'upload final
        onAvatarChange(file);
    };

    const handleContainerClick = () => {
        if (editable && !isUploading) {
            fileInputRef.current?.click();
        }
    };

    return (
        <div className={cn("relative group", className)}>
            <div
                onClick={handleContainerClick}
                className={cn(
                    "relative size-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-muted flex items-center justify-center transition-all cursor-pointer",
                    editable && "group-hover:opacity-90 group-hover:scale-[1.02]"
                )}
            >
                {previewUrl ? (
                    <Image
                        src={previewUrl}
                        alt="Avatar"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                    />
                ) : (
                    <span className="text-3xl font-black text-muted-foreground select-none">{initials}</span>
                )}

                {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                        <Loader2 className="size-8 text-white animate-spin" />
                    </div>
                )}
            </div>

            {editable && (
                <>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        disabled={isUploading}
                    />
                    <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        onClick={handleContainerClick}
                        disabled={isUploading}
                        className="absolute bottom-0 right-0 rounded-full h-10 w-10 shadow-lg border-2 border-white dark:border-slate-800"
                    >
                        <Camera className="size-5 text-primary" />
                    </Button>
                </>
            )}
        </div>
    );
}
