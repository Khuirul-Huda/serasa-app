import { Store } from 'lucide-react';
import React from 'react';

interface ShopEmptyStateProps {
    onReset: () => void;
}

export default function ShopEmptyState({ onReset }: ShopEmptyStateProps) {
    return (
        <div className="mx-auto max-w-lg rounded-3xl border border-navy-200/60 bg-white p-12 text-center shadow-2xs sm:p-16">
            <Store
                className="mx-auto mb-4 h-12 w-12 text-navy-300"
                aria-hidden="true"
            />
            <h2 className="text-sm font-extrabold text-navy-800">
                Toko Tidak Ditemukan
            </h2>
            <p className="mt-1 text-xs text-navy-500">
                Kami tidak menemukan toko yang cocok dengan pencarian atau filter Anda. Silakan cari dengan kata kunci lain.
            </p>
            <button
                onClick={onReset}
                className="mt-5 cursor-pointer rounded-xl bg-pastel-teal px-5 py-2.5 text-xs font-extrabold tracking-wider text-white uppercase shadow-2xs transition-all hover:bg-pastel-teal/90"
            >
                Reset Filter Toko
            </button>
        </div>
    );
}
