/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Head, Link, usePage } from '@inertiajs/react';
import { Store, ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';

export default function Dashboard() {
    const { auth } = usePage().props as any;
    const user = auth?.user;

    return (
        <AppLayout>
            <Head title="Pusat Kendali - SAMIRONO ETALASE" />
            
            <div className="max-w-5xl mx-auto p-6 space-y-6 font-sans text-navy-900 animate-fade-in">
                {/* Header Welcome Box */}
                <div className="bg-white rounded-3xl border border-navy-200/60 p-6 shadow-3xs space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-pastel-teal text-white flex items-center justify-center font-bold">
                            S
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider text-pastel-teal">
                            Pusat Kendali Akun Warga
                        </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-navy-900">
                        Selamat Datang, {user?.name || 'Mitra Samirono'}!
                    </h1>
                    <p className="text-xs text-navy-500 max-w-xl leading-relaxed font-normal">
                        Anda terhubung sebagai <strong className="font-bold text-navy-800 uppercase">{user?.role || 'pengguna'}</strong>. Akses panel manajemen UMKM Anda di bawah ini.
                    </p>
                </div>

                {/* Quick Navigation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user?.role === 'admin' ? (
                        <Link
                            href="/admin/dashboard"
                            className="bg-white rounded-3xl border border-navy-200/60 p-6 shadow-3xs hover:border-pastel-peach transition-all group flex flex-col justify-between space-y-4"
                        >
                            <div className="space-y-2">
                                <div className="w-10 h-10 rounded-2xl bg-pastel-peach-light text-navy-900 flex items-center justify-center border border-pastel-peach/30">
                                    <ShieldCheck className="w-5 h-5 text-pastel-peach" />
                                </div>
                                <h2 className="text-base font-extrabold text-navy-900 group-hover:text-pastel-peach transition-colors uppercase tracking-wider">
                                    Panel Moderasi Admin Desa
                                </h2>
                                <p className="text-xs text-navy-500 font-normal leading-relaxed">
                                    Verifikasi toko UMKM baru, atur konfigurasi portal, dan impor data spreadsheet massal.
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-navy-800 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                                <span>Buka Panel Admin</span>
                                <ArrowRight className="w-4 h-4 text-pastel-peach" />
                            </div>
                        </Link>
                    ) : (
                        <Link
                            href="/merchant/dashboard"
                            className="bg-white rounded-3xl border border-navy-200/60 p-6 shadow-3xs hover:border-pastel-teal transition-all group flex flex-col justify-between space-y-4"
                        >
                            <div className="space-y-2">
                                <div className="w-10 h-10 rounded-2xl bg-pastel-teal-light text-pastel-teal flex items-center justify-center border border-pastel-teal/20">
                                    <Store className="w-5 h-5" />
                                </div>
                                <h2 className="text-base font-extrabold text-navy-900 group-hover:text-pastel-teal transition-colors uppercase tracking-wider">
                                    Kelola Toko & Produk Saya
                                </h2>
                                <p className="text-xs text-navy-500 font-normal leading-relaxed">
                                    Unggah foto produk baru, atur ketersediaan stok, dan ubah profil toko digital Anda.
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-pastel-teal uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                                <span>Buka Kelola Toko</span>
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    )}

                    <Link
                        href="/"
                        className="bg-white rounded-3xl border border-navy-200/60 p-6 shadow-3xs hover:border-pastel-teal transition-all group flex flex-col justify-between space-y-4"
                    >
                        <div className="space-y-2">
                            <div className="w-10 h-10 rounded-2xl bg-navy-100 text-navy-700 flex items-center justify-center border border-navy-200">
                                <ShoppingBag className="w-5 h-5 text-pastel-teal" />
                            </div>
                            <h2 className="text-base font-extrabold text-navy-900 group-hover:text-pastel-teal transition-colors uppercase tracking-wider">
                                Jelajahi Etalase Warga
                            </h2>
                            <p className="text-xs text-navy-500 font-normal leading-relaxed">
                                Lihat produk unggulan Desa Samirono mulai dari susu segar, keju, hingga anyaman bambu.
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-navy-700 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                            <span>Buka Katalog Utama</span>
                            <ArrowRight className="w-4 h-4 text-pastel-teal" />
                        </div>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Pusat Kendali',
            href: dashboard(),
        },
    ],
};
