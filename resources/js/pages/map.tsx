import React, { lazy, Suspense } from 'react';
import SEOHead from '@/components/SEOHead';
import MarketplaceLayout from '@/layouts/marketplace-layout';
import type { AppSettings, Category, Product, Shop } from '@/types';

// Lazy-loaded: Leaflet + ShopMap chunk is only downloaded when visiting /map
const ShopMap = lazy(() => import('@/components/ShopMap'));

interface MapPageProps {
    settings: AppSettings;
    categories: Category[];
    shops: Shop[];
    products: Product[];
}

export default function MapPage({
    settings,
    categories,
    shops,
    products,
}: MapPageProps) {
    return (
        <MarketplaceLayout
            settings={settings}
            categories={categories}
            products={products}
            activeTab="map"
        >
            <SEOHead
                title={`Peta Geografis UMKM - ${settings.appName}`}
                description={`Peta geografis persebaran sentra industri kreatif dan UMKM Desa Samirono. Telusuri sebaran toko lokal secara spasial.`}
                keywords="Peta UMKM, Lokasi Toko Samirono, Spasial Getasan, Peta Geografis, Rute Rumah Produksi"
                image={settings.heroBanner}
                siteName={settings.appName}
            />

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <Suspense
                    fallback={
                        <div
                            className="w-full animate-pulse rounded-2xl border border-navy-200/60 bg-navy-50"
                            style={{ height: 500 }}
                            aria-label="Memuat peta..."
                            role="status"
                        />
                    }
                >
                    <ShopMap shops={shops} villageName={settings.villageName} />
                </Suspense>
            </div>
        </MarketplaceLayout>
    );
}
