import { Link } from '@inertiajs/react';
import { MapPin, Phone, CheckCircle2, ShoppingBag, ArrowRight, Clock } from 'lucide-react';
import React from 'react';
import type { Shop } from '@/types';
import { getWhatsAppLink } from '@/utils';

interface ShopListCardProps {
    shop: Shop;
    productCount: number;
}

export default function ShopListCard({ shop, productCount }: ShopListCardProps) {
    const handleContactWhatsApp = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const message = `Halo ${shop.ownerName} dari ${shop.name}, saya melihat profil toko digital Anda di platform SERASA Desa Samirono. Saya ingin menanyakan produk-produk kreatif Anda.`;
        const url = getWhatsAppLink(shop.phone, message);
        window.open(url, '_blank');
    };

    return (
        <article
            className="group flex flex-col overflow-hidden rounded-3xl border border-navy-200/60 bg-white font-sans shadow-2xs transition-all duration-300 hover:border-pastel-teal hover:shadow-md sm:flex-row"
            id={`shop-list-card-${shop.id}`}
        >
            {/* Left Image / Banner */}
            <Link
                href={`/shops/${shop.id}`}
                className="relative block h-40 shrink-0 overflow-hidden bg-navy-50 sm:h-auto sm:w-56 lg:w-64"
            >
                <img
                    src={shop.image}
                    alt={`Banner ${shop.name}`}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-95 transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-navy-900/60 via-transparent to-transparent sm:bg-none" />

                {/* Logo Avatar Overlap */}
                <div className="absolute bottom-3 left-3 h-12 w-12 overflow-hidden rounded-xl border-2 border-white bg-white shadow-xs sm:top-3 sm:bottom-auto">
                    <img
                        src={shop.logo}
                        alt={`Logo ${shop.name}`}
                        className="h-full w-full object-cover"
                    />
                </div>
            </Link>

            {/* Content Details */}
            <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg border border-pastel-teal/20 bg-pastel-teal-light px-2.5 py-0.5 text-xs font-extrabold tracking-wider text-pastel-teal uppercase">
                            {shop.category}
                        </span>
                        {shop.isVerified && (
                            <span className="inline-flex items-center gap-1 rounded-lg border border-pastel-teal/20 bg-white px-2 py-0.5 text-xs font-black tracking-wider text-pastel-teal uppercase shadow-2xs">
                                <CheckCircle2 className="h-3.5 w-3.5 text-pastel-teal" />
                                <span>Terverifikasi</span>
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1 rounded-lg bg-navy-100 px-2 py-0.5 text-xs font-bold text-navy-700">
                            <MapPin className="h-3 w-3 text-pastel-peach" />
                            <span>{shop.dusun}</span>
                        </span>
                    </div>

                    <h3 className="font-sans text-base leading-snug font-black text-navy-900 transition-colors group-hover:text-pastel-teal sm:text-lg">
                        <Link href={`/shops/${shop.id}`}>{shop.name}</Link>
                    </h3>

                    <p className="text-xs font-bold tracking-wider text-navy-400 uppercase">
                        Pemilik: <span className="font-black text-navy-700">{shop.ownerName}</span>
                    </p>

                    <p className="line-clamp-2 text-xs leading-relaxed text-navy-600 sm:text-sm">
                        {shop.description}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="mt-4 flex flex-col gap-3 border-t border-navy-100 pt-3.5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-navy-500">
                        <div className="flex items-center gap-1 font-bold text-navy-700">
                            <ShoppingBag className="h-3.5 w-3.5 text-pastel-teal" />
                            <span>{productCount} Produk</span>
                        </div>
                        {shop.jamKerja && (
                            <div className="flex items-center gap-1 text-navy-500">
                                <Clock className="h-3.5 w-3.5 text-pastel-teal" />
                                <span>{shop.jamKerja}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleContactWhatsApp}
                            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-navy-200 px-3 py-2 text-xs font-extrabold tracking-wider text-navy-700 uppercase shadow-2xs transition-all hover:border-pastel-teal/30 hover:bg-pastel-teal-light hover:text-pastel-teal"
                        >
                            <Phone className="h-3.5 w-3.5 text-pastel-teal" />
                            <span>WA</span>
                        </button>
                        <Link
                            href={`/shops/${shop.id}`}
                            className="group/btn flex items-center justify-center gap-1.5 rounded-xl bg-pastel-teal px-3 py-2 text-xs font-extrabold tracking-wider text-white uppercase shadow-2xs transition-all hover:bg-pastel-teal/90"
                        >
                            <span>Katalog</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
