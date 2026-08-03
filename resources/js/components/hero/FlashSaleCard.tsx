/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { router } from '@inertiajs/react';
import { Sparkles, ThumbsUp, MapPin } from 'lucide-react';
import React from 'react';
import type { AppSettings, Product } from '@/types';
import { formatIDR } from '@/utils';

interface FlashSaleCardProps {
    settings: AppSettings;
    featuredProduct: Product | null;
}

export default function FlashSaleCard({ settings, featuredProduct }: FlashSaleCardProps) {
    const title = settings.flashSaleTitle || 'PRODUK UNGGULAN WARGA';
    const tag = settings.flashSaleTag || 'Pilihan Desa';

    return (
        <div className="flex h-[280px] flex-col justify-between rounded-3xl border border-navy-200/60 bg-white p-5 shadow-2xs sm:h-[340px] lg:col-span-4 dark:border-navy-800 dark:bg-navy-900/90">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-pastel-teal">
                        <Sparkles className="h-5 w-5" />
                        <span className="text-xs font-black tracking-wider uppercase">
                            {title}
                        </span>
                    </div>
                    <span className="rounded-lg bg-pastel-teal-light px-2.5 py-1 text-xs font-bold text-pastel-teal dark:bg-navy-800 dark:text-pastel-teal">
                        {tag}
                    </span>
                </div>

                {featuredProduct ? (
                    <button
                        type="button"
                        onClick={() => router.visit(`/products/${featuredProduct.id}`)}
                        className="group/promo flex w-full cursor-pointer gap-3.5 rounded-2xl border border-pastel-teal/20 bg-pastel-teal-light/40 p-3 text-left transition-all hover:border-pastel-teal/40 hover:bg-pastel-teal-light dark:border-pastel-teal/30 dark:bg-navy-950 dark:hover:bg-navy-800"
                    >
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-pastel-teal/20 bg-navy-100 transition-transform duration-300 group-hover/promo:scale-105 sm:h-24 sm:w-24 dark:border-navy-800 dark:bg-navy-900">
                            <img
                                src={featuredProduct.image}
                                alt={featuredProduct.name}
                                width={96}
                                height={96}
                                loading="lazy"
                                sizes="96px"
                                className="h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <span className="inline-block rounded-md bg-pastel-teal-light px-1.5 py-0.5 text-xs font-black text-pastel-teal uppercase dark:bg-pastel-teal/20">
                                Rekomendasi
                            </span>
                            <h4 className="line-clamp-2 text-sm leading-snug font-bold text-navy-800 transition-colors group-hover/promo:text-pastel-teal dark:text-navy-100">
                                {featuredProduct.name}
                            </h4>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-black text-navy-900 dark:text-white">
                                    {formatIDR(featuredProduct.price)}
                                </span>
                                <span className="text-xs font-medium text-navy-400 dark:text-navy-400">
                                    / {featuredProduct.unit}
                                </span>
                            </div>
                        </div>
                    </button>
                ) : (
                    <div className="rounded-2xl bg-navy-50 p-4 text-center text-xs text-navy-400 dark:bg-navy-950 dark:text-navy-500">
                        Belum ada produk unggulan
                    </div>
                )}

                {featuredProduct && (
                    <p className="line-clamp-2 text-xs leading-relaxed text-navy-500 dark:text-navy-400">
                        {featuredProduct.description}
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between border-t border-navy-100 pt-3 text-xs font-medium text-navy-500 dark:border-navy-800 dark:text-navy-400">
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
