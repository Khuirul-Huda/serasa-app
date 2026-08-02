import { Store, ShieldCheck, MapPin } from 'lucide-react';
import React from 'react';
import type { AppSettings } from '@/types';

interface ShopHeroHeaderProps {
    settings?: AppSettings;
    totalShops: number;
    verifiedShopsCount: number;
    dusunCount: number;
}

export default function ShopHeroHeader({
    settings,
    totalShops,
    verifiedShopsCount,
    dusunCount,
}: ShopHeroHeaderProps) {
    const village = settings?.villageName || 'Desa Samirono';
    const kecamatan = settings?.kecamatanName || 'Kecamatan Getasan';
    const kabupaten = settings?.kabupatenName || 'Kabupaten Semarang';

    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Bento Tile 1: Editorial Overview */}
            <div className="relative flex flex-col justify-between space-y-6 overflow-hidden rounded-3xl border border-navy-200/60 bg-white p-6 shadow-2xs sm:p-8 lg:col-span-8">
                <div className="space-y-3">
                    <span className="block font-mono text-xs font-bold tracking-wider text-navy-400 uppercase">
                        {kecamatan}, {kabupaten}
                    </span>

                    <h1 className="sm:text-3.5xl text-2xl leading-tight font-black tracking-tight text-navy-900 uppercase">
                        Direktori Rumah Produksi{' '}
                        <span className="text-pastel-teal">{village}</span>
                    </h1>

                    <p className="max-w-xl text-xs leading-relaxed font-normal text-navy-500 sm:text-sm">
                        Temukan produsen olahan produk lokal, kerajinan, dan kuliner khas {village}. Hubungi langsung pemilik toko atau jelajahi katalog produk mereka.
                    </p>
                </div>
            </div>

            {/* Bento Tile 2: Live Village Metrics Card */}
            <div className="relative flex flex-col justify-between space-y-6 overflow-hidden rounded-3xl border border-navy-800 bg-navy-900 p-6 text-white shadow-md sm:p-8 lg:col-span-4">
                <div className="space-y-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pastel-teal text-white">
                        <Store className="h-5 w-5" />
                    </div>

                    <div>
                        <span className="text-3.5xl block font-black tracking-tight text-white sm:text-4xl">
                            {totalShops}
                        </span>
                        <span className="mt-1 block text-xs font-bold tracking-wider text-navy-400 uppercase">
                            Usaha & Rumah Produksi Terdaftar
                        </span>
                    </div>
                </div>

                <div className="space-y-2 border-t border-navy-800/80 pt-4">
                    <div className="flex items-center justify-between text-xs font-medium text-navy-300">
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5 text-pastel-mint" />
                            <span>Toko Terverifikasi</span>
                        </span>
                        <span className="font-bold text-white">
                            {verifiedShopsCount} Mitra
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium text-navy-300">
                        <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-pastel-peach" />
                            <span>Cakupan Wilayah</span>
                        </span>
                        <span className="font-bold text-white">
                            {dusunCount} Dusun
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
