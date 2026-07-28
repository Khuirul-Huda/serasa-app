/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Settings2, Clock, MapPin, Save, CheckCircle2 } from "lucide-react";
import React from "react";
import LocationPickerMap from "@/components/LocationPickerMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ShopProfileTabProps {
  form: any;
  onSubmit: (e: React.FormEvent) => void;
  editSuccess: boolean;
}

export default function ShopProfileTab({
  form,
  onSubmit,
  editSuccess,
}: ShopProfileTabProps) {
  return (
    <div className="bg-white border border-navy-200/60 rounded-3xl p-6 shadow-3xs max-w-3xl mx-auto space-y-6 animate-fade-in" id="owner-edit-shop">
      <div className="border-b border-navy-100 pb-3">
        <h3 className="font-extrabold text-navy-900 text-base flex items-center gap-2 uppercase tracking-wider">
          <Settings2 className="w-5 h-5 text-pastel-teal" />
          <span>Konfigurasi Operasional Toko</span>
        </h3>
        <p className="text-xs text-navy-400 mt-0.5">Ubah rincian kontak bantuan, alamat rumah produksi, dan penunjuk pin pada peta desa.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 text-xs">
        {editSuccess && (
          <div className="p-4 bg-pastel-mint-light border border-pastel-mint/20 text-pastel-mint font-bold rounded-xl flex items-center gap-2 animate-fade-in uppercase tracking-wider text-[10px] shadow-3xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-pastel-mint" />
            Data Profil Toko Anda Berhasil Diperbarui!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label className="font-bold text-navy-400 uppercase tracking-wider text-[9px] block">No. WhatsApp Pembeli</Label>
            <Input
              type="text"
              required
              value={form.data.phone}
              onChange={(e) => form.setData("phone", e.target.value)}
              className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal"
            />
          </div>

          <div className="space-y-1">
            <Label className="font-bold text-navy-400 uppercase tracking-wider text-[9px] block">Jam Operasional Toko</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pastel-teal z-10" />
              <Input
                type="text"
                required
                value={form.data.jamKerja}
                onChange={(e) => form.setData("jamKerja", e.target.value)}
                className="rounded-xl pl-9 border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="font-bold text-navy-400 uppercase tracking-wider text-[9px] block">Dusun Produksi</Label>
            <select
              value={form.data.dusun}
              onChange={(e) => form.setData("dusun", e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-navy-200/60 bg-white text-navy-800 font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-pastel-teal/20 focus:border-pastel-teal cursor-pointer shadow-3xs"
            >
              <option value="Dusun Samirono">Dusun Samirono (Pusat)</option>
              <option value="Dusun Bentar">Dusun Bentar (Susu)</option>
              <option value="Dusun Surowono">Dusun Surowono (Pertanian)</option>
              <option value="Dusun Tawang">Dusun Tawang (Kuliner)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <Label className="font-bold text-navy-400 uppercase tracking-wider text-[9px] block">Alamat Rumah Produksi</Label>
          <Input
            type="text"
            required
            value={form.data.address}
            onChange={(e) => form.setData("address", e.target.value)}
            className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal"
          />
        </div>

        <div className="bg-navy-50/50 rounded-2xl p-4 border border-navy-200/60 space-y-3">
          <span className="font-bold text-navy-800 flex items-center gap-1.5 text-xs">
            <MapPin className="w-4 h-4 text-pastel-teal" />
            <span className="font-extrabold text-xs uppercase tracking-wider text-navy-800">Ubah Koordinat Peta Desa</span>
          </span>
          <LocationPickerMap
            lat={form.data.lat}
            lng={form.data.lng}
            onChange={(lat, lng) => form.setData((prev: any) => ({ ...prev, lat, lng }))}
          />
          
          <div className="flex gap-4 text-[9.5px] font-mono text-navy-400 bg-white p-2.5 rounded-xl border border-navy-200/60 shadow-3xs">
            <div>Latitude: <span className="font-bold text-pastel-teal">{form.data.lat}</span></div>
            <div>Longitude: <span className="font-bold text-pastel-teal">{form.data.lng}</span></div>
          </div>
        </div>

        <div className="space-y-1">
          <Label className="font-bold text-navy-400 uppercase tracking-wider text-[9px] block">Uraian Toko (Deskripsi)</Label>
          <textarea
            rows={4}
            value={form.data.description}
            onChange={(e) => form.setData("description", e.target.value)}
            className="w-full px-4 py-2.5 text-xs rounded-xl border border-navy-200/60 bg-white text-navy-800 font-medium focus:outline-none focus:ring-2 focus:ring-pastel-teal/20 focus:border-pastel-teal resize-none transition-all shadow-3xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="font-bold text-navy-400 uppercase tracking-wider block text-[9px]">Ganti Logo Toko (Opsional)</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => form.setData("logo", e.target.files?.[0] || null)}
              className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal cursor-pointer text-navy-400 text-[10px] py-1 bg-white"
            />
          </div>
          <div className="space-y-1">
            <Label className="font-bold text-navy-400 uppercase tracking-wider block text-[9px]">Ganti Banner Foto Toko (Opsional)</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => form.setData("image", e.target.files?.[0] || null)}
              className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal cursor-pointer text-navy-400 text-[10px] py-1 bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-navy-100">
          <Button
            type="submit"
            disabled={form.processing}
            className="px-6 h-10 bg-pastel-teal hover:bg-pastel-teal/90 text-white font-extrabold uppercase tracking-widest text-[10px] rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4 text-white" />
            <span>{form.processing ? "Menyimpan..." : "Simpan Perubahan Profil"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
