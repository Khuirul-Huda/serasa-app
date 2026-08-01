/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from '@inertiajs/react';
import {
    MapPin,
    Phone,
    CheckCircle2,
    ShoppingBag,
    ArrowRight,
    Clock,
    Award,
} from 'lucide-react';
import React from 'react';
import type { Shop } from '@/types';
import { getWhatsAppLink } from '@/utils';

interface ShopCardProps {
    shop: Shop;
    productCount: number;
}

export default function ShopCard({ shop, productCount }: ShopCardProps) {
    const handleContactWhatsApp = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const message = `Halo ${shop.ownerName} dari ${shop.name}, saya melihat profil toko digital Anda di platform SERASA Desa Samirono. Saya ingin menanyakan produk-produk kreatif Anda.`;
        const url = getWhatsAppLink(shop.phone, message);
        window.open(url, '_blank');
    };

    return (
        <article
            className="group flex h-full flex-col overflow-hidden rounded-3xl border border-navy-200/60 bg-white font-sans shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-pastel-teal hover:shadow-md"
            id={`shop-card-${shop.id}`}
        >
            {/* Background Image Banner */}
            <Link
                href={`/shops/${shop.id}`}
                className="relative block h-44 overflow-hidden bg-navy-50"
            >
                <figure className="h-full w-full">
                    <img
                        src={shop.image}
                        alt={`Banner ${shop.name}`}
                        width={400}
                        height={176}
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="h-full w-full object-cover opacity-95 transition-all duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                    />
                    <figcaption className="sr-only">
                        {shop.name} — {shop.category}
                    </figcaption>
                </figure>
                <div
                    className="absolute inset-0 bg-linear-to-t from-navy-900/80 via-navy-900/20 to-transparent"
                    aria-hidden="true"
                />

                {/* Top Glassmorphism Floating Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    {shop.isVerified ? (
                        <span className="inline-flex items-center gap-1.5 rounded-xl border border-pastel-teal/20 bg-white/95 px-2.5 py-1 text-xs font-black tracking-wider text-pastel-teal uppercase shadow-2xs backdrop-blur-md">
                            <CheckCircle2
                                className="h-3.5 w-3.5 shrink-0 text-pastel-teal"
                                aria-hidden="true"
                            />
                            <span>Terverifikasi</span>
                        </span>
                    ) : (
                        <span />
                    )}

                    <span className="inline-flex items-center gap-1 rounded-xl bg-navy-900/85 px-2.5 py-1 text-xs font-bold tracking-wider text-navy-100 uppercase backdrop-blur-md">
                        <MapPin className="h-3 w-3 text-pastel-peach" />
                        <span>{shop.dusun}</span>
                    </span>
                </div>
            </Link>

            {/* Profile Info Area */}
            <div className="relative flex flex-1 flex-col justify-between px-5 pt-0 pb-5">
                <div className="relative">
                    {/* Logo overlapping the banner */}
                    <div className="absolute -top-10 left-0 h-16 w-16 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md">
                        <img
                            src={shop.logo}
                            alt={`Logo ${shop.name}`}
                            width={64}
                            height={64}
                            loading="lazy"
                            sizes="64px"
                            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                        />
                    </div>

                    <div className="space-y-2.5 pt-9">
                        {/* Badges Row */}
                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="inline-block rounded-lg border border-pastel-teal/20 bg-pastel-teal-light px-2.5 py-0.5 text-xs font-extrabold tracking-wider text-pastel-teal uppercase">
                                {shop.category}
                            </span>
                            {shop.nib && (
                                <span className="inline-flex items-center gap-0.5 rounded-lg border border-pastel-lavender/20 bg-pastel-lavender-light px-2 py-0.5 text-xs font-black text-pastel-lavender uppercase">
                                    <Award className="h-3 w-3" />
                                    <span>NIB</span>
                                </span>
                            )}
                            {shop.halal && (
                                <span className="inline-flex items-center gap-0.5 rounded-lg border border-pastel-teal/20 bg-pastel-teal-light px-2 py-0.5 text-xs font-black text-pastel-teal uppercase">
                                    <Award className="h-3 w-3" />
                                    <span>HALAL</span>
                                </span>
                            )}
                            {shop.pirt && (
                                <span className="inline-flex items-center gap-0.5 rounded-lg border border-pastel-peach/20 bg-pastel-peach-light px-2 py-0.5 text-xs font-black text-pastel-peach uppercase">
                                    <Award className="h-3 w-3" />
                                    <span>P-IRT</span>
                                </span>
                            )}
                        </div>

                        <h3
                            className="flex min-w-0 items-center gap-1 font-sans text-base leading-snug font-black text-navy-900 transition-colors group-hover:text-pastel-teal sm:text-lg"
                            title={shop.name}
                        >
                            <Link href={`/shops/${shop.id}`} className="truncate">
                                {shop.name}
                            </Link>
                        </h3>

                        <p className="-mt-0.5 text-xs font-bold text-navy-400">
                            Pemilik:{' '}
                            <span className="font-black text-navy-700">
                                {shop.ownerName}
                            </span>
                        </p>

                        <p className="line-clamp-2 pt-0.5 text-sm leading-relaxed font-normal text-navy-600">
                            {shop.description}
                        </p>
                    </div>
                </div>

                <footer className="mt-4 space-y-3 border-t border-navy-100 pt-3.5 text-xs">
                    <address className="flex flex-col gap-2 text-navy-500 not-italic">
                        <div className="flex items-start gap-1.5">
                            <MapPin
                                className="mt-0.5 h-4 w-4 shrink-0 text-pastel-teal"
                                aria-hidden="true"
                            />
                            <span className="font-sans text-xs font-medium text-navy-600">
                                {shop.address}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-0.5">
                            <div className="flex items-center gap-1.5 rounded-lg border border-navy-200/50 bg-navy-100/60 px-2.5 py-1 text-xs font-bold text-navy-700">
                                <ShoppingBag
                                    className="h-3.5 w-3.5 shrink-0 text-pastel-teal"
                                    aria-hidden="true"
                                />
                                <span>{productCount} Produk Kreatif</span>
                            </div>

                            {shop.jamKerja && (
                                <div className="flex items-center gap-1 text-xs font-bold text-navy-500">
                                    <Clock
                                        className="h-3.5 w-3.5 shrink-0 text-pastel-teal"
                                        aria-hidden="true"
                                    />
                                    <time>{shop.jamKerja}</time>
                                </div>
                            )}
                        </div>
                    </address>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                            onClick={handleContactWhatsApp}
                            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-navy-200 px-3 py-2.5 text-xs font-extrabold text-navy-700 shadow-2xs transition-all hover:border-pastel-teal/30 hover:bg-pastel-teal-light hover:text-pastel-teal"
                            aria-label={`Hubungi ${shop.name} via WhatsApp`}
                        >
                            <Phone
                                className="h-4 w-4 text-pastel-teal"
                                aria-hidden="true"
                            />
                            <span>Kontak WA</span>
                        </button>
                        <Link
                            href={`/shops/${shop.id}`}
                            className="group/btn flex items-center justify-center gap-1.5 rounded-xl bg-pastel-coral px-3 py-2.5 text-xs font-extrabold tracking-wider text-white uppercase shadow-2xs transition-all hover:bg-pastel-coral/90"
                            aria-label={`Lihat katalog ${shop.name}`}
                        >
                            <span>Katalog</span>
                            <ArrowRight
                                className="h-4 w-4 transition-transform group-hover/btn:translate-x-1"
                                aria-hidden="true"
                            />
                        </Link>
                    </div>
                </footer>
            </div>
        </article>
    );
}
