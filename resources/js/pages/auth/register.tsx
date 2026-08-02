/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Form, Head, Link } from '@inertiajs/react';
import { User, Mail, Lock, UserPlus, ShieldCheck } from 'lucide-react';
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
            <Head title="Daftar Akun Baru SERASA" />

            <div className="space-y-5 font-sans text-navy-900">
                {/* Segmented Auth Navigation Switcher */}
                <div className="flex rounded-2xl border border-navy-200/60 bg-navy-50/80 p-1 text-xs font-bold">
                    <Link
                        href={login()}
                        className="flex-1 rounded-xl py-2 text-center text-navy-500 transition-colors hover:text-navy-900"
                    >
                        Masuk Akun
                    </Link>
                    <span className="flex-1 rounded-xl bg-white py-2 text-center text-navy-900 shadow-xs">
                        Daftar Akun Baru
                    </span>
                </div>

                <Form
                    {...store.form()}
                    resetOnSuccess={['password', 'password_confirmation']}
                    disableWhileProcessing
                    className="flex flex-col gap-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-3.5 text-xs sm:text-sm">
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="name"
                                        className="block text-xs font-bold tracking-wider text-navy-600 uppercase"
                                    >
                                        Nama Lengkap
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-navy-400" />
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            placeholder="Contoh: Budi Santoso"
                                            className="w-full rounded-xl border border-navy-200/70 bg-white py-2.5 pr-4 pl-10 text-xs transition-all focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 sm:text-sm"
                                        />
                                    </div>
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="email"
                                        className="block text-xs font-bold tracking-wider text-navy-600 uppercase"
                                    >
                                        Alamat Email
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-navy-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            placeholder="nama@email.com"
                                            className="w-full rounded-xl border border-navy-200/70 bg-white py-2.5 pr-4 pl-10 text-xs transition-all focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 sm:text-sm"
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="password"
                                        className="block text-xs font-bold tracking-wider text-navy-600 uppercase"
                                    >
                                        Kata Sandi
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute top-1/2 left-3.5 z-10 h-4 w-4 -translate-y-1/2 text-navy-400" />
                                        <PasswordInput
                                            id="password"
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            placeholder="Minimal 8 karakter"
                                            passwordrules={passwordRules}
                                            className="w-full rounded-xl border border-navy-200/70 bg-white py-2.5 pr-4 pl-10 text-xs transition-all focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 sm:text-sm"
                                        />
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="password_confirmation"
                                        className="block text-xs font-bold tracking-wider text-navy-600 uppercase"
                                    >
                                        Konfirmasi Kata Sandi
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute top-1/2 left-3.5 z-10 h-4 w-4 -translate-y-1/2 text-navy-400" />
                                        <PasswordInput
                                            id="password_confirmation"
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            placeholder="Ulangi kata sandi Anda"
                                            passwordrules={passwordRules}
                                            className="w-full rounded-xl border border-navy-200/70 bg-white py-2.5 pr-4 pl-10 text-xs transition-all focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 sm:text-sm"
                                        />
                                    </div>
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                tabIndex={5}
                                className="shadow-md flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-pastel-teal py-3.5 text-xs font-extrabold tracking-wider text-white uppercase transition-all hover:bg-pastel-teal/90 disabled:opacity-50"
                            >
                                {processing ? (
                                    <Spinner />
                                ) : (
                                    <UserPlus className="h-4 w-4" />
                                )}
                                <span>Daftar Akun Baru</span>
                            </Button>

                            {/* Trust Notice */}
                            <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] font-medium text-navy-400">
                                <ShieldCheck className="h-3.5 w-3.5 text-pastel-teal" />
                                <span>Pendaftaran aman & gratis tanpa biaya</span>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
