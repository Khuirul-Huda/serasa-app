/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Star } from 'lucide-react';
import React from 'react';
import type { Category } from '@/types';
import { formatIDR } from '@/utils';

interface ProductPreviewProps {
    form: any;
    categories: Category[];
}

export default function ProductPreview({
    form,
    categories,
}: ProductPreviewProps) {
    return (
        <div className="shadow-3xs flex min-h-[380px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-navy-200/60 bg-white p-6">
            <div className="shadow-3xs flex w-full max-w-[220px] flex-col overflow-hidden rounded-2xl border border-navy-200/60 bg-white font-sans">
                <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-navy-50">
                    <img
                        src={
                            form.data.image
                                ? typeof form.data.image === 'string'
                                    ? form.data.image
                                    : URL.createObjectURL(form.data.image)
                                : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80'
                        }
                        alt="Product Live Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80';
                        }}
                    />
                    <div className="absolute top-2 right-2 rounded-md bg-white/90 px-2 py-0.5 font-mono text-[10px] font-bold text-navy-600 shadow-2xs backdrop-blur-xs">
                        {categories.find((c) => c.id === form.data.categoryId)
                            ?.name || 'KULINER'}
                    </div>
                </div>

                <div className="flex flex-1 flex-col justify-between gap-2.5 p-3.5 text-navy-800">
                    <div className="space-y-1">
                        <span className="line-clamp-1 block text-xs leading-snug font-extrabold text-navy-900">
                            {form.data.name || 'Nama Produk Baru'}
                        </span>

                        <div className="flex items-center gap-1 text-[11px] text-navy-500">
                            <div className="flex shrink-0 items-center text-pastel-peach">
                                <Star className="h-3 w-3 fill-current" />
                            </div>
                            <span>5.0 (0 Ulasan)</span>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-between border-t border-navy-100 pt-2">
                        <div className="flex flex-col">
                            <span className="text-xs leading-none font-black text-navy-900">
                                {formatIDR(Number(form.data.price) || 0)}
                            </span>
                            <span className="text-[10px] font-medium text-navy-400">
                                / {form.data.unit || 'Pcs'}
                            </span>
                        </div>

                        <div className="shadow-3xs rounded-lg bg-pastel-coral px-3 py-1 text-[10px] font-extrabold tracking-wider text-white uppercase">
                            Beli
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
