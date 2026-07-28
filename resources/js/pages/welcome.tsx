/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { Link, router } from "@inertiajs/react";
import { ShoppingBag, ArrowRight, CheckCircle2 } from "lucide-react";
import React, { useState, useMemo } from "react";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import SEOHead from "@/components/SEOHead";
import MarketplaceLayout from "@/layouts/marketplace-layout";
import type { AppSettings, Category, Product, Shop } from "@/types";

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
      <SEOHead
        title={`${settings.appName} - ${settings.tagline}`}
        description={settings.description || "Sentra UMKM digital kreatif Desa Samirono. Temukan produk lokal terbaik mulai dari kuliner segar hingga kerajinan anyaman bambu khas warga desa."}
        image={settings.heroBanner}
        siteName={settings.appName}
      />

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 font-sans">
        
        {/* Catalog Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-base font-black text-navy-900 uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-pastel-teal" />
                <span>Katalog Produk Kreatif Warga</span>
              </h2>
              <p className="text-xs text-navy-500 font-normal">Membeli produk lokal membantu perputaran ekonomi mandiri Desa Samirono.</p>
            </div>
            
            <div className="text-[10px] text-navy-500 font-bold uppercase tracking-wider bg-white border border-navy-200/60 px-3 py-1.5 rounded-xl shadow-2xs">
              Menampilkan {filteredProducts.length} Produk Relevan
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-navy-200/60 rounded-3xl p-16 text-center shadow-2xs max-w-lg mx-auto">
              <ShoppingBag className="w-12 h-12 text-navy-300 mx-auto mb-4" />
              <h3 className="font-extrabold text-navy-800 text-sm">Produk Tidak Ditemukan</h3>
              <p className="text-xs text-navy-500 mt-1">Kami tidak menemukan produk yang cocok dengan pencarian Anda. Silakan cari dengan kata kunci lain atau pilih semua kategori.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4 px-5 py-2.5 bg-pastel-teal hover:bg-pastel-teal/90 text-white font-extrabold text-[9.5px] uppercase tracking-wider rounded-xl transition-all shadow-2xs cursor-pointer"
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
        <div className="bg-pastel-teal-light/30 rounded-3xl border border-pastel-teal/15 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-base font-black text-navy-900 uppercase tracking-wider">Kenali Toko Kreatif Samirono</h3>
              <p className="text-xs text-navy-600 mt-0.5">Profil produsen lokal, pengolah susu perah, pengerajin bambu, dan kuliner khas desa.</p>
            </div>

            <Link
              href="/shops"
              className="text-[10px] font-bold text-pastel-teal hover:text-pastel-teal/90 flex items-center gap-1.5 uppercase tracking-widest bg-white border border-pastel-teal/20 px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              <span>Daftar Seluruh Toko</span>
              <ArrowRight className="w-3.5 h-3.5 text-pastel-teal" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shops.slice(0, 3).map((shop) => (
              <div 
                key={shop.id}
                onClick={() => router.visit(`/shops/${shop.id}`)}
                className="bg-white rounded-2xl border border-navy-200/60 p-4 shadow-2xs flex gap-4 cursor-pointer hover:border-pastel-teal transition-all hover:shadow-md"
              >
                <img 
                  src={shop.logo} 
                  alt={shop.name} 
                  width={48}
                  height={48}
                  loading="lazy"
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-navy-200"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-navy-900 truncate block">{shop.name}</span>
                    {shop.isVerified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-pastel-mint fill-pastel-mint-light shrink-0" />
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-navy-400 uppercase font-bold tracking-wider">{shop.category}</span>
                  <p className="text-[11px] text-navy-500 line-clamp-2 leading-relaxed pt-0.5">{shop.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </MarketplaceLayout>
  );
}
