/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { Link, usePage, router } from "@inertiajs/react";
import {
  Store,
  Search,
  X,
  Menu,
  ShieldCheck,
} from "lucide-react";
import React, { useState } from "react";
import type { AppSettings, Category, Product, Shop } from "@/types";
import TopBar from "./navbar/TopBar";
import CartDropdown from "./navbar/CartDropdown";
import NotificationDropdown from "./navbar/NotificationDropdown";
import MobileMenu from "./navbar/MobileMenu";

interface NavbarProps {
  settings: AppSettings;
  activeTab: "katalog" | "shops" | "map" | "merchant" | "admin" | "detail";
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
  searchQuery = "",
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

  return (
    <header
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-navy-200/60 shadow-xs font-sans transition-all"
      id="marketplace-navbar"
    >
      {/* 1. TOP UTILITY BAR */}
      <TopBar settings={settings} />

      {/* 2. MAIN HEADER BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4 justify-between">
        {/* Brand Logo & Main Nav Tabs */}
        <div className="flex items-center gap-6 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-9 h-9 bg-pastel-teal rounded-2xl flex items-center justify-center text-white font-black text-base shadow-2xs group-hover:scale-105 transition-all duration-300">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-navy-900 font-black text-base tracking-tight uppercase leading-none group-hover:text-pastel-teal transition-colors">
                SAMIRONO <span className="text-pastel-teal">ETALASE</span>
              </span>
              <span className="text-[9px] text-navy-400 font-bold uppercase tracking-widest leading-tight mt-0.5">
                Sentra UMKM Digital
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Link Pills */}
          <nav className="hidden lg:flex items-center gap-1 bg-navy-50/70 p-1 rounded-xl border border-navy-200/50">
            <Link
              href="/"
              prefetch="hover"
              className={`px-3 py-1.5 text-[10.5px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                activeTab === "katalog"
                  ? "bg-pastel-teal-light text-pastel-teal border border-pastel-teal/15"
                  : "text-navy-600 hover:text-pastel-teal hover:bg-navy-50"
              }`}
            >
              Katalog Produk
            </Link>
            <Link
              href="/shops"
              prefetch="hover"
              className={`px-3 py-1.5 text-[10.5px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                activeTab === "shops"
                  ? "bg-pastel-teal-light text-pastel-teal border border-pastel-teal/15"
                  : "text-navy-600 hover:text-pastel-teal hover:bg-navy-50"
              }`}
            >
              Daftar UMKM
            </Link>
            <Link
              href="/map"
              prefetch="hover"
              className={`px-3 py-1.5 text-[10.5px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                activeTab === "map"
                  ? "bg-pastel-teal-light text-pastel-teal border border-pastel-teal/15"
                  : "text-navy-600 hover:text-pastel-teal hover:bg-navy-50"
              }`}
            >
              Peta Geografis
            </Link>
          </nav>
        </div>

        {/* Search Input */}
        <div className="flex-grow max-w-md mx-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari produk desa (susu, keju, anyaman, gethuk...)"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-navy-200 bg-navy-50 focus:bg-white text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-pastel-teal/15 focus:border-pastel-teal font-medium transition-all"
              id="global-search-input"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-navy-400" />

            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right side interactions */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <CartDropdown />
          <NotificationDropdown shops={shops} />

          {/* Quick Dashboard link for authenticated owners/admins */}
          {user && (
            <div className="hidden sm:flex items-center">
              {user.role === "admin" ? (
                <Link
                  href="/admin/dashboard"
                  className={`flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer border ${
                    activeTab === "admin"
                      ? "bg-pastel-peach text-navy-900 border-pastel-peach shadow-3xs"
                      : "bg-pastel-peach-light text-navy-800 border-pastel-peach/20 hover:bg-pastel-peach/30"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-pastel-peach" />
                  <span>Admin Desa</span>
                </Link>
              ) : (
                <Link
                  href="/merchant/dashboard"
                  className={`flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer border ${
                    activeTab === "merchant"
                      ? "bg-pastel-teal text-white border-pastel-teal shadow-3xs"
                      : "bg-pastel-teal-light text-pastel-teal border-pastel-teal/20 hover:bg-pastel-teal/15"
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Kelola Toko Saya</span>
                </Link>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-navy-600 hover:text-pastel-teal rounded-xl hover:bg-navy-50 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
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
