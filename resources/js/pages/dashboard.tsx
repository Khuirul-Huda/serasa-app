/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Head, Link, usePage } from '@inertiajs/react';
import { Store, ShieldCheck, ShoppingBag, ArrowRight, UserCheck, Key, Settings, Clock } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';

export default function Dashboard() {
    const { auth } = usePage().props as any;
    const user = auth?.user;

    return (
        <AppLayout>
            <Head title="Pusat Kendali Portal Desa" />

            <div className="mx-auto max-w-5xl animate-fade-in space-y-6 p-6 font-sans text-navy-900">
                {/* Header Welcome Box */}
                <div className="shadow-3xs space-y-2 rounded-3xl border border-navy-200/60 bg-white p-6">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pastel-teal font-bold text-white">
                            S
                        </div>
                        <span className="text-xs font-black tracking-wider text-pastel-teal uppercase">
                            Pusat Kendali Akun Warga
                        </span>
                    </div>
                    <h1 className="text-xl font-black text-navy-900 sm:text-2xl">
                        Selamat Datang, {user?.name || 'Mitra Samirono'}!
                    </h1>
                    <p className="max-w-xl text-xs leading-relaxed font-normal text-navy-500">
                        Anda terhubung sebagai{' '}
                        <strong className="font-bold text-navy-800 uppercase">
                            {user?.role || 'pengguna'}
                        </strong>
                        . Kelola akun dan akses panel manajemen UMKM Anda di bawah ini.
                    </p>
                </div>

                {/* Account Summary Stats Row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-3.5 rounded-2xl border border-navy-200/60 bg-white p-4 shadow-2xs">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pastel-teal-light text-pastel-teal">
                            <UserCheck className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="block text-[11px] font-bold text-navy-400">Pengguna Terdaftar</span>
                            <span className="truncate block text-sm font-black text-navy-900">{user?.name}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 rounded-2xl border border-navy-200/60 bg-white p-4 shadow-2xs">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pastel-peach-light text-pastel-peach">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="block text-[11px] font-bold text-navy-400">Hak Akses</span>
                            <span className="truncate block text-sm font-black text-navy-900 uppercase">{user?.role || 'User'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 rounded-2xl border border-navy-200/60 bg-white p-4 shadow-2xs">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pastel-lavender-light text-pastel-lavender">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="block text-[11px] font-bold text-navy-400">Email Akun</span>
                            <span className="truncate block text-xs font-bold text-navy-800">{user?.email}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Navigation Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {user?.role === 'admin' ? (
                        <Link
                            href="/admin/dashboard"
                            className="shadow-3xs group flex flex-col justify-between space-y-4 rounded-3xl border border-navy-200/60 bg-white p-6 transition-all hover:border-pastel-peach"
                        >
                            <div className="space-y-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-pastel-peach/30 bg-pastel-peach-light text-navy-900">
                                    <ShieldCheck className="h-5 w-5 text-pastel-peach" />
                                </div>
                                <h2 className="text-base font-extrabold tracking-wider text-navy-900 uppercase transition-colors group-hover:text-pastel-peach">
                                    Panel Moderasi Admin Desa
                                </h2>
                                <p className="text-xs leading-relaxed font-normal text-navy-500">
                                    Verifikasi toko UMKM baru, atur konfigurasi
                                    portal, dan impor data spreadsheet massal.
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-navy-800 uppercase transition-transform group-hover:translate-x-1">
                                <span>Buka Panel Admin</span>
                                <ArrowRight className="h-4 w-4 text-pastel-peach" />
                            </div>
                        </Link>
                    ) : (
                        <Link
                            href="/merchant/dashboard"
                            className="shadow-3xs group flex flex-col justify-between space-y-4 rounded-3xl border border-navy-200/60 bg-white p-6 transition-all hover:border-pastel-teal"
                        >
                            <div className="space-y-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-pastel-teal/20 bg-pastel-teal-light text-pastel-teal">
                                    <Store className="h-5 w-5" />
                                </div>
                                <h2 className="text-base font-extrabold tracking-wider text-navy-900 uppercase transition-colors group-hover:text-pastel-teal">
                                    Kelola Toko & Produk Saya
                                </h2>
                                <p className="text-xs leading-relaxed font-normal text-navy-500">
                                    Unggah foto produk baru, atur ketersediaan
                                    stok, dan ubah profil toko digital Anda.
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-pastel-teal uppercase transition-transform group-hover:translate-x-1">
                                <span>Buka Kelola Toko</span>
                                <ArrowRight className="h-4 w-4" />
                            </div>
                        </Link>
                    )}

                    <Link
                        href="/"
                        className="shadow-3xs group flex flex-col justify-between space-y-4 rounded-3xl border border-navy-200/60 bg-white p-6 transition-all hover:border-pastel-teal"
                    >
                        <div className="space-y-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-navy-200 bg-navy-100 text-navy-700">
                                <ShoppingBag className="h-5 w-5 text-pastel-teal" />
                            </div>
                            <h2 className="text-base font-extrabold tracking-wider text-navy-900 uppercase transition-colors group-hover:text-pastel-teal">
                                Jelajahi Etalase Warga
                            </h2>
                            <p className="text-xs leading-relaxed font-normal text-navy-500">
                                Lihat produk unggulan Desa Samirono mulai dari
                                susu segar, keju, hingga anyaman bambu.
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-navy-700 uppercase transition-transform group-hover:translate-x-1">
                            <span>Buka Katalog Utama</span>
                            <ArrowRight className="h-4 w-4 text-pastel-teal" />
                        </div>
                    </Link>
                </div>

                {/* Account Settings Shortcut Box */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-navy-200/60 bg-white p-5 shadow-2xs">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-100 text-navy-700">
                            <Settings className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-navy-900">Pengaturan Akun & Keamanan</h3>
                            <p className="text-xs text-navy-500">Ubah nama, email, atau perbarui kata sandi akun Anda.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/settings/profile"
                            className="rounded-xl border border-navy-200 px-4 py-2 text-xs font-bold text-navy-700 transition-all hover:border-pastel-teal hover:text-pastel-teal"
                        >
                            Profil
                        </Link>
                        <Link
                            href="/settings/password"
                            className="rounded-xl border border-navy-200 px-4 py-2 text-xs font-bold text-navy-700 transition-all hover:border-pastel-teal hover:text-pastel-teal"
                        >
                            Kata Sandi
                        </Link>
                    </div>
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
