/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import Navbar from "@/components/Navbar";
import type { AppSettings, Category, Product, Shop } from "@/types";
import { 
  Phone, 
  Heart
} from "lucide-react";
import { Link } from "@inertiajs/react";

interface MarketplaceLayoutProps {
  children: React.ReactNode;
  settings: AppSettings;
  activeTab: "katalog" | "shops" | "map" | "merchant" | "admin" | "detail";
  categories: Category[];
  products: Product[];
  shops?: Shop[];
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
  shops = [],
  searchQuery = "",
  setSearchQuery,
  selectedCategory = "all",
  setSelectedCategory,
}: MarketplaceLayoutProps) {
  return (
    <div className="min-h-screen bg-navy-50/40 flex flex-col font-sans antialiased text-navy-900" id="serasa-root-container">
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
      <main className="flex-grow">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-navy-900 text-navy-400 py-12 border-t border-navy-800 font-sans mt-16" id="serasa-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Main Top Row: Logo & Navigation Links */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1.5 max-w-md">
              <Link 
                href="/"
                className="flex items-center gap-2.5 text-left group cursor-pointer"
              >
                <div className="w-8 h-8 bg-pastel-teal rounded-xl flex items-center justify-center text-white font-black text-sm shadow-2xs group-hover:bg-pastel-teal/90 transition-colors">
                  S
                </div>
                <span className="text-white font-black text-base tracking-wide uppercase">
                  SAMIRONO <span className="text-pastel-teal">ETALASE</span>
                </span>
              </Link>
              <p className="text-[11px] text-navy-300 font-normal leading-relaxed">
                Platform digitalisasi & sentra promosi produk usaha warga {settings.villageName}, Kecamatan Getasan, Kabupaten Semarang.
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-wider text-navy-200">
              <Link href="/" className="hover:text-pastel-teal transition-colors">
                Etalase Warga
              </Link>
              <Link href="/shops" className="hover:text-pastel-teal transition-colors">
                Daftar UMKM
              </Link>
              <Link href="/map" className="hover:text-pastel-teal transition-colors">
                Peta Desa
              </Link>
              <Link href="/merchant/dashboard" className="hover:text-pastel-teal transition-colors">
                Daftar Toko
              </Link>
              <a 
                href={`https://wa.me/${settings.adminPhone}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-pastel-teal/15 hover:bg-pastel-teal/25 text-pastel-teal font-bold rounded-xl border border-pastel-teal/25 transition-all text-[10px]"
              >
                <Phone className="w-3 h-3 text-pastel-teal" />
                <span>Helpline Desa</span>
              </a>
            </nav>
          </div>

          {/* Bottom Copyright & Credit Row */}
          <div className="border-t border-navy-800/80 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-navy-400">
            <p>© 2026 TIM KKN UNNES GIAT 16 DESA SAMIRONO.</p>
            <p className="flex items-center gap-1 font-sans text-[11px] text-navy-300">
              Dibuat dengan <Heart className="w-3 h-3 text-pastel-coral fill-pastel-coral" /> untuk Kemandirian Ekonomi Desa.
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}
