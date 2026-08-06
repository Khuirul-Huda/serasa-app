/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { Head } from '@inertiajs/react';
import React from 'react';
import OwnerPanel from '@/components/OwnerPanel';
import AppLayout from '@/layouts/app-layout';
import type { AppSettings, Category, Product, Shop } from '@/types';

interface MerchantDashboardProps {
    settings: AppSettings;
    categories: Category[];
    myShop: Shop | undefined;
    myProducts: Product[];
    products: Product[];
}

export default function MerchantDashboard({
    settings,
    categories,
    myShop,
    myProducts,
}: MerchantDashboardProps) {
    const breadcrumbs = [
        { title: 'Pasar Etalase', href: '/' },
        { title: 'Kelola Toko Saya', href: '/merchant/dashboard' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Kelola Toko Saya - ${settings.appName}`} />

            <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 font-sans">
                <OwnerPanel
                    myShop={myShop}
                    myProducts={myProducts}
                    categories={categories}
                />
            </div>
        </AppLayout>
    );
}
