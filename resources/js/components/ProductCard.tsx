/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from '@inertiajs/react';
import { Star, MapPin, CheckCircle2 } from 'lucide-react';
import React from 'react';
import type { Product, Shop, Category } from '@/types';
import { formatIDR } from '@/utils';

interface ProductCardProps {
    product: Product;
    shop: Shop | undefined;
    category: Category | undefined;
}

export default function ProductCard({ product, shop }: ProductCardProps) {
    const hasDiscount =
        product.isAvailable &&
        (product.price >= 30000);
    const discountPercent = 10;
    const originalPrice = hasDiscount
        ? Math.round((product.price * (100 + discountPercent)) / 100 / 1000) *
          1000
        : null;

    const salesCount = React.useMemo(() => {
        return Math.max(10, (product.reviewsCount || 0) * 5 + 3);
    }, [product.reviewsCount]);

    return (
        <article
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-200/60 bg-white font-sans shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-pastel-teal hover:shadow-md"
            id={`product-card-${product.id}`}
        >
            <Link
                href={`/products/${product.id}`}
                className="relative block aspect-square overflow-hidden bg-navy-50"
            >
                <figure className="h-full w-full">
                    <img
                        src={product.image}
                        alt={product.name}
                        width={300}
                        height={300}
                        loading="lazy"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                    />
                    {shop && (
                        <figcaption className="absolute right-0 bottom-0 left-0 flex items-center gap-1 bg-linear-to-t from-navy-900/80 to-transparent px-3 py-1.5 text-white">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-pastel-peach" />
                            <span className="truncate text-xs font-bold tracking-wide uppercase">
                                {shop.dusun}
                            </span>
                        </figcaption>
                    )}
                </figure>

                {/* Discount Badge Overlay */}
                {hasDiscount && (
                    <div
                        className="pointer-events-none absolute top-2.5 left-2.5 z-10 flex items-center gap-0.5 rounded-md bg-pastel-coral px-2.5 py-1 text-xs font-black tracking-wide text-white uppercase shadow-xs"
                        aria-label={`Diskon ${discountPercent}%`}
                    >
                        <span>{discountPercent}%</span>
                        <span className="text-xs font-medium opacity-90">
                            OFF
                        </span>
                    </div>
                )}

                {!product.isAvailable && (
                    <div
                        className="backdrop-blur-3xs absolute inset-0 flex items-center justify-center bg-navy-900/80"
                        role="status"
                        aria-label="Stok habis"
                    >
                        <span className="rounded-full border border-pastel-coral/80 bg-pastel-coral px-3.5 py-1.5 text-xs font-extrabold tracking-widest text-white uppercase">
                            Stok Habis
                        </span>
                    </div>
                )}
            </Link>

            <div className="flex flex-1 flex-col justify-between space-y-3 bg-white p-4">
                <div className="space-y-1.5">
                    {shop && (
                        <div className="flex min-w-0 items-center gap-1.5">
                            <img
                                src={shop.logo}
                                alt={shop.name}
                                width={20}
                                height={20}
                                loading="lazy"
                                className="h-5 w-5 shrink-0 rounded-full border border-navy-200 object-cover"
                                referrerPolicy="no-referrer"
                            />
                            <Link
                                href={`/shops/${shop.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex min-w-0 items-center gap-1 text-xs font-bold text-navy-500 hover:text-pastel-teal"
                                title={shop.name}
                            >
                                <span className="truncate">{shop.name}</span>
                                {shop.isVerified && (
                                    <CheckCircle2
                                        className="h-3.5 w-3.5 shrink-0 fill-pastel-teal-light text-pastel-teal"
                                        aria-label="Terverifikasi"
                                    />
                                )}
                            </Link>
                        </div>
                    )}

                    <h3 className="line-clamp-2 min-h-[38px] pt-0.5 font-sans text-sm leading-snug font-bold text-navy-800 transition-colors group-hover:text-pastel-teal md:text-base">
                        <Link href={`/products/${product.id}`}>
                            {product.name}
                        </Link>
                    </h3>

                    <div className="pt-0.5">
                        <div className="flex flex-wrap items-baseline gap-1.5">
                            <data
                                value={product.price}
                                className="text-base font-black text-navy-900 md:text-lg"
                            >
                                {formatIDR(product.price)}
                            </data>
                            <span className="text-xs font-normal text-navy-400">
                                / {product.unit}
                            </span>
                        </div>
                        {hasDiscount && originalPrice && (
                            <div className="mt-0.5 flex items-center gap-1.5">
                                <s className="text-xs text-navy-400">
                                    {formatIDR(originalPrice)}
                                </s>
                                <mark className="rounded bg-pastel-coral-light px-1.5 text-xs font-extrabold text-pastel-coral not-italic">
                                    -{discountPercent}%
                                </mark>
                            </div>
                        )}
                    </div>
                </div>

                <footer className="flex items-center justify-between gap-1 border-t border-navy-100 pt-2">
                    <div
                        className="flex items-center gap-1.5 text-xs text-navy-500"
                        role="img"
                        aria-label={`Rating ${product.rating} bintang, terjual ${salesCount}+`}
                    >
                        <div className="flex items-center gap-0.5">
                            <Star
                                className="h-3.5 w-3.5 fill-pastel-peach text-pastel-peach"
                                aria-hidden="true"
                            />
                            <span className="font-bold text-navy-700">
                                {product.rating}
                            </span>
                        </div>
                        <span className="text-navy-300" aria-hidden="true">
                            |
                        </span>
                        <span className="truncate text-xs">
                            Terjual {salesCount}+
                        </span>
                    </div>

                    <Link
                        href={`/products/${product.id}`}
                        className="shadow-3xs rounded-xl bg-pastel-coral px-3.5 py-1.5 text-xs font-bold tracking-wider text-white uppercase transition-all hover:bg-pastel-coral/90"
                    >
                        Beli
                    </Link>
                </footer>
            </div>
        </article>
    );
}
