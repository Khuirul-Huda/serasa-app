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
    activeTab: 'katalog' | 'shops' | 'map' | 'merchant' | 'admin' | 'detail';
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
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            className="sticky top-0 z-50 border-b border-navy-200/60 bg-white/95 font-sans shadow-xs backdrop-blur-md transition-all"
            id="marketplace-navbar"
        >
            {/* 1. TOP UTILITY BAR */}
            <TopBar settings={settings} />

            {/* 2. MAIN HEADER BAR */}
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                {/* Brand Logo & Main Nav Tabs */}
                <div className="flex shrink-0 items-center gap-6">
                    <Link
                        href="/"
                        className="group flex cursor-pointer items-center gap-2.5"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-pastel-teal text-base font-black text-white shadow-2xs transition-all duration-300 group-hover:scale-105">
                            {initial}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base leading-none font-black tracking-tight text-navy-900 uppercase transition-colors group-hover:text-pastel-teal">
                                {firstWord}{' '}
                                {restWords ? (
                                    <span className="text-pastel-teal">
                                        {restWords}
                                    </span>
                                ) : null}
                            </span>
                            <span className="mt-0.5 text-[9px] leading-tight font-bold tracking-widest text-navy-400 uppercase">
                                {settings?.tagline || 'Sentra UMKM Digital'}
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Link Pills */}
                    <nav className="hidden items-center gap-1 rounded-xl border border-navy-200/50 bg-navy-50/70 p-1 lg:flex">
                        <Link
                            href="/"
                            prefetch="hover"
                            className={`cursor-pointer rounded-lg px-3 py-1.5 text-[10.5px] font-black tracking-wider uppercase transition-all ${
                                activeTab === 'katalog'
                                    ? 'border border-pastel-teal/15 bg-pastel-teal-light text-pastel-teal'
                                    : 'text-navy-600 hover:bg-navy-50 hover:text-pastel-teal'
                            }`}
                        >
                            Katalog Produk
                        </Link>
                        <Link
                            href="/shops"
                            prefetch="hover"
                            className={`cursor-pointer rounded-lg px-3 py-1.5 text-[10.5px] font-black tracking-wider uppercase transition-all ${
                                activeTab === 'shops'
                                    ? 'border border-pastel-teal/15 bg-pastel-teal-light text-pastel-teal'
                                    : 'text-navy-600 hover:bg-navy-50 hover:text-pastel-teal'
                            }`}
                        >
                            Daftar UMKM
                        </Link>
                        <Link
                            href="/map"
                            prefetch="hover"
                            className={`cursor-pointer rounded-lg px-3 py-1.5 text-[10.5px] font-black tracking-wider uppercase transition-all ${
                                activeTab === 'map'
                                    ? 'border border-pastel-teal/15 bg-pastel-teal-light text-pastel-teal'
                                    : 'text-navy-600 hover:bg-navy-50 hover:text-pastel-teal'
                            }`}
                        >
                            Peta Geografis
                        </Link>
                    </nav>
                </div>

                {/* Search Input */}
                <div className="mx-2 max-w-md flex-grow">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari produk desa (susu, keju, anyaman, gethuk...)"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full rounded-xl border border-navy-200 bg-navy-50 py-2 pr-10 pl-9 text-xs font-medium text-navy-800 placeholder-navy-400 transition-all focus:border-pastel-teal focus:bg-white focus:ring-2 focus:ring-pastel-teal/15 focus:outline-none"
                            id="global-search-input"
                        />
                        <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-navy-400" />

                        {searchQuery && (
                            <button
                                onClick={() => handleSearchChange('')}
                                className="absolute top-1/2 right-3 -translate-y-1/2 p-0.5 text-navy-400 hover:text-navy-600"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Right side interactions */}
                <div className="flex shrink-0 items-center gap-3 md:gap-4">
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
                                            : 'border-pastel-peach/20 bg-pastel-peach-light text-navy-800 hover:bg-pastel-peach/30'
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
                                            : 'border-pastel-teal/20 bg-pastel-teal-light text-pastel-teal hover:bg-pastel-teal/15'
                                    }`}
                                >
                                    <Store className="h-3.5 w-3.5" />
                                    <span>Kelola Toko Saya</span>
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="cursor-pointer rounded-xl p-2 text-navy-600 transition-colors hover:bg-navy-50 hover:text-pastel-teal lg:hidden"
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
