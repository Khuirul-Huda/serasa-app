/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Head, useForm, Link, router, usePage } from '@inertiajs/react';
import { Store, ShieldCheck, Sparkles, Mail, Lock, LogIn, Shield } from 'lucide-react';
import React from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const { isDemo } = usePage().props as any;

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    const handleDemoLogin = (role: 'owner' | 'admin') => {
        const email =
            role === 'owner'
                ? 'owner@serasa.levitation.web.id'
                : 'admin@serasa.levitation.web.id';
        const password = 'password';

        router.post('/login', { email, password, remember: true });
    };

    return (
        <>
            <Head title="Masuk ke Akun SERASA" />

            <div className="space-y-5 font-sans text-navy-900">
                {/* Segmented Auth Navigation Switcher */}
                <div className="flex rounded-2xl border border-navy-200/60 bg-navy-50/80 p-1 text-xs font-bold">
                    <span className="flex-1 rounded-xl bg-white py-2 text-center text-navy-900 shadow-xs">
                        Masuk Akun
                    </span>
                    <Link
                        href="/register"
                        className="flex-1 rounded-xl py-2 text-center text-navy-500 transition-colors hover:text-navy-900"
                    >
                        Daftar Akun Baru
                    </Link>
                </div>

                {/* Demo Mode Quick Access Card — hidden in production */}
                {isDemo && (
                    <div className="space-y-3 rounded-2xl border border-pastel-teal/25 bg-pastel-teal-light/40 p-4 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-navy-900">
                            <Sparkles className="h-4 w-4 animate-pulse fill-pastel-teal/20 text-pastel-teal" />
                            <span className="text-[11px] font-black tracking-wider uppercase">
                                Akses Cepat (Demo Mode)
                            </span>
                        </div>
                        <p className="text-xs leading-relaxed font-normal text-navy-600">
                            Masuk instan menggunakan akun demonstrasi:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => handleDemoLogin('owner')}
                                className="group flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-pastel-teal/30 bg-white px-3 py-2.5 text-center shadow-3xs transition-all hover:border-pastel-teal hover:bg-pastel-teal-light"
                            >
                                <Store className="h-4 w-4 text-pastel-teal transition-transform group-hover:scale-110" />
                                <span className="text-xs font-black tracking-tight text-navy-900 uppercase">
                                    Owner Toko
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDemoLogin('admin')}
                                className="group flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-pastel-peach/40 bg-white px-3 py-2.5 text-center shadow-3xs transition-all hover:border-pastel-peach hover:bg-pastel-peach-light"
                            >
                                <ShieldCheck className="h-4 w-4 text-pastel-peach transition-transform group-hover:scale-110" />
                                <span className="text-xs font-black tracking-tight text-navy-900 uppercase">
                                    Admin Desa
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                {isDemo && (
                    <div className="relative flex items-center py-0.5">
                        <div className="flex-grow border-t border-navy-200/60" />
                        <span className="mx-3 font-mono text-[10px] font-bold tracking-widest text-navy-400 uppercase">
                            Atau Manual
                        </span>
                        <div className="flex-grow border-t border-navy-200/60" />
                    </div>
                )}

                {/* Manual Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 text-xs sm:text-sm"
                >
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
                                placeholder="nama@email.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded-xl border border-navy-200/70 bg-white py-2.5 pr-4 pl-10 text-xs transition-all focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 sm:text-sm"
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label
                                htmlFor="password"
                                className="text-xs font-bold tracking-wider text-navy-600 uppercase"
                            >
                                Kata Sandi
                            </Label>
                            {canResetPassword && (
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-bold text-pastel-teal hover:underline"
                                >
                                    Lupa Sandi?
                                </Link>
                            )}
                        </div>
                        <div className="relative">
                            <Lock className="absolute top-1/2 left-3.5 z-10 h-4 w-4 -translate-y-1/2 text-navy-400" />
                            <PasswordInput
                                id="password"
                                required
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="w-full rounded-xl border border-navy-200/70 bg-white py-2.5 pr-4 pl-10 text-xs transition-all focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 sm:text-sm"
                            />
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center gap-2 pt-0.5 select-none">
                        <Checkbox
                            id="remember"
                            checked={data.remember}
                            onCheckedChange={(val) =>
                                setData('remember', !!val)
                            }
                            className="border-navy-300 text-pastel-teal focus:ring-pastel-teal"
                        />
                        <label
                            htmlFor="remember"
                            className="cursor-pointer text-xs font-medium text-navy-600"
                        >
                            Ingat akun saya di perangkat ini
                        </label>
                    </div>

                    <Button
                        type="submit"
                        disabled={processing}
                        className="shadow-md flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-pastel-teal py-3.5 text-xs font-extrabold tracking-wider text-white uppercase transition-all hover:bg-pastel-teal/90 disabled:opacity-50"
                    >
                        <LogIn className="h-4 w-4" />
                        <span>{processing ? 'Memproses...' : 'Masuk ke Akun'}</span>
                    </Button>
                </form>

                {/* Footer Security Badge */}
                <div className="flex items-center justify-center gap-1.5 pt-2 text-[11px] font-medium text-navy-400">
                    <Shield className="h-3.5 w-3.5 text-pastel-teal" />
                    <span>Akses platform terenkripsi & aman</span>
                </div>
            </div>

            {status && (
                <div className="mt-4 rounded-xl border border-pastel-teal/20 bg-pastel-teal-light p-3 text-center text-xs font-semibold text-pastel-teal">
                    {status}
                </div>
            )}
        </>
    );
}
