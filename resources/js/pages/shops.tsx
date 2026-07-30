import React, { useMemo } from 'react';
import SEOHead from '@/components/SEOHead';
import ShopCard from '@/components/ShopCard';
import ShopEmptyState from '@/components/shops/ShopEmptyState';
import ShopFilterToolbar from '@/components/shops/ShopFilterToolbar';
import ShopHeroHeader from '@/components/shops/ShopHeroHeader';
import ShopListCard from '@/components/shops/ShopListCard';
import { useShopFilters } from '@/hooks/useShopFilters';
import MarketplaceLayout from '@/layouts/marketplace-layout';
import type { AppSettings, Category, Product, Shop } from '@/types';

interface ShopsProps {
    settings: AppSettings;
    categories: Category[];
    shops: (Shop & { productCount?: number })[];
    products: Product[];
}

export default function Shops({
    settings,
    categories,
    shops,
    products,
}: ShopsProps) {
    const {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedDusun,
        setSelectedDusun,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        filteredShops,
        uniqueDusuns,
        resetFilters,
    } = useShopFilters(shops);

    const verifiedShopsCount = useMemo(
        () => shops.filter((s) => s.isVerified).length,
        [shops],
    );

    return (
        <MarketplaceLayout
            settings={settings}
            categories={categories}
            products={products}
            activeTab="shops"
        >
            <SEOHead
                title={`Daftar UMKM Warga - ${settings.appName}`}
                description={`Direktori lengkap Pelaku Usaha Mikro Kecil dan Menengah (UMKM) Desa Samirono. Temukan rumah produksi, detail kontak, dan lokasi geografis mitra ekonomi desa.`}
                keywords="Direktori UMKM, Daftar Toko Desa Samirono, Pelaku Ekonomi Kreatif, Getasan, Semarang, Profil Rumah Produksi Warga"
                image={settings.heroBanner}
                siteName={settings.appName}
            />

            <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 font-sans sm:px-6 lg:px-8">
                {/* Hero Overview Header */}
                <ShopHeroHeader
                    totalShops={shops.length}
                    verifiedShopsCount={verifiedShopsCount}
                    dusunCount={uniqueDusuns.length}
                />

                {/* Integrated Control Toolbar */}
                <ShopFilterToolbar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    selectedDusun={selectedDusun}
                    onDusunChange={setSelectedDusun}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    categories={categories}
                    uniqueDusuns={uniqueDusuns}
                    totalResults={filteredShops.length}
                    totalShops={shops.length}
                />

                {/* Directory Listings Grid or List */}
                {filteredShops.length === 0 ? (
                    <ShopEmptyState onReset={resetFilters} />
                ) : viewMode === 'grid' ? (
                    <ul className="grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredShops.map((shop) => (
                            <li key={shop.id}>
                                <ShopCard
                                    shop={shop}
                                    productCount={shop.productCount || 0}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <ul className="flex list-none flex-col gap-4 p-0">
                        {filteredShops.map((shop) => (
                            <li key={shop.id}>
                                <ShopListCard
                                    shop={shop}
                                    productCount={shop.productCount || 0}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </MarketplaceLayout>
    );
}
