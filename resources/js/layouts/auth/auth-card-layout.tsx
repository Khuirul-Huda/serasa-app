/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogo from '@/components/app-logo';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-navy-50/40 p-6 md:p-10 font-sans text-navy-900">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 self-center"
                >
                    <AppLogo />
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="rounded-3xl border border-navy-200/60 shadow-3xs bg-white">
                        <CardHeader className="px-8 pt-8 pb-0 text-center space-y-1">
                            <CardTitle className="text-lg font-black uppercase tracking-wider text-navy-900">{title}</CardTitle>
                            <CardDescription className="text-xs text-navy-500">{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 py-6">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
