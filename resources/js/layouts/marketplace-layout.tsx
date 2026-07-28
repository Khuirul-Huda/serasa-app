/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import Navbar from "@/components/Navbar";
import { AppSettings, Category, Product } from "@/types";
import { 
  Phone, 
  Globe,
  Heart
} from "lucide-react";
import { Link, router } from "@inertiajs/react";

interface MarketplaceLayoutProps {
  children: React.ReactNode;
  settings: AppSettings;
  activeTab: "katalog" | "shops" | "map" | "merchant" | "admin" | "detail";
  categories: Category[];
  products: Product[];
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  selectedCategory?: string;
  setSelectedCategory?: (cat: string) => void;
}

export default function MarketplaceLayout({
  children,
  settings,
  activeTab,
  categories,
  products,
  searchQuery = "",
  setSearchQuery,
  selectedCategory = "all",
  setSelectedCategory,
}: MarketplaceLayoutProps) {
  return (
    <div className="min-h-screen bg-stone-50/60 flex flex-col font-sans antialiased text-stone-900" id="serasa-root-container">
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
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-800 font-sans mt-16" id="serasa-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Main Top Row: Logo & Navigation Links */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1.5 max-w-md">
              <Link 
                href="/"
                className="flex items-center gap-2.5 text-left group cursor-pointer"
              >
                <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-2xs group-hover:bg-emerald-500 transition-colors">
                  S
                </div>
                <span className="text-white font-black text-base tracking-wide uppercase">
                  SAMIRONO <span className="text-emerald-500">ETALASE</span>
                </span>
              </Link>
              <p className="text-[11px] text-stone-400 font-normal leading-relaxed">
                Platform digitalisasi & sentra promosi produk usaha warga {settings.villageName}, Kecamatan Getasan, Kabupaten Semarang.
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-wider text-stone-300">
              <Link href="/" className="hover:text-emerald-400 transition-colors">
                Etalase Warga
              </Link>
              <Link href="/shops" className="hover:text-emerald-400 transition-colors">
                Daftar UMKM
              </Link>
              <Link href="/map" className="hover:text-emerald-400 transition-colors">
                Peta Desa
              </Link>
              <Link href="/merchant/dashboard" className="hover:text-emerald-400 transition-colors">
                Daftar Toko
              </Link>
              <a 
                href={`https://wa.me/${settings.adminPhone}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 font-bold rounded-xl border border-emerald-500/30 transition-all text-[10px]"
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>Helpline Desa</span>
              </a>
            </nav>
          </div>

          {/* Bottom Copyright & Credit Row */}
          <div className="border-t border-stone-800/80 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-stone-500">
            <p>© 2026 TIM KKN UNNES GIAT 16 DESA SAMIRONO.</p>
            <p className="flex items-center gap-1 font-sans text-[11px] text-stone-400">
              Dibuat dengan <Heart className="w-3 h-3 text-red-500 fill-red-500" /> untuk Kemandirian Ekonomi Desa.
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}
