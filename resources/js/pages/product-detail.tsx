/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { Link, useForm } from "@inertiajs/react";
import {
  ArrowLeft,
  Star,
  Phone,
  CheckCircle2,
  ShoppingCart,
  MessageSquare,
  Send
} from "lucide-react";
import React from "react";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MarketplaceLayout from "@/layouts/marketplace-layout";
import type { AppSettings, Category, Product, Shop, Review } from "@/types";
import { formatIDR, getWhatsAppLink } from "@/utils";

interface ProductDetailProps {
  settings: AppSettings;
  categories: Category[];
  product: Product;
  shop: Shop;
  reviews?: Review[];
  allProducts?: Product[];
}

export default function ProductDetail({
  settings,
  categories,
  product,
  shop,
  reviews = [],
  allProducts = [],
}: ProductDetailProps) {
  const productReviews = reviews.length > 0 ? reviews : ((product as any).reviews || []);

  // Review form submission setup
  const { data, setData, post, processing, errors, reset } = useForm({
    userName: "",
    rating: 5,
    comment: "",
  });

  const handleContactWhatsApp = () => {
    const message = `Halo ${shop.ownerName} dari ${shop.name}, saya melihat produk digital Anda "${product.name}" di platform SERASA Desa Samirono dan tertarik untuk membeli.`;
    const url = getWhatsAppLink(shop.phone, message);
    window.open(url, "_blank");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/products/${product.id}/reviews`, {
      onSuccess: () => {
        reset("comment");
      }
    });
  };

  return (
    <MarketplaceLayout
      settings={settings}
      categories={categories}
      products={allProducts}
      activeTab="katalog"
    >
      <SEOHead
        title={`${product.name} - ${shop.name} Samirono`}
        description={`Spesifikasi dan ulasan untuk ${product.name} seharga Rp${product.price.toLocaleString('id-ID')} dari ${shop.name} Desa Samirono.`}
        keywords={`${product.name}, ${product.name} Samirono, Produk ${shop.name}, Beli ${product.name}, Harga ${product.name}`}
        image={product.image}
        url={`https://serasa.levitation.web.id/products/${product.id}`}
        type="product"
        siteName={settings.appName}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
        
        {/* Breadcrumb Nav */}
        <nav aria-label="Breadcrumb">
          <Link
            href={`/shops/${shop.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Kembali ke Katalog {shop.name}</span>
          </Link>
        </nav>

        {/* Master Product Specifications Box */}
        <article className="bg-white rounded-3xl border border-gray-200 shadow-3xs overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8">
          
          {/* Left Column: Product Image (Column span 5) */}
          <div className="md:col-span-5 relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-150">
            <img 
              src={product.image} 
              alt={product.name} 
              width={500}
              height={500}
              loading="eager"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {!product.isAvailable && (
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-3xs flex items-center justify-center">
                <span className="px-5 py-2 bg-red-700 text-white text-[10px] uppercase tracking-widest font-extrabold rounded-full border border-red-600">
                  Stok Habis
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Specs & Actions (Column span 7) */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Title / Badges */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[8px] font-extrabold uppercase rounded border border-emerald-100/70 tracking-wider">
                  Produk UMKM
                </span>
                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 text-[8px] font-bold uppercase rounded border border-gray-200 tracking-wider">
                  {shop.category}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Shop Badge Link */}
              <div className="flex items-center gap-2 pt-0.5">
                <img 
                  src={shop.logo} 
                  alt={shop.name} 
                  width={20}
                  height={20}
                  loading="eager"
                  className="w-5 h-5 rounded-full object-cover border border-gray-200"
                  referrerPolicy="no-referrer"
                />
                <Link
                  href={`/shops/${shop.id}`}
                  className="text-xs font-bold text-gray-600 hover:text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{shop.name}</span>
                  {shop.isVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 shrink-0" />
                  )}
                </Link>
              </div>
            </div>

            {/* Price Segment */}
            <div className="bg-gray-50 border border-gray-200/60 p-4 rounded-2xl">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400 block">Harga Terdaftar</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <data value={product.price} className="text-2xl font-black text-emerald-700">{formatIDR(product.price)}</data>
                <span className="text-xs text-gray-500 font-semibold">/ {product.unit}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1 text-xs">
              <span className="font-extrabold text-gray-500 uppercase tracking-wider block text-[9px]">Uraian Produk</span>
              <p className="text-gray-600 text-sm leading-relaxed font-normal">
                {product.description}
              </p>
            </div>

            {/* Call to Actions */}
            <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleContactWhatsApp}
                disabled={!product.isAvailable}
                className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-[10px] rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Phone className="w-4 h-4 text-white" />
                <span>Beli Langsung via WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  alert("Simulasi: Produk ditambahkan ke keranjang belanja Anda di Navbar.");
                }}
                disabled={!product.isAvailable}
                className="py-3 bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold uppercase tracking-wider text-[10px] rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-3xs disabled:opacity-50"
              >
                <ShoppingCart className="w-4 h-4 text-emerald-600" />
                <span>Simulasi Keranjang</span>
              </button>
            </div>

          </div>
        </article>

        {/* Dynamic Reviews and Write a Review Segment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Reviews List (Col span 7) */}
          <section className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 shadow-3xs space-y-6" aria-label="Ulasan Pembeli">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  <span>Ulasan Pembeli ({productReviews.length})</span>
                </h2>
              </div>
              <div className="flex items-center gap-1 font-bold text-gray-700 text-xs" aria-label={`Rating ${product.rating} dari 5`}>
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                <span>{product.rating} / 5.0</span>
              </div>
            </div>

            {productReviews.length === 0 ? (
              <div className="text-center py-12 text-gray-400 italic text-xs">
                Belum ada ulasan untuk produk ini. Jadilah yang pertama memberikan penilaian!
              </div>
            ) : (
              <ol className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto pr-1 list-none p-0">
                {productReviews.map((rev: Review) => (
                  <li key={rev.id} className="py-4 space-y-1.5 text-xs">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="font-bold text-gray-800 text-[13px]">{rev.userName}</span>
                        <time className="block text-[9.5px] text-gray-400 font-medium" dateTime={rev.createdAt}>{rev.date || 'Baru Saja'}</time>
                      </div>
                      <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded text-[10px] font-bold text-amber-800" aria-label={`Rating ${rev.rating} bintang`}>
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" aria-hidden="true" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 font-normal leading-relaxed text-sm">
                      {rev.comment}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {/* Right Column: Write a Review Form (Col span 5) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 p-6 shadow-3xs space-y-4 self-start">
            <div>
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Tulis Ulasan Baru</h3>
              <p className="text-[10px] text-gray-500">Berikan masukan atau kritik membangun bagi produk kreatif Samirono.</p>
            </div>

             <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label className="font-bold text-gray-500 uppercase tracking-wider text-[9px] block">Nama Anda</Label>
                <Input
                  type="text"
                  required
                  placeholder="Contoh: Ibu Ranti"
                  value={data.userName}
                  onChange={(e) => setData("userName", e.target.value)}
                  className="w-full px-4 py-2 bg-white font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs"
                />
                {errors.userName && <span className="text-red-500 font-semibold">{errors.userName}</span>}
              </div>

              <div className="space-y-1.5">
                <Label className="font-bold text-gray-500 uppercase tracking-wider text-[9px] block">Rating Bintang</Label>
                <select
                  value={data.rating}
                  onChange={(e) => setData("rating", Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-250 bg-white font-bold uppercase tracking-wider text-gray-700 cursor-pointer text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Sangat Puas)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Puas)</option>
                  <option value={3}>⭐⭐⭐ (3 - Biasa Saja)</option>
                  <option value={2}>⭐⭐ (2 - Kurang)</option>
                  <option value={1}>⭐ (1 - Kecewa)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="font-bold text-gray-500 uppercase tracking-wider text-[9px] block">Tanggapan / Komentar</Label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ceritakan cita rasa keju, atau keawetan tas anyaman ini..."
                  value={data.comment}
                  onChange={(e) => setData("comment", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-250 bg-white text-gray-800 font-medium resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs outline-none"
                />
                {errors.comment && <span className="text-red-500 font-semibold">{errors.comment}</span>}
              </div>

              <Button
                type="submit"
                disabled={processing}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-[10px] rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <Send className="w-4 h-4 text-white" />
                <span>{processing ? "Mengirim..." : "Kirim Ulasan Sekarang"}</span>
              </Button>
            </form>
          </div>

        </div>

      </div>
    </MarketplaceLayout>
  );
}
