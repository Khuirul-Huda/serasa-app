/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import AdminPanel from '@/components/AdminPanel';
import AppLayout from '@/layouts/app-layout';
import type { AppSettings, ArticleItem, Category, Product, Shop } from '@/types';

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export interface AdminReview {
    id: string;
    productId: string;
    productName: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface AdminDashboardProps {
    settings: AppSettings;
    shops: Shop[];
    products: Product[];
    categories: Category[];
    reviews?: AdminReview[];
    users?: AdminUser[];
    articles?: ArticleItem[];
}

export default function AdminDashboard({
    settings,
    shops,
    products,
    categories,
    reviews = [],
    users = [],
    articles = [],
}: AdminDashboardProps) {
    const page = usePage();
    const queryTab = new URLSearchParams(
        page.url.includes('?') ? page.url.split('?')[1] : '',
    ).get('tab') || 'stats';

    const getTabTitle = (tab: string) => {
        switch (tab) {
            case 'shops':
                return 'Kelola UMKM';
            case 'products':
                return 'Moderasi Produk';
            case 'reviews':
                return 'Ulasan';
            case 'categories':
                return 'Sektor';
            case 'users':
                return 'Akun';
            case 'articles':
                return 'Kabar Desa & Artikel';
            case 'config':
                return 'Konfigurasi';
            default:
                return 'Statistik';
        }
    };

    const breadcrumbs = [
        { title: 'Admin Desa', href: '/admin/dashboard' },
        { title: getTabTitle(queryTab), href: `/admin/dashboard?tab=${queryTab}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${getTabTitle(queryTab)} - Admin Desa ${settings.appName}`} />

            <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 font-sans">
                <AdminPanel
                    settings={settings}
                    shops={shops}
                    products={products}
                    categories={categories}
                    reviews={reviews}
                    users={users}
                    articles={articles}
                />
            </div>
        </AppLayout>
    );
}
