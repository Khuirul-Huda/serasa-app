/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Form, Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="Verifikasi Email" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 rounded-xl border border-pastel-teal/20 bg-pastel-teal-light p-3 text-center text-xs font-bold text-pastel-teal">
                    Tautan verifikasi baru telah dikirimkan ke alamat email yang
                    Anda daftarkan.
                </div>
            )}

            <Form
                {...send.form()}
                className="space-y-6 text-center font-sans text-xs text-navy-900"
            >
                {({ processing }) => (
                    <>
                        <Button
                            disabled={processing}
                            className="shadow-3xs h-10 w-full cursor-pointer rounded-xl bg-pastel-teal text-xs font-extrabold tracking-wider text-white uppercase hover:bg-pastel-teal/90"
                        >
                            {processing && <Spinner />}
                            Kirim Ulang Email Verifikasi
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-xs font-bold text-navy-500 hover:text-pastel-teal"
                        >
                            Keluar / Log Out
                        </TextLink>
                    </>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verifikasi Alamat Email',
    description:
        'Silakan periksa email Anda dan klik tautan verifikasi yang kami kirimkan untuk mengaktifkan seluruh fitur toko.',
};
