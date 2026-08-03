/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { AppSettings, Category, Product } from '@/types';
import FlashSaleCard from './hero/FlashSaleCard';
import HeroSearchSection from './hero/HeroSearchSection';
import PromoSlider from './hero/PromoSlider';

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
    const featuredProduct = settings.flashSaleProductId
        ? products.find((p) => p.id === settings.flashSaleProductId) ||
          (products.length > 0 ? products.find((p) => p.isAvailable) || products[0] : null)
        : (products.length > 0 ? products.find((p) => p.isAvailable) || products[0] : null);

    const slides = settings.promoSlides || [
        {
            id: 'slide-1',
            title: `Susu Sapi Murni ${settings.villageName}`,
            tagline: 'Diskon 10% Spesial Minggu Ini',
            description:
                'Segar murni dari peternakan lereng gunung, diperah higienis harian oleh warga desa.',
            image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
            badge: '🥛 SUSU SEGAR',
            btnQuery: 'susu',
        },
        {
            id: 'slide-2',
            title: 'Keju Mozzarella & Ricotta',
            tagline: `Karya Tani Unggulan ${settings.villageName}`,
            description:
                'Diproduksi oleh sentra pengolahan dengan cita rasa keju artisan bersertifikat pangan.',
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

    return (
        <div
            className="relative overflow-hidden border-b border-navy-200/60 bg-navy-50/40 pt-4 pb-6 font-sans sm:pt-6 sm:pb-8 dark:border-navy-800 dark:bg-navy-950/60"
            id="serasa-hero"
        >
            {/* Background Subtle Pattern */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(oklch(0.82_0.01_250)_1px,transparent_1px)] bg-size-[18px_18px] opacity-40 dark:bg-[radial-gradient(oklch(0.35_0.02_250)_1px,transparent_1px)]" />

            <div className="relative mx-auto max-w-7xl space-y-4 px-4 sm:space-y-6 sm:px-6 lg:px-8">
                {/* Marketplace Banner Slider & Sidebar Promos */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
                    <PromoSlider
                        slides={slides}
                        onSelectQuery={(query) => setSearchQuery(query)}
                    />
                    <FlashSaleCard
                        settings={settings}
                        featuredProduct={featuredProduct}
                    />
                </div>

                {/* Global Search Bar & Filters */}
                <HeroSearchSection
                    settings={settings}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    totalProducts={totalProducts}
                />
            </div>
        </div>
    );
}
