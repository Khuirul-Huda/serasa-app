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
    <div className="space-y-6 animate-fade-in" id="admin-stats-subtab">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          subtitle="Perlu Tindakan Admin"
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
      <div className="bg-white rounded-3xl border border-navy-200/60 p-6 shadow-3xs space-y-4">
        <div>
          <h3 className="font-extrabold text-navy-900 text-sm uppercase tracking-wider">
            Distribusi Sektor Komoditas UMKM
          </h3>
          <p className="text-xs text-navy-500 mt-0.5">
            Rincian jumlah produk kreatif warga per kategori usaha di Desa Samirono.
          </p>
        </div>

        <div className="space-y-3">
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
              <div key={cat.id} className="space-y-1 text-xs">
                <div className="flex justify-between items-center font-bold text-navy-700">
                  <span>{cat.name}</span>
                  <span className="font-mono text-navy-500">
                    {cat.count} Produk ({percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-navy-50 rounded-full overflow-hidden border border-navy-100">
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
      <div className="bg-pastel-teal-light/30 border border-pastel-teal/15 rounded-3xl p-5 flex items-start gap-3 text-xs text-navy-700">
        <div className="w-8 h-8 rounded-xl bg-pastel-teal-light text-pastel-teal flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <span className="font-bold uppercase tracking-wider text-[10px] text-pastel-teal block">
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
