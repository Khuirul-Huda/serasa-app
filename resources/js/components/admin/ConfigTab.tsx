/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { Save, CheckCircle2, Eye, Sparkles, Flame, Plus, Trash2, Sliders, RotateCcw, AlertTriangle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
    isDirty?: boolean;
    onDiscard?: () => void;
}

export default function ConfigTab({
    data,
    setData,
    products = [],
    onSubmit,
    processing,
    saveSuccess,
    isDirty = false,
    onDiscard,
}: ConfigTabProps) {
    const slides = data.promoSlides || [];
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
            className="animate-fade-in space-y-6 font-sans text-navy-900 dark:text-navy-100 pb-20"
            id="admin-config-subtab"
        >
            <form onSubmit={onSubmit} className="space-y-6 text-xs sm:text-sm">
                {saveSuccess && (
                    <div className="shadow-3xs flex animate-fade-in items-center gap-2.5 rounded-2xl border border-pastel-teal/20 bg-pastel-teal-light p-4 text-xs font-bold tracking-wider text-pastel-teal uppercase dark:bg-navy-950">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-pastel-teal" />
                        <span>
                            Konfigurasi Platform & Hero Flash Sale Berhasil Diperbarui!
                        </span>
                    </div>
                )}

                {/* DUAL COLUMN LAYOUT GRID */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* LEFT COLUMN: Global Branding & Map Coordinates & Preview */}
                    <div className="space-y-6">
                        {/* 1. Global Platform Branding */}
                        <div className="shadow-3xs space-y-6 rounded-3xl border border-navy-200/60 bg-white p-6 dark:border-navy-800 dark:bg-navy-900 sm:p-8">
                            <div className="flex items-center justify-between border-b border-navy-100 pb-4 dark:border-navy-800">
                                <div>
                                    <h3 className="text-base font-black tracking-wider text-navy-900 uppercase dark:text-white sm:text-lg">
                                        Identitas & Parameter Global Platform
                                    </h3>
                                    <p className="mt-1 text-xs font-normal text-navy-500 dark:text-navy-400">
                                        Atur judul portal, nama desa, kontak helpline admin, dan deskripsi publik.
                                    </p>
                                </div>
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-pastel-teal/20 bg-pastel-teal-light text-pastel-teal dark:bg-navy-950">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                                <div className="space-y-1.5">
                                    <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase dark:text-navy-400">
                                        Nama Aplikasi Portal
                                    </Label>
                                    <Input
                                        type="text"
                                        required
                                        value={data.appName}
                                        onChange={(e) => setData('appName', e.target.value)}
                                        className="rounded-xl border-navy-200/60 bg-navy-50/50 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100 sm:text-sm"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase dark:text-navy-400">
                                        Nama Wilayah Desa
                                    </Label>
                                    <Input
                                        type="text"
                                        required
                                        value={data.villageName}
                                        onChange={(e) => setData('villageName', e.target.value)}
                                        className="rounded-xl border-navy-200/60 bg-navy-50/50 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                                <div className="space-y-1.5">
                                    <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase dark:text-navy-400">
                                        Slogan / Tagline Portal
                                    </Label>
                                    <Input
                                        type="text"
                                        required
                                        value={data.tagline}
                                        onChange={(e) => setData('tagline', e.target.value)}
                                        className="rounded-xl border-navy-200/60 bg-navy-50/50 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100 sm:text-sm"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase dark:text-navy-400">
                                        No. WA Helpline Admin Desa
                                    </Label>
                                    <Input
                                        type="text"
                                        required
                                        placeholder="6285725900000"
                                        value={data.adminPhone}
                                        onChange={(e) => setData('adminPhone', e.target.value)}
                                        className="rounded-xl border-navy-200/60 bg-navy-50/50 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase dark:text-navy-400">
                                    URL Banner Utama (Hero Banner)
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    value={data.heroBanner}
                                    onChange={(e) => setData('heroBanner', e.target.value)}
                                    className="rounded-xl border-navy-200/60 bg-navy-50/50 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100 sm:text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                                <div className="space-y-1.5">
                                    <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase dark:text-navy-400">
                                        Nama Kecamatan
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Kecamatan Getasan"
                                        value={data.kecamatanName || ''}
                                        onChange={(e) => setData('kecamatanName', e.target.value)}
                                        className="rounded-xl border-navy-200/60 bg-navy-50/50 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100 sm:text-sm"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase dark:text-navy-400">
                                        Nama Kabupaten / Kota
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Kabupaten Semarang"
                                        value={data.kabupatenName || ''}
                                        onChange={(e) => setData('kabupatenName', e.target.value)}
                                        className="rounded-xl border-navy-200/60 bg-navy-50/50 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                                <div className="space-y-1.5">
                                    <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase dark:text-navy-400">
                                        Lat Peta Desa
                                    </Label>
                                    <Input
                                        type="number"
                                        step="any"
                                        placeholder="-7.371239"
                                        value={data.mapCenterLat !== undefined ? data.mapCenterLat : -7.371239}
                                        onChange={(e) => setData('mapCenterLat', Number(e.target.value))}
                                        className="rounded-xl border-navy-200/60 bg-navy-50/50 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100 sm:text-sm"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase dark:text-navy-400">
                                        Lng Peta Desa
                                    </Label>
                                    <Input
                                        type="number"
                                        step="any"
                                        placeholder="110.456123"
                                        value={data.mapCenterLng !== undefined ? data.mapCenterLng : 110.456123}
                                        onChange={(e) => setData('mapCenterLng', Number(e.target.value))}
                                        className="rounded-xl border-navy-200/60 bg-navy-50/50 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100 sm:text-sm"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase dark:text-navy-400">
                                        Zoom Peta
                                    </Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={20}
                                        placeholder="14"
                                        value={data.mapZoom !== undefined ? data.mapZoom : 14}
                                        onChange={(e) => setData('mapZoom', Number(e.target.value))}
                                        className="rounded-xl border-navy-200/60 bg-navy-50/50 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase dark:text-navy-400">
                                    Teks Hak Cipta & Kredit Footer
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="© 2026 TIM KKN UNNES GIAT 16 DESA SAMIRONO"
                                    value={data.footerCredits || ''}
                                    onChange={(e) => setData('footerCredits', e.target.value)}
                                    className="rounded-xl border-navy-200/60 bg-navy-50/50 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Live Preview Card */}
                        <div className="shadow-3xs space-y-4 rounded-3xl border border-navy-200/60 bg-white p-6 dark:border-navy-800 dark:bg-navy-900 sm:p-8">
                            <div className="flex items-center gap-2 text-navy-600 dark:text-navy-300">
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

                    {/* RIGHT COLUMN: Flash Sale & Promo Slider */}
                    <div className="space-y-6">
                        {/* 2. Hero Flash Sale Card Configuration */}
                        <div className="shadow-3xs space-y-6 rounded-3xl border border-pastel-coral/25 bg-white p-6 dark:border-navy-800 dark:bg-navy-900 sm:p-8">
                            <div className="flex items-center justify-between border-b border-navy-100 pb-4 dark:border-navy-800">
                                <div>
                                    <h3 className="flex items-center gap-2 text-base font-black tracking-wider text-navy-900 uppercase dark:text-white sm:text-lg">
                                        <Flame className="h-5 w-5 text-pastel-coral fill-pastel-coral/30" />
                                        <span>Pengaturan Card Flash Sale Hero</span>
                                    </h3>
                                    <p className="mt-1 text-xs font-normal text-navy-500 dark:text-navy-400">
                                        Atur judul promo flash sale, produk unggulan, waktu mundur, dan stok.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                                <div className="space-y-1.5">
                                    <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase dark:text-navy-400">
                                        Judul Kartu Flash Sale
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="KEJAR DISKON WARGA"
                                        value={data.flashSaleTitle || ''}
                                        onChange={(e) => setData('flashSaleTitle', e.target.value)}
                                        className="rounded-xl border-navy-200/60 bg-navy-50/50 text-xs focus-visible:border-pastel-coral focus-visible:ring-pastel-coral/20 dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100 sm:text-sm"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase dark:text-navy-400">
                                        Produk Featured Flash Sale
                                    </Label>
                                    <select
                                        value={data.flashSaleProductId || ''}
                                        onChange={(e) => setData('flashSaleProductId', e.target.value)}
                                        className="w-full cursor-pointer rounded-xl border border-navy-200/60 bg-navy-50/50 px-3 py-2.5 text-xs font-medium text-navy-800 focus:border-pastel-coral focus:ring-2 focus:ring-pastel-coral/20 focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100 sm:text-sm"
                                    >
                                        <option value="">-- Pilih Produk Featured --</option>
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
                                    <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase dark:text-navy-400">
                                        Tag Diskon
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Diskon Harian"
                                        value={data.flashSaleTag || ''}
                                        onChange={(e) => setData('flashSaleTag', e.target.value)}
                                        className="rounded-xl border-navy-200/60 bg-navy-50/50 text-xs focus-visible:border-pastel-coral focus-visible:ring-pastel-coral/20 dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100 sm:text-sm"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase dark:text-navy-400">
                                        Countdown (Jam : Menit)
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min={0}
                                            max={99}
                                            placeholder="Jam"
                                            value={data.flashSaleHours !== undefined ? data.flashSaleHours : 3}
                                            onChange={(e) => setData('flashSaleHours', Number(e.target.value))}
                                            className="rounded-xl border-navy-200/60 bg-navy-50/50 text-xs focus-visible:border-pastel-coral focus-visible:ring-pastel-coral/20 dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100 sm:text-sm"
                                        />
                                        <span className="font-bold text-navy-400">:</span>
                                        <Input
                                            type="number"
                                            min={0}
                                            max={59}
                                            placeholder="Menit"
                                            value={data.flashSaleMinutes !== undefined ? data.flashSaleMinutes : 44}
                                            onChange={(e) => setData('flashSaleMinutes', Number(e.target.value))}
                                            className="rounded-xl border-navy-200/60 bg-navy-50/50 text-xs focus-visible:border-pastel-coral focus-visible:ring-pastel-coral/20 dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase dark:text-navy-400">
                                        Progress Stok ({data.flashSaleProgress ?? 87}%)
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
                        <div className="shadow-3xs space-y-6 rounded-3xl border border-navy-200/60 bg-white p-6 dark:border-navy-800 dark:bg-navy-900 sm:p-8">
                            <div className="flex items-center justify-between border-b border-navy-100 pb-4 dark:border-navy-800">
                                <div>
                                    <h3 className="flex items-center gap-2 text-base font-black tracking-wider text-navy-900 uppercase dark:text-white sm:text-lg">
                                        <Sliders className="h-5 w-5 text-pastel-teal" />
                                        <span>Slide Banner Promo Hero ({slides.length})</span>
                                    </h3>
                                    <p className="mt-1 text-xs font-normal text-navy-500 dark:text-navy-400">
                                        Tambah & kelola slide banner promosi carousel utama.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleAddSlide}
                                    className="shadow-3xs flex cursor-pointer items-center gap-1.5 rounded-xl bg-pastel-teal px-3.5 py-2 text-xs font-bold tracking-wider text-white uppercase hover:bg-pastel-teal/90"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Tambah</span>
                                </Button>
                            </div>

                            <div className="space-y-5">
                                {slides.map((slide, idx) => (
                                    <div
                                        key={slide.id || idx}
                                        className="space-y-4 rounded-2xl border border-navy-200/60 bg-navy-50/50 p-4 transition-all hover:border-pastel-teal/40 dark:border-navy-800 dark:bg-navy-950"
                                    >
                                        <div className="flex items-center justify-between border-b border-navy-200/60 pb-2 dark:border-navy-800">
                                            <span className="text-xs font-black tracking-wider text-navy-700 uppercase dark:text-navy-300">
                                                Slide Promo #{idx + 1}
                                            </span>
                                            {slides.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSlide(idx)}
                                                    className="flex cursor-pointer items-center gap-1 text-xs font-bold text-pastel-coral hover:underline"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    <span>Hapus</span>
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <div className="space-y-1">
                                                <Label className="block text-xs font-bold text-navy-500 uppercase dark:text-navy-400">
                                                    Judul Slide
                                                </Label>
                                                <Input
                                                    type="text"
                                                    value={slide.title}
                                                    onChange={(e) => handleUpdateSlide(idx, 'title', e.target.value)}
                                                    className="rounded-xl border-navy-200/60 bg-white text-xs focus-visible:border-pastel-teal dark:border-navy-700 dark:bg-navy-900 dark:text-navy-100"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="block text-xs font-bold text-navy-500 uppercase dark:text-navy-400">
                                                    Subtitle / Tagline
                                                </Label>
                                                <Input
                                                    type="text"
                                                    value={slide.tagline}
                                                    onChange={(e) => handleUpdateSlide(idx, 'tagline', e.target.value)}
                                                    className="rounded-xl border-navy-200/60 bg-white text-xs focus-visible:border-pastel-teal dark:border-navy-700 dark:bg-navy-900 dark:text-navy-100"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                            <div className="space-y-1">
                                                <Label className="block text-xs font-bold text-navy-500 uppercase dark:text-navy-400">
                                                    Badge Icon & Teks
                                                </Label>
                                                <Input
                                                    type="text"
                                                    value={slide.badge}
                                                    onChange={(e) => handleUpdateSlide(idx, 'badge', e.target.value)}
                                                    className="rounded-xl border-navy-200/60 bg-white text-xs focus-visible:border-pastel-teal dark:border-navy-700 dark:bg-navy-900 dark:text-navy-100"
                                                />
                                            </div>
                                            <div className="space-y-1 sm:col-span-2">
                                                <Label className="block text-xs font-bold text-navy-500 uppercase dark:text-navy-400">
                                                    URL Gambar Banner
                                                </Label>
                                                <Input
                                                    type="text"
                                                    value={slide.image}
                                                    onChange={(e) => handleUpdateSlide(idx, 'image', e.target.value)}
                                                    className="rounded-xl border-navy-200/60 bg-white text-xs focus-visible:border-pastel-teal dark:border-navy-700 dark:bg-navy-900 dark:text-navy-100"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="block text-xs font-bold text-navy-500 uppercase dark:text-navy-400">
                                                Deskripsi Singkat Banner
                                            </Label>
                                            <textarea
                                                rows={2}
                                                value={slide.description}
                                                onChange={(e) => handleUpdateSlide(idx, 'description', e.target.value)}
                                                className="w-full resize-none rounded-xl border border-navy-200/60 bg-white p-2 text-xs text-navy-800 focus:border-pastel-teal focus:outline-none dark:border-navy-700 dark:bg-navy-900 dark:text-navy-100"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </form>

            {/* FLOATING FIXED ACTION BAR PORTAL (Appears when forms are changed / dirty) */}
            {isDirty && mounted && createPortal(
                <div className="fixed bottom-6 left-1/2 z-[9999] w-[92%] max-w-2xl -translate-x-1/2 animate-fade-in font-sans text-navy-900 dark:text-navy-100">
                    <div className="flex flex-col items-center justify-between gap-3 rounded-3xl border border-navy-700/80 bg-navy-900/95 p-4 pl-5 text-white shadow-2xl backdrop-blur-md dark:border-navy-700 dark:bg-navy-950/95 sm:flex-row">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-pastel-coral/20 text-pastel-coral">
                                <AlertTriangle className="h-5 w-5 animate-bounce" />
                            </div>
                            <div>
                                <span className="block text-xs font-black tracking-wider text-white uppercase sm:text-sm">
                                    Ada Perubahan Konfigurasi!
                                </span>
                                <span className="block text-[11px] font-medium text-navy-300">
                                    Simpan atau batalkan perubahan sebelum berpindah halaman.
                                </span>
                            </div>
                        </div>

                        <div className="flex w-full items-center justify-end gap-2.5 sm:w-auto">
                            {onDiscard && (
                                <button
                                    type="button"
                                    onClick={onDiscard}
                                    disabled={processing}
                                    className="flex h-10 cursor-pointer items-center gap-1.5 rounded-2xl border border-white/20 bg-white/10 px-4 text-xs font-bold text-navy-100 transition-all hover:bg-white/20 disabled:opacity-50"
                                >
                                    <RotateCcw className="h-3.5 w-3.5 text-pastel-coral" />
                                    <span>Batalkan Perubahan</span>
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={onSubmit}
                                disabled={processing}
                                className="flex h-10 cursor-pointer items-center gap-2 rounded-2xl bg-pastel-teal px-5 text-xs font-black tracking-wider text-white uppercase shadow-md transition-all hover:bg-pastel-teal/90 disabled:opacity-50"
                            >
                                {processing ? (
                                    <Spinner />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                <span>{processing ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
