/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Store, UserCheck, AlertCircle, Package, Sparkles } from "lucide-react";
import React from "react";
import type { Shop, Product, Category } from "@/types";
import MetricCard from "./MetricCard";

interface StatsTabProps {
  shops: Shop[];
  products: Product[];
  categories: Category[];
}

export default function StatsTab({ shops, products, categories }: StatsTabProps) {
  const totalShops = shops.length;
  const verifiedShops = shops.filter((s) => s.isVerified).length;
  const pendingShops = totalShops - verifiedShops;
  const totalProducts = products.length;

  const categoryDistribution = categories.map((cat) => {
    const count = products.filter((p) => p.categoryId === cat.id).length;
    return { id: cat.id, name: cat.name, count };
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans text-navy-900" id="admin-stats-subtab">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          label="Total UMKM Terdaftar"
          value={totalShops}
          subtitle="Mitra Ekonomi Desa"
          icon={<Store className="w-5 h-5" />}
        />
        <MetricCard
          label="Toko Terverifikasi"
          value={verifiedShops}
          subtitle="Status Aktif & Valid"
          icon={<UserCheck className="w-5 h-5 text-pastel-teal" />}
        />
        <MetricCard
          label="Menunggu Review"
          value={pendingShops}
          subtitle="Perlu Verifikasi Admin"
          icon={<AlertCircle className="w-5 h-5 text-pastel-peach" />}
        />
        <MetricCard
          label="Total Produk Etalase"
          value={totalProducts}
          subtitle="Katalog Aktif Warga"
          icon={<Package className="w-5 h-5 text-pastel-teal" />}
        />
      </div>

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
            Semua data UMKM dan produk yang terdaftar di etalase ini disimpan secara otomatis di database. Gunakan tab <strong className="font-bold text-navy-800">"Kelola UMKM"</strong> untuk memverifikasi toko baru atau mengimpor data massal dari file Excel.
          </p>
        </div>
      </div>
    </div>
  );
}
