/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Store, MapPin, Sparkle, Clock } from 'lucide-react';
import React from 'react';
import LocationPickerMap from '@/components/LocationPickerMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Category } from '@/types';

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
        <div
            className="mx-auto max-w-5xl animate-fade-in px-4 py-6 font-sans text-navy-900 sm:px-6 lg:px-8"
            id="owner-onboarding"
        >
            <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-navy-200/60 bg-white shadow-sm lg:grid-cols-12">
                {/* Informational Column */}
                <div className="relative flex flex-col justify-between space-y-8 border-r border-navy-200/60 bg-pastel-teal-light/30 p-8 lg:col-span-5">
                    <div className="relative z-10 space-y-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-pastel-teal/20 bg-pastel-teal-light text-pastel-teal">
                            <Store className="h-6 w-6" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-xl leading-none font-black tracking-tight text-navy-900 uppercase sm:text-2xl">
                                Mulai Digitalisasi <br />
                                <span className="text-pastel-teal">
                                    Toko Usaha Anda
                                </span>
                            </h2>
                            <p className="text-xs leading-relaxed font-normal text-navy-600 sm:text-sm">
                                Gabung di portal etalase digital desa. Hadirkan
                                etalase digital terpusat untuk memperkenalkan
                                komoditas pangan, olahan, kriya, maupun jasa
                                Anda secara modern.
                            </p>
                        </div>

                        <div className="shadow-3xs space-y-3 rounded-2xl border border-navy-200/60 bg-white p-4 text-xs font-normal text-navy-600">
                            <div className="flex items-start gap-2.5">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-pastel-teal" />
                                <span>
                                    <strong>Pemetaan Geografis Akurat</strong>:
                                    Geser pin penunjuk lokasi peta ke titik
                                    rumah produksi Anda, agar pembeli dapat
                                    dinavigasikan dengan benar.
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-2 border-t border-navy-200/60 pt-6 font-mono text-xs font-bold tracking-widest text-pastel-teal uppercase">
                        <Sparkle className="h-4 w-4 animate-pulse fill-pastel-peach/20 text-pastel-peach" />
                        <span>Registrasi UMKM Desa Gratis</span>
                    </div>
                </div>

                {/* Registration Form Column */}
                <div className="space-y-6 bg-white p-6 sm:p-8 lg:col-span-7">
                    <div className="border-b border-navy-100 pb-3">
                        <h3 className="text-base font-extrabold tracking-wider text-navy-900 uppercase">
                            Formulir Profil Usaha Warga
                        </h3>
                        <p className="mt-0.5 text-xs text-navy-500">
                            Lengkapi rincian berikut untuk meluncurkan etalase
                            toko digital Anda.
                        </p>
                    </div>

                    <form
                        onSubmit={onSubmit}
                        className="space-y-5 text-xs sm:text-sm"
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                    Nama Toko / UMKM
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    placeholder="Contoh: Susu Murni Bentar"
                                    value={form.data.name}
                                    onChange={(e: any) =>
                                        form.setData('name', e.target.value)
                                    }
                                    className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                    Nama Pemilik
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    placeholder="Contoh: Bapak Haryono"
                                    value={form.data.ownerName}
                                    onChange={(e: any) =>
                                        form.setData(
                                            'ownerName',
                                            e.target.value,
                                        )
                                    }
                                    className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                    Nomor WhatsApp Toko
                                </Label>
                                <Input
                                    type="tel"
                                    required
                                    placeholder="Contoh: 6285725900000"
                                    value={form.data.phone}
                                    onChange={(e: any) =>
                                        form.setData('phone', e.target.value)
                                    }
                                    className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                    Wilayah Dusun
                                </label>
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

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                    Jam Kerja Operasional
                                </Label>
                                <div className="relative">
                                    <Clock className="absolute top-1/2 left-3.5 z-10 h-4 w-4 -translate-y-1/2 text-pastel-teal" />
                                    <Input
                                        type="text"
                                        required
                                        placeholder="Contoh: 08:00 - 17:00"
                                        value={form.data.jamKerja}
                                        onChange={(e: any) =>
                                            form.setData(
                                                'jamKerja',
                                                e.target.value,
                                            )
                                        }
                                        className="rounded-xl border-navy-200/60 pl-9 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                    Fokus Sektor Usaha
                                </Label>
                                <select
                                    value={form.data.category}
                                    onChange={(e) =>
                                        form.setData('category', e.target.value)
                                    }
                                    className="shadow-3xs w-full cursor-pointer rounded-xl border border-navy-200/60 bg-white px-4 py-2.5 text-xs font-bold tracking-wider text-navy-800 uppercase focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none sm:text-sm"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                Alamat Detail Produksi
                            </Label>
                            <Input
                                type="text"
                                required
                                placeholder="Contoh: RT 02 / RW 04, Dusun Bentar"
                                value={form.data.address}
                                onChange={(e: any) =>
                                    form.setData('address', e.target.value)
                                }
                                className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                            />
                        </div>

                        {/* Map Position Picker Box */}
                        <div className="space-y-3 rounded-2xl border border-navy-200/60 bg-navy-50/50 p-4">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-navy-800">
                                <MapPin className="h-4 w-4 text-pastel-teal" />
                                <span className="text-xs font-extrabold tracking-wider text-navy-800 uppercase">
                                    Pin Peta Koordinat Lokasi
                                </span>
                            </span>
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

                            <div className="shadow-3xs flex gap-4 rounded-xl border border-navy-200/60 bg-white p-2.5 font-mono text-xs text-navy-400">
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

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                    Logo Toko (Opsional)
                                </Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e: any) =>
                                        form.setData(
                                            'logo',
                                            e.target.files?.[0] || null,
                                        )
                                    }
                                    className="cursor-pointer rounded-xl border-navy-200/60 bg-white py-1 text-xs text-navy-400 focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                    Banner Foto Toko (Opsional)
                                </Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e: any) =>
                                        form.setData(
                                            'image',
                                            e.target.files?.[0] || null,
                                        )
                                    }
                                    className="cursor-pointer rounded-xl border-navy-200/60 bg-white py-1 text-xs text-navy-400 focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                Deskripsi Singkat Toko
                            </Label>
                            <textarea
                                rows={2}
                                placeholder="Ceritakan singkat mengenai keunikan produk lokal buatan rumah produksi Anda..."
                                value={form.data.description}
                                onChange={(e) =>
                                    form.setData('description', e.target.value)
                                }
                                className="shadow-3xs w-full resize-none rounded-xl border border-navy-200/60 bg-white px-4 py-2.5 text-xs font-medium text-navy-800 transition-all focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none sm:text-sm"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-pastel-teal text-xs font-extrabold tracking-widest text-white uppercase shadow-xs transition-all hover:bg-pastel-teal/90 hover:shadow-md"
                        >
                            <Store className="h-4 w-4 text-white" />
                            <span>
                                {form.processing
                                    ? 'Mendaftarkan Toko...'
                                    : 'Daftarkan Toko Saya Sekarang'}
                            </span>
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
