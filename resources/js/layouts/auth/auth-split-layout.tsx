/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, usePage } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { settings } = usePage().props as any;
    const appName = settings?.appName || 'Etalase UMKM Digital';
    const villageName = settings?.villageName || 'Desa Samirono';

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0 font-sans text-navy-900 bg-navy-50/40">
            <div className="relative hidden h-full flex-col bg-navy-900 p-10 text-white lg:flex border-r border-navy-800 justify-between">
                <Link
                    href="/"
                    className="relative z-20 flex items-center"
                >
                    <AppLogo />
                </Link>

                <div className="relative z-20 space-y-2">
                    <span className="text-xs font-black uppercase tracking-widest text-pastel-peach">
                        {appName}
                    </span>
                    <h2 className="text-2xl font-black tracking-tight text-white leading-snug">
                        Mendikdayakan Pelaku UMKM & Produk Kreatif {villageName}
                    </h2>
                    <p className="text-xs text-navy-300 leading-relaxed font-normal">
                        Hubungkan usaha Anda ke pasar eksternal secara digital.
                    </p>
                </div>

                <div className="text-[10px] text-navy-400 font-mono uppercase">
                    © {new Date().getFullYear()} {appName} - {villageName}
                </div>
            </div>

            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[360px] bg-white p-8 rounded-3xl border border-navy-200/60 shadow-3xs">
                    <Link
                        href="/"
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                        <AppLogo />
                    </Link>
                    <div className="flex flex-col items-start gap-1 text-left sm:items-center sm:text-center">
                        <h1 className="text-base font-black uppercase tracking-wider text-navy-900">{title}</h1>
                        <p className="text-xs text-navy-500">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
