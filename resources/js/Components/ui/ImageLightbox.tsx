import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
    images: string[];
    index: number | null;
    onClose: () => void;
    onPrev?: () => void;
    onNext?: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
    images,
    index,
    onClose,
    onPrev,
    onNext,
}) => {
    useEffect(() => {
        if (index === null) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft' && onPrev) onPrev();
            if (e.key === 'ArrowRight' && onNext) onNext();
        };

        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [index, onClose, onPrev, onNext]);

    if (index === null || images.length === 0) return null;

    return (
        <div 
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
            style={{ background: 'rgba(0,0,0,0.92)' }}
            onClick={onClose}
        >
            {/* Close button */}
            <button 
                onClick={onClose}
                className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
                aria-label="Tutup"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Counter */}
            {images.length > 1 && (
                <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-white/10 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full">
                        {index + 1} / {images.length}
                    </span>
                </div>
            )}

            {/* Prev button */}
            {images.length > 1 && onPrev && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="absolute left-4 md:left-8 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
                    aria-label="Sebelumnya"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
            )}

            {/* Image Container */}
            <div 
                className="relative max-w-5xl max-h-full w-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <img 
                    src={images[index]} 
                    alt={`Preview ${index + 1}`}
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
                />
            </div>

            {/* Next button */}
            {images.length > 1 && onNext && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="absolute right-4 md:right-8 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
                    aria-label="Berikutnya"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            )}

            {/* Thumbnail Navigation (Optional, skip for now for simplicity) */}
        </div>
    );
};
