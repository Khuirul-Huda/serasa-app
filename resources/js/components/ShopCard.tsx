/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapPin, Phone, CheckCircle2, ShoppingBag, ArrowRight, Clock, Award } from "lucide-react";
import { Link } from "@inertiajs/react";
import React from "react";
import type { Shop } from "@/types";
import { getWhatsAppLink } from "@/utils";

interface ShopCardProps {
  shop: Shop;
  productCount: number;
}

export default function ShopCard({
  shop,
  productCount,
}: ShopCardProps) {
  const handleContactWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Halo ${shop.ownerName} dari ${shop.name}, saya melihat profil toko digital Anda di platform SERASA Desa Samirono. Saya ingin menanyakan produk-produk kreatif Anda.`;
    const url = getWhatsAppLink(shop.phone, message);
    window.open(url, "_blank");
  };

  return (
    <article
      className="group bg-white rounded-3xl border border-stone-200/80 hover:border-emerald-600 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full font-sans"
      id={`shop-card-${shop.id}`}
    >
      {/* Background Image Banner */}
      <Link href={`/shops/${shop.id}`} className="block relative h-32 bg-stone-100 overflow-hidden">
        <figure className="w-full h-full">
          <img
            src={shop.image}
            alt={`Banner ${shop.name}`}
            width={400}
            height={128}
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-95"
            referrerPolicy="no-referrer"
          />
          <figcaption className="sr-only">{shop.name} — {shop.category}</figcaption>
        </figure>
        <div className="absolute inset-0 bg-linear-to-t from-stone-950/70 via-stone-950/20 to-transparent" aria-hidden="true" />

        {/* Verification & Dusun Pills */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {shop.isVerified && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/95 text-emerald-800 text-[8.5px] font-black tracking-wider uppercase border border-emerald-100 rounded-md shadow-2xs backdrop-blur-xs">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-100 shrink-0" aria-hidden="true" />
              <span>Terverifikasi</span>
            </span>
          )}
        </div>
        
        <div className="absolute bottom-2.5 right-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-900/80 text-stone-200 text-[8.5px] font-bold uppercase tracking-wider rounded-md backdrop-blur-xs">
            <MapPin className="w-2.5 h-2.5 text-emerald-400" />
            <span>{shop.dusun}</span>
          </span>
        </div>
      </Link>

      {/* Profile Info Area */}
      <div className="px-5 pb-5 pt-0 relative flex-1 flex flex-col justify-between">
        <div className="relative">
          {/* Logo overlapping the banner */}
          <div className="absolute -top-8 left-0 w-14 h-14 rounded-2xl border-2 border-white bg-white overflow-hidden shadow-xs">
            <img
              src={shop.logo}
              alt={`Logo ${shop.name}`}
              width={56}
              height={56}
              loading="lazy"
              sizes="56px"
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="pt-8 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-block text-[8.5px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                {shop.category}
              </span>
              {shop.nib && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[8px] font-black uppercase rounded-md border border-blue-200/80">
                  NIB
                </span>
              )}
              {shop.halal && (
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[8px] font-black uppercase rounded-md border border-emerald-200/80">
                  HALAL
                </span>
              )}
              {shop.pirt && (
                <span className="px-2 py-0.5 bg-purple-50 text-purple-800 text-[8px] font-black uppercase rounded-md border border-purple-200/80">
                  P-IRT
                </span>
              )}
            </div>

            <h3 className="font-sans text-base text-stone-900 group-hover:text-emerald-700 transition-colors flex items-center gap-1 leading-snug font-extrabold">
              <Link href={`/shops/${shop.id}`}>{shop.name}</Link>
            </h3>

            <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold -mt-0.5">
              Pemilik: <span className="text-stone-700 font-black">{shop.ownerName}</span>
            </p>

            <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed pt-0.5 font-normal">
              {shop.description}
            </p>
          </div>
        </div>

        <footer className="pt-3.5 mt-4 border-t border-stone-100 space-y-3 text-xs">
          <address className="not-italic flex flex-col gap-1.5 text-stone-500">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              <span className="font-sans text-[11px] text-stone-600 font-medium">{shop.address}</span>
            </div>
            
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <div className="flex items-center gap-1.5 font-bold text-stone-700 text-[10px] uppercase tracking-wider bg-stone-100/70 border border-stone-200/60 px-2.5 py-1 rounded-lg">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                <span>{productCount} Produk Kreatif</span>
              </div>

              {shop.jamKerja && (
                <div className="flex items-center gap-1 font-bold text-stone-500 text-[9.5px] uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                  <time>{shop.jamKerja}</time>
                </div>
              )}
            </div>
          </address>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleContactWhatsApp}
              className="py-2 px-3 border border-stone-200 text-stone-700 font-extrabold uppercase tracking-wider text-[9.5px] rounded-xl hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              aria-label={`Hubungi ${shop.name} via WhatsApp`}
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              <span>Kontak WA</span>
            </button>
            <Link
              href={`/shops/${shop.id}`}
              className="py-2 px-3 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold uppercase tracking-wider text-[9.5px] rounded-xl transition-all flex items-center justify-center gap-1.5 group/btn shadow-2xs"
              aria-label={`Lihat katalog ${shop.name}`}
            >
              <span>Katalog</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </footer>
      </div>
    </article>
  );
}
