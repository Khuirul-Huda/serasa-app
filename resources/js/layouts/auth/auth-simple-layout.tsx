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
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-navy-50/40 p-6 font-sans text-navy-900 md:p-10">
            <div className="w-full max-w-sm">
                <div className="shadow-3xs flex flex-col gap-6 rounded-3xl border border-navy-200/60 bg-white p-8">
                    <div className="flex flex-col items-center gap-3">
                        <Link
                            href="/"
                            className="flex flex-col items-center gap-2"
                        >
                            <AppLogo />
                        </Link>

                        <div className="space-y-1 pt-2 text-center">
                            <h1 className="text-base font-extrabold tracking-wider text-navy-900 uppercase">
                                {title}
                            </h1>
                            <p className="text-center text-xs text-navy-500">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
