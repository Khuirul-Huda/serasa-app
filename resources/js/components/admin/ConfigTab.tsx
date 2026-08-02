/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Save, CheckCircle2, Eye, Sparkles, Flame, Plus, Trash2, Sliders } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import type { Product, PromoSlideItem } from '@/types';

interface ConfigTabProps {
    data: {
        appName: string;
        tagline: string;
        villageName: string;
        kecamatanName?: string;
        kabupatenName?: string;
        description: string;
        adminPhone: string;
        heroBanner: string;
        mapCenterLat?: number;
        mapCenterLng?: number;
        mapZoom?: number;
        footerCredits?: string;
        flashSaleTitle?: string;
        flashSaleProductId?: string;
        flashSaleHours?: number;
        flashSaleMinutes?: number;
        flashSaleTag?: string;
        flashSaleProgress?: number;
        hotSearches?: { label: string; query: string }[];
        promoSlides?: PromoSlideItem[];
    };
    setData: (key: string, value: any) => void;
    products?: Product[];
    onSubmit: (e: React.FormEvent) => void;
    processing: boolean;
    saveSuccess: boolean;
}

export default function ConfigTab({
    data,
    setData,
    products = [],
    onSubmit,
    processing,
    saveSuccess,
}: ConfigTabProps) {
    const slides = data.promoSlides || [];

    const handleAddSlide = () => {
        const newSlide: PromoSlideItem = {
            id: `slide-${Date.now()}`,
            title: 'Judul Banner Promo Baru',
            tagline: 'Subtitle / Highlight Promo',
            description: 'Penjelasan singkat mengenai produk atau promo spesial warga.',
            image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
            badge: '🔥 PROMO SPESIAL',
            btnQuery: 'promo',
        };
        setData('promoSlides', [...slides, newSlide]);
    };

    const handleUpdateSlide = (index: number, key: keyof PromoSlideItem, val: string) => {
        const updated = slides.map((s, i) => (i === index ? { ...s, [key]: val } : s));
        setData('promoSlides', updated);
    };

    const handleRemoveSlide = (index: number) => {
        const updated = slides.filter((_, i) => i !== index);
        setData('promoSlides', updated);
    };

    return (
        <div
            className="animate-fade-in space-y-6 font-sans text-navy-900"
            id="admin-config-subtab"
        >
            <form onSubmit={onSubmit} className="space-y-6 text-xs sm:text-sm">
                {saveSuccess && (
                    <div className="shadow-3xs mx-auto max-w-4xl flex animate-fade-in items-center gap-2.5 rounded-2xl border border-pastel-teal/20 bg-pastel-teal-light p-4 text-xs font-bold tracking-wider text-pastel-teal uppercase">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-pastel-teal" />
                        <span>
                            Konfigurasi Platform & Hero Flash Sale Berhasil Diperbarui!
                        </span>
                    </div>
                )}

                {/* 1. Global Platform Branding */}
                <div className="shadow-3xs mx-auto max-w-4xl space-y-6 rounded-3xl border border-navy-200/60 bg-white p-6 sm:p-8">
                    <div className="flex items-center justify-between border-b border-navy-100 pb-4">
                        <div>
                            <h3 className="text-base font-black tracking-wider text-navy-900 uppercase sm:text-lg">
                                Identitas & Parameter Global Platform
                            </h3>
                            <p className="mt-1 text-xs font-normal text-navy-500">
                                Atur judul portal, nama desa, kontak helpline admin, dan deskripsi publik.
                            </p>
                        </div>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-pastel-teal/20 bg-pastel-teal-light text-pastel-teal">
                            <Sparkles className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                        <div className="space-y-1.5">
                            <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                Nama Aplikasi Portal
                            </Label>
                            <Input
                                type="text"
                                required
                                value={data.appName}
                                onChange={(e) => setData('appName', e.target.value)}
                                className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                Nama Wilayah Desa
                            </Label>
                            <Input
                                type="text"
                                required
                                value={data.villageName}
                                onChange={(e) => setData('villageName', e.target.value)}
                                className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                        <div className="space-y-1.5">
                            <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                Slogan / Tagline Portal
                            </Label>
                            <Input
                                type="text"
                                required
                                value={data.tagline}
                                onChange={(e) => setData('tagline', e.target.value)}
                                className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                No. WA Helpline Admin Desa
                            </Label>
                            <Input
                                type="text"
                                required
                                placeholder="6285725900000"
                                value={data.adminPhone}
                                onChange={(e) => setData('adminPhone', e.target.value)}
                                className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                            URL Banner Utama (Hero Banner)
                        </Label>
                        <Input
                            type="text"
                            required
                            value={data.heroBanner}
                            onChange={(e) => setData('heroBanner', e.target.value)}
                            className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                        <div className="space-y-1.5">
                            <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                Nama Kecamatan
                            </Label>
                            <Input
                                type="text"
                                placeholder="Kecamatan Getasan"
                                value={data.kecamatanName || ''}
                                onChange={(e) => setData('kecamatanName', e.target.value)}
                                className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                Nama Kabupaten / Kota
                            </Label>
                            <Input
                                type="text"
                                placeholder="Kabupaten Semarang"
                                value={data.kabupatenName || ''}
                                onChange={(e) => setData('kabupatenName', e.target.value)}
                                className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                        <div className="space-y-1.5">
                            <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                Latitude Tengah Peta Desa
                            </Label>
                            <Input
                                type="number"
                                step="any"
                                placeholder="-7.371239"
                                value={data.mapCenterLat !== undefined ? data.mapCenterLat : -7.371239}
                                onChange={(e) => setData('mapCenterLat', Number(e.target.value))}
                                className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                Longitude Tengah Peta Desa
                            </Label>
                            <Input
                                type="number"
                                step="any"
                                placeholder="110.456123"
                                value={data.mapCenterLng !== undefined ? data.mapCenterLng : 110.456123}
                                onChange={(e) => setData('mapCenterLng', Number(e.target.value))}
                                className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                Default Level Zoom (1 - 20)
                            </Label>
                            <Input
                                type="number"
                                min={1}
                                max={20}
                                placeholder="14"
                                value={data.mapZoom !== undefined ? data.mapZoom : 14}
                                onChange={(e) => setData('mapZoom', Number(e.target.value))}
                                className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                            Teks Hak Cipta & Kredit Footer
                        </Label>
                        <Input
                            type="text"
                            placeholder="© 2026 TIM KKN UNNES GIAT 16 DESA SAMIRONO"
                            value={data.footerCredits || ''}
                            onChange={(e) => setData('footerCredits', e.target.value)}
                            className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                        />
                    </div>
                </div>

                {/* 2. Hero Flash Sale Card Configuration */}
                <div className="shadow-3xs mx-auto max-w-4xl space-y-6 rounded-3xl border border-pastel-coral/25 bg-white p-6 sm:p-8">
                    <div className="flex items-center justify-between border-b border-navy-100 pb-4">
                        <div>
                            <h3 className="flex items-center gap-2 text-base font-black tracking-wider text-navy-900 uppercase sm:text-lg">
                                <Flame className="h-5 w-5 text-pastel-coral fill-pastel-coral/30" />
                                <span>Pengaturan Card Flash Sale Hero</span>
                            </h3>
                            <p className="mt-1 text-xs font-normal text-navy-500">
                                Atur judul promo flash sale, produk unggulan yang ditampilkan, waktu mundur, dan persentase persediaan.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                        <div className="space-y-1.5">
                            <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                Judul Kartu Flash Sale
                            </Label>
                            <Input
                                type="text"
                                placeholder="KEJAR DISKON WARGA"
                                value={data.flashSaleTitle || ''}
                                onChange={(e) => setData('flashSaleTitle', e.target.value)}
                                className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-coral focus-visible:ring-pastel-coral/20 sm:text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                Produk Featured Flash Sale
                            </Label>
                            <select
                                value={data.flashSaleProductId || ''}
                                onChange={(e) => setData('flashSaleProductId', e.target.value)}
                                className="w-full cursor-pointer rounded-xl border border-navy-200/60 bg-white px-3 py-2.5 text-xs font-medium text-navy-800 focus:border-pastel-coral focus:ring-2 focus:ring-pastel-coral/20 focus:outline-none sm:text-sm"
                            >
                                <option value="">-- Pilih Produk Featured (Otomatis) --</option>
                                {products.map((prod) => (
                                    <option key={prod.id} value={prod.id}>
                                        {prod.name} - Rp{prod.price.toLocaleString('id-ID')}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                        <div className="space-y-1.5">
                            <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                Subtitle / Tag Diskon
                            </Label>
                            <Input
                                type="text"
                                placeholder="Diskon Harian"
                                value={data.flashSaleTag || ''}
                                onChange={(e) => setData('flashSaleTag', e.target.value)}
                                className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-coral focus-visible:ring-pastel-coral/20 sm:text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                Durasi Countdown (Jam : Menit)
                            </Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min={0}
                                    max={99}
                                    placeholder="Jam"
                                    value={data.flashSaleHours !== undefined ? data.flashSaleHours : 3}
                                    onChange={(e) => setData('flashSaleHours', Number(e.target.value))}
                                    className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-coral focus-visible:ring-pastel-coral/20 sm:text-sm"
                                />
                                <span className="font-bold text-navy-400">:</span>
                                <Input
                                    type="number"
                                    min={0}
                                    max={59}
                                    placeholder="Menit"
                                    value={data.flashSaleMinutes !== undefined ? data.flashSaleMinutes : 44}
                                    onChange={(e) => setData('flashSaleMinutes', Number(e.target.value))}
                                    className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-coral focus-visible:ring-pastel-coral/20 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                Progress Bar Stok ({data.flashSaleProgress ?? 87}%)
                            </Label>
                            <input
                                type="range"
                                min={5}
                                max={100}
                                value={data.flashSaleProgress ?? 87}
                                onChange={(e) => setData('flashSaleProgress', Number(e.target.value))}
                                className="w-full cursor-pointer accent-pastel-coral"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Hero Promo Slider Management */}
                <div className="shadow-3xs mx-auto max-w-4xl space-y-6 rounded-3xl border border-navy-200/60 bg-white p-6 sm:p-8">
                    <div className="flex items-center justify-between border-b border-navy-100 pb-4">
                        <div>
                            <h3 className="flex items-center gap-2 text-base font-black tracking-wider text-navy-900 uppercase sm:text-lg">
                                <Sliders className="h-5 w-5 text-pastel-teal" />
                                <span>Manajemen Slide Banner Promo Hero ({slides.length})</span>
                            </h3>
                            <p className="mt-1 text-xs font-normal text-navy-500">
                                Tambah, ubah, atau hapus slide banner promosi yang diputar di carousel utama beranda.
                            </p>
                        </div>
                        <Button
                            type="button"
                            onClick={handleAddSlide}
                            className="shadow-3xs flex cursor-pointer items-center gap-1.5 rounded-xl bg-pastel-teal px-3.5 py-2 text-xs font-bold tracking-wider text-white uppercase hover:bg-pastel-teal/90"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Tambah Slide</span>
                        </Button>
                    </div>

                    <div className="space-y-5">
                        {slides.map((slide, idx) => (
                            <div
                                key={slide.id || idx}
                                className="space-y-4 rounded-2xl border border-navy-200/60 bg-navy-50/50 p-4 transition-all hover:border-pastel-teal/40"
                            >
                                <div className="flex items-center justify-between border-b border-navy-200/60 pb-2">
                                    <span className="text-xs font-black tracking-wider text-navy-700 uppercase">
                                        Slide Promo #{idx + 1}
                                    </span>
                                    {slides.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSlide(idx)}
                                            className="flex cursor-pointer items-center gap-1 text-xs font-bold text-pastel-coral hover:underline"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            <span>Hapus Slide</span>
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div className="space-y-1">
                                        <Label className="block text-xs font-bold text-navy-500 uppercase">
                                            Judul Slide
                                        </Label>
                                        <Input
                                            type="text"
                                            value={slide.title}
                                            onChange={(e) => handleUpdateSlide(idx, 'title', e.target.value)}
                                            className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="block text-xs font-bold text-navy-500 uppercase">
                                            Subtitle / Tagline
                                        </Label>
                                        <Input
                                            type="text"
                                            value={slide.tagline}
                                            onChange={(e) => handleUpdateSlide(idx, 'tagline', e.target.value)}
                                            className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div className="space-y-1">
                                        <Label className="block text-xs font-bold text-navy-500 uppercase">
                                            Badge Icon & Teks
                                        </Label>
                                        <Input
                                            type="text"
                                            value={slide.badge}
                                            onChange={(e) => handleUpdateSlide(idx, 'badge', e.target.value)}
                                            className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal"
                                        />
                                    </div>
                                    <div className="space-y-1 sm:col-span-2">
                                        <Label className="block text-xs font-bold text-navy-500 uppercase">
                                            URL Gambar Banner
                                        </Label>
                                        <Input
                                            type="text"
                                            value={slide.image}
                                            onChange={(e) => handleUpdateSlide(idx, 'image', e.target.value)}
                                            className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="block text-xs font-bold text-navy-500 uppercase">
                                        Deskripsi Singkat Banner
                                    </Label>
                                    <textarea
                                        rows={2}
                                        value={slide.description}
                                        onChange={(e) => handleUpdateSlide(idx, 'description', e.target.value)}
                                        className="w-full resize-none rounded-xl border border-navy-200/60 bg-white p-2 text-xs text-navy-800 focus:border-pastel-teal focus:outline-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save Bar */}
                <div className="shadow-3xs mx-auto flex max-w-4xl justify-end rounded-3xl border border-navy-200/60 bg-white p-4">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-pastel-teal px-6 text-xs font-extrabold tracking-widest text-white uppercase shadow-xs transition-all hover:bg-pastel-teal/90 sm:text-sm"
                    >
                        {processing ? (
                            <Spinner />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        <span>
                            {processing
                                ? 'Menyimpan...'
                                : 'Simpan Semua Perubahan Hero & Platform'}
                        </span>
                    </Button>
                </div>
            </form>

            {/* Live Preview Card */}
            <div className="shadow-3xs mx-auto max-w-4xl space-y-4 rounded-3xl border border-navy-200/60 bg-white p-6 sm:p-8">
                <div className="flex items-center gap-2 text-navy-600">
                    <Eye className="h-4.5 w-4.5 text-pastel-teal" />
                    <span className="text-xs font-extrabold tracking-wider uppercase sm:text-sm">
                        Pratinjau Tampilan Header Platform
                    </span>
                </div>

                <div className="relative space-y-3 overflow-hidden rounded-3xl bg-navy-900 p-6 text-white shadow-md sm:p-8">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 animate-pulse rounded-full bg-pastel-teal" />
                        <span className="font-mono text-xs tracking-widest text-navy-300 uppercase">
                            {data.villageName || 'Desa Samirono'}
                        </span>
                    </div>

                    <h4 className="text-xl font-black tracking-tight text-white uppercase sm:text-2xl">
                        {data.appName || 'SAMIRONO ETALASE'}
                    </h4>

                    <p className="text-xs font-extrabold tracking-wider text-pastel-peach uppercase sm:text-sm">
                        {data.tagline || 'Sentra Komoditas Warga'}
                    </p>

                    <p className="max-w-xl text-xs leading-relaxed font-normal text-navy-300 sm:text-sm">
                        {data.description || 'Deskripsi portal...'}
                    </p>
                </div>
            </div>
        </div>
    );
}
