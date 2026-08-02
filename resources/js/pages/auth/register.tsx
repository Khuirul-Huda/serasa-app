/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Form, Head, Link } from '@inertiajs/react';
import React from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Daftar Akun Baru" />

            <div className="space-y-6 font-sans text-navy-900">
                <Form
                    {...store.form()}
                    resetOnSuccess={['password', 'password_confirmation']}
                    disableWhileProcessing
                    className="flex flex-col gap-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-4 text-xs sm:text-sm">
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="name"
                                        className="block text-xs font-bold tracking-wider text-navy-500 uppercase"
                                    >
                                        Nama Lengkap
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        placeholder="Contoh: Budi Santoso"
                                        className="w-full rounded-xl border border-navy-200/60 px-4 py-2.5 text-xs transition-all focus:border-pastel-teal focus:ring-pastel-teal/20 sm:text-sm"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="email"
                                        className="block text-xs font-bold tracking-wider text-navy-500 uppercase"
                                    >
                                        Alamat Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        placeholder="nama@email.com"
                                        className="w-full rounded-xl border border-navy-200/60 px-4 py-2.5 text-xs transition-all focus:border-pastel-teal focus:ring-pastel-teal/20 sm:text-sm"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="password"
                                        className="block text-xs font-bold tracking-wider text-navy-500 uppercase"
                                    >
                                        Kata Sandi
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        placeholder="Minimal 8 karakter"
                                        passwordrules={passwordRules}
                                        className="w-full rounded-xl border border-navy-200/60 px-4 py-2.5 text-xs transition-all focus:border-pastel-teal focus:ring-pastel-teal/20 sm:text-sm"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="password_confirmation"
                                        className="block text-xs font-bold tracking-wider text-navy-500 uppercase"
                                    >
                                        Konfirmasi Kata Sandi
                                    </Label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        placeholder="Ulangi kata sandi Anda"
                                        passwordrules={passwordRules}
                                        className="w-full rounded-xl border border-navy-200/60 px-4 py-2.5 text-xs transition-all focus:border-pastel-teal focus:ring-pastel-teal/20 sm:text-sm"
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                tabIndex={5}
                                className="shadow-3xs mt-2 w-full cursor-pointer rounded-xl bg-pastel-teal py-3.5 text-xs font-extrabold tracking-wider text-white uppercase transition-all hover:bg-pastel-teal/90 disabled:opacity-50"
                            >
                                {processing && <Spinner />}
                                Daftar Akun Baru
                            </Button>

                            <div className="pt-1 text-center text-xs font-medium text-navy-400">
                                Sudah memiliki akun?{' '}
                                <Link
                                    href={login()}
                                    tabIndex={6}
                                    className="font-bold text-pastel-teal hover:underline"
                                >
                                    Masuk Sekarang
                                </Link>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
