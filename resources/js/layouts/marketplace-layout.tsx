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
    <div className="min-h-screen bg-brand-paper flex flex-col font-sans antialiased text-brand-ink" id="serasa-root-container">
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
      <footer className="bg-gray-900 text-gray-300 py-16 border-t border-gray-800 font-sans mt-12" id="serasa-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-10 text-xs leading-relaxed">
          
          {/* Col 1: Brand Info & Vision */}
          <div className="md:col-span-4 space-y-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-left group cursor-pointer"
            >
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black text-base shadow-xs group-hover:bg-emerald-500 transition-colors">
                S
              </div>
              <span className="text-white font-black text-lg tracking-wide uppercase">
                SAMIRONO <span className="text-emerald-500">ETALASE</span>
              </span>
            </Link>
            <p className="font-light text-gray-400 leading-relaxed text-[11.5px]">
              Platform digitalisasi & promosi terpusat produk ekonomi kreatif {settings.villageName}, Kecamatan Getasan, Kabupaten Semarang. Menghubungkan pembeli luar kota, wisatawan lokal, maupun dinas pariwisata langsung ke rumah produksi warga.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2 py-0.5 bg-gray-800 text-emerald-400 font-mono text-[9px] uppercase tracking-wider rounded border border-gray-700 font-bold">
                Versi 1.1 Stabil
              </span>
              <span className="text-gray-700">|</span>
              <span className="flex items-center gap-1.5 text-gray-400 font-bold uppercase tracking-wider text-[9.5px]">
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                <span>Kecamatan Getasan</span>
              </span>
            </div>
          </div>

          {/* Col 2: Interactive Sektor Kreatif */}
          <div className="md:col-span-2 space-y-3.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider border-b border-gray-800 pb-1.5">Sektor Kreatif</h4>
            <ul className="space-y-2 text-gray-400 font-medium text-[11px]">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/?category=${cat.id}`}
                    className="hover:text-emerald-500 transition-colors text-left cursor-pointer"
                  >
                    • {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/"
                  className="hover:text-emerald-500 transition-colors text-left font-bold cursor-pointer"
                >
                  • Lihat Semua Produk
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Layanan & Navigasi */}
          <div className="md:col-span-3 space-y-3.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider border-b border-gray-800 pb-1.5">Layanan & Navigasi</h4>
            <ul className="space-y-2 text-gray-400 font-medium text-[11px]">
              <li>
                <Link 
                  href="/shops"
                  className="hover:text-emerald-500 transition-colors text-left cursor-pointer"
                >
                  • Daftar UMKM Terdaftar
                </Link>
              </li>
              <li>
                <Link 
                  href="/map"
                  className="hover:text-emerald-500 transition-colors text-left cursor-pointer"
                >
                  • Peta Geografis Desa
                </Link>
              </li>
              <li>
                <Link 
                  href="/merchant/dashboard"
                  className="hover:text-emerald-500 transition-colors text-left cursor-pointer"
                >
                  • Daftarkan Toko Warga (Gratis)
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/dashboard"
                  className="hover:text-emerald-500 transition-colors text-left cursor-pointer"
                >
                  • Panel Verifikasi Admin Desa
                </Link>
              </li>
              <li>
                <a 
                  href={`https://wa.me/${settings.adminPhone}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-emerald-500 transition-colors text-left block"
                >
                  • Syarat & Ketentuan UMKM Desa
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Pembayaran & Pengiriman */}
          <div className="md:col-span-3 space-y-4">
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider border-b border-gray-800 pb-1.5 mb-2.5">Sistem Pembayaran</h4>
              <div className="grid grid-cols-4 gap-2 bg-white/5 p-2 rounded-xl border border-white/5">
                <div className="bg-white rounded-lg p-1.5 flex items-center justify-center h-8 hover:scale-105 transition-transform" title="QRIS">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" alt="QRIS" className="h-5 object-contain" referrerPolicy="no-referrer" />
                </div>
                <div className="bg-white rounded-lg p-1.5 flex items-center justify-center h-8 hover:scale-105 transition-transform" title="Bank BCA">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg" alt="BCA" className="h-3.5 object-contain" referrerPolicy="no-referrer" />
                </div>
                <div className="bg-white rounded-lg p-1.5 flex items-center justify-center h-8 hover:scale-105 transition-transform" title="Bank BRI">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2e/BRI_Logo.svg" alt="BRI" className="h-4 object-contain" referrerPolicy="no-referrer" />
                </div>
                <div className="bg-white rounded-lg p-1 flex flex-col items-center justify-center h-8 hover:scale-105 transition-transform" title="Cash On Delivery">
                  <span className="text-[7px] font-black text-emerald-800 tracking-tighter leading-none bg-emerald-100 px-1 py-0.5 rounded">COD</span>
                  <span className="text-[7.5px] font-bold text-gray-900 tracking-tighter leading-none mt-0.5 uppercase">TUNAI</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider border-b border-gray-800 pb-1.5 mb-2">Metode Pengiriman</h4>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 bg-gray-800 border border-gray-700/60 rounded text-[9px] font-bold text-emerald-400">KURIR DUSUN (SIAP ANTAR)</span>
                <span className="px-2 py-1 bg-gray-800 border border-gray-700/60 rounded text-[9px] font-bold text-emerald-400">AMBIL DI RUMAH PRODUKSI</span>
                <span className="px-2 py-1 bg-gray-800 border border-gray-700/60 rounded text-[9px] font-bold text-gray-300">J&T / JNE GETASAN</span>
              </div>
            </div>

            <div className="pt-2">
              <a 
                href={`https://wa.me/${settings.adminPhone}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-[9px] rounded-xl transition-all cursor-pointer shadow-md w-full justify-center"
              >
                <Phone className="w-3.5 h-3.5 text-white animate-pulse" />
                <span>Hubungi IT Desa Samirono</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright segment */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-gray-500">
          <p>© 2026 TIM KKN UNNES GIAT 16 DESA SAMIRONO.</p>
          <p className="flex items-center gap-1 font-sans text-[11px]">
            Dibuat dengan <Heart className="w-3 h-3 text-red-500 fill-red-500" /> untuk Kemandirian Ekonomi Indonesia.
          </p>
        </div>
      </footer>
    </div>
  );
}
