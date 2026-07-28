/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Store, MapPin, Sparkle, Clock } from "lucide-react";
import React from "react";
import LocationPickerMap from "@/components/LocationPickerMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/types";

interface OnboardingPanelProps {
  categories: Category[];
  form: any;
  onSubmit: (e: React.FormEvent) => void;
}

export default function OnboardingPanel({
  categories,
  form,
  onSubmit,
}: OnboardingPanelProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in font-sans text-navy-900" id="owner-onboarding">
      <div className="bg-white rounded-3xl border border-navy-200/60 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Informational Column */}
        <div className="lg:col-span-5 bg-pastel-teal-light/30 border-r border-navy-200/60 p-8 flex flex-col justify-between space-y-8 relative">
          <div className="space-y-6 relative z-10">
            <div className="w-12 h-12 bg-pastel-teal-light rounded-2xl flex items-center justify-center text-pastel-teal border border-pastel-teal/20">
              <Store className="w-6 h-6" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-navy-900 leading-none">
                Mulai Digitalisasi <br />
                <span className="text-pastel-teal">Toko Usaha Anda</span>
              </h2>
              <p className="text-xs sm:text-sm text-navy-600 font-normal leading-relaxed">
                Gabung di portal <strong className="font-bold text-navy-800">SAMIRONO ETALASE</strong>. Hadirkan etalase digital terpusat untuk memperkenalkan komoditas pangan, olahan, kriya, maupun jasa Anda secara modern.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-navy-200/60 space-y-3 text-xs text-navy-600 font-normal shadow-3xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-pastel-teal shrink-0 mt-0.5" />
                <span>
                  <strong>Pemetaan Geografis Akurat</strong>: Geser pin penunjuk lokasi peta ke titik rumah produksi Anda, agar pembeli dapat dinavigasikan dengan benar.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-navy-200/60 text-xs text-pastel-teal font-bold uppercase tracking-widest relative z-10 flex items-center gap-2 font-mono">
            <Sparkle className="w-4 h-4 text-pastel-peach fill-pastel-peach/20 animate-pulse" />
            <span>Registrasi UMKM Desa Gratis</span>
          </div>
        </div>

        {/* Registration Form Column */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 bg-white">
          <div className="border-b border-navy-100 pb-3">
            <h3 className="font-extrabold text-navy-900 text-base uppercase tracking-wider">Formulir Profil Usaha Warga</h3>
            <p className="text-xs text-navy-500 mt-0.5">Lengkapi rincian berikut untuk meluncurkan etalase toko digital Anda.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-bold text-navy-500 uppercase tracking-wider block text-xs">Nama Toko / UMKM</Label>
                <Input
                  type="text"
                  required
                  placeholder="Contoh: Susu Murni Bentar"
                  value={form.data.name}
                  onChange={(e: any) => form.setData("name", e.target.value)}
                  className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-navy-500 uppercase tracking-wider block text-xs">Nama Pemilik</Label>
                <Input
                  type="text"
                  required
                  placeholder="Contoh: Bapak Haryono"
                  value={form.data.ownerName}
                  onChange={(e: any) => form.setData("ownerName", e.target.value)}
                  className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-bold text-navy-500 uppercase tracking-wider block text-xs">Nomor WhatsApp Toko</Label>
                <Input
                  type="tel"
                  required
                  placeholder="Contoh: 6285725900000"
                  value={form.data.phone}
                  onChange={(e: any) => form.setData("phone", e.target.value)}
                  className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-navy-500 uppercase tracking-wider block text-xs">Wilayah Dusun</label>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-bold text-navy-500 uppercase tracking-wider block text-xs">Jam Kerja Operasional</Label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pastel-teal z-10" />
                  <Input
                    type="text"
                    required
                    placeholder="Contoh: 08:00 - 17:00"
                    value={form.data.jamKerja}
                    onChange={(e: any) => form.setData("jamKerja", e.target.value)}
                    className="rounded-xl pl-9 border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal text-xs sm:text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-navy-500 uppercase tracking-wider block text-xs">Fokus Sektor Usaha</Label>
                <select
                  value={form.data.category}
                  onChange={(e) => form.setData("category", e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-navy-200/60 bg-white text-navy-800 font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-pastel-teal/20 focus:border-pastel-teal cursor-pointer shadow-3xs"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold text-navy-500 uppercase tracking-wider block text-xs">Alamat Detail Produksi</Label>
              <Input
                type="text"
                required
                placeholder="Contoh: RT 02 / RW 04, Dusun Bentar"
                value={form.data.address}
                onChange={(e: any) => form.setData("address", e.target.value)}
                className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal text-xs sm:text-sm"
              />
            </div>

            {/* Map Position Picker Box */}
            <div className="bg-navy-50/50 rounded-2xl p-4 border border-navy-200/60 space-y-3">
              <span className="font-bold text-navy-800 flex items-center gap-1.5 text-xs">
                <MapPin className="w-4 h-4 text-pastel-teal" />
                <span className="font-extrabold text-xs uppercase tracking-wider text-navy-800">Pin Peta Koordinat Lokasi</span>
              </span>
              <LocationPickerMap
                lat={form.data.lat}
                lng={form.data.lng}
                onChange={(lat, lng) => form.setData((prev: any) => ({ ...prev, lat, lng }))}
              />
              
              <div className="flex gap-4 text-xs font-mono text-navy-400 bg-white p-2.5 rounded-xl border border-navy-200/60 shadow-3xs">
                <div>Latitude: <span className="font-bold text-pastel-teal">{form.data.lat}</span></div>
                <div>Longitude: <span className="font-bold text-pastel-teal">{form.data.lng}</span></div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-bold text-navy-500 uppercase tracking-wider block text-xs">Logo Toko (Opsional)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e: any) => form.setData("logo", e.target.files?.[0] || null)}
                  className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal cursor-pointer text-navy-400 text-xs py-1 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-navy-500 uppercase tracking-wider block text-xs">Banner Foto Toko (Opsional)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e: any) => form.setData("image", e.target.files?.[0] || null)}
                  className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal cursor-pointer text-navy-400 text-xs py-1 bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold text-navy-500 uppercase tracking-wider block text-xs">Deskripsi Singkat Toko</Label>
              <textarea
                rows={2}
                placeholder="Ceritakan singkat mengenai keunikan produk lokal buatan rumah produksi Anda..."
                value={form.data.description}
                onChange={(e) => form.setData("description", e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-navy-200/60 bg-white text-navy-800 font-medium focus:outline-none focus:ring-2 focus:ring-pastel-teal/20 focus:border-pastel-teal resize-none transition-all shadow-3xs"
              />
            </div>

            <Button
              type="submit"
              disabled={form.processing}
              className="w-full h-11 bg-pastel-teal hover:bg-pastel-teal/90 text-white font-extrabold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md transition-all"
            >
              <Store className="w-4 h-4 text-white" />
              <span>{form.processing ? "Mendaftarkan Toko..." : "Daftarkan Toko Saya Sekarang"}</span>
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}
