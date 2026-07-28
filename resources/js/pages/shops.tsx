import { Store, Search } from "lucide-react";
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header Branding Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white border border-gray-200 p-6 rounded-2xl shadow-3xs">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight uppercase flex items-center gap-2">
              <Store className="w-6 h-6 text-emerald-700" />
              <span>Daftar Pelaku UMKM Terdaftar</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Temui langsung produsen lokal Samirono, hubungi via WhatsApp, atau jelajahi katalog produk kreatif mereka.
            </p>
          </div>

          {/* Search and filter tools */}
          <search className="flex flex-wrap items-center gap-2 w-full md:w-auto" role="search" aria-label="Cari toko UMKM">
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
              <input
                type="search"
                placeholder="Cari toko / nama pemilik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-gray-55 focus:bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 font-medium"
                aria-label="Nama toko atau pemilik"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 font-bold text-gray-700 uppercase tracking-wider cursor-pointer"
              aria-label="Filter kategori toko"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </search>
        </div>

        {/* Directory Listings Grid */}
        {filteredShops.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-3xs max-w-lg mx-auto">
            <Store className="w-12 h-12 text-gray-300 mx-auto mb-4" aria-hidden="true" />
            <h2 className="font-bold text-gray-700 text-sm">Toko Tidak Ditemukan</h2>
            <p className="text-xs text-gray-500 mt-1">Kami tidak menemukan toko yang cocok dengan filter pencarian Anda. Silakan cari dengan kata kunci lain.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[9.5px] uppercase tracking-wider rounded-lg transition-all shadow-3xs cursor-pointer"
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
