/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Star, MapPin, CheckCircle2 } from "lucide-react";
import { Link } from "@inertiajs/react";
import React from "react";
import type { Product, Shop, Category } from "@/types";
import { formatIDR } from "@/utils";

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
  const hasDiscount = product.isAvailable && (product.price % 3 === 0 || product.price % 4 === 0);
  const discountPercent = product.price % 4 === 0 ? 10 : 15;
  const originalPrice = hasDiscount 
    ? Math.round((product.price * (100 + discountPercent)) / 100 / 1000) * 1000 
    : null;
  
  const salesCount = Math.max(10, (product.reviewsCount * 4) + (Number(product.id.charCodeAt(product.id.length - 1)) % 15) + 3);

  return (
    <article
      className="group bg-white rounded-2xl border border-gray-200 hover:border-emerald-600 transition-all duration-300 flex flex-col h-full overflow-hidden shadow-2xs hover:shadow-lg hover:-translate-y-0.5"
      id={`product-card-${product.id}`}
    >
      <Link href={`/products/${product.id}`} className="block relative aspect-square bg-gray-50 overflow-hidden">
        <figure className="w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            loading="lazy"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
            referrerPolicy="no-referrer"
          />
          {shop && (
            <figcaption className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/75 to-transparent px-3 py-1.5 text-white flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="text-[9px] font-bold uppercase tracking-wide truncate">{shop.dusun}</span>
            </figcaption>
          )}
        </figure>

        {hasDiscount && (
          <div className="absolute top-2.5 left-2.5 px-2 py-1 bg-red-500 text-white font-extrabold text-[9px] uppercase tracking-wide rounded-md shadow-xs flex items-center gap-0.5" aria-label={`Diskon ${discountPercent}%`}>
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
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-3xs flex items-center justify-center" role="status" aria-label="Stok habis">
            <span className="px-3.5 py-1.5 bg-red-700 text-white text-[9px] uppercase tracking-widest font-extrabold rounded-full border border-red-600">
              Stok Habis
            </span>
          </div>
        )}
      </Link>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div className="space-y-1.5">
          {shop && (
            <div className="flex items-center gap-1.5">
              <img 
                src={shop.logo} 
                alt={shop.name} 
                width={18}
                height={18}
                loading="lazy"
                className="w-4.5 h-4.5 rounded-full object-cover border border-gray-200"
                referrerPolicy="no-referrer"
              />
              <Link
                href={`/shops/${shop.id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-[9.5px] font-bold text-gray-500 hover:text-emerald-600 flex items-center gap-1 truncate"
              >
                <span>{shop.name}</span>
                {shop.isVerified && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-100 shrink-0" aria-label="Terverifikasi" />
                )}
              </Link>
            </div>
          )}

          <h3 className="font-sans text-xs md:text-[13px] font-medium text-gray-800 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight min-h-[32px] pt-0.5">
            <Link href={`/products/${product.id}`}>{product.name}</Link>
          </h3>

          <div className="pt-0.5">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <data value={product.price} className="text-sm md:text-base font-extrabold text-emerald-600">
                {formatIDR(product.price)}
              </data>
              <span className="text-[9px] text-gray-400 font-normal">/ {product.unit}</span>
            </div>
            {hasDiscount && originalPrice && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <s className="text-[10px] text-gray-400">{formatIDR(originalPrice)}</s>
                <mark className="text-[8px] text-red-500 bg-red-50 font-extrabold px-1 rounded not-italic">-{discountPercent}%</mark>
              </div>
            )}
          </div>
        </div>

        <footer className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 text-[10px] text-gray-500" role="img" aria-label={`Rating ${product.rating} bintang, terjual ${salesCount}+`}>
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden="true" />
              <span className="font-bold text-gray-700">{product.rating}</span>
            </div>
            <span className="text-gray-300" aria-hidden="true">|</span>
            <span className="text-[9px] truncate">Terjual {salesCount}+</span>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="px-3 py-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-[9.5px] font-bold uppercase tracking-wider rounded-lg transition-all border border-emerald-100"
          >
            Beli
          </Link>
        </footer>
      </div>
    </article>
  );
}
