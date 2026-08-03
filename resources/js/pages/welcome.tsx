/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { Link, router } from '@inertiajs/react';
import { ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import SEOHead from '@/components/SEOHead';
import MarketplaceLayout from '@/layouts/marketplace-layout';
import type { AppSettings, Category, Product, Shop } from '@/types';

interface WelcomeProps {
    settings: AppSettings;
    categories: Category[];
    products: Product[];
    shops: Shop[];
    filters?: {
        search?: string;
        category?: string;
    };
}

export default function Welcome({
    settings,
    categories,
    products,
    shops,
    filters,
}: WelcomeProps) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [selectedCategory, setSelectedCategory] = useState(
        filters?.category || 'all',
    );
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    // Client-side instant filtering for premium responsive UX
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchSearch =
                product.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                product.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchCategory =
                selectedCategory === 'all' ||
                product.categoryId === selectedCategory;

            return matchSearch && matchCategory;
        });
    }, [products, searchQuery, selectedCategory]);

    // Reset page to 1 when search or category filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;

    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    // Fast O(1) lookup maps for products rendering
    const shopsMap = useMemo(() => {
        const map = new Map<string, Shop>();
        shops.forEach((s) => map.set(s.id, s));
        return map;
    }, [shops]);

    const categoriesMap = useMemo(() => {
        const map = new Map<string, Category>();
        categories.forEach((c) => map.set(c.id, c));
        return map;
    }, [categories]);

    return (
        <MarketplaceLayout
            settings={settings}
            categories={categories}
            products={products}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            activeTab="katalog"
        >
            <SEOHead
                title={`${settings.appName} - ${settings.tagline}`}
                description={
                    settings.description ||
                    `Sentra UMKM digital kreatif ${settings.villageName}. Temukan produk lokal terbaik khas warga desa.`
                }
                image={settings.heroBanner}
                siteName={settings.appName}
            />

            {/* Hero promo slider carousel */}
            <Hero
                settings={settings}
                categories={categories}
                products={products}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                totalProducts={products.length}
                totalShops={shops.length}
            />

            <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 font-sans sm:px-6 lg:px-8">
                {/* Catalog Section */}
                <div className="space-y-6" id="catalog-section">
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="flex items-center gap-2 text-base font-black tracking-wider text-navy-900 uppercase dark:text-navy-100">
                                <ShoppingBag className="h-5 w-5 text-pastel-teal" />
                                <span>Katalog Produk Kreatif Warga</span>
                            </h2>
                            <p className="text-xs font-normal text-navy-500 dark:text-navy-400">
                                Membeli produk lokal membantu perputaran ekonomi
                                mandiri {settings.villageName}.
                            </p>
                        </div>

                        <div className="rounded-xl border border-navy-200/60 bg-white px-3 py-1.5 text-xs font-bold tracking-wider text-navy-500 uppercase shadow-2xs dark:border-navy-800 dark:bg-navy-900 dark:text-navy-300">
                            Menampilkan {paginatedProducts.length} dari {filteredProducts.length} Produk Relevan
                        </div>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="mx-auto max-w-lg rounded-3xl border border-navy-200/60 bg-white p-16 text-center shadow-2xs dark:border-navy-800 dark:bg-navy-900/90">
                            <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-navy-300 dark:text-navy-600" />
                            <h3 className="text-sm font-extrabold text-navy-800 dark:text-navy-100">
                                Produk Tidak Ditemukan
                            </h3>
                            <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">
                                Kami tidak menemukan produk yang cocok dengan
                                pencarian Anda. Silakan cari dengan kata kunci
                                lain atau pilih semua kategori.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                }}
                                className="mt-4 cursor-pointer rounded-xl bg-pastel-teal px-5 py-2.5 text-xs font-extrabold tracking-wider text-white uppercase shadow-2xs transition-all hover:bg-pastel-teal/90"
                            >
                                Reset Semua Filter
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {paginatedProducts.map((product) => {
                                    const shop = shopsMap.get(product.shopId);
                                    const category = categoriesMap.get(product.categoryId);

                                    return (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            shop={shop}
                                            category={category}
                                        />
                                    );
                                })}
                            </div>

                            {/* Pagination Controls Bar */}
                            {totalPages > 1 && (() => {
                                const scrollToCatalog = () => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });

                                // Build page numbers with ellipsis: [1, '...', 4, 5, 6, '...', 20]
                                const pages: (number | '...')[] = [];
                                const delta = 1;
                                const rangeStart = Math.max(2, currentPage - delta);
                                const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

                                pages.push(1);
                                if (rangeStart > 2) pages.push('...');
                                for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
                                if (rangeEnd < totalPages - 1) pages.push('...');
                                if (totalPages > 1) pages.push(totalPages);

                                return (
                                <div className="flex flex-col items-center justify-between gap-4 border-t border-navy-100 pt-6 sm:flex-row dark:border-navy-800">
                                    <div className="text-xs font-bold text-navy-500 dark:text-navy-400">
                                        Halaman {currentPage} dari {totalPages} ({filteredProducts.length} Produk Total)
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => {
                                                setCurrentPage((prev) => Math.max(prev - 1, 1));
                                                scrollToCatalog();
                                            }}
                                            className="cursor-pointer rounded-xl border border-navy-200 bg-white px-3 py-1.5 text-xs font-extrabold text-navy-700 transition-all hover:border-pastel-teal hover:text-pastel-teal disabled:cursor-not-allowed disabled:opacity-40 dark:border-navy-800 dark:bg-navy-900 dark:text-navy-200 dark:hover:border-pastel-teal dark:hover:text-pastel-teal"
                                        >
                                            &laquo; Prev
                                        </button>
                                        {pages.map((page, idx) =>
                                            page === '...' ? (
                                                <span
                                                    key={`ellipsis-${idx}`}
                                                    className="px-1 text-xs font-bold text-navy-400 select-none dark:text-navy-500"
                                                >
                                                    …
                                                </span>
                                            ) : (
                                                <button
                                                    key={page}
                                                    onClick={() => {
                                                        setCurrentPage(page);
                                                        scrollToCatalog();
                                                    }}
                                                    className={`h-8 w-8 cursor-pointer rounded-xl text-xs font-extrabold transition-all ${
                                                        page === currentPage
                                                            ? 'bg-pastel-teal text-white shadow-2xs'
                                                            : 'border border-navy-200 bg-white text-navy-700 hover:border-pastel-teal hover:text-pastel-teal dark:border-navy-800 dark:bg-navy-900 dark:text-navy-200 dark:hover:border-pastel-teal dark:hover:text-pastel-teal'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ),
                                        )}
                                        <button
                                            disabled={currentPage === totalPages}
                                            onClick={() => {
                                                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                                                scrollToCatalog();
                                            }}
                                            className="cursor-pointer rounded-xl border border-navy-200 bg-white px-3 py-1.5 text-xs font-extrabold text-navy-700 transition-all hover:border-pastel-teal hover:text-pastel-teal disabled:cursor-not-allowed disabled:opacity-40 dark:border-navy-800 dark:bg-navy-900 dark:text-navy-200 dark:hover:border-pastel-teal dark:hover:text-pastel-teal"
                                        >
                                            Next &raquo;
                                        </button>
                                    </div>
                                </div>
                                );
                            })()}
                        </div>
                    )}
                </div>

                {/* Featured Shops Row */}
                <div className="space-y-6 rounded-3xl border border-pastel-teal/15 bg-pastel-teal-light/30 p-6 sm:p-8 dark:border-navy-800 dark:bg-navy-900/50">
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h3 className="text-base font-black tracking-wider text-navy-900 uppercase dark:text-navy-100">
                                Kenali Toko Kreatif {settings.villageName}
                            </h3>
                            <p className="mt-0.5 text-xs text-navy-600 dark:text-navy-400">
                                Profil produsen lokal dan unit usaha kreatif {settings.villageName}.
                            </p>
                        </div>

                        <Link
                            href="/shops"
                            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-pastel-teal/20 bg-white px-4 py-2.5 text-xs font-bold tracking-widest text-pastel-teal uppercase shadow-2xs transition-all hover:text-pastel-teal/90 dark:border-navy-800 dark:bg-navy-900"
                        >
                            <span>Daftar Seluruh Toko</span>
                            <ArrowRight className="h-3.5 w-3.5 text-pastel-teal" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {shops.slice(0, 3).map((shop) => (
                            <div
                                key={shop.id}
                                onClick={() =>
                                    router.visit(`/shops/${shop.id}`)
                                }
                                className="flex cursor-pointer gap-4 rounded-2xl border border-navy-200/60 bg-white p-4 shadow-2xs transition-all hover:border-pastel-teal hover:shadow-md dark:border-navy-800 dark:bg-navy-900/90 dark:hover:border-pastel-teal"
                            >
                                <img
                                    src={shop.logo}
                                    alt={shop.name}
                                    width={48}
                                    height={48}
                                    loading="lazy"
                                    className="h-12 w-12 shrink-0 rounded-xl border border-navy-200 object-cover dark:border-navy-700"
                                    referrerPolicy="no-referrer"
                                />
                                <div className="min-w-0 flex-1 space-y-1">
                                    <div className="flex min-w-0 items-center gap-1.5" title={shop.name}>
                                        <span className="block truncate text-xs font-bold text-navy-900 dark:text-navy-100">
                                            {shop.name}
                                        </span>
                                        {shop.isVerified && (
                                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 fill-pastel-mint-light text-pastel-mint dark:fill-navy-800" />
                                        )}
                                    </div>
                                    <span className="font-mono text-xs font-bold tracking-wider text-navy-400 uppercase dark:text-navy-400">
                                        {shop.category}
                                    </span>
                                    <p className="line-clamp-2 pt-0.5 text-xs leading-relaxed text-navy-500 dark:text-navy-400">
                                        {shop.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MarketplaceLayout>
    );
}
