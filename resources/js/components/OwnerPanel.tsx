/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useForm, Link } from '@inertiajs/react';
import {
    CheckCircle2,
    AlertCircle,
    ShoppingBag,
    Settings,
    ExternalLink,
    Store,
    Award,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import type { Shop, Product, Category } from '@/types';
import CatalogTab from './owner/CatalogTab';
import OnboardingPanel from './owner/OnboardingPanel';
import ShopProfileTab from './owner/ShopProfileTab';

interface OwnerPanelProps {
    myShop: Shop | undefined;
    myProducts: Product[];
    categories: Category[];
}

export default function OwnerPanel({
    myShop,
    myProducts,
    categories,
}: OwnerPanelProps) {
    const [activeTab, setActiveTab] = useState<'catalog' | 'shop-profile'>(
        'catalog',
    );
    const [editSuccess, setEditSuccess] = useState(false);
    const [searchCatalogQuery, setSearchCatalogQuery] = useState('');
    const [selectedCatalogCategory, setSelectedCatalogCategory] =
        useState('all');

    // 1. Inertia Form for Shop Registration
    const registerForm = useForm({
        name: '',
        ownerName: '',
        description: '',
        category: categories[0]?.name || 'Kuliner & Olahan',
        phone: '',
        address: '',
        dusun: 'Dusun Samirono',
        lat: -7.3822,
        lng: 110.4287,
        jamKerja: '08:00 - 17:00',
        logo: null as File | null,
        image: null as File | null,
    });

    // 2. Inertia Form for Shop Profiling
    const editShopForm = useForm({
        description: myShop?.description || '',
        phone: myShop?.phone || '',
        address: myShop?.address || '',
        dusun: myShop?.dusun || 'Dusun Samirono',
        lat: myShop?.lat || -7.3822,
        lng: myShop?.lng || 110.4287,
        jamKerja: myShop?.jamKerja || '08:00 - 17:00',
        logo: null as File | null,
        image: null as File | null,
        _method: 'PUT',
    });

    // Sync edits when shop changes
    useEffect(() => {
        if (myShop) {
            editShopForm.setData({
                description: myShop.description || '',
                phone: myShop.phone || '',
                address: myShop.address || '',
                dusun: myShop.dusun || 'Dusun Samirono',
                lat: myShop.lat || -7.3822,
                lng: myShop.lng || 110.4287,
                jamKerja: myShop.jamKerja || '08:00 - 17:00',
                logo: null,
                image: null,
                _method: 'PUT',
            });
        }
    }, [myShop, activeTab, editShopForm]);

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        registerForm.post('/merchant/shop', {
            forceFormData: true,
        });
    };

    const handleEditShopSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        editShopForm.post('/merchant/shop', {
            forceFormData: true,
            onSuccess: () => {
                setEditSuccess(true);
                setTimeout(() => setEditSuccess(false), 3000);
            },
        });
    };

    // Onboarding View (If shop does not exist)
    if (!myShop) {
        return (
            <OnboardingPanel
                categories={categories}
                form={registerForm}
                onSubmit={handleRegisterSubmit}
            />
        );
    }

    // Dashboard Workspace Panel View
    return (
        <div
            className="mx-auto max-w-7xl animate-fade-in space-y-6 py-2 font-sans text-navy-900"
            id="owner-workspace"
        >
            {/* Merchant Header Banner & Overview Cards */}
            <div className="shadow-3xs space-y-6 rounded-3xl border border-navy-200/60 bg-white p-6">
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                    <div className="flex items-center gap-4">
                        <div className="shadow-3xs h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-navy-200/60 bg-navy-50 p-0.5">
                            <img
                                src={myShop.logo}
                                alt={myShop.name}
                                className="h-full w-full rounded-xl object-cover"
                                referrerPolicy="no-referrer"
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl leading-none font-black tracking-tight text-navy-900 uppercase sm:text-2xl">
                                    {myShop.name}
                                </h1>
                                {myShop.isVerified ? (
                                    <Badge
                                        variant="outline"
                                        className="flex items-center gap-1.5 rounded-lg border-pastel-teal/20 bg-pastel-teal-light px-2.5 py-1 text-xs font-black tracking-wider text-pastel-teal uppercase"
                                    >
                                        <CheckCircle2 className="h-4 w-4 animate-pulse fill-pastel-teal-light text-pastel-teal" />
                                        <span>Terverifikasi</span>
                                    </Badge>
                                ) : (
                                    <Badge
                                        variant="outline"
                                        className="flex items-center gap-1.5 rounded-lg border-pastel-peach/20 bg-pastel-peach-light px-2.5 py-1 text-xs font-black tracking-wider text-pastel-peach uppercase"
                                    >
                                        <AlertCircle className="h-4 w-4 text-pastel-peach" />
                                        <span>Dalam Review</span>
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xs font-normal text-navy-500 sm:text-sm">
                                Pemilik:{' '}
                                <span className="font-bold text-navy-800">
                                    {myShop.ownerName}
                                </span>{' '}
                                | Dusun:{' '}
                                <span className="font-bold text-navy-800">
                                    {myShop.dusun}
                                </span>{' '}
                                | Sektor:{' '}
                                <span className="font-bold text-pastel-teal">
                                    {myShop.category}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Direct Live Store View Action Button */}
                    <Link
                        href={`/shops/${myShop.id}`}
                        target="_blank"
                        className="shadow-3xs flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-navy-900 px-4 py-2.5 text-xs font-extrabold tracking-wider text-white uppercase transition-all hover:bg-navy-800"
                    >
                        <span>Lihat Toko Publik (Live)</span>
                        <ExternalLink className="h-4 w-4 text-pastel-teal" />
                    </Link>
                </div>

                {/* Quick Merchant Metric Cards */}
                <div className="grid grid-cols-1 gap-4 border-t border-navy-100 pt-2 sm:grid-cols-3">
                    <div className="flex items-center justify-between rounded-2xl border border-navy-200/50 bg-navy-50/60 p-4">
                        <div>
                            <span className="block text-xs font-extrabold tracking-wider text-navy-400 uppercase">
                                Total Produk Etalase
                            </span>
                            <span className="mt-0.5 block text-xl font-black text-navy-900">
                                {myProducts.length} Produk
                            </span>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-pastel-teal/20 bg-pastel-teal-light text-pastel-teal">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-navy-200/50 bg-navy-50/60 p-4">
                        <div>
                            <span className="block text-xs font-extrabold tracking-wider text-navy-400 uppercase">
                                Status Operasional
                            </span>
                            <span className="mt-0.5 block text-sm font-black text-navy-900">
                                {myShop.jamKerja || '08:00 - 17:00'}
                            </span>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-pastel-peach/30 bg-pastel-peach-light text-navy-800">
                            <Store className="h-5 w-5 text-pastel-peach" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-navy-200/50 bg-navy-50/60 p-4">
                        <div>
                            <span className="block text-xs font-extrabold tracking-wider text-navy-400 uppercase">
                                Legalitas Toko
                            </span>
                            <div className="mt-1 flex flex-wrap gap-1">
                                {myShop.nib ? (
                                    <span className="rounded bg-pastel-lavender-light px-1.5 py-0.5 text-xs font-black text-pastel-lavender uppercase">
                                        NIB
                                    </span>
                                ) : null}
                                {myShop.halal ? (
                                    <span className="rounded bg-pastel-teal-light px-1.5 py-0.5 text-xs font-black text-pastel-teal uppercase">
                                        HALAL
                                    </span>
                                ) : null}
                                {myShop.pirt ? (
                                    <span className="rounded bg-pastel-peach-light px-1.5 py-0.5 text-xs font-black text-pastel-peach uppercase">
                                        P-IRT
                                    </span>
                                ) : null}
                                {!myShop.nib &&
                                    !myShop.halal &&
                                    !myShop.pirt && (
                                        <span className="text-xs font-medium text-navy-400">
                                            Belum Ada
                                        </span>
                                    )}
                            </div>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-pastel-lavender/30 bg-pastel-lavender-light text-pastel-lavender">
                            <Award className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* Flat Underlined Tab Switcher with Icons */}
                <div className="flex shrink-0 space-x-6 border-b border-navy-200 pt-2">
                    <button
                        onClick={() => {
                            setActiveTab('catalog');
                            setIsAddingProduct(false);
                        }}
                        className={`flex cursor-pointer items-center gap-2 border-b-2 px-1 pb-3 text-xs font-black tracking-wider uppercase transition-all ${
                            activeTab === 'catalog'
                                ? 'border-pastel-teal text-pastel-teal'
                                : 'border-transparent text-navy-400 hover:border-navy-300 hover:text-navy-700'
                        }`}
                    >
                        <ShoppingBag className="h-4 w-4" />
                        <span>Etalase Produk ({myProducts.length})</span>
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('shop-profile');
                            setIsAddingProduct(false);
                        }}
                        className={`flex cursor-pointer items-center gap-2 border-b-2 px-1 pb-3 text-xs font-black tracking-wider uppercase transition-all ${
                            activeTab === 'shop-profile'
                                ? 'border-pastel-teal text-pastel-teal'
                                : 'border-transparent text-navy-400 hover:border-navy-300 hover:text-navy-700'
                        }`}
                    >
                        <Settings className="h-4 w-4" />
                        <span>Profil Toko</span>
                    </button>
                </div>
            </div>

            {/* Tab Panels */}
            {activeTab === 'shop-profile' && (
                <ShopProfileTab
                    myShop={myShop}
                    form={editShopForm}
                    onSubmit={handleEditShopSubmit}
                    editSuccess={editSuccess}
                />
            )}

            {activeTab === 'catalog' && (
                <CatalogTab
                    myProducts={myProducts}
                    categories={categories}
                    searchCatalogQuery={searchCatalogQuery}
                    setSearchCatalogQuery={setSearchCatalogQuery}
                    selectedCatalogCategory={selectedCatalogCategory}
                    setSelectedCatalogCategory={setSelectedCatalogCategory}
                    onOpenAddModal={() => setIsAddingProduct(true)}
                />
            )}
        </div>
    );
}
