/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { Head } from '@inertiajs/react';
import React from 'react';
import OwnerPanel from '@/components/OwnerPanel';
import MarketplaceLayout from '@/layouts/marketplace-layout';
import type { AppSettings, Category, Product, Shop } from '@/types';

interface MerchantDashboardProps {
    settings: AppSettings;
    categories: Category[];
    myShop: Shop | undefined;
    myProducts: Product[];
}

export default function MerchantDashboard({
    settings,
    categories,
    myShop,
    myProducts,
}: MerchantDashboardProps) {
    // Use allProducts to satisfy the search navbar parameter, fallback to empty array
    const allProducts: Product[] = [];

    return (
        <MarketplaceLayout
            settings={settings}
            categories={categories}
            products={allProducts}
            activeTab="merchant"
        >
            <Head title={`Kelola Toko Saya - ${settings.appName}`} />

            <div className="mx-auto max-w-7xl py-4">
                <OwnerPanel
                    myShop={myShop}
                    myProducts={myProducts}
                    categories={categories}
                />
            </div>
        </MarketplaceLayout>
    );
}
