import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    return (
        <>
            <Head title="Tampilan Aplikasi" />

            <h1 className="sr-only">Tampilan Aplikasi</h1>

            <div className="space-y-6 font-sans">
                <Heading
                    variant="small"
                    title="Pengaturan Tampilan"
                    description="Atur tema tampilan portal (Terang / Gelap / Sistem) sesuai kenyamanan Anda"
                />
                <AppearanceTabs />
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Tampilan Aplikasi',
            href: editAppearance(),
        },
    ],
};
