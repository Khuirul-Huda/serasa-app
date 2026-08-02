/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { router } from '@inertiajs/react';
import { Flame, ThumbsUp, MapPin } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { AppSettings, Product } from '@/types';
import { formatIDR } from '@/utils';

interface FlashSaleCardProps {
    settings: AppSettings;
    featuredProduct: Product | null;
}

export default function FlashSaleCard({ settings, featuredProduct }: FlashSaleCardProps) {
    const initialHours = settings.flashSaleHours !== undefined ? settings.flashSaleHours : 3;
    const initialMinutes = settings.flashSaleMinutes !== undefined ? settings.flashSaleMinutes : 44;

    const [timeLeft, setTimeLeft] = useState({
        hours: initialHours,
        minutes: initialMinutes,
        seconds: 12,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                } else {
                    return { hours: initialHours, minutes: initialMinutes, seconds: 12 };
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [initialHours, initialMinutes]);

    const title = settings.flashSaleTitle || 'KEJAR DISKON WARGA';
    const tag = settings.flashSaleTag || 'Diskon Harian';
    const progress = settings.flashSaleProgress ?? 87;

    return (
        <div className="flex h-[280px] flex-col justify-between rounded-3xl border border-navy-200/60 bg-white p-5 shadow-2xs sm:h-[340px] lg:col-span-4">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-pastel-coral">
                        <Flame className="h-5 w-5 animate-pulse fill-pastel-coral/50" />
                        <span className="text-xs font-black tracking-wider uppercase">
                            {title}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-xs">
                        <span className="rounded-md bg-navy-900 px-1.5 py-0.5 text-xs font-bold text-white">
                            {String(timeLeft.hours).padStart(2, '0')}
                        </span>
                        <span className="text-navy-400">:</span>
                        <span className="rounded-md bg-navy-900 px-1.5 py-0.5 text-xs font-bold text-white">
                            {String(timeLeft.minutes).padStart(2, '0')}
                        </span>
                        <span className="text-navy-400">:</span>
                        <span className="animate-pulse rounded-md bg-pastel-coral px-1.5 py-0.5 text-xs font-bold text-white">
                            {String(timeLeft.seconds).padStart(2, '0')}
                        </span>
                    </div>
                </div>

                {featuredProduct ? (
                    <div
                        onClick={() => router.visit(`/products/${featuredProduct.id}`)}
                        className="group/promo flex cursor-pointer gap-3.5 rounded-2xl border border-pastel-coral/20 bg-pastel-coral-light/40 p-3 transition-all hover:border-pastel-coral/40 hover:bg-pastel-coral-light"
                    >
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-pastel-coral/20 bg-navy-100 transition-transform duration-300 group-hover/promo:scale-105">
                            <img
                                src={featuredProduct.image}
                                alt={featuredProduct.name}
                                width={80}
                                height={80}
                                loading="lazy"
                                sizes="80px"
                                className="h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <div className="space-y-1">
                            <span className="inline-block rounded-md bg-pastel-coral-light px-1.5 py-0.5 text-xs font-black text-pastel-coral uppercase">
                                Stok Terbatas
                            </span>
                            <h4 className="line-clamp-1 text-xs leading-snug font-bold text-navy-800 transition-colors group-hover/promo:text-pastel-coral">
                                {featuredProduct.name}
                            </h4>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xs font-black text-navy-900">
                                    {formatIDR(featuredProduct.price)}
                                </span>
                                <span className="text-xs font-medium text-navy-400">
                                    / {featuredProduct.unit}
                                </span>
                            </div>
                            <span className="block text-xs font-bold text-pastel-teal">
                                Produk Unggulan Warga
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl bg-navy-50 p-4 text-center text-xs text-navy-400">
                        Belum ada produk promo
                    </div>
                )}

                <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs font-bold text-navy-500">
                        <span>Tersisa Stok Terbatas</span>
                        <span className="text-pastel-coral">{tag}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-navy-100">
                        <div
                            className="h-full rounded-full bg-pastel-coral transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-navy-100 pt-3 text-xs font-medium text-navy-500">
                <div className="flex items-center gap-1">
                    <ThumbsUp className="h-3.5 w-3.5 text-pastel-teal" />
                    <span>100% Produk Desa</span>
                </div>
                <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-pastel-peach" />
                    <span>{settings.villageName}</span>
                </div>
            </div>
        </div>
    );
}
