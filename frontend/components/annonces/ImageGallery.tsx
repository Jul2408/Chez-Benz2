'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn, Download } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Photo } from '@/types';

interface ImageGalleryProps {
    images: Photo[];
    title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const validImages = (images || []).filter(img => img && img.url && img.url.trim() !== '');

    // Fallback for no images
    if (validImages.length === 0) {
        return (
            <div className="aspect-[4/3] bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
                Aucune image
            </div>
        );
    }

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % validImages.length);
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div
                className="relative aspect-[4/3] md:aspect-[16/9] bg-black rounded-xl overflow-hidden group cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
            >
                <Image
                    src={validImages[currentIndex].url}
                    alt={`Photo ${currentIndex + 1} - ${title}`}
                    fill
                    className="object-contain"
                    priority
                />

                {/* Navigation Arrows */}
                {validImages.length > 1 && (
                    <>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg"
                            onClick={prevImage}
                        >
                            <ChevronLeft className="size-5" />
                        </Button>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg"
                            onClick={nextImage}
                        >
                            <ChevronRight className="size-5" />
                        </Button>
                    </>
                )}

                {/* Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    {currentIndex + 1} / {validImages.length}
                </div>
            </div>

            {/* Thumbnails */}
            {validImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
                    {validImages.map((image, index) => (
                        <button
                            key={image.id || index}
                            onClick={() => setCurrentIndex(index)}
                            className={cn(
                                "relative flex-shrink-0 size-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer snap-start",
                                currentIndex === index ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
                            )}
                        >
                            <Image
                                src={image.thumbnail_url || image.url}
                                alt={`Miniature ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <div className="absolute top-4 right-4 flex gap-2 z-10">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="text-white hover:bg-white/10 rounded-full"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(validImages[currentIndex].url, '_blank');
                                }}
                            >
                                <Download className="size-5" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="text-white hover:bg-white/10 rounded-full"
                                onClick={() => setIsLightboxOpen(false)}
                            >
                                <X className="size-6" />
                            </Button>
                        </div>

                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full h-12 w-12"
                            onClick={prevImage}
                        >
                            <ChevronLeft className="size-8" />
                        </Button>

                        <motion.div
                            key={currentIndex}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            className="relative w-full h-full max-h-[90vh] max-w-[90vw]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={validImages[currentIndex].url}
                                alt={`Zoom photo ${currentIndex + 1}`}
                                fill
                                className="object-contain"
                                quality={100}
                            />
                        </motion.div>

                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full h-12 w-12"
                            onClick={nextImage}
                        >
                            <ChevronRight className="size-8" />
                        </Button>

                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-1.5 rounded-full text-sm backdrop-blur-md">
                            {currentIndex + 1} sur {validImages.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
