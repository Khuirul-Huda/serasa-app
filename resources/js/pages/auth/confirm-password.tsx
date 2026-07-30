/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Form, Head } from '@inertiajs/react';
import {
    index as confirmOptions,
    store as confirmStore,
} from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyConfirmationController';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Konfirmasi Kata Sandi" />

            <PasskeyVerify
                routes={{
                    options: confirmOptions(),
                    submit: confirmStore(),
                }}
                label="Konfirmasi dengan Passkey"
                loadingLabel="Memverifikasi..."
                separator="Atau konfirmasi dengan Kata Sandi"
            />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-6 font-sans text-xs text-navy-900">
                        <div className="grid gap-2">
                            <Label
                                htmlFor="password"
                                className="text-xs font-bold tracking-wider text-navy-600 uppercase"
                            >
                                Kata Sandi
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="Masukkan kata sandi Anda"
                                autoComplete="current-password"
                                autoFocus
                                className="rounded-xl border-navy-200/60 focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20"
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center">
                            <Button
                                className="shadow-3xs h-10 w-full cursor-pointer rounded-xl bg-pastel-teal text-xs font-extrabold tracking-wider text-white uppercase hover:bg-pastel-teal/90"
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing && <Spinner />}
                                Konfirmasi Kata Sandi
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Konfirmasi Sandi Akses',
    description:
        'Area ini memerlukan konfirmasi kata sandi demi keamanan akun pelaku usaha.',
};
