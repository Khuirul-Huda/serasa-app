/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Star, MapPin, CheckCircle2 } from "lucide-react";
import { Product, Shop, Category } from "@/types";
import { formatIDR, getWhatsAppLink } from "@/utils";
import { router } from "@inertiajs/react";

interface ProductCardProps {
  product: Product;
  shop: Shop | undefined;
  category: Category | undefined;
}

export default function ProductCard({
  product,
  shop,
  category,
}: ProductCardProps) {
  const handleWhatsAppBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!shop) return;
    const message = `Halo ${shop.name}, saya tertarik dengan produk ekonomi kreatif Anda: "${product.name}" (${formatIDR(product.price)} / ${product.unit}) yang saya lihat di website SERASA Samirono. Apakah produk ini tersedia?`;
    const url = getWhatsAppLink(shop.phone, message);
    window.open(url, "_blank");
  };

  const hasDiscount = product.isAvailable && (product.price % 3 === 0 || product.price % 4 === 0);
  const discountPercent = product.price % 4 === 0 ? 10 : 15;
  const originalPrice = hasDiscount 
    ? Math.round((product.price * (100 + discountPercent)) / 100 / 1000) * 1000 
    : null;
  
  const salesCount = Math.max(10, (product.reviewsCount * 4) + (Number(product.id.charCodeAt(product.id.length - 1)) % 15) + 3);

  return (
    <div 
      onClick={() => router.visit(`/products/${product.id}`)}
      className="group bg-white rounded-2xl border border-gray-200 hover:border-emerald-600 transition-all duration-300 flex flex-col h-full cursor-pointer overflow-hidden shadow-2xs hover:shadow-lg hover:-translate-y-0.5"
      id={`product-card-${product.id}`}
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          referrerPolicy="no-referrer"
        />
        
        {hasDiscount && (
          <div className="absolute top-2.5 left-2.5 px-2 py-1 bg-red-500 text-white font-extrabold text-[9px] uppercase tracking-wide rounded-md shadow-xs flex items-center gap-0.5">
            <span>{discountPercent}%</span>
            <span className="text-[8px] font-normal opacity-90">OFF</span>
          </div>
        )}

        {category && (
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider bg-black/50 text-white backdrop-blur-xs">
            {category.name}
          </span>
        )}

        {!product.isAvailable && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-3xs flex items-center justify-center">
            <span className="px-3.5 py-1.5 bg-red-700 text-white text-[9px] uppercase tracking-widest font-extrabold rounded-full border border-red-600">
              Stok Habis
            </span>
          </div>
        )}

        {shop && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent px-3 py-1.5 text-white flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="text-[9px] font-bold uppercase tracking-wide truncate">{shop.dusun}</span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div className="space-y-1.5">
          {shop && (
            <div className="flex items-center gap-1.5">
              <img 
                src={shop.logo} 
                alt={shop.name} 
                className="w-4.5 h-4.5 rounded-full object-cover border border-gray-200"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.visit(`/shops/${shop.id}`);
                }}
                className="text-[9.5px] font-bold text-gray-500 hover:text-emerald-600 flex items-center gap-1 cursor-pointer truncate"
              >
                <span>{shop.name}</span>
                {shop.isVerified && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-100 shrink-0" />
                )}
              </button>
            </div>
          )}

          <h3 className="font-sans text-xs md:text-[13px] font-medium text-gray-800 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight min-h-[32px] pt-0.5">
            {product.name}
          </h3>

          <div className="pt-0.5">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm md:text-base font-extrabold text-emerald-600">
                {formatIDR(product.price)}
              </span>
              <span className="text-[9px] text-gray-400 font-normal">
                / {product.unit}
              </span>
            </div>
            {hasDiscount && originalPrice && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-gray-400 line-through">
                  {formatIDR(originalPrice)}
                </span>
                <span className="text-[8px] text-red-500 bg-red-50 font-extrabold px-1 rounded">
                  -{discountPercent}%
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-gray-700">{product.rating}</span>
            </div>
            <span className="text-gray-300">|</span>
            <span className="text-[9px] truncate">Terjual {salesCount}+</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              router.visit(`/products/${product.id}`);
            }}
            className="px-3 py-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-[9.5px] font-bold uppercase tracking-wider rounded-lg transition-all border border-emerald-100 cursor-pointer"
          >
            Beli
          </button>
        </div>
      </div>
    </div>
  );
}
