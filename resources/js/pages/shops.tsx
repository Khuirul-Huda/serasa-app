import { Store, Search, ShieldCheck, MapPin, ArrowUpRight, Sparkles } from "lucide-react";
import React, { useState, useMemo } from "react";
import SEOHead from "@/components/SEOHead";
import ShopCard from "@/components/ShopCard";
import MarketplaceLayout from "@/layouts/marketplace-layout";
import type { AppSettings, Category, Product, Shop } from "@/types";

interface ShopsProps {
  settings: AppSettings;
  categories: Category[];
  shops: (Shop & { productCount?: number })[];
  products: Product[];
}

export default function Shops({
  settings,
  categories,
  shops,
  products,
}: ShopsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredShops = useMemo(() => {
    return shops.filter((shop) => {
      const matchSearch =
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.dusun.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCategory =
        selectedCategory === "all" || shop.category === selectedCategory;
      
      return matchSearch && matchCategory;
    });
  }, [shops, searchQuery, selectedCategory]);

  const verifiedShopsCount = useMemo(() => shops.filter(s => s.isVerified).length, [shops]);

  return (
    <MarketplaceLayout
      settings={settings}
      categories={categories}
      products={products}
      activeTab="shops"
    >
      <SEOHead
        title={`Daftar UMKM Warga - ${settings.appName}`}
        description={`Direktori lengkap Pelaku Usaha Mikro Kecil dan Menengah (UMKM) Desa Samirono. Temukan rumah produksi, detail kontak, dan lokasi geografis mitra ekonomi desa.`}
        keywords="Direktori UMKM, Daftar Toko Desa Samirono, Pelaku Ekonomi Kreatif, Getasan, Semarang, Profil Rumah Produksi Warga"
        image={settings.heroBanner}
        siteName={settings.appName}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
        
        {/* Asymmetric Bento Grid Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Bento Tile 1: Editorial Overview & Integrated Controls (8 Cols) */}
          <div className="lg:col-span-8 bg-white border border-navy-200/60 rounded-3xl p-6 sm:p-8 shadow-2xs flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-navy-400 font-bold uppercase tracking-wider block">
                Kecamatan Getasan, Kabupaten Semarang
              </span>

              <h1 className="text-2xl sm:text-3.5xl font-black text-navy-900 tracking-tight uppercase leading-tight">
                Direktori Rumah Produksi <span className="text-pastel-teal">Desa Samirono</span>
              </h1>

              <p className="text-navy-500 text-xs sm:text-sm font-normal leading-relaxed max-w-xl">
                Temukan produsen olahan susu murni, pengrajin bambu, dan kuliner lokal Samirono. Hubungi langsung pemilik toko atau jelajahi katalog produk mereka.
              </p>
            </div>

            {/* Integrated Search Box & Category Select Filter Toolbar */}
            <div className="pt-4 border-t border-navy-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Cari nama toko, pemilik, atau dusun..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-navy-200/60 bg-navy-50 text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-pastel-teal/20 focus:border-pastel-teal font-medium transition-all"
                  aria-label="Cari nama toko atau pemilik"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 text-xs bg-white border border-navy-200/60 text-navy-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pastel-teal/20 focus:border-pastel-teal font-bold uppercase tracking-wider cursor-pointer shadow-2xs"
                aria-label="Filter kategori toko"
              >
                <option value="all">Semua Kategori ({categories.length})</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bento Tile 2: Live Village Metrics Card (4 Cols) */}
          <div className="lg:col-span-4 bg-navy-900 text-white rounded-3xl p-6 sm:p-8 border border-navy-800 shadow-md flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-pastel-teal rounded-2xl flex items-center justify-center text-white">
                <Store className="w-5 h-5" />
              </div>

              <div>
                <span className="text-3.5xl sm:text-4xl font-black tracking-tight text-white block">
                  {shops.length}
                </span>
                <span className="text-xs text-navy-400 font-bold uppercase tracking-wider block mt-1">
                  Usaha & Rumah Produksi Terdaftar
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-navy-800/80 space-y-2">
              <div className="flex justify-between items-center text-[11px] font-medium text-navy-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-pastel-mint" />
                  <span>Toko Terverifikasi</span>
                </span>
                <span className="font-bold text-white">{verifiedShopsCount} Mitra</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-medium text-navy-300">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-pastel-peach" />
                  <span>Lokasi</span>
                </span>
                <span className="font-bold text-white">Samirono, Getasan</span>
              </div>
            </div>
          </div>

        </div>

        {/* Directory Listings Grid */}
        {filteredShops.length === 0 ? (
          <div className="bg-white border border-navy-200/60 rounded-3xl p-16 text-center shadow-2xs max-w-lg mx-auto">
            <Store className="w-12 h-12 text-navy-300 mx-auto mb-4" aria-hidden="true" />
            <h2 className="font-extrabold text-navy-800 text-sm">Toko Tidak Ditemukan</h2>
            <p className="text-xs text-navy-500 mt-1">Kami tidak menemukan toko yang cocok dengan pencarian Anda. Silakan cari dengan kata kunci lain.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 px-5 py-2.5 bg-pastel-teal hover:bg-pastel-teal/90 text-white font-extrabold text-[9.5px] uppercase tracking-wider rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              Reset Filter Toko
            </button>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0">
            {filteredShops.map((shop) => (
              <li key={shop.id}>
                <ShopCard
                  shop={shop}
                  productCount={shop.productCount || 0}
                />
              </li>
            ))}
          </ul>
        )}

      </div>
    </MarketplaceLayout>
  );
}
