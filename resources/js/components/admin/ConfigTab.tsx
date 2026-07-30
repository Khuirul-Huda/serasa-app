/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Save, CheckCircle2, Eye, Sparkles } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

interface ConfigTabProps {
    data: {
        appName: string;
        tagline: string;
        villageName: string;
        description: string;
        adminPhone: string;
        heroBanner: string;
    };
    setData: (key: string, value: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    processing: boolean;
    saveSuccess: boolean;
}

export default function ConfigTab({
    data,
    setData,
    onSubmit,
    processing,
    saveSuccess,
}: ConfigTabProps) {
    return (
        <div
            className="animate-fade-in space-y-6 font-sans text-navy-900"
            id="admin-config-subtab"
        >
            <div className="shadow-3xs mx-auto max-w-4xl space-y-6 rounded-3xl border border-navy-200/60 bg-white p-6 sm:p-8">
                <div className="flex items-center justify-between border-b border-navy-100 pb-4">
                    <div>
                        <h3 className="text-lg font-extrabold tracking-wider text-navy-900 uppercase">
                            Identitas & Parameter Global Platform
                        </h3>
                        <p className="mt-1 text-xs font-normal text-navy-500 sm:text-sm">
                            Atur judul situs, nomor kontak helpline desa, dan
                            deskripsi publik portal etalase.
                        </p>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-pastel-teal/20 bg-pastel-teal-light text-pastel-teal">
                        <Sparkles className="h-5 w-5" />
                    </div>
                </div>

                <form
                    onSubmit={onSubmit}
                    className="space-y-6 text-xs sm:text-sm"
                >
                    {saveSuccess && (
                        <div className="shadow-3xs flex animate-fade-in items-center gap-2.5 rounded-2xl border border-pastel-teal/20 bg-pastel-teal-light p-4 text-xs font-bold tracking-wider text-pastel-teal uppercase">
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-pastel-teal" />
                            <span>
                                Konfigurasi Platform Berhasil Diperbarui Ke
                                Database!
                            </span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                        <div className="space-y-1.5">
                            <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                Nama Aplikasi Portal
                            </Label>
                            <Input
                                type="text"
                                required
                                value={data.appName}
                                onChange={(e) =>
                                    setData('appName', e.target.value)
                                }
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
                                onChange={(e) =>
                                    setData('villageName', e.target.value)
                                }
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
                                onChange={(e) =>
                                    setData('tagline', e.target.value)
                                }
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
                                onChange={(e) =>
                                    setData('adminPhone', e.target.value)
                                }
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
                            onChange={(e) =>
                                setData('heroBanner', e.target.value)
                            }
                            className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                            Deskripsi Singkat Portal Desa
                        </Label>
                        <textarea
                            rows={3}
                            required
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            className="shadow-3xs w-full resize-none rounded-xl border border-navy-200/60 bg-white px-4 py-2.5 text-xs leading-relaxed font-normal text-navy-800 transition-all focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none sm:text-sm"
                        />
                    </div>

                    <div className="flex justify-end border-t border-navy-100 pt-3">
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
                                    : 'Simpan Perubahan Global'}
                            </span>
                        </Button>
                    </div>
                </form>
            </div>

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
