/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { router } from '@inertiajs/react';
import {
    Search,
    MapPin,
    ChevronLeft,
    ChevronRight,
    Flame,
    ThumbsUp,
    Tag,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { AppSettings, Category, Product } from '@/types';
import { formatIDR } from '@/utils';

interface HeroProps {
    settings: AppSettings;
    categories: Category[];
    products?: Product[];
    selectedCategory: string;
    setSelectedCategory: (catId: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    totalShops: number;
    totalProducts: number;
}

const promoSlides = [
    {
        id: 'slide-1',
        title: 'Susu Sapi Murni Samirono',
        tagline: 'Diskon 10% Spesial Minggu Ini',
        description:
            'Segar murni dari peternakan lereng Gunung Merbabu, diperah higienis harian oleh warga desa.',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
        badge: '🥛 SUSU SEGAR',
        btnQuery: 'susu',
    },
    {
        id: 'slide-2',
        title: 'Keju Mozzarella & Ricotta',
        tagline: 'Karya Tani Unggulan Samirono',
        description:
            'Diproduksi oleh sentra pengolahan susu Samirono dengan cita rasa keju eropa bersertifikat pangan.',
        image: 'https://images.unsplash.com/photo-1559561853-080268185995?auto=format&fit=crop&w=800&q=80',
        badge: '🧀 KEJU LOKAL',
        btnQuery: 'keju',
    },
    {
        id: 'slide-3',
        title: 'Kerajinan Anyaman Bambu',
        tagline: '100% Produk Kreatif Ramah Lingkungan',
        description:
            'Dianyam telaten dengan bambu pilihan lereng pegunungan untuk perabot estetis fungsional.',
        image: 'https://images.unsplash.com/photo-1590736969955-71cb94801759?auto=format&fit=crop&w=800&q=80',
        badge: '🎋 KRIYA BAMBU',
        btnQuery: 'anyaman',
    },
];

export default function Hero({
    settings,
    categories,
    products = [],
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    totalProducts,
}: HeroProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [timeLeft, setTimeLeft] = useState({
        hours: 3,
        minutes: 44,
        seconds: 12,
    });

    const featuredProduct =
        products.length > 0
            ? products.find((p) => p.isAvailable) || products[0]
            : null;

    // Carousel Auto-advance
    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
        }, 5500);

        return () => clearInterval(slideInterval);
    }, []);

    // Countdown timer simulation for e-commerce Flash Sale
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                } else {
                    return { hours: 3, minutes: 44, seconds: 12 };
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handlePrevSlide = () => {
        setCurrentSlide(
            (prev) => (prev - 1 + promoSlides.length) % promoSlides.length,
        );
    };

    const handleNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
    };

    const hotSearches = [
        { label: 'Susu Segar', query: 'susu' },
        { label: 'Keju Samirono', query: 'keju' },
        { label: 'Tas Anyaman', query: 'tas' },
        { label: 'Kopi Merbabu', query: 'kopi' },
        { label: 'Keripik Paru', query: 'keripik' },
        { label: 'Pupuk Organik', query: 'pupuk' },
    ];

    return (
        <div
            className="relative overflow-hidden border-b border-navy-200/60 bg-navy-50/40 pt-6 pb-10 font-sans"
            id="serasa-hero"
        >
            {/* Background Subtle Pattern */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(oklch(0.82_0.01_250)_1px,transparent_1px)] bg-size-[18px_18px] opacity-40" />

            <div className="relative mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                {/* Marketplace Banner Slider & Sidebar Promos */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                    {/* Main Promotions Slider Carousel (Lefthand Column) */}
                    <div className="group/slider relative h-[280px] overflow-hidden rounded-3xl border border-navy-200/60 bg-navy-900 shadow-xs sm:h-[340px] lg:col-span-8">
                        {promoSlides.map((slide, index) => (
                            <div
                                key={slide.id}
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

                                {/* Single-color gradient overlay */}
                                <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-tr from-navy-900 via-navy-900/75 to-transparent p-6 text-white sm:p-10">
                                    <div className="max-w-lg space-y-2 sm:space-y-3">
                                        <span className="inline-block rounded-md bg-pastel-peach px-3 py-1 text-xs font-black tracking-wider text-navy-900 uppercase">
                                            {slide.badge}
                                        </span>
                                        <h2 className="sm:text-3.5xl text-xl leading-tight font-black tracking-tight text-white">
                                            {slide.title}
                                        </h2>
                                        <p className="text-xs font-bold text-pastel-peach sm:text-sm">
                                            {slide.tagline}
                                        </p>
                                        <p className="line-clamp-2 text-xs leading-relaxed font-normal text-navy-200 sm:text-sm">
                                            {slide.description}
                                        </p>
                                        <div className="pt-2">
                                            <button
                                                onClick={() =>
                                                    setSearchQuery(
                                                        slide.btnQuery,
                                                    )
                                                }
                                                className="cursor-pointer rounded-xl bg-pastel-coral px-5 py-2.5 text-xs font-extrabold tracking-wider text-white uppercase shadow-md transition-all hover:bg-pastel-coral/90"
                                            >
                                                Temukan Produk Warga
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={handlePrevSlide}
                            className="absolute top-1/2 left-4 z-20 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-xs transition-all group-hover/slider:opacity-100 hover:bg-white/30"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={handleNextSlide}
                            className="absolute top-1/2 right-4 z-20 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-xs transition-all group-hover/slider:opacity-100 hover:bg-white/30"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>

                        <div className="absolute bottom-4 left-6 z-20 flex gap-1.5 sm:left-10">
                            {promoSlides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentSlide(i)}
                                    className={`h-1 w-2.5 cursor-pointer rounded-full transition-all ${
                                        i === currentSlide
                                            ? 'w-5 bg-pastel-teal'
                                            : 'bg-white/45 hover:bg-white/70'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Countdown & Highlight Promo Card */}
                    <div className="flex h-[280px] flex-col justify-between rounded-3xl border border-navy-200/60 bg-white p-5 shadow-2xs sm:h-[340px] lg:col-span-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-pastel-coral">
                                    <Flame className="h-5 w-5 animate-pulse fill-pastel-coral/50" />
                                    <span className="text-xs font-black tracking-wider uppercase">
                                        KEJAR DISKON WARGA
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 font-mono text-xs">
                                    <span className="rounded-md bg-navy-900 px-1.5 py-0.5 text-xs font-bold text-white">
                                        {String(timeLeft.hours).padStart(
                                            2,
                                            '0',
                                        )}
                                    </span>
                                    <span className="text-navy-400">:</span>
                                    <span className="rounded-md bg-navy-900 px-1.5 py-0.5 text-xs font-bold text-white">
                                        {String(timeLeft.minutes).padStart(
                                            2,
                                            '0',
                                        )}
                                    </span>
                                    <span className="text-navy-400">:</span>
                                    <span className="animate-pulse rounded-md bg-pastel-coral px-1.5 py-0.5 text-xs font-bold text-white">
                                        {String(timeLeft.seconds).padStart(
                                            2,
                                            '0',
                                        )}
                                    </span>
                                </div>
                            </div>

                            {featuredProduct ? (
                                <div
                                    onClick={() =>
                                        router.visit(
                                            `/products/${featuredProduct.id}`,
                                        )
                                    }
                                    className="group/promo flex cursor-pointer gap-3.5 rounded-2xl border border-pastel-coral/20 bg-pastel-coral-light/40 p-3 transition-all hover:border-pastel-coral/40 hover:bg-pastel-coral-light"
                                >
                                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-pastel-coral/20 bg-navy-100 transition-transform duration-300 group-hover/promo:scale-105">
                                        <img
                                            src={featuredProduct.image}
                                            alt={featuredProduct.name}
                                            width={80}
                                            height={80}
                                            loading="lazy"
                                            sizes="80px"
                                            className="h-full w-full object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="inline-block rounded-md bg-pastel-coral-light px-1.5 py-0.5 text-xs font-black text-pastel-coral uppercase">
                                            Stok Terbatas
                                        </span>
                                        <h4 className="line-clamp-1 text-xs leading-snug font-bold text-navy-800 transition-colors group-hover/promo:text-pastel-coral">
                                            {featuredProduct.name}
                                        </h4>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xs font-black text-navy-900">
                                                {formatIDR(
                                                    featuredProduct.price,
                                                )}
                                            </span>
                                            <span className="text-xs font-medium text-navy-400">
                                                / {featuredProduct.unit}
                                            </span>
                                        </div>
                                        <span className="block text-xs font-bold text-pastel-teal">
                                            Produk Unggulan Warga
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-2xl bg-navy-50 p-4 text-center text-xs text-navy-400">
                                    Belum ada produk promo
                                </div>
                            )}

                            <div className="space-y-1 pt-1">
                                <div className="flex justify-between text-xs font-bold text-navy-500">
                                    <span>Tersisa Stok Terbatas</span>
                                    <span className="text-pastel-coral">
                                        Diskon Harian
                                    </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-navy-100">
                                    <div
                                        className="h-full rounded-full bg-pastel-coral"
                                        style={{ width: '87%' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-navy-100 pt-3 text-xs font-medium text-navy-500">
                            <div className="flex items-center gap-1">
                                <ThumbsUp className="h-3.5 w-3.5 text-pastel-teal" />
                                <span>100% Produk Desa</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-pastel-peach" />
                                <span>
                                    {settings.villageName || 'Desa Samirono'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Global Search Bar */}
                <div className="space-y-4 rounded-3xl border border-navy-200/60 bg-white p-4 shadow-2xs sm:p-5">
                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                        <div className="relative w-full flex-grow">
                            <input
                                type="text"
                                placeholder="Cari produk UMKM Desa Samirono (misal: susu segar, keju, batik, gethuk...)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        router.get('/', {
                                            search: searchQuery,
                                            category: selectedCategory,
                                        });
                                    }
                                }}
                                className="w-full rounded-2xl border border-navy-200/60 bg-navy-50 py-3 pr-4 pl-11 text-xs font-medium text-navy-800 placeholder-navy-400 transition-all focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none sm:text-sm"
                                id="hero-search-input"
                            />
                            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-navy-400" />
                        </div>

                        <button
                            onClick={() =>
                                router.get('/', {
                                    search: searchQuery,
                                    category: selectedCategory,
                                })
                            }
                            className="flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-pastel-teal px-7 py-3 text-xs font-extrabold tracking-wider text-white uppercase shadow-xs transition-all hover:bg-pastel-teal/90 sm:w-auto"
                        >
                            <Search className="h-4 w-4" />
                            <span>Cari Katalog</span>
                        </button>
                    </div>

                    {/* Quick Search Tag Chips */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                        <div className="flex shrink-0 items-center gap-1 text-xs font-extrabold tracking-wider text-navy-400 uppercase">
                            <Tag className="h-3 w-3 text-pastel-coral" />
                            <span>Populer:</span>
                        </div>
                        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
                            {hotSearches.map((item) => (
                                <button
                                    key={item.query}
                                    onClick={() => setSearchQuery(item.query)}
                                    className={`shrink-0 cursor-pointer rounded-xl px-3 py-1 text-xs font-bold transition-all ${
                                        searchQuery === item.query
                                            ? 'shadow-3xs bg-pastel-teal text-white'
                                            : 'bg-navy-100/60 text-navy-700 hover:bg-pastel-teal-light hover:text-pastel-teal'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category Filter Pills Bar */}
                    <div className="no-scrollbar flex items-center gap-2 overflow-x-auto border-t border-navy-100 pt-2">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`shrink-0 cursor-pointer rounded-xl px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all ${
                                selectedCategory === 'all'
                                    ? 'bg-pastel-teal text-white shadow-xs'
                                    : 'border border-navy-200/50 bg-navy-50 text-navy-600 hover:bg-navy-100'
                            }`}
                        >
                            Semua Komoditas ({totalProducts})
                        </button>

                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`shrink-0 cursor-pointer rounded-xl px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all ${
                                    selectedCategory === cat.id
                                        ? 'bg-pastel-teal text-white shadow-xs'
                                        : 'border border-navy-200/50 bg-navy-50 text-navy-600 hover:bg-navy-100'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
