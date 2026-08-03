/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PromoSlideItem } from '@/types';

interface PromoSliderProps {
    slides: PromoSlideItem[];
    onSelectQuery: (query: string) => void;
}

export default function PromoSlider({ slides, onSelectQuery }: PromoSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const handlePrevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    const handleNextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        if (slides.length <= 1 || isPaused) return;
        const slideInterval = setInterval(() => {
            handleNextSlide();
        }, 5500);

        return () => clearInterval(slideInterval);
    }, [slides.length, isPaused, handleNextSlide]);

    if (!slides || slides.length === 0) {
        return null;
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        touchEndX.current = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                handleNextSlide();
            } else {
                handlePrevSlide();
            }
        }
    };

    return (
        <div
            className="group/slider relative h-[200px] overflow-hidden rounded-2xl border border-navy-200/60 bg-navy-900 shadow-xs sm:h-[260px] sm:rounded-3xl lg:col-span-8 lg:h-[300px] dark:border-navy-800"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-label="Promo carousel"
        >
            {slides.map((slide, index) => (
                <div
                    key={slide.id || `slide-${index}`}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        index === currentSlide
                            ? 'z-10 opacity-100'
                            : 'pointer-events-none z-0 opacity-0'
                    }`}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`Slide ${index + 1} dari ${slides.length}: ${slide.title}`}
                >
                    <img
                        src={slide.image}
                        alt={slide.title}
                        width={800}
                        height={300}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        sizes="(max-width: 768px) 100vw, 66vw"
                        className="h-full w-full object-cover opacity-40"
                        referrerPolicy="no-referrer"
                    />

                    <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-tr from-navy-900 via-navy-900/75 to-transparent p-5 text-white sm:p-8">
                        <div className="max-w-lg space-y-1.5 sm:space-y-2">
                            {slide.badge && (
                                <span className="inline-block rounded-md bg-pastel-peach px-2.5 py-0.5 text-[10px] font-black tracking-wider text-navy-900 uppercase sm:px-3 sm:py-1 sm:text-xs">
                                    {slide.badge}
                                </span>
                            )}
                            <h2 className="text-lg leading-tight font-black tracking-tight text-white sm:text-2xl lg:text-3xl">
                                {slide.title}
                            </h2>
                            {slide.tagline && (
                                <p className="text-[11px] font-bold text-pastel-peach sm:text-sm">
                                    {slide.tagline}
                                </p>
                            )}
                            {slide.description && (
                                <p className="line-clamp-2 hidden text-xs leading-relaxed font-normal text-navy-200 sm:block sm:text-sm">
                                    {slide.description}
                                </p>
                            )}
                            {slide.btnQuery && (
                                <div className="pt-1 sm:pt-2">
                                    <button
                                        type="button"
                                        onClick={() => onSelectQuery(slide.btnQuery)}
                                        className="min-h-[44px] cursor-pointer rounded-xl bg-pastel-coral px-4 py-2.5 text-xs font-extrabold tracking-wider text-white uppercase shadow-md transition-all hover:bg-pastel-coral/90 sm:px-5"
                                    >
                                        Temukan Produk
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {slides.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={handlePrevSlide}
                        className="absolute top-1/2 left-3 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-xs transition-all hover:bg-white/30 sm:left-4"
                        aria-label="Slide sebelumnya"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={handleNextSlide}
                        className="absolute top-1/2 right-3 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-xs transition-all hover:bg-white/30 sm:right-4"
                        aria-label="Slide selanjutnya"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>

                    <div className="absolute bottom-3 left-5 z-20 flex items-center gap-2 sm:bottom-4 sm:left-8">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setCurrentSlide(i)}
                                className={`h-2 cursor-pointer rounded-full transition-all ${
                                    i === currentSlide
                                        ? 'w-6 bg-pastel-teal'
                                        : 'w-2 bg-white/45 hover:bg-white/70'
                                }`}
                                aria-label={`Pilih slide ${i + 1}`}
                            />
                        ))}

                        <button
                            type="button"
                            onClick={() => setIsPaused(!isPaused)}
                            className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xs text-white backdrop-blur-xs transition-all hover:bg-white/40 sm:h-10 sm:w-10"
                            aria-label={isPaused ? 'Lanjutkan auto-slide' : 'Jeda auto-slide'}
                        >
                            {isPaused ? '▶' : '⏸'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
