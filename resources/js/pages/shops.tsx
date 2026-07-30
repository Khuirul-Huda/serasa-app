import { Store, Search, ShieldCheck, MapPin } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import SEOHead from '@/components/SEOHead';
import ShopCard from '@/components/ShopCard';
import MarketplaceLayout from '@/layouts/marketplace-layout';
import type { AppSettings, Category, Product, Shop } from '@/types';

interface ShopsProps {
    settings: AppSettings;
    categories: Category[];
    shops: (Shop & { productCount?: number })[];
    products: Product[];
}

export default function Shops({
    settings,
    categories,
    shops,
    products,
}: ShopsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredShops = useMemo(() => {
        return shops.filter((shop) => {
            const matchSearch =
                shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                shop.ownerName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                shop.dusun.toLowerCase().includes(searchQuery.toLowerCase());

            const matchCategory =
                selectedCategory === 'all' ||
                shop.category === selectedCategory;

            return matchSearch && matchCategory;
        });
    }, [shops, searchQuery, selectedCategory]);

    const verifiedShopsCount = useMemo(
        () => shops.filter((s) => s.isVerified).length,
        [shops],
    );

    return (
        <MarketplaceLayout
            settings={settings}
            categories={categories}
            products={products}
            activeTab="shops"
        >
            <SEOHead
                title={`Daftar UMKM Warga - ${settings.appName}`}
                description={`Direktori lengkap Pelaku Usaha Mikro Kecil dan Menengah (UMKM) Desa Samirono. Temukan rumah produksi, detail kontak, dan lokasi geografis mitra ekonomi desa.`}
                keywords="Direktori UMKM, Daftar Toko Desa Samirono, Pelaku Ekonomi Kreatif, Getasan, Semarang, Profil Rumah Produksi Warga"
                image={settings.heroBanner}
                siteName={settings.appName}
            />

            <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 font-sans sm:px-6 lg:px-8">
                {/* Asymmetric Bento Grid Hero Header */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                    {/* Bento Tile 1: Editorial Overview & Integrated Controls (8 Cols) */}
                    <div className="relative flex flex-col justify-between space-y-6 overflow-hidden rounded-3xl border border-navy-200/60 bg-white p-6 shadow-2xs sm:p-8 lg:col-span-8">
                        <div className="space-y-3">
                            <span className="block font-mono text-xs font-bold tracking-wider text-navy-400 uppercase">
                                Kecamatan Getasan, Kabupaten Semarang
                            </span>

                            <h1 className="sm:text-3.5xl text-2xl leading-tight font-black tracking-tight text-navy-900 uppercase">
                                Direktori Rumah Produksi{' '}
                                <span className="text-pastel-teal">
                                    Desa Samirono
                                </span>
                            </h1>

                            <p className="max-w-xl text-xs leading-relaxed font-normal text-navy-500 sm:text-sm">
                                Temukan produsen olahan susu murni, pengrajin
                                bambu, dan kuliner lokal Samirono. Hubungi
                                langsung pemilik toko atau jelajahi katalog
                                produk mereka.
                            </p>
                        </div>

                        {/* Integrated Search Box & Category Select Filter Toolbar */}
                        <div className="flex flex-col items-stretch gap-3 border-t border-navy-100 pt-4 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search
                                    className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-navy-400"
                                    aria-hidden="true"
                                />
                                <input
                                    type="search"
                                    placeholder="Cari nama toko, pemilik, atau dusun..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full rounded-2xl border border-navy-200/60 bg-navy-50 py-2.5 pr-4 pl-10 text-xs font-medium text-navy-800 placeholder-navy-400 transition-all focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none"
                                    aria-label="Cari nama toko atau pemilik"
                                />
                            </div>

                            <select
                                value={selectedCategory}
                                onChange={(e) =>
                                    setSelectedCategory(e.target.value)
                                }
                                className="cursor-pointer rounded-2xl border border-navy-200/60 bg-white px-4 py-2.5 text-xs font-bold tracking-wider text-navy-700 uppercase shadow-2xs focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none"
                                aria-label="Filter kategori toko"
                            >
                                <option value="all">
                                    Semua Kategori ({categories.length})
                                </option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Bento Tile 2: Live Village Metrics Card (4 Cols) */}
                    <div className="relative flex flex-col justify-between space-y-6 overflow-hidden rounded-3xl border border-navy-800 bg-navy-900 p-6 text-white shadow-md sm:p-8 lg:col-span-4">
                        <div className="space-y-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pastel-teal text-white">
                                <Store className="h-5 w-5" />
                            </div>

                            <div>
                                <span className="text-3.5xl block font-black tracking-tight text-white sm:text-4xl">
                                    {shops.length}
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
                                    <span>Lokasi</span>
                                </span>
                                <span className="font-bold text-white">
                                    Samirono, Getasan
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Directory Listings Grid */}
                {filteredShops.length === 0 ? (
                    <div className="mx-auto max-w-lg rounded-3xl border border-navy-200/60 bg-white p-16 text-center shadow-2xs">
                        <Store
                            className="mx-auto mb-4 h-12 w-12 text-navy-300"
                            aria-hidden="true"
                        />
                        <h2 className="text-sm font-extrabold text-navy-800">
                            Toko Tidak Ditemukan
                        </h2>
                        <p className="mt-1 text-xs text-navy-500">
                            Kami tidak menemukan toko yang cocok dengan
                            pencarian Anda. Silakan cari dengan kata kunci lain.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('all');
                            }}
                            className="mt-4 cursor-pointer rounded-xl bg-pastel-teal px-5 py-2.5 text-xs font-extrabold tracking-wider text-white uppercase shadow-2xs transition-all hover:bg-pastel-teal/90"
                        >
                            Reset Filter Toko
                        </button>
                    </div>
                ) : (
                    <ul className="grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredShops.map((shop) => (
                            <li key={shop.id}>
                                <ShopCard
                                    shop={shop}
                                    productCount={shop.productCount || 0}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </MarketplaceLayout>
    );
}
