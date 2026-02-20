'use client';

import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Camera, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CoverUploadProps {
    currentCoverUrl: string | null;
    onCoverChange: (file: File | string) => void;
    editable?: boolean;
    className?: string;
}

export function CoverUpload({
    currentCoverUrl,
    onCoverChange,
    editable = true,
    className
}: CoverUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentCoverUrl);

    React.useEffect(() => {
        setPreviewUrl(currentCoverUrl);
    }, [currentCoverUrl]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Veuillez sélectionner une image valide.');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error('L\'image ne doit pas dépasser 10 Mo.');
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        onCoverChange(file);
    };

    const handleContainerClick = () => {
        if (editable && !isUploading) {
            fileInputRef.current?.click();
        }
    };

    return (
        <div className={cn("relative w-full h-48 md:h-64 rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-800", className)}>
            {previewUrl ? (
                <Image
                    src={previewUrl}
                    alt="Cover"
                    fill
                    className="object-cover"
                    priority
                />
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <ImageIcon className="size-10 stroke-[1]" />
                    <p className="text-sm font-medium">Ajouter une bannière professionnelle</p>
                </div>
            )}

            {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 backdrop-blur-sm">
                    <Loader2 className="size-10 text-white animate-spin" />
                </div>
            )}

            {editable && (
                <div className="absolute bottom-4 right-4 z-20">
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
                        onClick={handleContainerClick}
                        disabled={isUploading}
                        className="rounded-full bg-white/90 hover:bg-white text-slate-900 border-none shadow-xl backdrop-blur-sm font-bold gap-2"
                    >
                        <Camera className="size-4" />
                        Changer la bannière
                    </Button>
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-none" />
        </div>
    );
}
