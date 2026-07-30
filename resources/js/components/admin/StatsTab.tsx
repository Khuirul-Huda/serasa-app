/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
    Store,
    UserCheck,
    AlertCircle,
    Package,
    Sparkles,
    MapPin,
} from 'lucide-react';
import React from 'react';
import type { Shop, Product, Category } from '@/types';
import MetricCard from './MetricCard';

interface StatsTabProps {
    shops: Shop[];
    products: Product[];
    categories: Category[];
    onNavigateToShops?: (filter?: 'all' | 'verified' | 'pending') => void;
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

    const dusunList = [
        'Dusun Samirono',
        'Dusun Bentar',
        'Dusun Surowono',
        'Dusun Tawang',
    ];
    const dusunDistribution = dusunList.map((dusun) => {
        const count = shops.filter((s) =>
            s.dusun
                .toLowerCase()
                .includes(
                    dusun.split(' ')[1]?.toLowerCase() || dusun.toLowerCase(),
                ),
        ).length;

        return { name: dusun, count };
    });

    return (
        <div
            className="animate-fade-in space-y-6 font-sans text-navy-900"
            id="admin-stats-subtab"
        >
            {/* 4 Interactive Metric Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                <div
                    onClick={() =>
                        onNavigateToShops && onNavigateToShops('all')
                    }
                    className="group cursor-pointer transition-all hover:scale-[1.02]"
                >
                    <MetricCard
                        label="Total UMKM Terdaftar"
                        value={totalShops}
                        subtitle="Klik untuk kelola semua toko"
                        icon={
                            <Store className="h-5 w-5 transition-transform group-hover:scale-110" />
                        }
                    />
                </div>

                <div
                    onClick={() =>
                        onNavigateToShops && onNavigateToShops('verified')
                    }
                    className="group cursor-pointer transition-all hover:scale-[1.02]"
                >
                    <MetricCard
                        label="Toko Terverifikasi"
                        value={verifiedShops}
                        subtitle="Klik untuk filter terverifikasi"
                        icon={
                            <UserCheck className="h-5 w-5 text-pastel-teal transition-transform group-hover:scale-110" />
                        }
                    />
                </div>

                <div
                    onClick={() =>
                        onNavigateToShops && onNavigateToShops('pending')
                    }
                    className="group cursor-pointer transition-all hover:scale-[1.02]"
                >
                    <MetricCard
                        label="Menunggu Review"
                        value={pendingShops}
                        subtitle="Klik untuk tindakan verifikasi"
                        icon={
                            <AlertCircle className="h-5 w-5 text-pastel-peach transition-transform group-hover:scale-110" />
                        }
                    />
                </div>

                <div
                    onClick={() =>
                        onNavigateToProducts && onNavigateToProducts()
                    }
                    className="group cursor-pointer transition-all hover:scale-[1.02]"
                >
                    <MetricCard
                        label="Total Produk Etalase"
                        value={totalProducts}
                        subtitle="Klik untuk moderasi produk"
                        icon={
                            <Package className="h-5 w-5 text-pastel-teal transition-transform group-hover:scale-110" />
                        }
                    />
                </div>
            </div>

            {/* Analytics Grid: Category & Dusun Distribution */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Sector Category Distribution */}
                <div className="shadow-3xs space-y-5 rounded-3xl border border-navy-200/60 bg-white p-6 sm:p-8">
                    <div>
                        <h3 className="text-base font-extrabold tracking-wider text-navy-900 uppercase">
                            Distribusi Sektor Komoditas UMKM
                        </h3>
                        <p className="mt-1 text-xs font-normal text-navy-500 sm:text-sm">
                            Rincian jumlah produk kreatif warga per kategori
                            usaha di Desa Samirono.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {categoryDistribution.map((cat, idx) => {
                            const percentage =
                                totalProducts > 0
                                    ? Math.round(
                                          (cat.count / totalProducts) * 100,
                                      )
                                    : 0;
                            const barColors = [
                                'bg-pastel-teal',
                                'bg-navy-700',
                                'bg-pastel-coral',
                                'bg-pastel-peach',
                                'bg-pastel-lavender',
                            ];
                            const barColor = barColors[idx % barColors.length];

                            return (
                                <div
                                    key={cat.id}
                                    className="space-y-1.5 text-xs sm:text-sm"
                                >
                                    <div className="flex items-center justify-between font-bold text-navy-800">
                                        <span>{cat.name}</span>
                                        <span className="font-mono text-xs text-navy-500">
                                            {cat.count} Produk ({percentage}%)
                                        </span>
                                    </div>
                                    <div className="h-3 w-full overflow-hidden rounded-full border border-navy-100 bg-navy-50">
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
                <div className="shadow-3xs space-y-5 rounded-3xl border border-navy-200/60 bg-white p-6 sm:p-8">
                    <div>
                        <h3 className="flex items-center gap-2 text-base font-extrabold tracking-wider text-navy-900 uppercase">
                            <MapPin className="h-5 w-5 text-pastel-teal" />
                            <span>Penyebaran Wilayah Dusun Desa</span>
                        </h3>
                        <p className="mt-1 text-xs font-normal text-navy-500 sm:text-sm">
                            Jumlah unit rumah produksi UMKM yang tersebar di 4
                            wilayah dusun.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 pt-1">
                        {dusunDistribution.map((dusun) => (
                            <div
                                key={dusun.name}
                                className="space-y-1 rounded-2xl border border-navy-200/50 bg-navy-50/60 p-4"
                            >
                                <span className="block text-xs font-extrabold tracking-wider text-navy-500 uppercase">
                                    {dusun.name}
                                </span>
                                <span className="block text-xl font-black text-navy-900">
                                    {dusun.count} Toko
                                </span>
                                <span className="block text-[11px] font-bold text-pastel-teal">
                                    {totalShops > 0
                                        ? Math.round(
                                              (dusun.count / totalShops) * 100,
                                          )
                                        : 0}
                                    % Konsentrasi
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Info Notice Panel */}
            <div className="shadow-3xs flex items-start gap-3.5 rounded-3xl border border-pastel-teal/20 bg-pastel-teal-light/30 p-5 text-xs text-navy-700 sm:p-6 sm:text-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-pastel-teal/20 bg-pastel-teal-light text-pastel-teal">
                    <Sparkles className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                    <span className="block text-xs font-extrabold tracking-wider text-pastel-teal uppercase">
                        Informasi Sistem Admin
                    </span>
                    <p className="leading-relaxed font-normal text-navy-600">
                        Semua data UMKM dan produk yang terdaftar di etalase ini
                        disimpan secara otomatis di database. Klik pada kartu
                        statistik di atas atau gunakan tab navigasi untuk
                        langsung melakukan tindakan verifikasi dan moderasi.
                    </p>
                </div>
            </div>
        </div>
    );
}
