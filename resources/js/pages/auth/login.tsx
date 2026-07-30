/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Head, useForm, Link, router } from '@inertiajs/react';
import { Store, ShieldCheck, Sparkles } from 'lucide-react';
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
            <Head title="Masuk ke Portal UMKM" />

            <div className="space-y-6 font-sans text-navy-900">
                {/* Demo Mode Quick Access Card */}
                <div className="space-y-3.5 rounded-2xl border border-pastel-teal/20 bg-pastel-teal-light/30 p-5 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-navy-900">
                        <Sparkles className="h-4 w-4 animate-pulse fill-pastel-teal/20 text-pastel-teal" />
                        <span className="text-xs font-black tracking-wider uppercase">
                            Akses Cepat (Demo Mode)
                        </span>
                    </div>
                    <p className="text-xs leading-relaxed font-normal text-navy-600">
                        Klik tombol di bawah untuk masuk secara instan
                        menggunakan akun demonstrasi yang telah disiapkan.
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                        <button
                            type="button"
                            onClick={() => handleDemoLogin('owner')}
                            className="shadow-3xs group flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-pastel-teal/20 bg-white px-3 py-3 text-center transition-all hover:border-pastel-teal hover:bg-pastel-teal-light"
                        >
                            <Store className="h-4.5 w-4.5 text-pastel-teal transition-transform group-hover:scale-110" />
                            <span className="text-xs font-extrabold tracking-tight text-navy-800 uppercase">
                                Owner Toko
                            </span>
                            <span className="text-xs font-medium text-navy-400">
                                owner@serasa...
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleDemoLogin('admin')}
                            className="shadow-3xs group flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-pastel-peach/30 bg-white px-3 py-3 text-center transition-all hover:border-pastel-peach hover:bg-pastel-peach-light"
                        >
                            <ShieldCheck className="h-4.5 w-4.5 text-pastel-peach transition-transform group-hover:scale-110" />
                            <span className="text-xs font-extrabold tracking-tight text-navy-800 uppercase">
                                Admin Desa
                            </span>
                            <span className="text-xs font-medium text-navy-400">
                                admin@serasa...
                            </span>
                        </button>
                    </div>
                </div>

                <div className="relative flex items-center py-1">
                    <div className="flex-grow border-t border-navy-200/60"></div>
                    <span className="mx-4 flex-shrink font-mono text-xs font-bold tracking-widest text-navy-400 uppercase">
                        Atau Manual
                    </span>
                    <div className="flex-grow border-t border-navy-200/60"></div>
                </div>

                {/* Manual Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 text-xs sm:text-sm"
                >
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
                            placeholder="nama@email.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full rounded-xl border border-navy-200/60 px-4 py-2.5 text-xs transition-all focus:border-pastel-teal focus:ring-pastel-teal/20 sm:text-sm"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label
                                htmlFor="password"
                                className="text-xs font-bold tracking-wider text-navy-500 uppercase"
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
                        <PasswordInput
                            id="password"
                            required
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="w-full rounded-xl border border-navy-200/60 px-4 py-2.5 text-xs transition-all focus:border-pastel-teal focus:ring-pastel-teal/20 sm:text-sm"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center gap-2 pt-1 select-none">
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
                            Ingat akun saya
                        </label>
                    </div>

                    <Button
                        type="submit"
                        disabled={processing}
                        className="shadow-3xs mt-2 w-full cursor-pointer rounded-xl bg-pastel-teal py-3.5 text-xs font-extrabold tracking-wider text-white uppercase transition-all hover:bg-pastel-teal/90 disabled:opacity-50"
                    >
                        {processing ? 'Memproses...' : 'Masuk ke Akun Toko'}
                    </Button>
                </form>

                {/* Footer info */}
                <div className="text-center text-xs font-medium text-navy-400">
                    Belum memiliki akun toko?{' '}
                    <Link
                        href="/register"
                        className="font-bold text-pastel-teal hover:underline"
                    >
                        Daftarkan Toko UMKM Baru
                    </Link>
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
