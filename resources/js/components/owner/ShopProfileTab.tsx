/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Settings2,
  Clock,
  MapPin,
  Save,
  CheckCircle2,
  Image as ImageIcon,
  Phone,
  Sparkles,
  Info,
  Building2,
  Upload,
} from "lucide-react";
import React, { useMemo } from "react";
import LocationPickerMap from "@/components/LocationPickerMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import type { Shop } from "@/types";

interface ShopProfileTabProps {
  myShop: Shop;
  form: any;
  onSubmit: (e: React.FormEvent) => void;
  editSuccess: boolean;
}

export default function ShopProfileTab({
  myShop,
  form,
  onSubmit,
  editSuccess,
}: ShopProfileTabProps) {
  // Live image preview resolution
  const logoPreview = useMemo(() => {
    if (form.data.logo instanceof File) {
      return URL.createObjectURL(form.data.logo);
    }
    return myShop?.logo || "";
  }, [form.data.logo, myShop?.logo]);

  const bannerPreview = useMemo(() => {
    if (form.data.image instanceof File) {
      return URL.createObjectURL(form.data.image);
    }
    return myShop?.image || "";
  }, [form.data.image, myShop?.image]);

  const applyJamKerjaPreset = (preset: string) => {
    form.setData("jamKerja", preset);
  };

  return (
    <div
      className="space-y-6 animate-fade-in font-sans text-navy-900 max-w-4xl mx-auto"
      id="owner-edit-shop"
    >
      {/* Header Banner */}
      <div className="bg-white border border-navy-200/60 rounded-3xl p-6 sm:p-8 shadow-3xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-pastel-teal" />
            <h2 className="font-black text-navy-900 text-lg uppercase tracking-wider">
              Pengaturan Profil Toko Digital
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-navy-500 mt-1 font-normal leading-relaxed">
            Perbarui informasi visual, nomor kontak pembeli, jam operasional, dan lokasi peta rumah produksi Anda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {myShop.isVerified && (
            <span className="px-3 py-1 bg-pastel-teal-light text-pastel-teal border border-pastel-teal/20 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-pastel-teal" />
              <span>Terverifikasi</span>
            </span>
          )}
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 text-xs sm:text-sm">
        {/* Success Alert Banner */}
        {editSuccess && (
          <div className="p-4 bg-pastel-teal-light border border-pastel-teal/20 text-pastel-teal font-bold rounded-2xl flex items-center gap-2.5 animate-fade-in uppercase tracking-wider text-xs shadow-3xs">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-pastel-teal" />
            <span>Perubahan Profil Toko Berhasil Disimpan Ke Database!</span>
          </div>
        )}

        {/* SECTION 1: Brand & Visual Media */}
        <div className="bg-white border border-navy-200/60 rounded-3xl p-6 sm:p-8 shadow-3xs space-y-6">
          <div className="border-b border-navy-100 pb-3 flex items-center justify-between">
            <h3 className="font-extrabold text-navy-900 text-base uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4.5 h-4.5 text-pastel-teal" />
              <span>Identity & Media Branding Toko</span>
            </h3>
            <span className="text-xs font-mono text-navy-400 font-bold uppercase">
              Langkah 1 dari 3
            </span>
          </div>

          {/* Live Media Banner & Logo Preview */}
          <div className="relative rounded-2xl border border-navy-200/60 overflow-hidden bg-navy-50">
            {/* Banner Preview */}
            <div className="h-36 sm:h-44 w-full relative overflow-hidden bg-navy-100">
              <img
                src={bannerPreview}
                alt="Banner Toko Live Preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-navy-900/60 via-transparent to-transparent" />
              <span className="absolute top-3 right-3 px-2.5 py-1 bg-navy-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider rounded-lg">
                Pratinjau Banner Utama
              </span>
            </div>

            {/* Logo Preview Overlapping Banner */}
            <div className="p-4 sm:p-6 bg-white relative flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t border-navy-100">
              <div className="relative -mt-12 sm:-mt-14 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white bg-white overflow-hidden shadow-md shrink-0">
                <img
                  src={logoPreview}
                  alt="Logo Toko Live Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-black text-navy-900 uppercase tracking-wide">
                  {myShop.name}
                </h4>
                <p className="text-xs text-navy-500 font-normal">
                  Sektor Usaha: <strong className="font-bold text-pastel-teal">{myShop.category}</strong>
                </p>
                <p className="text-[11px] text-navy-400 font-mono">
                  File baru yang dipilih akan langsung diperbarui saat disimpan.
                </p>
              </div>
            </div>
          </div>

          {/* File Upload Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2">
            <div className="space-y-2">
              <Label className="font-bold text-navy-500 uppercase tracking-wider block text-xs flex items-center justify-between">
                <span>Ganti Logo Toko</span>
                <span className="text-[10px] text-navy-400 font-normal">Rasio 1:1 (Persegi)</span>
              </Label>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => form.setData("logo", e.target.files?.[0] || null)}
                  className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal cursor-pointer text-navy-600 text-xs py-1.5 bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-navy-500 uppercase tracking-wider block text-xs flex items-center justify-between">
                <span>Ganti Banner Foto Toko</span>
                <span className="text-[10px] text-navy-400 font-normal">Rasio Landscape 16:9</span>
              </Label>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => form.setData("image", e.target.files?.[0] || null)}
                  className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal cursor-pointer text-navy-600 text-xs py-1.5 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <Label className="font-bold text-navy-500 uppercase tracking-wider text-xs block">
              Uraian Deskripsi Toko & Produk
            </Label>
            <textarea
              rows={4}
              placeholder="Ceritakan sejarah keunikan produk, bahan organik, atau keunggulan usaha warga Anda..."
              value={form.data.description}
              onChange={(e) => form.setData("description", e.target.value)}
              className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-navy-200/60 bg-white text-navy-800 font-normal focus:outline-none focus:ring-2 focus:ring-pastel-teal/20 focus:border-pastel-teal resize-none transition-all shadow-3xs leading-relaxed"
            />
          </div>
        </div>

        {/* SECTION 2: Contact & Operational Setup */}
        <div className="bg-white border border-navy-200/60 rounded-3xl p-6 sm:p-8 shadow-3xs space-y-6">
          <div className="border-b border-navy-100 pb-3 flex items-center justify-between">
            <h3 className="font-extrabold text-navy-900 text-base uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-4.5 h-4.5 text-pastel-teal" />
              <span>Kontak WhatsApp & Jam Operasional</span>
            </h3>
            <span className="text-xs font-mono text-navy-400 font-bold uppercase">
              Langkah 2 dari 3
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Phone Input with Formatting Tip */}
            <div className="space-y-2 sm:col-span-1">
              <Label className="font-bold text-navy-500 uppercase tracking-wider text-xs block">
                No. WhatsApp Pembeli
              </Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pastel-teal z-10" />
                <Input
                  type="text"
                  required
                  placeholder="6285725900000"
                  value={form.data.phone}
                  onChange={(e) => form.setData("phone", e.target.value)}
                  className="rounded-xl pl-10 border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal text-xs sm:text-sm"
                />
              </div>
              <p className="text-[11px] text-navy-400 font-normal leading-normal pt-0.5">
                Format angka diawali kode negara <strong className="font-bold text-navy-700">628...</strong> tanpa spasi.
              </p>
            </div>

            {/* Jam Kerja with Quick Preset Pills */}
            <div className="space-y-2 sm:col-span-1">
              <Label className="font-bold text-navy-500 uppercase tracking-wider text-xs block">
                Jam Operasional Toko
              </Label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pastel-teal z-10" />
                <Input
                  type="text"
                  required
                  placeholder="08:00 - 17:00"
                  value={form.data.jamKerja}
                  onChange={(e) => form.setData("jamKerja", e.target.value)}
                  className="rounded-xl pl-10 border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal text-xs sm:text-sm"
                />
              </div>
              <div className="flex gap-1.5 pt-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => applyJamKerjaPreset("08:00 - 17:00")}
                  className="px-2 py-0.5 bg-navy-100 hover:bg-pastel-teal-light text-navy-700 hover:text-pastel-teal text-[10px] font-bold uppercase rounded-md transition-colors cursor-pointer"
                >
                  08:00 - 17:00
                </button>
                <button
                  type="button"
                  onClick={() => applyJamKerjaPreset("07:00 - 21:00")}
                  className="px-2 py-0.5 bg-navy-100 hover:bg-pastel-teal-light text-navy-700 hover:text-pastel-teal text-[10px] font-bold uppercase rounded-md transition-colors cursor-pointer"
                >
                  07:00 - 21:00
                </button>
                <button
                  type="button"
                  onClick={() => applyJamKerjaPreset("24 Jam")}
                  className="px-2 py-0.5 bg-navy-100 hover:bg-pastel-teal-light text-navy-700 hover:text-pastel-teal text-[10px] font-bold uppercase rounded-md transition-colors cursor-pointer"
                >
                  24 Jam
                </button>
              </div>
            </div>

            {/* Dusun Selection */}
            <div className="space-y-2 sm:col-span-1">
              <Label className="font-bold text-navy-500 uppercase tracking-wider text-xs block">
                Dusun Rumah Produksi
              </Label>
              <select
                value={form.data.dusun}
                onChange={(e) => form.setData("dusun", e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-navy-200/60 bg-white text-navy-800 font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-pastel-teal/20 focus:border-pastel-teal cursor-pointer shadow-3xs"
              >
                <option value="Dusun Samirono">Dusun Samirono (Pusat)</option>
                <option value="Dusun Bentar">Dusun Bentar (Susu)</option>
                <option value="Dusun Surowono">Dusun Surowono (Pertanian)</option>
                <option value="Dusun Tawang">Dusun Tawang (Kuliner)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: Location Address & Interactive Map Picker */}
        <div className="bg-white border border-navy-200/60 rounded-3xl p-6 sm:p-8 shadow-3xs space-y-6">
          <div className="border-b border-navy-100 pb-3 flex items-center justify-between">
            <h3 className="font-extrabold text-navy-900 text-base uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4.5 h-4.5 text-pastel-teal" />
              <span>Alamat Fisik & Titik Peta GPS</span>
            </h3>
            <span className="text-xs font-mono text-navy-400 font-bold uppercase">
              Langkah 3 dari 3
            </span>
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-navy-500 uppercase tracking-wider text-xs block">
              Alamat Lengkap Rumah Produksi / Patokan Toko
            </Label>
            <Input
              type="text"
              required
              placeholder="Contoh: RT 02 / RW 04, Depan Masjid Al-Hidayah, Dusun Bentar"
              value={form.data.address}
              onChange={(e) => form.setData("address", e.target.value)}
              className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal text-xs sm:text-sm"
            />
          </div>

          {/* Map Interactive Picker Box */}
          <div className="bg-navy-50/50 rounded-2xl p-4 sm:p-5 border border-navy-200/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-navy-800 flex items-center gap-1.5 text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-pastel-teal" />
                <span className="font-extrabold uppercase tracking-wider text-navy-800">
                  Geser Pin Marker Untuk Ubah Titik GPS Toko
                </span>
              </span>
              <span className="text-[11px] text-navy-400 font-mono">Peta Desa Samirono</span>
            </div>

            <LocationPickerMap
              lat={form.data.lat}
              lng={form.data.lng}
              onChange={(lat, lng) => form.setData((prev: any) => ({ ...prev, lat, lng }))}
            />
            
            <div className="flex gap-6 text-xs font-mono text-navy-500 bg-white p-3 rounded-xl border border-navy-200/60 shadow-3xs">
              <div>Latitude: <span className="font-bold text-pastel-teal">{form.data.lat}</span></div>
              <div>Longitude: <span className="font-bold text-pastel-teal">{form.data.lng}</span></div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Legal & Certification Notice Box */}
        <div className="bg-pastel-teal-light/20 border border-pastel-teal/20 rounded-3xl p-6 shadow-3xs space-y-3">
          <div className="flex items-center gap-2 text-navy-900">
            <Building2 className="w-5 h-5 text-pastel-teal shrink-0" />
            <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">
              Legalitas Usaha & Sertifikasi Pangan Warga
            </h4>
          </div>
          <p className="text-xs text-navy-600 font-normal leading-relaxed">
            Status legalitas seperti <strong className="font-semibold text-navy-800">NIB (Nomor Induk Berusaha)</strong>, <strong className="font-semibold text-navy-800">Sertifikat HALAL</strong>, dan <strong className="font-semibold text-navy-800">Izin P-IRT</strong> diverifikasi secara terpusat oleh Admin Desa Samirono.
          </p>
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            {myShop.nib ? (
              <span className="px-2.5 py-1 bg-pastel-lavender-light border border-pastel-lavender/30 text-pastel-lavender font-black text-xs uppercase rounded-lg">
                NIB Terdaftar
              </span>
            ) : null}
            {myShop.halal ? (
              <span className="px-2.5 py-1 bg-pastel-teal-light border border-pastel-teal/30 text-pastel-teal font-black text-xs uppercase rounded-lg">
                HALAL Terverifikasi
              </span>
            ) : null}
            {myShop.pirt ? (
              <span className="px-2.5 py-1 bg-pastel-peach-light border border-pastel-peach/30 text-pastel-peach font-black text-xs uppercase rounded-lg">
                P-IRT Terdaftar
              </span>
            ) : null}
            {!myShop.nib && !myShop.halal && !myShop.pirt && (
              <span className="text-xs text-navy-400 font-medium">Belum ada izin legalitas terdaftar</span>
            )}
          </div>
        </div>

        {/* Submit Form Action Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-navy-200">
          <p className="text-xs text-navy-400 font-normal hidden sm:block">
            Pastikan rincian nomor kontak dan foto sudah benar sebelum menyimpan.
          </p>
          <Button
            type="submit"
            disabled={form.processing}
            className="w-full sm:w-auto px-8 h-12 bg-pastel-teal hover:bg-pastel-teal/90 text-white font-black uppercase tracking-widest text-xs sm:text-sm rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {form.processing ? (
              <Spinner />
            ) : (
              <Save className="w-4.5 h-4.5 text-white" />
            )}
            <span>{form.processing ? "Menyimpan Ke Database..." : "Simpan Perubahan Profil"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
