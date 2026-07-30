/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

export default function ResetPassword({ token, email, passwordRules }: Props) {
    return (
        <>
            <Head title="Pembaruan Kata Sandi" />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-4.5 font-sans text-xs text-navy-900">
                        <div className="grid gap-1.5">
                            <Label
                                htmlFor="email"
                                className="text-xs font-bold tracking-wider text-navy-600 uppercase"
                            >
                                Email Terdaftar
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                className="rounded-xl border-navy-200/60 bg-navy-50 text-navy-600"
                                readOnly
                            />
                            <InputError
                                message={errors.email}
                                className="mt-1"
                            />
                        </div>

                        <div className="grid gap-1.5">
                            <Label
                                htmlFor="password"
                                className="text-xs font-bold tracking-wider text-navy-600 uppercase"
                            >
                                Kata Sandi Baru
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                className="rounded-xl border-navy-200/60 focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20"
                                autoFocus
                                placeholder="Kata sandi baru Anda"
                                passwordrules={passwordRules}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label
                                htmlFor="password_confirmation"
                                className="text-xs font-bold tracking-wider text-navy-600 uppercase"
                            >
                                Ulangi Kata Sandi Baru
                            </Label>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                autoComplete="new-password"
                                className="rounded-xl border-navy-200/60 focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20"
                                placeholder="Konfirmasi kata sandi baru"
                                passwordrules={passwordRules}
                            />
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-1"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="shadow-3xs mt-2 h-10 w-full cursor-pointer rounded-xl bg-pastel-teal text-xs font-extrabold tracking-wider text-white uppercase hover:bg-pastel-teal/90"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing && <Spinner />}
                            Simpan Kata Sandi Baru
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = {
    title: 'Atur Ulang Kata Sandi',
    description:
        'Masukkan kata sandi baru Anda di bawah ini untuk mengakses kembali portal.',
};
