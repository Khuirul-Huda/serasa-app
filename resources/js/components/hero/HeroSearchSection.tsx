/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Tag } from 'lucide-react';
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

    return (
        <div className="space-y-3 rounded-2xl border border-navy-200/60 bg-white p-3 shadow-2xs sm:p-4 dark:border-navy-800 dark:bg-navy-900/90">
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
                            type="button"
                            onClick={() => setSearchQuery(item.query)}
                            className={`min-h-[36px] cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold transition-all sm:min-h-[auto] sm:px-2.5 sm:py-1 ${
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

            {/* Category Filter Pills Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:flex-wrap sm:gap-2 sm:overflow-visible sm:pb-0">
                <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`min-h-[36px] shrink-0 cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold tracking-wider transition-all sm:min-h-[auto] sm:px-3.5 sm:py-2 ${
                        selectedCategory === 'all'
                            ? 'bg-pastel-teal text-white shadow-xs'
                            : 'border border-navy-200/50 bg-navy-50 text-navy-600 hover:bg-navy-100 dark:border-navy-800 dark:bg-navy-950 dark:text-navy-300 dark:hover:bg-navy-800'
                    }`}
                >
                    Semua ({totalProducts})
                </button>

                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`min-h-[36px] shrink-0 cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold tracking-wider transition-all sm:min-h-[auto] sm:px-3.5 sm:py-2 ${
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
