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
      className="group bg-white rounded-2xl border border-navy-200/60 hover:border-pastel-teal transition-all duration-300 flex flex-col h-full overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-0.5 font-sans"
      id={`product-card-${product.id}`}
    >
      <Link href={`/products/${product.id}`} className="block relative aspect-square bg-navy-50 overflow-hidden">
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
            <figcaption className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-navy-900/80 to-transparent px-3 py-1.5 text-white flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-pastel-peach shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wide truncate">{shop.dusun}</span>
            </figcaption>
          )}
        </figure>

        {hasDiscount && (
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-pastel-coral text-white font-black text-xs uppercase tracking-wide rounded-md shadow-xs flex items-center gap-0.5" aria-label={`Diskon ${discountPercent}%`}>
            <span>{discountPercent}%</span>
            <span className="text-[10px] font-normal opacity-90">OFF</span>
          </div>
        )}

        {category && (
          <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-navy-900/70 text-white backdrop-blur-xs">
            {category.name}
          </span>
        )}

        {!product.isAvailable && (
          <div className="absolute inset-0 bg-navy-900/80 backdrop-blur-3xs flex items-center justify-center" role="status" aria-label="Stok habis">
            <span className="px-3.5 py-1.5 bg-pastel-coral text-white text-xs uppercase tracking-widest font-extrabold rounded-full border border-pastel-coral/80">
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
                width={20}
                height={20}
                loading="lazy"
                className="w-5 h-5 rounded-full object-cover border border-navy-200"
                referrerPolicy="no-referrer"
              />
              <Link
                href={`/shops/${shop.id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-bold text-navy-500 hover:text-pastel-teal flex items-center gap-1 truncate"
              >
                <span>{shop.name}</span>
                {shop.isVerified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-pastel-teal fill-pastel-teal-light shrink-0" aria-label="Terverifikasi" />
                )}
              </Link>
            </div>
          )}

          <h3 className="font-sans text-sm md:text-base font-bold text-navy-800 group-hover:text-pastel-teal transition-colors line-clamp-2 leading-snug min-h-[38px] pt-0.5">
            <Link href={`/products/${product.id}`}>{product.name}</Link>
          </h3>

          <div className="pt-0.5">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <data value={product.price} className="text-base md:text-lg font-black text-navy-900">
                {formatIDR(product.price)}
              </data>
              <span className="text-xs text-navy-400 font-normal">/ {product.unit}</span>
            </div>
            {hasDiscount && originalPrice && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <s className="text-xs text-navy-400">{formatIDR(originalPrice)}</s>
                <mark className="text-[10px] text-pastel-coral bg-pastel-coral-light font-extrabold px-1.5 rounded not-italic">-{discountPercent}%</mark>
              </div>
            )}
          </div>
        </div>

        <footer className="pt-2 border-t border-navy-100 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 text-xs text-navy-500" role="img" aria-label={`Rating ${product.rating} bintang, terjual ${salesCount}+`}>
            <div className="flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 fill-pastel-peach text-pastel-peach" aria-hidden="true" />
              <span className="font-bold text-navy-700">{product.rating}</span>
            </div>
            <span className="text-navy-300" aria-hidden="true">|</span>
            <span className="text-[11px] truncate">Terjual {salesCount}+</span>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="px-3.5 py-1.5 bg-pastel-coral hover:bg-pastel-coral/90 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-3xs"
          >
            Beli
          </Link>
        </footer>
      </div>
    </article>
  );
}
