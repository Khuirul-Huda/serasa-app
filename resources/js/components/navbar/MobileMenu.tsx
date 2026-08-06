import { Link, usePage, router } from '@inertiajs/react';
import { Store, ShoppingBag, MapPin, Newspaper } from 'lucide-react';
import React from 'react';
import type { AppSettings } from '@/types';

interface MobileMenuProps {
    activeTab: string;
    isOpen?: boolean;
    settings?: AppSettings;
    user?: { name: string; role: string } | null;
    onClose: () => void;
}

export default function MobileMenu({
    activeTab,
    isOpen = true,
    user,
    onClose,
}: MobileMenuProps) {
    const { auth } = usePage().props as any;
    const currentUser = user || auth?.user;

    if (!isOpen) {
        return null;
    }

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div
            className="animate-fade-in border-t border-navy-200 bg-white shadow-lg lg:hidden dark:border-navy-800 dark:bg-navy-900/95 dark:shadow-2xl"
            id="mobile-menu-content"
        >
            <div className="space-y-1 px-3 pt-2 pb-4">
                <div className="px-4 py-2 text-[10px] font-bold tracking-wider text-navy-400 uppercase dark:text-navy-500">
                    Navigasi Halaman
                </div>

                <Link
                    href="/"
                    onClick={onClose}
                    prefetch="hover"
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-bold tracking-wider uppercase transition-all ${
                        activeTab === 'katalog'
                            ? 'border border-pastel-teal/15 bg-pastel-teal-light font-extrabold text-pastel-teal dark:border-navy-700 dark:bg-navy-800 dark:text-pastel-teal'
                            : 'text-navy-600 hover:bg-navy-50 dark:text-navy-200 dark:hover:bg-navy-800'
                    }`}
                >
                    <ShoppingBag className="h-4 w-4 text-pastel-teal" />
                    <span>Seluruh Etalase</span>
                </Link>

                <Link
                    href="/shops"
                    onClick={onClose}
                    prefetch="hover"
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-bold tracking-wider uppercase transition-all ${
                        activeTab === 'shops'
                            ? 'border border-pastel-teal/15 bg-pastel-teal-light font-extrabold text-pastel-teal dark:border-navy-700 dark:bg-navy-800 dark:text-pastel-teal'
                            : 'text-navy-600 hover:bg-navy-50 dark:text-navy-200 dark:hover:bg-navy-800'
                    }`}
                >
                    <Store className="h-4 w-4 text-pastel-teal" />
                    <span>Daftar UMKM Warga</span>
                </Link>

                <Link
                    href="/map"
                    onClick={onClose}
                    prefetch="hover"
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-bold tracking-wider uppercase transition-all ${
                        activeTab === 'map'
                            ? 'border border-pastel-teal/15 bg-pastel-teal-light font-extrabold text-pastel-teal dark:border-navy-700 dark:bg-navy-800 dark:text-pastel-teal'
                            : 'text-navy-600 hover:bg-navy-50 dark:text-navy-200 dark:hover:bg-navy-800'
                    }`}
                >
                    <MapPin className="h-4 w-4 text-pastel-teal" />
                    <span>Peta Geografis Desa</span>
                </Link>

                <Link
                    href="/articles"
                    onClick={onClose}
                    prefetch="hover"
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-bold tracking-wider uppercase transition-all ${
                        activeTab === 'articles' || activeTab === 'detail'
                            ? 'border border-pastel-teal/15 bg-pastel-teal-light font-extrabold text-pastel-teal dark:border-navy-700 dark:bg-navy-800 dark:text-pastel-teal'
                            : 'text-navy-600 hover:bg-navy-50 dark:text-navy-200 dark:hover:bg-navy-800'
                    }`}
                >
                    <Newspaper className="h-4 w-4 text-pastel-teal" />
                    <span>Kabar & Artikel Desa</span>
                </Link>

                <div className="my-2 border-t border-navy-100 dark:border-navy-800" />

                {currentUser ? (
                    <div className="space-y-1">
                        <div className="px-4 py-1 text-[10px] font-bold tracking-wider text-navy-400 uppercase dark:text-navy-500">
                            Akun: {currentUser.name}
                        </div>
                        {currentUser.role === 'admin' ? (
                            <Link
                                href="/admin/dashboard"
                                onClick={onClose}
                                className="block w-full rounded-xl bg-pastel-peach py-2.5 text-center text-xs font-bold tracking-wider text-navy-900 uppercase hover:bg-pastel-peach/90"
                            >
                                Panel Admin Desa
                            </Link>
                        ) : (
                            <Link
                                href="/merchant/dashboard"
                                onClick={onClose}
                                className="block w-full rounded-xl bg-pastel-teal py-2.5 text-center text-xs font-bold tracking-wider text-white uppercase hover:bg-pastel-teal/90"
                            >
                                Kelola Toko Saya
                            </Link>
                        )}
                        <form onSubmit={handleLogout} className="px-1 pt-1">
                            <button
                                type="submit"
                                className="w-full cursor-pointer rounded-xl bg-pastel-coral-light py-2.5 text-center text-xs font-bold tracking-wider text-pastel-coral uppercase hover:bg-pastel-coral/20 dark:bg-navy-800 dark:text-pastel-coral"
                            >
                                Keluar
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-2 px-1 py-2">
                        <Link
                            href="/login"
                            onClick={onClose}
                            className="block w-full rounded-xl border border-navy-200 py-2.5 text-center text-xs font-bold tracking-wider text-navy-600 uppercase hover:bg-navy-50 dark:border-navy-700 dark:text-navy-200 dark:hover:bg-navy-800"
                        >
                            Masuk
                        </Link>
                        <Link
                            href="/register"
                            onClick={onClose}
                            className="block w-full rounded-xl bg-pastel-coral py-2.5 text-center text-xs font-bold tracking-wider text-white uppercase hover:bg-pastel-coral/90"
                        >
                            Daftar Akun Baru
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
