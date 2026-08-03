/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { router } from '@inertiajs/react';
import { Search, Tag } from 'lucide-react';
import React from 'react';
import type { AppSettings, Category } from '@/types';

interface HeroSearchSectionProps {
    settings: AppSettings;
    categories: Category[];
    selectedCategory: string;
    setSelectedCategory: (catId: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    totalProducts: number;
}

export default function HeroSearchSection({
    settings,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    totalProducts,
}: HeroSearchSectionProps) {
    const hotSearches = settings.hotSearches || [
        { label: 'Susu Segar', query: 'susu' },
        { label: 'Keju Artisan', query: 'keju' },
        { label: 'Tas Anyaman', query: 'tas' },
        { label: 'Kopi Merbabu', query: 'kopi' },
        { label: 'Keripik Jamur', query: 'keripik' },
        { label: 'Gethuk Keju', query: 'gethuk' },
    ];

    const placeholderText = `Cari produk UMKM ${settings.villageName} (misal: ${hotSearches.map((h) => h.query).join(', ')}...)`;

    const handleSearchSubmit = () => {
        router.get('/', {
            search: searchQuery,
            category: selectedCategory,
        });
    };

    return (
        <div className="space-y-4 rounded-3xl border border-navy-200/60 bg-white p-4 shadow-2xs sm:p-5 dark:border-navy-800 dark:bg-navy-900/90">
            <div className="flex flex-col items-center gap-3 sm:flex-row">
                <div className="relative w-full flex-grow">
                    <input
                        type="text"
                        placeholder={placeholderText}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearchSubmit();
                            }
                        }}
                        className="w-full rounded-2xl border border-navy-200/60 bg-navy-50 py-3 pr-4 pl-11 text-xs font-medium text-navy-800 placeholder-navy-400 transition-all focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none sm:text-sm dark:border-navy-800 dark:bg-navy-950 dark:text-navy-100 dark:placeholder-navy-500"
                        id="hero-search-input"
                    />
                    <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-navy-400 dark:text-navy-500" />
                </div>

                <button
                    onClick={handleSearchSubmit}
                    className="flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-pastel-teal px-7 py-3 text-xs font-extrabold tracking-wider text-white uppercase shadow-xs transition-all hover:bg-pastel-teal/90 sm:w-auto"
                >
                    <Search className="h-4 w-4" />
                    <span>Cari Katalog</span>
                </button>
            </div>

            {/* Quick Search Tag Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex shrink-0 items-center gap-1 text-[11px] font-extrabold tracking-wider text-navy-400 uppercase dark:text-navy-500">
                    <Tag className="h-3 w-3 text-pastel-coral" />
                    <span>Populer:</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                    {hotSearches.slice(0, 5).map((item) => (
                        <button
                            key={item.query}
                            onClick={() => setSearchQuery(item.query)}
                            className={`cursor-pointer rounded-xl px-2.5 py-1 text-xs font-bold transition-all ${
                                searchQuery === item.query
                                    ? 'shadow-3xs bg-pastel-teal text-white'
                                    : 'bg-navy-100/60 text-navy-700 hover:bg-pastel-teal-light hover:text-pastel-teal dark:bg-navy-950 dark:text-navy-300 dark:hover:bg-navy-800 dark:hover:text-pastel-teal'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Category Filter Pills Bar (Top 5 Minimalist) */}
            <div className="flex flex-wrap items-center gap-1.5 border-t border-navy-100 pt-2.5 sm:gap-2 dark:border-navy-800">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-all sm:px-3.5 sm:py-2 ${
                        selectedCategory === 'all'
                            ? 'bg-pastel-teal text-white shadow-xs'
                            : 'border border-navy-200/50 bg-navy-50 text-navy-600 hover:bg-navy-100 dark:border-navy-800 dark:bg-navy-950 dark:text-navy-300 dark:hover:bg-navy-800'
                    }`}
                >
                    Semua Komoditas ({totalProducts})
                </button>

                {categories.slice(0, 5).map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-all sm:px-3.5 sm:py-2 ${
                            selectedCategory === cat.id
                                ? 'bg-pastel-teal text-white shadow-xs'
                                : 'border border-navy-200/50 bg-navy-50 text-navy-600 hover:bg-navy-100 dark:border-navy-800 dark:bg-navy-950 dark:text-navy-300 dark:hover:bg-navy-800'
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
