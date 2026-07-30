/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import React from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Lupa Sandi" />

            {status && (
                <div className="mb-4 rounded-xl border border-pastel-teal/20 bg-pastel-teal-light p-3 text-center text-xs font-semibold text-pastel-teal">
                    {status}
                </div>
            )}

            <div className="space-y-6 font-sans text-navy-900">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-4 text-xs sm:text-sm">
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="email"
                                        className="block text-xs font-bold tracking-wider text-navy-500 uppercase"
                                    >
                                        Alamat Email Terdaftar
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        autoFocus
                                        autoComplete="email"
                                        placeholder="nama@email.com"
                                        className="w-full rounded-xl border border-navy-200/60 px-4 py-2.5 text-xs transition-all focus:border-pastel-teal focus:ring-pastel-teal/20 sm:text-sm"
                                    />
                                    <InputError message={errors.email} />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="shadow-3xs mt-2 w-full cursor-pointer rounded-xl bg-pastel-teal py-3.5 text-xs font-extrabold tracking-wider text-white uppercase transition-all hover:bg-pastel-teal/90 disabled:opacity-50"
                            >
                                {processing && (
                                    <LoaderCircle className="mr-1.5 h-4 w-4 animate-spin text-white" />
                                )}
                                Kirim Tautan Atur Ulang Sandi
                            </Button>

                            <div className="pt-1 text-center text-xs font-medium text-navy-400">
                                Kembali ke halaman{' '}
                                <Link
                                    href={login()}
                                    className="font-bold text-pastel-teal hover:underline"
                                >
                                    Masuk Akun
                                </Link>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
