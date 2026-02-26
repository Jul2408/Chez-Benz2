'use client';

import * as ReactModule from 'react';
const React = ReactModule as any;
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageCarouselProps {
    images: string[];
    title: string;
}

export function ImageCarousel({ images, title }: ImageCarouselProps) {
    const [mainEmblaRef, mainEmblaApi] = useEmblaCarousel();
    const [thumbEmblaRef, thumbEmblaApi] = useEmblaCarousel({
        containScroll: 'keepSnaps',
        dragFree: true,
    } as any);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const onSelect = React.useCallback(() => {
        if (!mainEmblaApi || !thumbEmblaApi) return;
        setSelectedIndex(mainEmblaApi.selectedScrollSnap());
        thumbEmblaApi.scrollTo(mainEmblaApi.selectedScrollSnap());
    }, [mainEmblaApi, thumbEmblaApi]);

    React.useEffect(() => {
        if (!mainEmblaApi) return;
        onSelect();
        mainEmblaApi.on('select', onSelect);
        mainEmblaApi.on('reInit', onSelect);
    }, [mainEmblaApi, onSelect]);

    const scrollPrev = React.useCallback(() => mainEmblaApi && (mainEmblaApi as any).scrollPrev(), [mainEmblaApi]);
    const scrollNext = React.useCallback(() => mainEmblaApi && (mainEmblaApi as any).scrollNext(), [mainEmblaApi]);
    const scrollTo = React.useCallback((index: number) => mainEmblaApi && (mainEmblaApi as any).scrollTo(index), [mainEmblaApi]);

    const validImages = (images || []).filter(img => typeof img === 'string' && img.trim() !== '');

    if (validImages.length === 0) {
        return (
            <div className="aspect-[4/3] bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
                Pas d'image disponible
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Carousel */}
            <div className="relative group">
                <div className="overflow-hidden rounded-xl bg-black aspect-[4/3]" ref={mainEmblaRef as any}>
                    <div className="flex touch-pan-y">
                        {validImages.map((src, index) => (
                            <div className="flex-[0_0_100%] min-w-0 relative aspect-[4/3]" key={index}>
                                <Image
                                    src={src}
                                    alt={`${title} - Image ${index + 1}`}
                                    fill
                                    className="object-contain"
                                    priority={index === 0}
                                    unoptimized={src.startsWith('data:')}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                {validImages.length > 1 && (
                    <>
                        <Button
                            {...({
                                variant: "secondary",
                                size: "icon",
                                className: "absolute left-4 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
                                onClick: scrollPrev
                            } as any)}
                        >
                            <ChevronLeft className="size-5" {...({} as any)} />
                        </Button>
                        <Button
                            {...({
                                variant: "secondary",
                                size: "icon",
                                className: "absolute right-4 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
                                onClick: scrollNext
                            } as any)}
                        >
                            <ChevronRight className="size-5" {...({} as any)} />
                        </Button>

                        {/* Counter Badge */}
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium pointer-events-none">
                            {selectedIndex + 1} / {validImages.length}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {validImages.length > 1 && (
                <div className="overflow-hidden px-1" ref={thumbEmblaRef as any}>
                    <div className="flex -ml-2 gap-2 p-1">
                        {validImages.map((src, index) => (
                            <button
                                key={index}
                                onClick={() => scrollTo(index)}
                                className={cn(
                                    "flex-[0_0_20%] min-w-0 relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                                    index === selectedIndex ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
                                )}
                            >
                                <Image
                                    src={src}
                                    alt={`Miniature ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    unoptimized={src.startsWith('data:')}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
