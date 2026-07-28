/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/types";

interface AddProductFormProps {
  form: any;
  categories: Category[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function AddProductForm({
  form,
  categories,
  onSubmit,
  onCancel,
}: AddProductFormProps) {
  return (
    <div className="bg-white border border-navy-200/60 p-6 rounded-3xl shadow-3xs space-y-4">
      <div>
        <h4 className="font-extrabold text-navy-900 text-sm uppercase tracking-wide">Rincian Produk Baru</h4>
        <p className="text-[11px] text-navy-400 mt-0.5">Lengkapi parameters berikut untuk menampilkan produk di etalase utama.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="font-bold text-navy-400 uppercase tracking-wider text-[9px] block">Nama Produk</Label>
            <Input
              type="text"
              required
              placeholder="Contoh: Susu Stroberi Segar"
              value={form.data.name}
              onChange={(e) => form.setData("name", e.target.value)}
              className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal"
            />
          </div>

          <div className="space-y-1">
            <Label className="font-bold text-navy-400 uppercase tracking-wider text-[9px] block">Kategori Komoditas</Label>
            <select
              value={form.data.categoryId}
              onChange={(e) => form.setData("categoryId", e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-navy-200/60 bg-white text-navy-800 font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-pastel-teal/20 focus:border-pastel-teal cursor-pointer shadow-3xs"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1 sm:col-span-2">
            <Label className="font-bold text-navy-400 uppercase tracking-wider text-[9px] block">Harga Jual (Rupiah)</Label>
            <Input
              type="number"
              required
              placeholder="Contoh: 15000"
              value={form.data.price}
              onChange={(e) => form.setData("price", e.target.value)}
              className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal"
            />
          </div>

          <div className="space-y-1">
            <Label className="font-bold text-navy-400 uppercase tracking-wider text-[9px] block">Satuan Takaran</Label>
            <Input
              type="text"
              required
              placeholder="Pcs, Liter, Kg, Botol"
              value={form.data.unit}
              onChange={(e) => form.setData("unit", e.target.value)}
              className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="font-bold text-navy-400 uppercase tracking-wider text-[9px] block">Foto Produk (File Upload)</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => form.setData("image", e.target.files?.[0] || null)}
            className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal cursor-pointer text-navy-400 text-[10px] py-1 bg-white"
          />
        </div>

        <div className="space-y-1">
          <Label className="font-bold text-navy-400 uppercase tracking-wider text-[9px] block">Deskripsi Uraian Produk</Label>
          <textarea
            rows={3}
            placeholder="Jelaskan spesifikasi keunikan rasa susu, bahan baku bambu anyaman, atau cita rasa produk kuliner Anda..."
            value={form.data.description}
            onChange={(e) => form.setData("description", e.target.value)}
            className="w-full px-4 py-2.5 text-xs rounded-xl border border-navy-200/60 bg-white text-navy-800 font-medium focus:outline-none focus:ring-2 focus:ring-pastel-teal/20 focus:border-pastel-teal resize-none transition-all shadow-3xs"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-navy-100">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="rounded-xl h-9 text-navy-500 border-navy-200"
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={form.processing}
            className="bg-pastel-teal hover:bg-pastel-teal/90 text-white rounded-xl h-9 font-extrabold uppercase tracking-wider shadow-3xs transition-all cursor-pointer"
          >
            {form.processing ? "Menyimpan..." : "Luncurkan Produk"}
          </Button>
        </div>
      </form>
    </div>
  );
}
