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
      <div className="bg-white rounded-2xl border border-navy-200/60 overflow-hidden shadow-3xs max-w-[200px] w-full flex flex-col font-sans">
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
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs text-[8px] font-bold text-navy-500 px-1.5 py-0.5 rounded font-mono">
            {categories.find((c) => c.id === form.data.categoryId)?.name || "KULINER"}
          </div>
        </div>

        <div className="p-3 flex-1 flex flex-col justify-between gap-2.5 text-navy-800">
          <div className="space-y-1">
            <span className="block text-[11px] font-bold text-navy-800 line-clamp-1 leading-snug">
              {form.data.name || "Nama Produk Baru"}
            </span>

            <div className="flex items-center gap-1 text-[9px] text-navy-400">
              <div className="flex items-center text-pastel-peach shrink-0">
                <Star className="w-2.5 h-2.5 fill-current" />
              </div>
              <span>5.0 (0 Ulasan)</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-navy-100 pt-2 shrink-0">
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-pastel-mint leading-none">
                {formatIDR(Number(form.data.price) || 0)}
              </span>
              <span className="text-[8px] text-navy-400 font-medium">
                / {form.data.unit || "Pcs"}
              </span>
            </div>

            <div className="px-2.5 py-1 bg-pastel-teal text-white font-extrabold text-[8px] uppercase tracking-wider rounded-lg">
              Beli
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
