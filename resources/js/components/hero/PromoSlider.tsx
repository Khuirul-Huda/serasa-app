/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { PromoSlideItem } from '@/types';

interface PromoSliderProps {
    slides: PromoSlideItem[];
    onSelectQuery: (query: string) => void;
}

export default function PromoSlider({ slides, onSelectQuery }: PromoSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (slides.length <= 1) return;
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5500);

        return () => clearInterval(slideInterval);
    }, [slides.length]);

    if (!slides || slides.length === 0) {
        return null;
    }

    const handlePrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const handleNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    return (
        <div className="group/slider relative h-[280px] overflow-hidden rounded-3xl border border-navy-200/60 bg-navy-900 shadow-xs sm:h-[340px] lg:col-span-8">
            {slides.map((slide, index) => (
                <div
                    key={slide.id || `slide-${index}`}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        index === currentSlide
                            ? 'z-10 opacity-100'
                            : 'pointer-events-none z-0 opacity-0'
                    }`}
                >
                    <img
                        src={slide.image}
                        alt={slide.title}
                        width={800}
                        height={340}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="h-full w-full object-cover opacity-40 transition-transform duration-10000 hover:scale-105"
                        referrerPolicy="no-referrer"
                    />

                    <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-tr from-navy-900 via-navy-900/75 to-transparent p-6 text-white sm:p-10">
                        <div className="max-w-lg space-y-2 sm:space-y-3">
                            {slide.badge && (
                                <span className="inline-block rounded-md bg-pastel-peach px-3 py-1 text-xs font-black tracking-wider text-navy-900 uppercase">
                                    {slide.badge}
                                </span>
                            )}
                            <h2 className="sm:text-3.5xl text-xl leading-tight font-black tracking-tight text-white">
                                {slide.title}
                            </h2>
                            {slide.tagline && (
                                <p className="text-xs font-bold text-pastel-peach sm:text-sm">
                                    {slide.tagline}
                                </p>
                            )}
                            {slide.description && (
                                <p className="line-clamp-2 text-xs leading-relaxed font-normal text-navy-200 sm:text-sm">
                                    {slide.description}
                                </p>
                            )}
                            {slide.btnQuery && (
                                <div className="pt-2">
                                    <button
                                        onClick={() => onSelectQuery(slide.btnQuery)}
                                        className="cursor-pointer rounded-xl bg-pastel-coral px-5 py-2.5 text-xs font-extrabold tracking-wider text-white uppercase shadow-md transition-all hover:bg-pastel-coral/90"
                                    >
                                        Temukan Produk Warga
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
                        onClick={handlePrevSlide}
                        className="absolute top-1/2 left-4 z-20 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-xs transition-all group-hover/slider:opacity-100 hover:bg-white/30"
                        aria-label="Slide sebelumnya"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        onClick={handleNextSlide}
                        className="absolute top-1/2 right-4 z-20 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-xs transition-all group-hover/slider:opacity-100 hover:bg-white/30"
                        aria-label="Slide selanjutnya"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>

                    <div className="absolute bottom-4 left-6 z-20 flex gap-1.5 sm:left-10">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`h-1 w-2.5 cursor-pointer rounded-full transition-all ${
                                    i === currentSlide
                                        ? 'w-5 bg-pastel-teal'
                                        : 'bg-white/45 hover:bg-white/70'
                                }`}
                                aria-label={`Pilih slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
