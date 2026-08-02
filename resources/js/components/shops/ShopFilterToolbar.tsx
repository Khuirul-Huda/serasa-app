import { Search, LayoutGrid, List, X } from 'lucide-react';
import React from 'react';
import type { SortOption, ViewMode } from '@/hooks/useShopFilters';
import type { Category } from '@/types';

interface ShopFilterToolbarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    selectedCategory: string;
    onCategoryChange: (value: string) => void;
    selectedDusun: string;
    onDusunChange: (value: string) => void;
    sortBy: SortOption;
    onSortChange: (value: SortOption) => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    categories: Category[];
    uniqueDusuns: string[];
    totalResults: number;
    totalShops: number;
}

export default function ShopFilterToolbar({
    searchQuery,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    selectedDusun,
    onDusunChange,
    sortBy,
    onSortChange,
    viewMode,
    onViewModeChange,
    categories,
    uniqueDusuns,
    totalResults,
    totalShops,
}: ShopFilterToolbarProps) {
    return (
        <div className="space-y-4 rounded-3xl border border-navy-200/60 bg-white p-5 shadow-2xs sm:p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <Search
                        className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-navy-400"
                        aria-hidden="true"
                    />
                    <input
                        type="search"
                        placeholder="Cari nama toko, pemilik, atau dusun..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full rounded-2xl border border-navy-200/60 bg-navy-50 py-2.5 pr-9 pl-10 text-xs font-medium text-navy-800 placeholder-navy-400 transition-all focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none"
                        aria-label="Cari nama toko, pemilik, atau dusun"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-navy-400 hover:text-navy-700"
                            aria-label="Bersihkan pencarian"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="cursor-pointer rounded-2xl border border-navy-200/60 bg-white px-3.5 py-2.5 text-xs font-bold tracking-wider text-navy-700 uppercase shadow-2xs focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none"
                        aria-label="Filter kategori toko"
                    >
                        <option value="all">Semua Kategori ({categories.length})</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    {/* Dusun Filter */}
                    <select
                        value={selectedDusun}
                        onChange={(e) => onDusunChange(e.target.value)}
                        className="cursor-pointer rounded-2xl border border-navy-200/60 bg-white px-3.5 py-2.5 text-xs font-bold tracking-wider text-navy-700 uppercase shadow-2xs focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none"
                        aria-label="Filter dusun toko"
                    >
                        <option value="all">Semua Dusun</option>
                        {uniqueDusuns.map((dusun) => (
                            <option key={dusun} value={dusun}>
                                {dusun}
                            </option>
                        ))}
                    </select>

                    {/* Sort Selector */}
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value as SortOption)}
                        className="cursor-pointer rounded-2xl border border-navy-200/60 bg-white px-3.5 py-2.5 text-xs font-bold tracking-wider text-navy-700 uppercase shadow-2xs focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none"
                        aria-label="Urutkan toko"
                    >
                        <option value="featured">Urutkan: Featured</option>
                        <option value="most-products">Produk Terbanyak</option>
                        <option value="name-asc">Nama (A-Z)</option>
                    </select>

                    {/* View Mode Switcher */}
                    <div className="flex items-center rounded-2xl border border-navy-200/60 bg-navy-50 p-1">
                        <button
                            onClick={() => onViewModeChange('grid')}
                            className={`rounded-xl p-1.5 transition-all ${
                                viewMode === 'grid'
                                    ? 'bg-white text-pastel-teal shadow-2xs'
                                    : 'text-navy-400 hover:text-navy-700'
                            }`}
                            aria-label="Tampilan Grid"
                            title="Tampilan Grid"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => onViewModeChange('list')}
                            className={`rounded-xl p-1.5 transition-all ${
                                viewMode === 'list'
                                    ? 'bg-white text-pastel-teal shadow-2xs'
                                    : 'text-navy-400 hover:text-navy-700'
                            }`}
                            aria-label="Tampilan List"
                            title="Tampilan List"
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Status Bar */}
            <div className="flex items-center justify-between border-t border-navy-100 pt-3 text-xs font-medium text-navy-500">
                <span>
                    Menampilkan <strong className="font-bold text-navy-900">{totalResults}</strong> dari{' '}
                    <strong className="font-bold text-navy-900">{totalShops}</strong> Rumah Produksi
                </span>
            </div>
        </div>
    );
}
