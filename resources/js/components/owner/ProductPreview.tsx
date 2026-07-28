/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Star } from "lucide-react";
import React from "react";
import type { Category } from "@/types";
import { formatIDR } from "@/utils";

interface ProductPreviewProps {
  form: any;
  categories: Category[];
}

export default function ProductPreview({ form, categories }: ProductPreviewProps) {
  return (
    <div className="bg-white border border-navy-200/60 rounded-3xl overflow-hidden shadow-3xs flex flex-col items-center p-6 justify-center min-h-[380px]">
      <div className="bg-white rounded-2xl border border-navy-200/60 overflow-hidden shadow-3xs max-w-[220px] w-full flex flex-col font-sans">
        <div className="aspect-square w-full bg-navy-50 overflow-hidden shrink-0 relative">
          <img
            src={
              form.data.image
                ? typeof form.data.image === "string"
                  ? form.data.image
                  : URL.createObjectURL(form.data.image)
                : "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80"
            }
            alt="Product Live Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80";
            }}
          />
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs text-[10px] font-bold text-navy-600 px-2 py-0.5 rounded-md font-mono shadow-2xs">
            {categories.find((c) => c.id === form.data.categoryId)?.name || "KULINER"}
          </div>
        </div>

        <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5 text-navy-800">
          <div className="space-y-1">
            <span className="block text-xs font-extrabold text-navy-900 line-clamp-1 leading-snug">
              {form.data.name || "Nama Produk Baru"}
            </span>

            <div className="flex items-center gap-1 text-[11px] text-navy-500">
              <div className="flex items-center text-pastel-peach shrink-0">
                <Star className="w-3 h-3 fill-current" />
              </div>
              <span>5.0 (0 Ulasan)</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-navy-100 pt-2 shrink-0">
            <div className="flex flex-col">
              <span className="text-xs font-black text-navy-900 leading-none">
                {formatIDR(Number(form.data.price) || 0)}
              </span>
              <span className="text-[10px] text-navy-400 font-medium">
                / {form.data.unit || "Pcs"}
              </span>
            </div>

            <div className="px-3 py-1 bg-pastel-coral text-white font-extrabold text-[10px] uppercase tracking-wider rounded-lg shadow-3xs">
              Beli
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
