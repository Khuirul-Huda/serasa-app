/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useMemo } from "react";
import { Head, Link } from "@inertiajs/react";
import MarketplaceLayout from "@/layouts/marketplace-layout";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { AppSettings, Category, Product, Shop } from "@/types";
import { ShoppingBag, ArrowRight, CheckCircle2 } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState(filters?.search || "");
  const [selectedCategory, setSelectedCategory] = useState(filters?.category || "all");

  // Client-side instant filtering for premium responsive UX
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCategory =
        selectedCategory === "all" || product.categoryId === selectedCategory;
      
      return matchSearch && matchCategory;
    });
  }, [products, searchQuery, selectedCategory]);

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
      <Head title={`${settings.appName} - ${settings.tagline}`} />

      {/* Hero promo slider carousel */}
      <Hero
        settings={settings}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalProducts={products.length}
        totalShops={shops.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Catalog Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-base font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                <span>Katalog Produk Kreatif Warga</span>
              </h2>
              <p className="text-xs text-gray-500">Membeli produk lokal membantu perputaran ekonomi mandiri Desa Samirono.</p>
            </div>
            
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider bg-gray-100 border border-gray-200 px-3 py-1 rounded-lg">
              Menampilkan {filteredProducts.length} Produk Relevan
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-3xs max-w-lg mx-auto">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-bold text-gray-700 text-sm">Produk Tidak Ditemukan</h3>
              <p className="text-xs text-gray-500 mt-1">Kami tidak menemukan produk yang cocok dengan pencarian Anda. Silakan cari dengan kata kunci lain atau pilih semua kategori.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[9.5px] uppercase tracking-wider rounded-lg transition-all shadow-3xs cursor-pointer"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => {
                const shop = shops.find((s) => s.id === product.shopId);
                const category = categories.find((c) => c.id === product.categoryId);
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
          )}
        </div>

        {/* Featured Shops Row */}
        <div className="bg-emerald-50/40 rounded-3xl border border-emerald-100/70 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Sentra UMKM</span>
              <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider mt-1.5">Kenali Toko Kreatif Samirono</h3>
              <p className="text-xs text-gray-500">Profil produsen lokal, pengolah susu perah, pengerajin bambu, dan kuliner khas desa.</p>
            </div>

            <Link
              href="/shops"
              className="text-[10px] font-bold text-emerald-700 hover:text-emerald-600 flex items-center gap-1 uppercase tracking-widest bg-white border border-emerald-200 px-4 py-2 rounded-xl transition-all shadow-3xs cursor-pointer"
            >
              <span>Daftar Seluruh Toko</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shops.slice(0, 3).map((shop) => (
              <div 
                key={shop.id}
                onClick={() => Link.prototype} // dummy handler as shopcard handles it
                className="bg-white rounded-2xl border border-gray-150 p-4 shadow-3xs flex gap-4 cursor-pointer hover:border-emerald-600 transition-colors"
              >
                <img 
                  src={shop.logo} 
                  alt={shop.name} 
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-200"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-900 truncate block">{shop.name}</span>
                    {shop.isVerified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 shrink-0" />
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-gray-400 uppercase font-bold tracking-wider">{shop.category}</span>
                  <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed pt-0.5">{shop.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </MarketplaceLayout>
  );
}
