/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { Link } from "@inertiajs/react";
import { 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  ArrowLeft,
  ShoppingBag
} from "lucide-react";
import React from "react";
import ProductCard from "@/components/ProductCard";
import SEOHead from "@/components/SEOHead";
import MarketplaceLayout from "@/layouts/marketplace-layout";
import type { AppSettings, Category, Product, Shop } from "@/types";
import { getWhatsAppLink } from "@/utils";

interface ShopDetailProps {
  settings: AppSettings;
  categories: Category[];
  shop: Shop;
  products?: Product[];
  allProducts?: Product[];
}

export default function ShopDetail({
  settings,
  categories,
  shop,
  products = [],
  allProducts = [],
}: ShopDetailProps) {
  const shopProducts = products.length > 0 ? products : ((shop as any).products || []);

  const handleContactWhatsApp = () => {
    const message = `Halo ${shop.ownerName} dari ${shop.name}, saya melihat profil toko digital Anda di platform SERASA Desa Samirono. Saya ingin menanyakan produk-produk kreatif Anda.`;
    const url = getWhatsAppLink(shop.phone, message);
    window.open(url, "_blank");
  };

  return (
    <MarketplaceLayout
      settings={settings}
      categories={categories}
      products={allProducts}
      activeTab="shops"
    >
      <SEOHead
        title={`${shop.name} - Katalog UMKM Samirono`}
        description={`Kunjungi toko ${shop.name} di Desa Samirono. Menyediakan ${shop.category}. Hubungi ${shop.ownerName} di dusun ${shop.dusun}.`}
        keywords={`${shop.name}, UMKM ${shop.name}, Toko ${shop.dusun}, Produk ${shop.category}, Ekonomi Kreatif Samirono`}
        image={shop.image}
        siteName={settings.appName}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
        
        {/* Breadcrumb Nav */}
        <nav aria-label="Breadcrumb">
          <Link
            href="/shops"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Kembali ke Daftar UMKM</span>
          </Link>
        </nav>

        {/* Master Profile Header Block */}
        <article className="bg-white rounded-3xl border border-gray-200 shadow-3xs overflow-hidden">
          {/* Banner */}
          <figure className="relative h-44 sm:h-56 bg-gray-50">
            <img 
              src={shop.image} 
              alt={shop.name} 
              width={1200}
              height={224}
              loading="eager"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
          </figure>

          {/* Profile details wrapper */}
          <div className="px-6 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row gap-5 sm:items-end -mt-10 sm:-mt-12 mb-4">
              {/* Logo */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white bg-white overflow-hidden shadow-md shrink-0">
                <img 
                  src={shop.logo} 
                  alt={shop.name} 
                  width={96}
                  height={96}
                  loading="eager"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight">
                    {shop.name}
                  </h1>
                  {shop.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-800 text-[8px] font-extrabold tracking-wider uppercase">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-50" />
                      <span>Terverifikasi</span>
                    </span>
                  )}
                </div>
                
                <p className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">
                  Kategori Utama: <span className="text-emerald-700 font-extrabold">{shop.category}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-gray-100">
              {/* Left Column: Description & Metadata */}
              <div className="lg:col-span-8 space-y-4 text-xs">
                <section className="space-y-1.5 text-gray-600 font-light leading-relaxed">
                  <h2 className="text-gray-900 font-bold uppercase tracking-wider text-[9.5px]">Tentang UMKM Kami</h2>
                  <p className="text-sm font-normal text-gray-600 leading-relaxed">
                    {shop.description}
                  </p>
                </section>

                <address className="not-italic grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] text-gray-500">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <span className="font-bold text-gray-800 block">Alamat Rumah Produksi:</span>
                      <span>{shop.address} ({shop.dusun})</span>
                    </div>
                  </div>
                  {shop.jamKerja && (
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <span className="font-bold text-gray-800 block">Jam Operasional Pelayanan:</span>
                        <time>{shop.jamKerja}</time>
                      </div>
                    </div>
                  )}
                </address>
              </div>

              {/* Right Column: Interaction Hub */}
              <aside className="lg:col-span-4 bg-emerald-50/40 rounded-2xl border border-emerald-100/60 p-4 space-y-4 self-start text-xs">
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400 block">Kontak Hubungan Pelaku Usaha</span>
                  <div className="font-bold text-gray-800 text-sm">{shop.ownerName} (Pemilik)</div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleContactWhatsApp}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-[10px] rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Hubungi Toko (WhatsApp)</span>
                  </button>

                  <Link
                    href="/map"
                    className="w-full py-3 bg-white hover:bg-gray-50 border border-emerald-200 text-emerald-700 font-bold uppercase tracking-wider text-[10px] rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-3xs"
                  >
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Lihat di Peta Desa</span>
                  </Link>
                </div>
              </aside>
            </div>

          </div>
        </article>

        {/* Associated Products Grid */}
        <section aria-label={`Etalase Produk ${shop.name}`} className="space-y-5">
          <div>
            <h2 className="font-bold text-gray-900 text-base uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" aria-hidden="true" />
              <span>Etalase Produk Toko ({shopProducts.length})</span>
            </h2>
            <p className="text-xs text-gray-500">Seluruh produk yang diproduksi secara langsung oleh {shop.name}.</p>
          </div>

          {shopProducts.length === 0 ? (
            <div className="bg-white border border-gray-150 rounded-2xl p-16 text-center shadow-3xs max-w-md mx-auto">
              <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" aria-hidden="true" />
              <p className="text-xs text-gray-400 italic">Toko belum mengunggah produk ke dalam katalog.</p>
            </div>
          ) : (
            <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 list-none p-0">
              {shopProducts.map((product: Product) => {
                const category = categories.find((c) => c.id === product.categoryId);

                return (
                  <li key={product.id}>
                    <ProductCard
                      product={product}
                      shop={shop}
                      category={category}
                    />
                  </li>
                );
              })}
            </ol>
          )}
        </section>

      </div>
    </MarketplaceLayout>
  );
}
