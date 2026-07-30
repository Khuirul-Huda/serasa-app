/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Store, UserCheck, AlertCircle, Package, Sparkles, MapPin } from "lucide-react";
import React from "react";
import type { Shop, Product, Category } from "@/types";
import MetricCard from "./MetricCard";

interface StatsTabProps {
  shops: Shop[];
  products: Product[];
  categories: Category[];
  onNavigateToShops?: (filter?: "all" | "verified" | "pending") => void;
  onNavigateToProducts?: () => void;
}

export default function StatsTab({
  shops,
  products,
  categories,
  onNavigateToShops,
  onNavigateToProducts,
}: StatsTabProps) {
  const totalShops = shops.length;
  const verifiedShops = shops.filter((s) => s.isVerified).length;
  const pendingShops = totalShops - verifiedShops;
  const totalProducts = products.length;

  const categoryDistribution = categories.map((cat) => {
    const count = products.filter((p) => p.categoryId === cat.id).length;
    return { id: cat.id, name: cat.name, count };
  });

  const dusunList = ["Dusun Samirono", "Dusun Bentar", "Dusun Surowono", "Dusun Tawang"];
  const dusunDistribution = dusunList.map((dusun) => {
    const count = shops.filter((s) => s.dusun.toLowerCase().includes(dusun.split(" ")[1]?.toLowerCase() || dusun.toLowerCase())).length;
    return { name: dusun, count };
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans text-navy-900" id="admin-stats-subtab">
      {/* 4 Interactive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div
          onClick={() => onNavigateToShops && onNavigateToShops("all")}
          className="cursor-pointer group hover:scale-[1.02] transition-all"
        >
          <MetricCard
            label="Total UMKM Terdaftar"
            value={totalShops}
            subtitle="Klik untuk kelola semua toko"
            icon={<Store className="w-5 h-5 group-hover:scale-110 transition-transform" />}
          />
        </div>

        <div
          onClick={() => onNavigateToShops && onNavigateToShops("verified")}
          className="cursor-pointer group hover:scale-[1.02] transition-all"
        >
          <MetricCard
            label="Toko Terverifikasi"
            value={verifiedShops}
            subtitle="Klik untuk filter terverifikasi"
            icon={<UserCheck className="w-5 h-5 text-pastel-teal group-hover:scale-110 transition-transform" />}
          />
        </div>

        <div
          onClick={() => onNavigateToShops && onNavigateToShops("pending")}
          className="cursor-pointer group hover:scale-[1.02] transition-all"
        >
          <MetricCard
            label="Menunggu Review"
            value={pendingShops}
            subtitle="Klik untuk tindakan verifikasi"
            icon={<AlertCircle className="w-5 h-5 text-pastel-peach group-hover:scale-110 transition-transform" />}
          />
        </div>

        <div
          onClick={() => onNavigateToProducts && onNavigateToProducts()}
          className="cursor-pointer group hover:scale-[1.02] transition-all"
        >
          <MetricCard
            label="Total Produk Etalase"
            value={totalProducts}
            subtitle="Klik untuk moderasi produk"
            icon={<Package className="w-5 h-5 text-pastel-teal group-hover:scale-110 transition-transform" />}
          />
        </div>
      </div>

      {/* Analytics Grid: Category & Dusun Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Category Distribution */}
        <div className="bg-white rounded-3xl border border-navy-200/60 p-6 sm:p-8 shadow-3xs space-y-5">
          <div>
            <h3 className="font-extrabold text-navy-900 text-base uppercase tracking-wider">
              Distribusi Sektor Komoditas UMKM
            </h3>
            <p className="text-xs sm:text-sm text-navy-500 mt-1 font-normal">
              Rincian jumlah produk kreatif warga per kategori usaha di Desa Samirono.
            </p>
          </div>

          <div className="space-y-4">
            {categoryDistribution.map((cat, idx) => {
              const percentage = totalProducts > 0 ? Math.round((cat.count / totalProducts) * 100) : 0;
              const barColors = [
                "bg-pastel-teal",
                "bg-navy-700",
                "bg-pastel-coral",
                "bg-pastel-peach",
                "bg-pastel-lavender",
              ];
              const barColor = barColors[idx % barColors.length];

              return (
                <div key={cat.id} className="space-y-1.5 text-xs sm:text-sm">
                  <div className="flex justify-between items-center font-bold text-navy-800">
                    <span>{cat.name}</span>
                    <span className="font-mono text-navy-500 text-xs">
                      {cat.count} Produk ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-navy-50 rounded-full overflow-hidden border border-navy-100">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Geographic Dusun Hamlet Distribution */}
        <div className="bg-white rounded-3xl border border-navy-200/60 p-6 sm:p-8 shadow-3xs space-y-5">
          <div>
            <h3 className="font-extrabold text-navy-900 text-base uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-5 h-5 text-pastel-teal" />
              <span>Penyebaran Wilayah Dusun Desa</span>
            </h3>
            <p className="text-xs sm:text-sm text-navy-500 mt-1 font-normal">
              Jumlah unit rumah produksi UMKM yang tersebar di 4 wilayah dusun.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3.5 pt-1">
            {dusunDistribution.map((dusun) => (
              <div key={dusun.name} className="p-4 bg-navy-50/60 rounded-2xl border border-navy-200/50 space-y-1">
                <span className="text-xs font-extrabold text-navy-500 uppercase tracking-wider block">{dusun.name}</span>
                <span className="text-xl font-black text-navy-900 block">{dusun.count} Toko</span>
                <span className="text-[11px] text-pastel-teal font-bold block">
                  {totalShops > 0 ? Math.round((dusun.count / totalShops) * 100) : 0}% Konsentrasi
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Notice Panel */}
      <div className="bg-pastel-teal-light/30 border border-pastel-teal/20 rounded-3xl p-5 sm:p-6 flex items-start gap-3.5 text-xs sm:text-sm text-navy-700 shadow-3xs">
        <div className="w-10 h-10 rounded-2xl bg-pastel-teal-light text-pastel-teal flex items-center justify-center shrink-0 border border-pastel-teal/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <span className="font-extrabold uppercase tracking-wider text-xs text-pastel-teal block">
            Informasi Sistem Admin
          </span>
          <p className="leading-relaxed text-navy-600 font-normal">
            Semua data UMKM dan produk yang terdaftar di etalase ini disimpan secara otomatis di database. Klik pada kartu statistik di atas atau gunakan tab navigasi untuk langsung melakukan tindakan verifikasi dan moderasi.
          </p>
        </div>
      </div>
    </div>
  );
}
