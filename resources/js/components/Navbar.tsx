/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { Link, usePage, router } from '@inertiajs/react';
import { Store, Search, X, Menu, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';
import type { AppSettings, Category, Product, Shop } from '@/types';
import CartDropdown from './navbar/CartDropdown';
import MobileMenu from './navbar/MobileMenu';
import NotificationDropdown from './navbar/NotificationDropdown';
import TopBar from './navbar/TopBar';

interface NavbarProps {
    settings: AppSettings;
    activeTab: 'katalog' | 'shops' | 'map' | 'merchant' | 'admin' | 'detail' | 'articles';
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
    selectedCategory?: string;
    setSelectedCategory?: (cat: string) => void;
    categories: Category[];
    products: Product[];
    shops?: Shop[];
    onSelectProduct?: (product: Product) => void;
}

export default function Navbar({
    settings,
    activeTab,
    searchQuery = '',
    setSearchQuery,
    shops = [],
}: NavbarProps) {
    const { auth } = usePage<{ auth?: { user?: { name: string; role: string } | null } }>().props;
    const user = auth?.user;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(
        Boolean(searchQuery),
    );

    const handleSearchChange = (val: string) => {
        if (setSearchQuery) {
            setSearchQuery(val);
        } else {
            router.visit(`/?search=${encodeURIComponent(val)}`);
        }
    };

    const appNameParts = (settings?.appName || 'SAMIRONO ETALASE').split(' ');
    const firstWord = appNameParts[0];
    const restWords = appNameParts.slice(1).join(' ');
    const initial = firstWord ? firstWord.charAt(0).toUpperCase() : 'S';

    return (
        <header
            className="sticky top-0 z-50 border-b border-navy-200/60 bg-white/95 font-sans shadow-xs backdrop-blur-md transition-all dark:border-navy-800 dark:bg-navy-900/95"
            id="marketplace-navbar"
        >
            {/* 1. TOP UTILITY BAR */}
            <TopBar settings={settings} />

            {/* 2. MAIN HEADER BAR */}
            <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-6 lg:px-8">
                {/* Row 1: Brand Logo, Navigation Tabs & Right Actions */}
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                    {/* Brand Logo & Main Nav Tabs */}
                    <div className="flex shrink-0 items-center gap-3 sm:gap-6">
                        <Link
                            href="/"
                            className="group flex cursor-pointer items-center gap-2"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-pastel-teal text-sm font-black text-white shadow-2xs transition-all duration-300 group-hover:scale-105 sm:h-9 sm:w-9 sm:text-base">
                                {initial}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm leading-none font-black tracking-tight text-navy-900 uppercase transition-colors group-hover:text-pastel-teal sm:text-base dark:text-navy-100">
                                    {firstWord}{' '}
                                    {restWords ? (
                                        <span className="text-pastel-teal">
                                            {restWords}
                                        </span>
                                    ) : null}
                                </span>
                                <span className="mt-0.5 hidden text-[8px] leading-tight font-bold tracking-widest text-navy-400 uppercase min-[380px]:block sm:text-[9px] dark:text-navy-400">
                                    {settings?.tagline || 'Sentra UMKM Digital'}
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation Link Pills */}
                        <nav className="hidden items-center gap-1 rounded-xl border border-navy-200/50 bg-navy-50/70 p-1 lg:flex dark:border-navy-800 dark:bg-navy-950/80">
                            <Link
                                href="/"
                                prefetch="hover"
                                className={`cursor-pointer rounded-lg px-3 py-1.5 text-[10.5px] font-black tracking-wider uppercase transition-all ${
                                    activeTab === 'katalog'
                                        ? 'border border-pastel-teal/15 bg-pastel-teal-light text-pastel-teal dark:border-navy-700 dark:bg-navy-800 dark:text-pastel-teal'
                                        : 'text-navy-600 hover:bg-navy-50 hover:text-pastel-teal dark:text-navy-300 dark:hover:bg-navy-800 dark:hover:text-pastel-teal'
                                }`}
                            >
                                Katalog Produk
                            </Link>
                            <Link
                                href="/shops"
                                prefetch="hover"
                                className={`cursor-pointer rounded-lg px-3 py-1.5 text-[10.5px] font-black tracking-wider uppercase transition-all ${
                                    activeTab === 'shops'
                                        ? 'border border-pastel-teal/15 bg-pastel-teal-light text-pastel-teal dark:border-navy-700 dark:bg-navy-800 dark:text-pastel-teal'
                                        : 'text-navy-600 hover:bg-navy-50 hover:text-pastel-teal dark:text-navy-300 dark:hover:bg-navy-800 dark:hover:text-pastel-teal'
                                }`}
                            >
                                Daftar UMKM
                            </Link>
                            <Link
                                href="/map"
                                prefetch="hover"
                                className={`cursor-pointer rounded-lg px-3 py-1.5 text-[10.5px] font-black tracking-wider uppercase transition-all ${
                                    activeTab === 'map'
                                        ? 'border border-pastel-teal/15 bg-pastel-teal-light text-pastel-teal dark:border-navy-700 dark:bg-navy-800 dark:text-pastel-teal'
                                        : 'text-navy-600 hover:bg-navy-50 hover:text-pastel-teal dark:text-navy-300 dark:hover:bg-navy-800 dark:hover:text-pastel-teal'
                                }`}
                            >
                                Peta Geografis
                            </Link>
                            <Link
                                href="/articles"
                                prefetch="hover"
                                className={`cursor-pointer rounded-lg px-3 py-1.5 text-[10.5px] font-black tracking-wider uppercase transition-all ${
                                    activeTab === 'articles' || activeTab === 'detail'
                                        ? 'border border-pastel-teal/15 bg-pastel-teal-light text-pastel-teal dark:border-navy-700 dark:bg-navy-800 dark:text-pastel-teal'
                                        : 'text-navy-600 hover:bg-navy-50 hover:text-pastel-teal dark:text-navy-300 dark:hover:bg-navy-800 dark:hover:text-pastel-teal'
                                }`}
                            >
                                Kabar Desa
                            </Link>
                        </nav>
                    </div>

                    {/* Desktop Inline Search Input (Hidden on < sm) */}
                    <div className="hidden mx-2 max-w-md flex-1 sm:block">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari produk desa..."
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full rounded-xl border border-navy-200 bg-navy-50 py-2 pr-10 pl-9 text-xs font-medium text-navy-800 placeholder-navy-400 transition-all focus:border-pastel-teal focus:bg-white focus:ring-2 focus:ring-pastel-teal/15 focus:outline-none dark:border-navy-800 dark:bg-navy-950 dark:text-navy-100 dark:placeholder-navy-500 dark:focus:bg-navy-950"
                                id="global-search-input-desktop"
                            />
                            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-navy-400 dark:text-navy-500" />

                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => handleSearchChange('')}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 p-0.5 text-navy-400 hover:text-navy-600 dark:text-navy-500 dark:hover:text-navy-300"
                                    aria-label="Hapus kata kunci pencarian"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right side interactions */}
                    <div className="flex shrink-0 items-center gap-1 sm:gap-3 md:gap-4">
                        {/* Mobile Search Toggle Button */}
                        <button
                            type="button"
                            onClick={() =>
                                setIsMobileSearchOpen(!isMobileSearchOpen)
                            }
                            className="cursor-pointer rounded-xl p-2 text-navy-600 transition-colors hover:bg-navy-50 hover:text-pastel-teal sm:hidden dark:text-navy-300 dark:hover:bg-navy-800 dark:hover:text-pastel-teal"
                            aria-label={isMobileSearchOpen ? 'Tutup pencarian' : 'Buka pencarian'}
                            title="Cari produk"
                        >
                            <Search className="h-5 w-5" />
                        </button>

                        <CartDropdown />
                        <NotificationDropdown shops={shops} />

                        {/* Quick Dashboard link for authenticated owners/admins */}
                        {user && (
                            <div className="hidden items-center sm:flex">
                                {user.role === 'admin' ? (
                                    <Link
                                        href="/admin/dashboard"
                                        className={`flex cursor-pointer items-center gap-1.5 rounded-xl border px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all ${
                                            activeTab === 'admin'
                                                ? 'shadow-3xs border-pastel-peach bg-pastel-peach text-navy-900'
                                                : 'border-pastel-peach/20 bg-pastel-peach-light text-navy-800 hover:bg-pastel-peach/30 dark:border-navy-700 dark:bg-navy-800 dark:text-navy-200'
                                        }`}
                                    >
                                        <ShieldCheck className="h-3.5 w-3.5 text-pastel-peach" />
                                        <span>Admin Desa</span>
                                    </Link>
                                ) : (
                                    <Link
                                        href="/merchant/dashboard"
                                        className={`flex cursor-pointer items-center gap-1.5 rounded-xl border px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all ${
                                            activeTab === 'merchant'
                                                ? 'shadow-3xs border-pastel-teal bg-pastel-teal text-white'
                                                : 'border-pastel-teal/20 bg-pastel-teal-light text-pastel-teal hover:bg-pastel-teal/15 dark:border-navy-700 dark:bg-navy-800 dark:text-pastel-teal'
                                        }`}
                                    >
                                        <Store className="h-3.5 w-3.5" />
                                        <span>Kelola Toko</span>
                                    </Link>
                                )}
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="cursor-pointer rounded-xl p-2 text-navy-600 transition-colors hover:bg-navy-50 hover:text-pastel-teal lg:hidden dark:text-navy-300 dark:hover:bg-navy-800 dark:hover:text-pastel-teal"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Row 2: Mobile Search Bar (Expandable on < sm) */}
                {(isMobileSearchOpen || searchQuery) && (
                    <div className="mt-2 block animate-fade-in sm:hidden">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Cari produk desa..."
                                value={searchQuery}
                                onChange={(e) =>
                                    handleSearchChange(e.target.value)
                                }
                                autoFocus
                                className="w-full rounded-xl border border-navy-200 bg-navy-50 py-2 pr-9 pl-9 text-xs font-medium text-navy-800 placeholder-navy-400 transition-all focus:border-pastel-teal focus:bg-white focus:ring-2 focus:ring-pastel-teal/15 focus:outline-none dark:border-navy-800 dark:bg-navy-950 dark:text-navy-100 dark:placeholder-navy-500 dark:focus:bg-navy-950"
                                id="global-search-input-mobile"
                            />
                            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-navy-400 dark:text-navy-500" />

                            <button
                                onClick={() => {
                                    handleSearchChange('');
                                    setIsMobileSearchOpen(false);
                                }}
                                className="absolute top-1/2 right-3 -translate-y-1/2 p-0.5 text-navy-400 hover:text-navy-600 dark:text-navy-500 dark:hover:text-navy-300"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. MOBILE MENU DROPDOWN */}
            {isMobileMenuOpen && (
                <MobileMenu
                    activeTab={activeTab}
                    settings={settings}
                    user={user}
                    onClose={() => setIsMobileMenuOpen(false)}
                />
            )}
        </header>
    );
}
