/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapPin, Phone, CheckCircle2, ShoppingBag, ArrowRight, Clock } from "lucide-react";
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
      className="group bg-white rounded-3xl border border-navy-200/60 hover:border-pastel-teal shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full font-sans"
      id={`shop-card-${shop.id}`}
    >
      {/* Background Image Banner */}
      <Link href={`/shops/${shop.id}`} className="block relative h-32 bg-navy-50 overflow-hidden">
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
        <div className="absolute inset-0 bg-linear-to-t from-navy-900/70 via-navy-900/20 to-transparent" aria-hidden="true" />

        {/* Verification & Dusun Pills */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {shop.isVerified && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/95 text-pastel-mint text-[8.5px] font-black tracking-wider uppercase border border-pastel-mint/20 rounded-md shadow-2xs backdrop-blur-xs">
              <CheckCircle2 className="w-3 h-3 text-pastel-mint fill-pastel-mint-light shrink-0" aria-hidden="true" />
              <span>Terverifikasi</span>
            </span>
          )}
        </div>
        
        <div className="absolute bottom-2.5 right-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-navy-900/80 text-navy-100 text-[8.5px] font-bold uppercase tracking-wider rounded-md backdrop-blur-xs">
            <MapPin className="w-2.5 h-2.5 text-pastel-mint" />
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
              <span className="inline-block text-[8.5px] font-extrabold text-pastel-teal bg-pastel-teal-light border border-pastel-teal/20 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                {shop.category}
              </span>
              {shop.nib && (
                <span className="px-2 py-0.5 bg-pastel-lavender-light text-pastel-lavender text-[8px] font-black uppercase rounded-md border border-pastel-lavender/20">
                  NIB
                </span>
              )}
              {shop.halal && (
                <span className="px-2 py-0.5 bg-pastel-mint-light text-pastel-mint text-[8px] font-black uppercase rounded-md border border-pastel-mint/20">
                  HALAL
                </span>
              )}
              {shop.pirt && (
                <span className="px-2 py-0.5 bg-pastel-peach-light text-pastel-peach text-[8px] font-black uppercase rounded-md border border-pastel-peach/20">
                  P-IRT
                </span>
              )}
            </div>

            <h3 className="font-sans text-base text-navy-900 group-hover:text-pastel-teal transition-colors flex items-center gap-1 leading-snug font-extrabold">
              <Link href={`/shops/${shop.id}`}>{shop.name}</Link>
            </h3>

            <p className="text-[10px] uppercase tracking-wider text-navy-400 font-bold -mt-0.5">
              Pemilik: <span className="text-navy-700 font-black">{shop.ownerName}</span>
            </p>

            <p className="text-xs text-navy-500 line-clamp-2 leading-relaxed pt-0.5 font-normal">
              {shop.description}
            </p>
          </div>
        </div>

        <footer className="pt-3.5 mt-4 border-t border-navy-100 space-y-3 text-xs">
          <address className="not-italic flex flex-col gap-1.5 text-navy-500">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-pastel-teal shrink-0 mt-0.5" aria-hidden="true" />
              <span className="font-sans text-[11px] text-navy-600 font-medium">{shop.address}</span>
            </div>
            
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <div className="flex items-center gap-1.5 font-bold text-navy-700 text-[10px] uppercase tracking-wider bg-navy-100/60 border border-navy-200/50 px-2.5 py-1 rounded-lg">
                <ShoppingBag className="w-3.5 h-3.5 text-pastel-teal shrink-0" aria-hidden="true" />
                <span>{productCount} Produk Kreatif</span>
              </div>

              {shop.jamKerja && (
                <div className="flex items-center gap-1 font-bold text-navy-500 text-[9.5px] uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-pastel-teal shrink-0" aria-hidden="true" />
                  <time>{shop.jamKerja}</time>
                </div>
              )}
            </div>
          </address>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleContactWhatsApp}
              className="py-2 px-3 border border-navy-200 text-navy-700 font-extrabold uppercase tracking-wider text-[9.5px] rounded-xl hover:bg-pastel-mint-light hover:text-pastel-mint hover:border-pastel-mint/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              aria-label={`Hubungi ${shop.name} via WhatsApp`}
            >
              <Phone className="w-3.5 h-3.5 text-pastel-mint" aria-hidden="true" />
              <span>Kontak WA</span>
            </button>
            <Link
              href={`/shops/${shop.id}`}
              className="py-2 px-3 bg-pastel-teal hover:bg-pastel-teal/90 text-white font-extrabold uppercase tracking-wider text-[9.5px] rounded-xl transition-all flex items-center justify-center gap-1.5 group/btn shadow-2xs"
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
