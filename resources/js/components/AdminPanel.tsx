/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useForm, router } from '@inertiajs/react';
import {
    ShieldCheck,
    Activity,
    Store,
    Settings,
    FileSpreadsheet,
    CheckCircle2,
    AlertCircle,
    ShoppingBag,
    Package,
    MessageSquare,
    Layers,
    Users,
    Newspaper,
} from 'lucide-react';
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import type { AdminReview, AdminUser } from '@/pages/admin-dashboard';
import type { AppSettings, Shop, Product, Category, ArticleItem } from '@/types';
import ArticlesTab from './admin/ArticlesTab';
import CategoriesTab from './admin/CategoriesTab';
import ConfigTab from './admin/ConfigTab';
import type { ParsedImportRow } from './admin/ImportModal';
import ImportModal from './admin/ImportModal';
import ProductsTab from './admin/ProductsTab';
import ReviewsTab from './admin/ReviewsTab';
import ShopsTab from './admin/ShopsTab';
import StatsTab from './admin/StatsTab';
import UsersTab from './admin/UsersTab';

interface AdminPanelProps {
    settings: AppSettings;
    shops: Shop[];
    products: Product[];
    categories: Category[];
    reviews?: AdminReview[];
    users?: AdminUser[];
    articles?: ArticleItem[];
}

export default function AdminPanel({
    settings,
    shops,
    products,
    categories,
    reviews = [],
    users = [],
    articles = [],
}: AdminPanelProps) {
    const [activeSubTab, setActiveSubTab] = useState<
        | 'stats'
        | 'shops'
        | 'products'
        | 'reviews'
        | 'categories'
        | 'users'
        | 'articles'
        | 'config'
    >('stats');

    const [saveSuccess, setSaveSuccess] = useState(false);
    const [searchShopQuery, setSearchShopQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<
        'all' | 'verified' | 'pending'
    >('all');

    // Excel Import state
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importRows, setImportRows] = useState<ParsedImportRow[]>([]);
    const [isParsing, setIsParsing] = useState(false);
    const [isSubmittingImport, setIsSubmittingImport] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Inertia Form for app settings
    const { data, setData, post, processing } = useForm({
        appName: settings.appName,
        tagline: settings.tagline,
        villageName: settings.villageName,
        kecamatanName: settings.kecamatanName || 'Kecamatan Getasan',
        kabupatenName: settings.kabupatenName || 'Kabupaten Semarang',
        description: settings.description,
        adminPhone: settings.adminPhone,
        heroBanner: settings.heroBanner,
        mapCenterLat: settings.mapCenterLat !== undefined ? settings.mapCenterLat : -7.371239,
        mapCenterLng: settings.mapCenterLng !== undefined ? settings.mapCenterLng : 110.456123,
        mapZoom: settings.mapZoom !== undefined ? settings.mapZoom : 14,
        footerCredits: settings.footerCredits || '© 2026 TIM KKN UNNES GIAT 16 DESA SAMIRONO',
        flashSaleTitle: settings.flashSaleTitle || 'KEJAR DISKON WARGA',
        flashSaleProductId: settings.flashSaleProductId || '',
        flashSaleHours: settings.flashSaleHours !== undefined ? settings.flashSaleHours : 3,
        flashSaleMinutes: settings.flashSaleMinutes !== undefined ? settings.flashSaleMinutes : 44,
        flashSaleTag: settings.flashSaleTag || 'Diskon Harian',
        flashSaleProgress: settings.flashSaleProgress !== undefined ? settings.flashSaleProgress : 87,
        hotSearches: settings.hotSearches || [
            { label: 'Susu Sapi', query: 'susu' },
            { label: 'Keju', query: 'keju' },
            { label: 'Anyaman Bambu', query: 'anyaman' },
            { label: 'Tempe Daun', query: 'tempe' },
        ],
        promoSlides: settings.promoSlides || [
            {
                id: 'slide-1',
                title: `Susu Sapi Murni ${settings.villageName}`,
                tagline: 'Diskon 10% Spesial Minggu Ini',
                description: 'Segar murni dari peternakan lereng gunung, diperah higienis harian oleh warga desa.',
                image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
                badge: '🥛 SUSU SEGAR',
                btnQuery: 'susu',
            },
            {
                id: 'slide-2',
                title: 'Keju Mozzarella & Ricotta',
                tagline: `Karya Tani Unggulan ${settings.villageName}`,
                description: 'Diproduksi oleh sentra pengolahan dengan cita rasa keju artisan bersertifikat pangan.',
                image: 'https://images.unsplash.com/photo-1559561853-080268185995?auto=format&fit=crop&w=800&q=80',
                badge: '🧀 KEJU LOKAL',
                btnQuery: 'keju',
            },
            {
                id: 'slide-3',
                title: 'Kerajinan Anyaman Bambu',
                tagline: '100% Produk Kreatif Ramah Lingkungan',
                description: 'Dianyam telaten dengan bambu pilihan lereng pegunungan untuk perabot estetis fungsional.',
                image: 'https://images.unsplash.com/photo-1590736969955-71cb94801759?auto=format&fit=crop&w=800&q=80',
                badge: '🎋 KRIYA BAMBU',
                btnQuery: 'anyaman',
            },
        ],
    });

    const totalShops = shops.length;
    const verifiedShops = shops.filter((s) => s.isVerified).length;
    const pendingShops = totalShops - verifiedShops;

    const handleConfigSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings', {
            onSuccess: () => {
                setSaveSuccess(true);
                toast.success('Konfigurasi portal berhasil disimpan!');
                setTimeout(() => setSaveSuccess(false), 3500);
            },
        });
    };

    // Excel Parsing logic
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setIsParsing(true);
        const reader = new FileReader();

        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const rawData: any[] = XLSX.utils.sheet_to_json(ws, {
                    header: 1,
                });

                if (rawData.length < 2) {
                    toast.error('File Excel kosong atau tidak sesuai format.');
                    setIsParsing(false);

                    return;
                }

                const parsed: ParsedImportRow[] = [];

                for (let i = 1; i < rawData.length; i++) {
                    const row = rawData[i];

                    if (!row || row.length === 0 || !row[0]) {
                        continue;
                    }

                    const ownerName = String(row[0] || '').trim();
                    const address = String(row[1] || '').trim();
                    const dusunRaw = String(row[2] || '').trim();
                    const phoneRaw = String(row[3] || '').trim();
                    const shopName = String(row[4] || '').trim();
                    const categoryRaw = String(row[5] || '').trim();
                    const nib =
                        String(row[6] || '').toLowerCase() === 'v' ||
                        String(row[6] || '').toLowerCase() === 'ya';
                    const halal =
                        String(row[7] || '').toLowerCase() === 'v' ||
                        String(row[7] || '').toLowerCase() === 'ya';
                    const pirt =
                        String(row[8] || '').toLowerCase() === 'v' ||
                        String(row[8] || '').toLowerCase() === 'ya';

                    if (!shopName || !ownerName) {
                        continue;
                    }

                    let dusun = 'Dusun Samirono';

                    if (dusunRaw.toLowerCase().includes('bentar')) {
                        dusun = 'Dusun Bentar';
                    } else if (dusunRaw.toLowerCase().includes('surowono')) {
                        dusun = 'Dusun Surowono';
                    } else if (dusunRaw.toLowerCase().includes('tawang')) {
                        dusun = 'Dusun Tawang';
                    }

                    let phone = phoneRaw.replace(/[^0-9]/g, '');

                    if (phone.startsWith('0')) {
                        phone = '62' + phone.slice(1);
                    }

                    if (!phone) {
                        phone = '6285725900000';
                    }

                    let category = 'Kuliner & Olahan';

                    if (categoryRaw.toLowerCase().includes('susu')) {
                        category = 'Kuliner & Olahan';
                    } else if (
                        categoryRaw.toLowerCase().includes('kerajinan') ||
                        categoryRaw.toLowerCase().includes('kriya')
                    ) {
                        category = 'Kerajinan & Kriya';
                    } else if (
                        categoryRaw.toLowerCase().includes('tani') ||
                        categoryRaw.toLowerCase().includes('segar')
                    ) {
                        category = 'Hasil Tani Segar';
                    }

                    const conflictShop = shops.find(
                        (s) =>
                            s.name
                                .toLowerCase()
                                .includes(shopName.toLowerCase()) ||
                            shopName
                                .toLowerCase()
                                .includes(s.name.toLowerCase()) ||
                            (s.ownerName.toLowerCase() ===
                                ownerName.toLowerCase() &&
                                ownerName !== ''),
                    );

                    parsed.push({
                        rowNum: i + 1,
                        ownerName,
                        address: address || `Dusun ${dusun}`,
                        dusun,
                        phone,
                        name: shopName,
                        category,
                        nib,
                        halal,
                        pirt,
                        isConflict: !!conflictShop,
                        conflictShopName: conflictShop?.name,
                        action: conflictShop ? 'skip' : 'import',
                    });
                }

                setImportRows(parsed);
                toast.info(
                    `Berhasil me-load ${parsed.length} baris data toko dari file Excel.`,
                );
            } catch (err) {
                console.error('Gagal membaca Excel:', err);
                toast.error(
                    'Terjadi kesalahan membaca file Excel. Pastikan format valid.',
                );
            } finally {
                setIsParsing(false);
            }
        };

        reader.readAsBinaryString(file);
    };

    const handleToggleRowAction = (rowNum: number) => {
        setImportRows((prev) =>
            prev.map((r) =>
                r.rowNum === rowNum
                    ? {
                          ...r,
                          action: r.action === 'import' ? 'skip' : 'import',
                      }
                    : r,
            ),
        );
    };

    const handleSubmitImport = () => {
        const toImport = importRows.filter((r) => r.action === 'import');

        if (toImport.length === 0) {
            toast.warning('Pilih setidaknya 1 baris toko untuk diimpor.');

            return;
        }

        setIsSubmittingImport(true);

        router.post(
            '/admin/shops/bulk-import',
            { shops: toImport as any },
            {
                onSuccess: () => {
                    setIsSubmittingImport(false);
                    setIsImportModalOpen(false);
                    setImportRows([]);
                    toast.success(
                        `Berhasil mengimpor ${toImport.length} data UMKM ke direktori desa!`,
                    );
                },
                onError: () => {
                    setIsSubmittingImport(false);
                    toast.error(
                        'Gagal mengimpor data toko. Periksa kembali format data.',
                    );
                },
            },
        );
    };

    return (
        <div
            className="mx-auto max-w-7xl animate-fade-in space-y-6 py-2 font-sans text-navy-900"
            id="admin-workspace"
        >
            {/* Admin Banner & Summary Metric Grid */}
            <div className="shadow-3xs space-y-6 rounded-3xl border border-navy-200/60 bg-white p-6">
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                    <div className="flex items-center gap-4">
                        <div className="shadow-3xs flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-pastel-peach/30 bg-pastel-peach-light text-pastel-peach">
                            <ShieldCheck className="h-8 w-8" />
                        </div>

                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl leading-none font-black tracking-tight text-navy-900 uppercase sm:text-2xl">
                                    Panel Moderasi Admin Desa
                                </h1>
                                <span className="rounded-lg border border-pastel-teal/20 bg-pastel-teal-light px-3 py-1 text-xs font-black tracking-wider text-pastel-teal uppercase">
                                    Super Admin
                                </span>
                            </div>
                            <p className="text-xs font-normal text-navy-500 sm:text-sm">
                                Pusat kendali verifikasi UMKM, moderasi produk &
                                ulasan, serta manajemen pengguna{' '}
                                {settings.appName}.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="shadow-3xs flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-pastel-teal px-4 py-2.5 text-xs font-extrabold tracking-wider text-white uppercase transition-all hover:bg-pastel-teal/90"
                    >
                        <FileSpreadsheet className="h-4 w-4" />
                        <span>Impor Data Excel UMKM</span>
                    </button>
                </div>

                {/* Admin Quick Metric Cards */}
                <div className="grid grid-cols-2 gap-4 border-t border-navy-100 pt-2 md:grid-cols-4">
                    <div className="flex items-center justify-between rounded-2xl border border-navy-200/50 bg-navy-50/60 p-4">
                        <div>
                            <span className="block text-xs font-extrabold tracking-wider text-navy-400 uppercase sm:text-sm">
                                Total UMKM Warga
                            </span>
                            <span className="mt-0.5 block text-lg font-black text-navy-900 sm:text-xl">
                                {totalShops} Toko
                            </span>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-pastel-teal/20 bg-pastel-teal-light text-pastel-teal">
                            <Store className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-navy-200/50 bg-navy-50/60 p-4">
                        <div>
                            <span className="block text-xs font-extrabold tracking-wider text-navy-400 uppercase sm:text-sm">
                                Toko Terverifikasi
                            </span>
                            <span className="mt-0.5 block text-lg font-black text-pastel-teal sm:text-xl">
                                {verifiedShops} Toko
                            </span>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-pastel-teal/20 bg-pastel-teal-light text-pastel-teal">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-navy-200/50 bg-navy-50/60 p-4">
                        <div>
                            <span className="block text-xs font-extrabold tracking-wider text-navy-400 uppercase sm:text-sm">
                                Menunggu Review
                            </span>
                            <span className="mt-0.5 block text-lg font-black text-pastel-peach sm:text-xl">
                                {pendingShops} Toko
                            </span>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-pastel-peach/30 bg-pastel-peach-light text-pastel-peach">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-navy-200/50 bg-navy-50/60 p-4">
                        <div>
                            <span className="block text-xs font-extrabold tracking-wider text-navy-400 uppercase sm:text-sm">
                                Total Produk
                            </span>
                            <span className="mt-0.5 block text-lg font-black text-navy-900 sm:text-xl">
                                {products.length} Produk
                            </span>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-pastel-lavender/30 bg-pastel-lavender-light text-pastel-lavender">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* Underlined Tab Switcher Bar */}
                <div className="flex shrink-0 space-x-4 overflow-x-auto border-b border-navy-200 pt-2 sm:space-x-6">
                    <button
                        onClick={() => setActiveSubTab('stats')}
                        className={`flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-1 pb-3 text-xs font-black tracking-wider uppercase transition-all sm:text-sm ${
                            activeSubTab === 'stats'
                                ? 'border-pastel-teal text-pastel-teal'
                                : 'border-transparent text-navy-400 hover:border-navy-300 hover:text-navy-700'
                        }`}
                    >
                        <Activity className="h-4 w-4" />
                        <span>Statistik</span>
                    </button>

                    <button
                        onClick={() => setActiveSubTab('shops')}
                        className={`flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-1 pb-3 text-xs font-black tracking-wider uppercase transition-all sm:text-sm ${
                            activeSubTab === 'shops'
                                ? 'border-pastel-teal text-pastel-teal'
                                : 'border-transparent text-navy-400 hover:border-navy-300 hover:text-navy-700'
                        }`}
                    >
                        <Store className="h-4 w-4" />
                        <span>Kelola UMKM ({totalShops})</span>
                        {pendingShops > 0 && (
                            <span className="ml-0.5 rounded-full bg-pastel-peach px-2 py-0.5 text-xs font-black text-navy-900">
                                {pendingShops}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveSubTab('products')}
                        className={`flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-1 pb-3 text-xs font-black tracking-wider uppercase transition-all sm:text-sm ${
                            activeSubTab === 'products'
                                ? 'border-pastel-teal text-pastel-teal'
                                : 'border-transparent text-navy-400 hover:border-navy-300 hover:text-navy-700'
                        }`}
                    >
                        <Package className="h-4 w-4" />
                        <span>Moderasi Produk ({products.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveSubTab('reviews')}
                        className={`flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-1 pb-3 text-xs font-black tracking-wider uppercase transition-all sm:text-sm ${
                            activeSubTab === 'reviews'
                                ? 'border-pastel-teal text-pastel-teal'
                                : 'border-transparent text-navy-400 hover:border-navy-300 hover:text-navy-700'
                        }`}
                    >
                        <MessageSquare className="h-4 w-4" />
                        <span>Ulasan ({reviews.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveSubTab('categories')}
                        className={`flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-1 pb-3 text-xs font-black tracking-wider uppercase transition-all sm:text-sm ${
                            activeSubTab === 'categories'
                                ? 'border-pastel-teal text-pastel-teal'
                                : 'border-transparent text-navy-400 hover:border-navy-300 hover:text-navy-700'
                        }`}
                    >
                        <Layers className="h-4 w-4" />
                        <span>Sektor ({categories.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveSubTab('users')}
                        className={`flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-1 pb-3 text-xs font-black tracking-wider uppercase transition-all sm:text-sm ${
                            activeSubTab === 'users'
                                ? 'border-pastel-teal text-pastel-teal'
                                : 'border-transparent text-navy-400 hover:border-navy-300 hover:text-navy-700'
                        }`}
                    >
                        <Users className="h-4 w-4" />
                        <span>Akun ({users.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveSubTab('articles')}
                        className={`flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-1 pb-3 text-xs font-black tracking-wider uppercase transition-all sm:text-sm ${
                            activeSubTab === 'articles'
                                ? 'border-pastel-teal text-pastel-teal'
                                : 'border-transparent text-navy-400 hover:border-navy-300 hover:text-navy-700'
                        }`}
                    >
                        <Newspaper className="h-4 w-4" />
                        <span>Kabar Desa & Artikel ({articles.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveSubTab('config')}
                        className={`flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-1 pb-3 text-xs font-black tracking-wider uppercase transition-all sm:text-sm ${
                            activeSubTab === 'config'
                                ? 'border-pastel-teal text-pastel-teal'
                                : 'border-transparent text-navy-400 hover:border-navy-300 hover:text-navy-700'
                        }`}
                    >
                        <Settings className="h-4 w-4" />
                        <span>Konfigurasi</span>
                    </button>
                </div>
            </div>

            {/* Tab Panels */}
            {activeSubTab === 'stats' && (
                <StatsTab
                    shops={shops}
                    products={products}
                    categories={categories}
                    onNavigateToShops={(filter) => {
                        if (filter) {
                            setStatusFilter(filter);
                        }

                        setActiveSubTab('shops');
                    }}
                    onNavigateToProducts={() => setActiveSubTab('products')}
                />
            )}

            {activeSubTab === 'shops' && (
                <ShopsTab
                    shops={shops}
                    searchQuery={searchShopQuery}
                    setSearchQuery={setSearchShopQuery}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    onOpenImportModal={() => setIsImportModalOpen(true)}
                />
            )}

            {activeSubTab === 'products' && (
                <ProductsTab
                    products={products}
                    categories={categories}
                    shops={shops}
                />
            )}

            {activeSubTab === 'reviews' && <ReviewsTab reviews={reviews} />}

            {activeSubTab === 'categories' && (
                <CategoriesTab categories={categories} />
            )}

            {activeSubTab === 'users' && <UsersTab users={users} />}

            {activeSubTab === 'articles' && <ArticlesTab articles={articles} />}

            {activeSubTab === 'config' && (
                <ConfigTab
                    data={data}
                    setData={setData}
                    products={products}
                    onSubmit={handleConfigSubmit}
                    processing={processing}
                    saveSuccess={saveSuccess}
                />
            )}

            {/* Excel Import Modal */}
            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => {
                    setIsImportModalOpen(false);
                    setImportRows([]);
                }}
                importRows={importRows}
                isParsing={isParsing}
                isSubmittingImport={isSubmittingImport}
                fileInputRef={fileInputRef}
                onFileUpload={handleFileUpload}
                onToggleAction={handleToggleRowAction}
                onSubmitImport={handleSubmitImport}
            />
        </div>
    );
}
