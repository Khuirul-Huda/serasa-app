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
                <div className="mb-4 p-3 bg-pastel-teal-light border border-pastel-teal/20 rounded-xl text-center text-xs font-bold text-pastel-teal">
                    Tautan verifikasi baru telah dikirimkan ke alamat email yang Anda daftarkan.
                </div>
            )}

            <Form {...send.form()} className="space-y-6 text-center text-xs font-sans text-navy-900">
                {({ processing }) => (
                    <>
                        <Button 
                            disabled={processing} 
                            className="w-full h-10 bg-pastel-teal hover:bg-pastel-teal/90 text-white font-extrabold uppercase tracking-wider text-xs rounded-xl shadow-3xs cursor-pointer"
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
