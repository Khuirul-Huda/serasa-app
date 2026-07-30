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
    Building2,
} from 'lucide-react';
import React, { useMemo } from 'react';
import LocationPickerMap from '@/components/LocationPickerMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import type { Shop } from '@/types';

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

        return myShop.logo || '';
    }, [form.data.logo, myShop.logo]);

    const bannerPreview = useMemo(() => {
        if (form.data.image instanceof File) {
            return URL.createObjectURL(form.data.image);
        }

        return myShop.image || '';
    }, [form.data.image, myShop.image]);

    const applyJamKerjaPreset = (preset: string) => {
        form.setData('jamKerja', preset);
    };

    return (
        <div
            className="mx-auto max-w-4xl animate-fade-in space-y-6 font-sans text-navy-900"
            id="owner-edit-shop"
        >
            {/* Header Banner */}
            <div className="shadow-3xs flex flex-col items-start justify-between gap-4 rounded-3xl border border-navy-200/60 bg-white p-6 sm:flex-row sm:items-center sm:p-8">
                <div>
                    <div className="flex items-center gap-2">
                        <Settings2 className="h-5 w-5 text-pastel-teal" />
                        <h2 className="text-lg font-black tracking-wider text-navy-900 uppercase">
                            Pengaturan Profil Toko Digital
                        </h2>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed font-normal text-navy-500 sm:text-sm">
                        Perbarui informasi visual, nomor kontak pembeli, jam
                        operasional, dan lokasi peta rumah produksi Anda.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {myShop.isVerified && (
                        <span className="flex items-center gap-1.5 rounded-xl border border-pastel-teal/20 bg-pastel-teal-light px-3 py-1 text-xs font-black tracking-wider text-pastel-teal uppercase">
                            <CheckCircle2 className="h-4 w-4 text-pastel-teal" />
                            <span>Terverifikasi</span>
                        </span>
                    )}
                </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-6 text-xs sm:text-sm">
                {/* Success Alert Banner */}
                {editSuccess && (
                    <div className="shadow-3xs flex animate-fade-in items-center gap-2.5 rounded-2xl border border-pastel-teal/20 bg-pastel-teal-light p-4 text-xs font-bold tracking-wider text-pastel-teal uppercase">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-pastel-teal" />
                        <span>
                            Perubahan Profil Toko Berhasil Disimpan Ke Database!
                        </span>
                    </div>
                )}

                {/* SECTION 1: Brand & Visual Media */}
                <div className="shadow-3xs space-y-6 rounded-3xl border border-navy-200/60 bg-white p-6 sm:p-8">
                    <div className="flex items-center justify-between border-b border-navy-100 pb-3">
                        <h3 className="flex items-center gap-2 text-base font-extrabold tracking-wider text-navy-900 uppercase">
                            <ImageIcon className="h-4.5 w-4.5 text-pastel-teal" />
                            <span>Identity & Media Branding Toko</span>
                        </h3>
                        <span className="font-mono text-xs font-bold text-navy-400 uppercase">
                            Langkah 1 dari 3
                        </span>
                    </div>

                    {/* Live Media Banner & Logo Preview */}
                    <div className="relative overflow-hidden rounded-2xl border border-navy-200/60 bg-navy-50">
                        {/* Banner Preview */}
                        <div className="relative h-36 w-full overflow-hidden bg-navy-100 sm:h-44">
                            <img
                                src={bannerPreview}
                                alt="Banner Toko Live Preview"
                                className="h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-navy-900/60 via-transparent to-transparent" />
                            <span className="absolute top-3 right-3 rounded-lg bg-navy-900/80 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-xs">
                                Pratinjau Banner Utama
                            </span>
                        </div>

                        {/* Logo Preview Overlapping Banner */}
                        <div className="relative flex flex-col items-start gap-4 border-t border-navy-100 bg-white p-4 sm:flex-row sm:items-center sm:p-6">
                            <div className="relative -mt-12 h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md sm:-mt-14 sm:h-24 sm:w-24">
                                <img
                                    src={logoPreview}
                                    alt="Logo Toko Live Preview"
                                    className="h-full w-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            </div>

                            <div className="space-y-1">
                                <h4 className="text-base font-black tracking-wide text-navy-900 uppercase sm:text-lg">
                                    {myShop.name}
                                </h4>
                                <p className="text-xs font-normal text-navy-500">
                                    Sektor Usaha:{' '}
                                    <strong className="font-bold text-pastel-teal">
                                        {myShop.category}
                                    </strong>
                                </p>
                                <p className="font-mono text-[11px] text-navy-400">
                                    File baru yang dipilih akan langsung
                                    diperbarui saat disimpan.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* File Upload Controls */}
                    <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 sm:gap-6">
                        <div className="space-y-2">
                            <Label className="block flex items-center justify-between text-xs font-bold tracking-wider text-navy-500 uppercase">
                                <span>Ganti Logo Toko</span>
                                <span className="text-[10px] font-normal text-navy-400">
                                    Rasio 1:1 (Persegi)
                                </span>
                            </Label>
                            <div className="relative">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        form.setData(
                                            'logo',
                                            e.target.files?.[0] || null,
                                        )
                                    }
                                    className="cursor-pointer rounded-xl border-navy-200/60 bg-white py-1.5 text-xs text-navy-600 focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="block flex items-center justify-between text-xs font-bold tracking-wider text-navy-500 uppercase">
                                <span>Ganti Banner Foto Toko</span>
                                <span className="text-[10px] font-normal text-navy-400">
                                    Rasio Landscape 16:9
                                </span>
                            </Label>
                            <div className="relative">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        form.setData(
                                            'image',
                                            e.target.files?.[0] || null,
                                        )
                                    }
                                    className="cursor-pointer rounded-xl border-navy-200/60 bg-white py-1.5 text-xs text-navy-600 focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description Textarea */}
                    <div className="space-y-2">
                        <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                            Uraian Deskripsi Toko & Produk
                        </Label>
                        <textarea
                            rows={4}
                            placeholder="Ceritakan sejarah keunikan produk, bahan organik, atau keunggulan usaha warga Anda..."
                            value={form.data.description}
                            onChange={(e) =>
                                form.setData('description', e.target.value)
                            }
                            className="shadow-3xs w-full resize-none rounded-xl border border-navy-200/60 bg-white px-4 py-3 text-xs leading-relaxed font-normal text-navy-800 transition-all focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none sm:text-sm"
                        />
                    </div>
                </div>

                {/* SECTION 2: Contact & Operational Setup */}
                <div className="shadow-3xs space-y-6 rounded-3xl border border-navy-200/60 bg-white p-6 sm:p-8">
                    <div className="flex items-center justify-between border-b border-navy-100 pb-3">
                        <h3 className="flex items-center gap-2 text-base font-extrabold tracking-wider text-navy-900 uppercase">
                            <Phone className="h-4.5 w-4.5 text-pastel-teal" />
                            <span>Kontak WhatsApp & Jam Operasional</span>
                        </h3>
                        <span className="font-mono text-xs font-bold text-navy-400 uppercase">
                            Langkah 2 dari 3
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                        {/* Phone Input with Formatting Tip */}
                        <div className="space-y-2 sm:col-span-1">
                            <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                No. WhatsApp Pembeli
                            </Label>
                            <div className="relative">
                                <Phone className="absolute top-1/2 left-3.5 z-10 h-4 w-4 -translate-y-1/2 text-pastel-teal" />
                                <Input
                                    type="text"
                                    required
                                    placeholder="6285725900000"
                                    value={form.data.phone}
                                    onChange={(e) =>
                                        form.setData('phone', e.target.value)
                                    }
                                    className="rounded-xl border-navy-200/60 pl-10 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                                />
                            </div>
                            <p className="pt-0.5 text-[11px] leading-normal font-normal text-navy-400">
                                Format angka diawali kode negara{' '}
                                <strong className="font-bold text-navy-700">
                                    628...
                                </strong>{' '}
                                tanpa spasi.
                            </p>
                        </div>

                        {/* Jam Kerja with Quick Preset Pills */}
                        <div className="space-y-2 sm:col-span-1">
                            <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                Jam Operasional Toko
                            </Label>
                            <div className="relative">
                                <Clock className="absolute top-1/2 left-3.5 z-10 h-4 w-4 -translate-y-1/2 text-pastel-teal" />
                                <Input
                                    type="text"
                                    required
                                    placeholder="08:00 - 17:00"
                                    value={form.data.jamKerja}
                                    onChange={(e) =>
                                        form.setData('jamKerja', e.target.value)
                                    }
                                    className="rounded-xl border-navy-200/60 pl-10 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                                />
                            </div>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        applyJamKerjaPreset('08:00 - 17:00')
                                    }
                                    className="cursor-pointer rounded-md bg-navy-100 px-2 py-0.5 text-[10px] font-bold text-navy-700 uppercase transition-colors hover:bg-pastel-teal-light hover:text-pastel-teal"
                                >
                                    08:00 - 17:00
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        applyJamKerjaPreset('07:00 - 21:00')
                                    }
                                    className="cursor-pointer rounded-md bg-navy-100 px-2 py-0.5 text-[10px] font-bold text-navy-700 uppercase transition-colors hover:bg-pastel-teal-light hover:text-pastel-teal"
                                >
                                    07:00 - 21:00
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        applyJamKerjaPreset('24 Jam')
                                    }
                                    className="cursor-pointer rounded-md bg-navy-100 px-2 py-0.5 text-[10px] font-bold text-navy-700 uppercase transition-colors hover:bg-pastel-teal-light hover:text-pastel-teal"
                                >
                                    24 Jam
                                </button>
                            </div>
                        </div>

                        {/* Dusun Selection */}
                        <div className="space-y-2 sm:col-span-1">
                            <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                Dusun Rumah Produksi
                            </Label>
                            <select
                                value={form.data.dusun}
                                onChange={(e) =>
                                    form.setData('dusun', e.target.value)
                                }
                                className="shadow-3xs w-full cursor-pointer rounded-xl border border-navy-200/60 bg-white px-4 py-2.5 text-xs font-bold tracking-wider text-navy-800 uppercase focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none sm:text-sm"
                            >
                                <option value="Dusun Samirono">
                                    Dusun Samirono (Pusat)
                                </option>
                                <option value="Dusun Bentar">
                                    Dusun Bentar (Susu)
                                </option>
                                <option value="Dusun Surowono">
                                    Dusun Surowono (Pertanian)
                                </option>
                                <option value="Dusun Tawang">
                                    Dusun Tawang (Kuliner)
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* SECTION 3: Location Address & Interactive Map Picker */}
                <div className="shadow-3xs space-y-6 rounded-3xl border border-navy-200/60 bg-white p-6 sm:p-8">
                    <div className="flex items-center justify-between border-b border-navy-100 pb-3">
                        <h3 className="flex items-center gap-2 text-base font-extrabold tracking-wider text-navy-900 uppercase">
                            <MapPin className="h-4.5 w-4.5 text-pastel-teal" />
                            <span>Alamat Fisik & Titik Peta GPS</span>
                        </h3>
                        <span className="font-mono text-xs font-bold text-navy-400 uppercase">
                            Langkah 3 dari 3
                        </span>
                    </div>

                    <div className="space-y-2">
                        <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                            Alamat Lengkap Rumah Produksi / Patokan Toko
                        </Label>
                        <Input
                            type="text"
                            required
                            placeholder="Contoh: RT 02 / RW 04, Depan Masjid Al-Hidayah, Dusun Bentar"
                            value={form.data.address}
                            onChange={(e) =>
                                form.setData('address', e.target.value)
                            }
                            className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                        />
                    </div>

                    {/* Map Interactive Picker Box */}
                    <div className="space-y-3 rounded-2xl border border-navy-200/60 bg-navy-50/50 p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-navy-800 sm:text-sm">
                                <MapPin className="h-4 w-4 text-pastel-teal" />
                                <span className="font-extrabold tracking-wider text-navy-800 uppercase">
                                    Geser Pin Marker Untuk Ubah Titik GPS Toko
                                </span>
                            </span>
                            <span className="font-mono text-[11px] text-navy-400">
                                Peta Desa Samirono
                            </span>
                        </div>

                        <LocationPickerMap
                            lat={form.data.lat}
                            lng={form.data.lng}
                            onChange={(lat, lng) =>
                                form.setData((prev: any) => ({
                                    ...prev,
                                    lat,
                                    lng,
                                }))
                            }
                        />

                        <div className="shadow-3xs flex gap-6 rounded-xl border border-navy-200/60 bg-white p-3 font-mono text-xs text-navy-500">
                            <div>
                                Latitude:{' '}
                                <span className="font-bold text-pastel-teal">
                                    {form.data.lat}
                                </span>
                            </div>
                            <div>
                                Longitude:{' '}
                                <span className="font-bold text-pastel-teal">
                                    {form.data.lng}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 4: Legal & Certification Notice Box */}
                <div className="shadow-3xs space-y-3 rounded-3xl border border-pastel-teal/20 bg-pastel-teal-light/20 p-6">
                    <div className="flex items-center gap-2 text-navy-900">
                        <Building2 className="h-5 w-5 shrink-0 text-pastel-teal" />
                        <h4 className="text-xs font-extrabold tracking-wider uppercase sm:text-sm">
                            Legalitas Usaha & Sertifikasi Pangan Warga
                        </h4>
                    </div>
                    <p className="text-xs leading-relaxed font-normal text-navy-600">
                        Status legalitas seperti{' '}
                        <strong className="font-semibold text-navy-800">
                            NIB (Nomor Induk Berusaha)
                        </strong>
                        ,{' '}
                        <strong className="font-semibold text-navy-800">
                            Sertifikat HALAL
                        </strong>
                        , dan{' '}
                        <strong className="font-semibold text-navy-800">
                            Izin P-IRT
                        </strong>{' '}
                        diverifikasi secara terpusat oleh Admin Desa Samirono.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        {myShop.nib ? (
                            <span className="rounded-lg border border-pastel-lavender/30 bg-pastel-lavender-light px-2.5 py-1 text-xs font-black text-pastel-lavender uppercase">
                                NIB Terdaftar
                            </span>
                        ) : null}
                        {myShop.halal ? (
                            <span className="rounded-lg border border-pastel-teal/30 bg-pastel-teal-light px-2.5 py-1 text-xs font-black text-pastel-teal uppercase">
                                HALAL Terverifikasi
                            </span>
                        ) : null}
                        {myShop.pirt ? (
                            <span className="rounded-lg border border-pastel-peach/30 bg-pastel-peach-light px-2.5 py-1 text-xs font-black text-pastel-peach uppercase">
                                P-IRT Terdaftar
                            </span>
                        ) : null}
                        {!myShop.nib && !myShop.halal && !myShop.pirt && (
                            <span className="text-xs font-medium text-navy-400">
                                Belum ada izin legalitas terdaftar
                            </span>
                        )}
                    </div>
                </div>

                {/* Submit Form Action Footer */}
                <div className="flex items-center justify-between border-t border-navy-200 pt-4">
                    <p className="hidden text-xs font-normal text-navy-400 sm:block">
                        Pastikan rincian nomor kontak dan foto sudah benar
                        sebelum menyimpan.
                    </p>
                    <Button
                        type="submit"
                        disabled={form.processing}
                        className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-pastel-teal px-8 text-xs font-black tracking-widest text-white uppercase shadow-xs transition-all hover:bg-pastel-teal/90 hover:shadow-md sm:w-auto sm:text-sm"
                    >
                        {form.processing ? (
                            <Spinner />
                        ) : (
                            <Save className="h-4.5 w-4.5 text-white" />
                        )}
                        <span>
                            {form.processing
                                ? 'Menyimpan Ke Database...'
                                : 'Simpan Perubahan Profil'}
                        </span>
                    </Button>
                </div>
            </form>
        </div>
    );
}
