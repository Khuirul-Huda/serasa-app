/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { MapPin, Phone, CheckCircle2, ShoppingBag, ArrowRight, Clock } from "lucide-react";
import { Shop } from "@/types";
import { getWhatsAppLink } from "@/utils";
import { router } from "@inertiajs/react";

interface ShopCardProps {
  shop: Shop;
  productCount: number;
}

export default function ShopCard({
  shop,
  productCount,
}: ShopCardProps) {
  const handleContactWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Halo ${shop.ownerName} dari ${shop.name}, saya melihat profil toko digital Anda di platform SERASA Desa Samirono. Saya ingin menanyakan produk-produk kreatif Anda.`;
    const url = getWhatsAppLink(shop.phone, message);
    window.open(url, "_blank");
  };

  const handleNavigate = () => {
    router.visit(`/shops/${shop.id}`);
  };

  return (
    <div 
      onClick={handleNavigate}
      className="group bg-white rounded-2xl border border-gray-200 hover:border-emerald-600 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full"
      id={`shop-card-${shop.id}`}
    >
      {/* Background Image Banner */}
      <div className="relative h-28 bg-gray-50 overflow-hidden">
        <img
          src={shop.image}
          alt={shop.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-95"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
        
        {/* Verification Pill */}
        {shop.isVerified && (
          <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 bg-white/95 text-emerald-800 text-[8px] font-extrabold tracking-wider uppercase border border-emerald-100 rounded shadow-3xs backdrop-blur-xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-100 shrink-0" />
            <span>Terverifikasi</span>
          </span>
        )}
      </div>

      {/* Profile Info Area */}
      <div className="px-4 pb-4 pt-0 relative flex-1 flex flex-col justify-between">
        <div className="relative">
          {/* Logo overlapping the banner */}
          <div className="absolute -top-7 left-0 w-12 h-12 rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
            <img
              src={shop.logo}
              alt={shop.name}
              className="w-full h-full object-cover transition-all duration-500"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="pt-8 space-y-2">
            {/* Category tag */}
            <span className="inline-block text-[8px] font-bold text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded uppercase tracking-wider">
              {shop.category}
            </span>

            {/* Shop Title */}
            <h3 className="font-sans text-[15px] text-gray-800 group-hover:text-emerald-600 transition-colors flex items-center gap-1 leading-snug font-bold">
              {shop.name}
            </h3>

            {/* Owner name */}
            <p className="text-[9.5px] uppercase tracking-wider text-gray-400 font-bold -mt-1">
              Pemilik: <span className="text-gray-600 font-extrabold">{shop.ownerName}</span>
            </p>

            {/* Description */}
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed pt-0.5 font-normal">
              {shop.description}
            </p>
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-gray-100 space-y-2.5 text-xs">
          {/* Metadata: Location, Product count, Jam Kerja */}
          <div className="flex flex-col gap-1 text-gray-500">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-sans text-[11px]">{shop.address} ({shop.dusun})</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-gray-700 text-[9.5px] uppercase tracking-wider">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{productCount} Produk</span>
            </div>
            {shop.jamKerja && (
              <div className="flex items-center gap-1.5 font-bold text-gray-500 text-[9.5px] uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Jam Kerja: {shop.jamKerja}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleContactWhatsApp}
              className="py-1.5 px-3 border border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[9px] rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Phone className="w-3 h-3 text-emerald-600" />
              Kontak
            </button>
            <button
              onClick={handleNavigate}
              className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-[9px] rounded-lg transition-colors flex items-center justify-center gap-1 group/btn cursor-pointer shadow-3xs"
            >
              <span>Katalog</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
