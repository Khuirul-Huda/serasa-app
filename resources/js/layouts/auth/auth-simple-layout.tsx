/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-navy-50/70 p-4 font-sans text-navy-900 sm:p-6 md:p-10">
            {/* Ambient Background Decorative Glows */}
            <div
                className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-pastel-teal/15 blur-3xl"
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-pastel-peach/15 blur-3xl"
                aria-hidden="true"
            />

            <div className="relative z-10 w-full max-w-md">
                <div className="shadow-md flex flex-col gap-6 rounded-3xl border border-navy-200/80 bg-white/95 p-6 backdrop-blur-md sm:p-8">
                    <div className="flex flex-col items-center gap-3">
                        <Link
                            href="/"
                            className="flex flex-col items-center gap-2 transition-transform duration-200 hover:scale-105"
                        >
                            <AppLogo />
                        </Link>

                        {(title || description) && (
                            <div className="space-y-1 pt-1 text-center">
                                {title && (
                                    <h1 className="text-base font-black tracking-wider text-navy-900 uppercase">
                                        {title}
                                    </h1>
                                )}
                                {description && (
                                    <p className="text-center text-xs font-medium leading-relaxed text-navy-500">
                                        {description}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    {children}
                </div>

                <div className="mt-5 text-center text-xs text-navy-400">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 font-bold text-navy-500 transition-colors hover:text-pastel-teal"
                    >
                        <span>← Kembali ke Beranda Etalase</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
