/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from '@inertiajs/react';
import { Phone, Heart } from 'lucide-react';
import React from 'react';
import Navbar from '@/components/Navbar';
import type { AppSettings, Category, Product, Shop } from '@/types';

const defaultSettings: AppSettings = {
    appName: 'Samirono Etalase',
    tagline: 'Platform UMKM Warga',
    villageName: 'Desa Samirono',
    description: 'Platform digitalisasi kreatif',
    adminPhone: '6285725912345',
    heroBanner: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=80',
    hotSearches: [],
    promoSlides: [],
};

interface MarketplaceLayoutProps {
    children: React.ReactNode;
    settings?: AppSettings;
    activeTab?: 'katalog' | 'shops' | 'map' | 'merchant' | 'admin' | 'detail';
    categories?: Category[];
    products?: Product[];
    shops?: Shop[];
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
    selectedCategory?: string;
    setSelectedCategory?: (cat: string) => void;
}

export default function MarketplaceLayout({
    children,
    settings = defaultSettings,
    activeTab = 'admin',
    categories = [],
    products = [],
    shops = [],
    searchQuery = '',
    setSearchQuery,
    selectedCategory = 'all',
    setSelectedCategory,
}: MarketplaceLayoutProps) {
    return (
        <div
            className="flex min-h-screen flex-col bg-navy-50/40 font-sans text-navy-900 antialiased dark:bg-navy-950/90 dark:text-navy-100"
            id="serasa-root-container"
        >
            {/* Navbar wrapper */}
            <Navbar
                settings={settings}
                activeTab={activeTab}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                products={products}
                shops={shops}
            />

            {/* Main Content Area */}
            <main className="flex-grow">{children}</main>

            {/* FOOTER */}
            <footer
                className="mt-16 border-t border-navy-800 bg-navy-900 py-12 font-sans text-navy-400 dark:border-navy-900 dark:bg-navy-950"
                id="serasa-footer"
            >
                <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                    {/* Main Top Row: Logo & Navigation Links */}
                    <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                        <div className="max-w-md space-y-1.5">
                            <Link
                                href="/"
                                className="group flex cursor-pointer items-center gap-2.5 text-left"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pastel-teal text-sm font-black text-white shadow-2xs transition-colors group-hover:bg-pastel-teal/90">
                                    S
                                </div>
                                <span className="text-base font-black tracking-wide text-white uppercase">
                                    SAMIRONO{' '}
                                    <span className="text-pastel-teal">
                                        ETALASE
                                    </span>
                                </span>
                            </Link>
                            <p className="text-xs leading-relaxed font-normal text-navy-300">
                                {settings.description ||
                                    `Platform digitalisasi & sentra promosi produk usaha warga ${settings.villageName}, ${settings.kecamatanName || 'Kecamatan Getasan'}, ${settings.kabupatenName || 'Kabupaten Semarang'}.`}
                            </p>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold tracking-wider text-navy-200 uppercase">
                            <Link
                                href="/"
                                className="transition-colors hover:text-pastel-teal"
                            >
                                Etalase Warga
                            </Link>
                            <Link
                                href="/shops"
                                className="transition-colors hover:text-pastel-teal"
                            >
                                Daftar UMKM
                            </Link>
                            <Link
                                href="/map"
                                className="transition-colors hover:text-pastel-teal"
                            >
                                Peta Desa
                            </Link>
                            <Link
                                href="/merchant/dashboard"
                                className="transition-colors hover:text-pastel-teal"
                            >
                                Daftar Toko
                            </Link>
                            <a
                                href={`https://wa.me/${settings.adminPhone}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-pastel-teal/25 bg-pastel-teal/15 px-3.5 py-1.5 text-xs font-bold text-pastel-teal transition-all hover:bg-pastel-teal/25"
                            >
                                <Phone className="h-3 w-3 text-pastel-teal" />
                                <span>Helpline Desa</span>
                            </a>
                        </nav>
                    </div>

                    {/* Bottom Copyright & Credit Row */}
                    <div className="flex flex-col items-center justify-between gap-4 border-t border-navy-800/80 pt-6 font-mono text-xs text-navy-400 sm:flex-row">
                        <p>{settings.footerCredits || '© 2026 TIM KKN UNNES GIAT 16 DESA SAMIRONO.'}</p>
                        <p className="flex items-center gap-1 font-sans text-xs text-navy-300">
                            Dibuat dengan{' '}
                            <Heart className="h-3 w-3 fill-pastel-coral text-pastel-coral" />{' '}
                            untuk Kemandirian Ekonomi Desa.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
