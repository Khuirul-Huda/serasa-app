/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { Link } from '@inertiajs/react';
import {
    MapPin,
    Phone,
    CheckCircle2,
    Clock,
    ShoppingBag,
    Award,
    ChevronRight,
} from 'lucide-react';
import React from 'react';
import ProductCard from '@/components/ProductCard';
import ShopCard from '@/components/ShopCard';
import SEOHead from '@/components/SEOHead';
import MarketplaceLayout from '@/layouts/marketplace-layout';
import type { AppSettings, Category, Product, Shop } from '@/types';
import { getWhatsAppLink } from '@/utils';

interface ShopDetailProps {
    settings: AppSettings;
    categories: Category[];
    shop: Shop;
    products?: Product[];
    allProducts?: Product[];
    relatedShops?: (Shop & { productCount?: number })[];
}

export default function ShopDetail({
    settings,
    categories,
    shop,
    products = [],
    allProducts = [],
    relatedShops = [],
}: ShopDetailProps) {
    const shopProducts =
        products.length > 0 ? products : (shop as any).products || [];

    const handleContactWhatsApp = () => {
        if (!shop.phone) return;
        const message = `Halo ${shop.ownerName} dari ${shop.name}, saya melihat profil toko digital Anda di platform SERASA Desa Samirono. Saya ingin menanyakan produk-produk kreatif Anda.`;
        const url = getWhatsAppLink(shop.phone, message);
        if (url) {
            window.open(url, '_blank');
        }
    };

    return (
        <MarketplaceLayout
            settings={settings}
            categories={categories}
            products={allProducts}
            activeTab="shops"
        >
            <SEOHead
                title={`${shop.name} - Katalog UMKM Samirono`}
                description={`Kunjungi toko ${shop.name} di Desa Samirono. Menyediakan ${shop.category}. Hubungi ${shop.ownerName} di dusun ${shop.dusun}.`}
                keywords={`${shop.name}, UMKM ${shop.name}, Toko ${shop.dusun}, Produk ${shop.category}, Ekonomi Kreatif Samirono`}
                image={shop.image}
                siteName={settings.appName}
            />

            <div className="mx-auto max-w-7xl animate-fade-in space-y-8 px-4 py-8 font-sans text-navy-900 sm:px-6 lg:px-8">
                {/* Breadcrumb Nav */}
                <nav
                    aria-label="Breadcrumb"
                    className="no-scrollbar flex items-center gap-2 overflow-x-auto py-1 text-xs font-medium text-navy-500"
                >
                    <Link
                        href="/"
                        className="shrink-0 font-bold transition-colors hover:text-pastel-teal"
                    >
                        Beranda
                    </Link>
                    <ChevronRight
                        className="h-3.5 w-3.5 shrink-0 text-navy-300"
                        aria-hidden="true"
                    />
                    <Link
                        href="/shops"
                        className="shrink-0 font-bold transition-colors hover:text-pastel-teal"
                    >
                        Daftar UMKM
                    </Link>
                    <ChevronRight
                        className="h-3.5 w-3.5 shrink-0 text-navy-300"
                        aria-hidden="true"
                    />
                    <span className="max-w-[240px] shrink-0 truncate font-bold text-navy-800">
                        {shop.name}
                    </span>
                </nav>

                {/* Master Profile Header Block */}
                <article className="shadow-3xs overflow-hidden rounded-3xl border border-navy-200/60 bg-white">
                    {/* Banner */}
                    <figure className="relative h-44 bg-navy-50 sm:h-56">
                        <img
                            src={shop.image}
                            alt={shop.name}
                            width={1200}
                            height={224}
                            loading="eager"
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                        {/* Single color gradient: navy-900 → transparent */}
                        <div
                            className="absolute inset-0 bg-linear-to-t from-navy-900/70 to-transparent"
                            aria-hidden="true"
                        />
                    </figure>

                    {/* Profile details wrapper */}
                    <div className="relative px-6 pt-0 pb-6">
                        <div className="-mt-10 mb-4 flex flex-col gap-5 sm:-mt-12 sm:flex-row sm:items-end">
                            {/* Logo */}
                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md sm:h-24 sm:w-24">
                                <img
                                    src={shop.logo}
                                    alt={shop.name}
                                    width={96}
                                    height={96}
                                    loading="eager"
                                    className="h-full w-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            </div>

                            <div className="flex-1 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-xl leading-tight font-black tracking-tight text-navy-900 sm:text-2xl">
                                        {shop.name}
                                    </h1>
                                    {shop.isVerified && (
                                        <span className="inline-flex items-center gap-1 rounded border border-pastel-teal/20 bg-pastel-teal-light px-2.5 py-0.5 text-xs font-extrabold tracking-wider text-pastel-teal uppercase">
                                            <CheckCircle2 className="h-3 w-3 fill-pastel-teal-light text-pastel-teal" />
                                            <span>Terverifikasi</span>
                                        </span>
                                    )}
                                    {shop.nib && (
                                        <span className="inline-flex items-center gap-1 rounded border border-pastel-lavender/20 bg-pastel-lavender-light px-2 py-0.5 text-xs font-black tracking-wider text-pastel-lavender uppercase">
                                            <Award className="h-3 w-3 text-pastel-lavender" />
                                            <span>Izin NIB</span>
                                        </span>
                                    )}
                                    {shop.halal && (
                                        <span className="inline-flex items-center gap-1 rounded border border-pastel-teal/20 bg-pastel-teal-light px-2 py-0.5 text-xs font-black tracking-wider text-pastel-teal uppercase">
                                            <Award className="h-3 w-3 text-pastel-teal" />
                                            <span>Sertifikat Halal</span>
                                        </span>
                                    )}
                                    {shop.pirt && (
                                        <span className="inline-flex items-center gap-1 rounded border border-pastel-peach/20 bg-pastel-peach-light px-2 py-0.5 text-xs font-black tracking-wider text-pastel-peach uppercase">
                                            <Award className="h-3 w-3 text-pastel-peach" />
                                            <span>Izin P-IRT</span>
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs font-bold tracking-wider text-navy-400 uppercase">
                                    Kategori Utama:{' '}
                                    <span className="font-extrabold text-pastel-teal">
                                        {shop.category}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8 border-t border-navy-100 pt-4 lg:grid-cols-12">
                            {/* Left Column: Description & Metadata */}
                            <div className="space-y-4 text-xs lg:col-span-8">
                                <section className="space-y-1.5 leading-relaxed font-light text-navy-600">
                                    <h2 className="text-xs font-bold tracking-wider text-navy-900 uppercase">
                                        Tentang UMKM Kami
                                    </h2>
                                    <p className="text-sm leading-relaxed font-normal text-navy-600">
                                        {shop.description}
                                    </p>
                                </section>

                                <address className="grid grid-cols-1 gap-3 pt-2 text-xs text-navy-500 not-italic sm:grid-cols-2">
                                    <div className="flex items-start gap-2">
                                        <MapPin
                                            className="mt-0.5 h-4 w-4 shrink-0 text-pastel-teal"
                                            aria-hidden="true"
                                        />
                                        <div>
                                            <span className="block font-bold text-navy-800">
                                                Alamat Rumah Produksi:
                                            </span>
                                            <span>
                                                {shop.address} ({shop.dusun})
                                            </span>
                                        </div>
                                    </div>
                                    {shop.jamKerja && (
                                        <div className="flex items-start gap-2">
                                            <Clock
                                                className="mt-0.5 h-4 w-4 shrink-0 text-pastel-teal"
                                                aria-hidden="true"
                                            />
                                            <div>
                                                <span className="block font-bold text-navy-800">
                                                    Jam Operasional Pelayanan:
                                                </span>
                                                <time>{shop.jamKerja}</time>
                                            </div>
                                        </div>
                                    )}
                                </address>
                            </div>

                            {/* Right Column: Interaction Hub */}
                            <aside className="space-y-4 self-start rounded-2xl border border-pastel-teal/15 bg-pastel-teal-light/30 p-4 text-xs lg:col-span-4">
                                <div className="space-y-1">
                                    <span className="block text-xs font-extrabold tracking-wider text-navy-400 uppercase">
                                        Kontak Hubungan Pelaku Usaha
                                    </span>
                                    <div className="text-sm font-bold text-navy-800">
                                        {shop.ownerName} (Pemilik)
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <button
                                        onClick={handleContactWhatsApp}
                                        disabled={!shop.phone}
                                        className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold tracking-wider uppercase shadow-xs transition-all ${
                                            shop.phone
                                                ? 'cursor-pointer bg-pastel-teal text-white hover:bg-pastel-teal/90'
                                                : 'cursor-not-allowed bg-navy-200 text-navy-400'
                                        }`}
                                    >
                                        <Phone className="h-4 w-4" />
                                        <span>
                                            {shop.phone
                                                ? 'Hubungi Toko (WhatsApp)'
                                                : 'Kontak WA Belum Tersedia'}
                                        </span>
                                    </button>

                                    <Link
                                        href="/map"
                                        className="shadow-3xs flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-navy-900 py-3 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-navy-800"
                                    >
                                        <MapPin className="h-4 w-4 text-pastel-teal" />
                                        <span>Lihat di Peta Desa</span>
                                    </Link>
                                </div>
                            </aside>
                        </div>
                    </div>
                </article>

                {/* Associated Products Grid */}
                <section
                    aria-label={`Etalase Produk ${shop.name}`}
                    className="space-y-5"
                >
                    <div>
                        <h2 className="flex items-center gap-2 text-base font-bold tracking-wider text-navy-900 uppercase">
                            <ShoppingBag
                                className="h-5 w-5 text-pastel-teal"
                                aria-hidden="true"
                            />
                            <span>
                                Etalase Produk Toko ({shopProducts.length})
                            </span>
                        </h2>
                        <p className="text-xs text-navy-500">
                            Seluruh produk yang diproduksi secara langsung oleh{' '}
                            {shop.name}.
                        </p>
                    </div>

                    {shopProducts.length === 0 ? (
                        <div className="shadow-3xs mx-auto max-w-md rounded-2xl border border-navy-200/60 bg-white p-16 text-center">
                            <ShoppingBag
                                className="mx-auto mb-2 h-10 w-10 text-navy-300"
                                aria-hidden="true"
                            />
                            <p className="text-xs text-navy-400 italic">
                                Toko belum mengunggah produk ke dalam katalog.
                            </p>
                        </div>
                    ) : (
                        <ol className="grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {shopProducts.map((product: Product) => {
                                const category = categories.find(
                                    (c) => c.id === product.categoryId,
                                );

                                return (
                                    <li key={product.id}>
                                        <ProductCard
                                            product={product}
                                            shop={shop}
                                            category={category}
                                        />
                                    </li>
                                );
                            })}
                        </ol>
                    )}
                </section>

                {/* Related Shops / UMKM Lainnya Section */}
                {relatedShops.length > 0 && (
                    <section
                        className="space-y-4 pt-4 border-t border-navy-100"
                        aria-label="Toko Serupa"
                    >
                        <div>
                            <h2 className="flex items-center gap-2 text-base font-bold tracking-wider text-navy-900 uppercase">
                                <Award
                                    className="h-5 w-5 text-pastel-teal"
                                    aria-hidden="true"
                                />
                                <span>
                                    UMKM Serupa di Sektor {shop.category}
                                </span>
                            </h2>
                            <p className="text-xs text-navy-500">
                                Jelajahi rekomendasi usaha warga alternatif di {shop.dusun} dan sekitarnya.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedShops.map((relShop) => (
                                <ShopCard
                                    key={relShop.id}
                                    shop={relShop}
                                    productCount={relShop.productCount || 0}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </MarketplaceLayout>
    );
}
