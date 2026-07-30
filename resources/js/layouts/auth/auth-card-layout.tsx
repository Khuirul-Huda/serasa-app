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
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-navy-50/40 p-6 font-sans text-navy-900 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link href="/" className="flex items-center gap-2 self-center">
                    <AppLogo />
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="shadow-3xs rounded-3xl border border-navy-200/60 bg-white">
                        <CardHeader className="space-y-1 px-8 pt-8 pb-0 text-center">
                            <CardTitle className="text-lg font-black tracking-wider text-navy-900 uppercase">
                                {title}
                            </CardTitle>
                            <CardDescription className="text-xs text-navy-500">
                                {description}
                            </CardDescription>
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
