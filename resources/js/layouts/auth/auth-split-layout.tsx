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
        <div className="relative grid h-dvh flex-col items-center justify-center bg-navy-50/40 px-8 font-sans text-navy-900 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col justify-between border-r border-navy-800 bg-navy-900 p-10 text-white lg:flex">
                <Link href="/" className="relative z-20 flex items-center">
                    <AppLogo />
                </Link>

                <div className="relative z-20 space-y-2">
                    <span className="text-xs font-black tracking-widest text-pastel-peach uppercase">
                        {appName}
                    </span>
                    <h2 className="text-2xl leading-snug font-black tracking-tight text-white">
                        Mendikdayakan Pelaku UMKM & Produk Kreatif {villageName}
                    </h2>
                    <p className="text-xs leading-relaxed font-normal text-navy-300">
                        Hubungkan usaha Anda ke pasar eksternal secara digital.
                    </p>
                </div>

                <div className="font-mono text-[10px] text-navy-400 uppercase">
                    © {new Date().getFullYear()} {appName} - {villageName}
                </div>
            </div>

            <div className="w-full lg:p-8">
                <div className="shadow-3xs mx-auto flex w-full flex-col justify-center space-y-6 rounded-3xl border border-navy-200/60 bg-white p-8 sm:w-[360px]">
                    <Link
                        href="/"
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                        <AppLogo />
                    </Link>
                    <div className="flex flex-col items-start gap-1 text-left sm:items-center sm:text-center">
                        <h1 className="text-base font-black tracking-wider text-navy-900 uppercase">
                            {title}
                        </h1>
                        <p className="text-xs text-navy-500">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
