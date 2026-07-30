# Shops Page Directory Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the `/shops` directory page UI/UX (Bento Hero, Dusun/Category filters, Sorting, Grid/List view switcher) and clean up code architecture by extracting modular components and a custom hook.

**Architecture:** Create `useShopFilters` custom hook to handle filter, search, sort, and view mode state. Extract sub-components `ShopHeroHeader`, `ShopFilterToolbar`, `ShopListCard`, and `ShopEmptyState` under `resources/js/components/shops/` to adhere strictly to SOLID Single Responsibility and DRY principles.

**Tech Stack:** Inertia.js v3, React 19, Tailwind CSS v4, Lucide React icons, TypeScript, Pest 4.

## Global Constraints

- Keep existing color scheme: Navy (`navy-900`, `navy-800`, `navy-50`), Pastel accents (`pastel-teal`, `pastel-mint`, `pastel-peach`, `pastel-lavender`).
- Do not show permit filters (NIB, Halal, P-IRT) in the filter toolbar (explicit user instruction).
- Follow existing codebase patterns and TypeScript types.
- Ensure all interactive controls have proper ARIA attributes.

---

### Task 1: Create `useShopFilters` Custom Hook

**Files:**
- Create: `resources/js/hooks/useShopFilters.ts`
- Test: `tests/Feature/MarketplaceControllerTest.php`

**Interfaces:**
- Consumes: `Shop` objects array.
- Produces: `useShopFilters(shops: (Shop & { productCount?: number })[])` returning `{ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, selectedDusun, setSelectedDusun, sortBy, setSortBy, viewMode, setViewMode, filteredShops, uniqueDusuns, resetFilters }`.

- [ ] **Step 1: Write `useShopFilters.ts` implementation**

```typescript
import { useState, useMemo } from 'react';
import type { Shop } from '@/types';

export type SortOption = 'featured' | 'most-products' | 'name-asc';
export type ViewMode = 'grid' | 'list';

export function useShopFilters(shops: (Shop & { productCount?: number })[]) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDusun, setSelectedDusun] = useState('all');
    const [sortBy, setSortBy] = useState<SortOption>('featured');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    const uniqueDusuns = useMemo(() => {
        const dusuns = new Set<string>();
        shops.forEach((s) => {
            if (s.dusun) dusuns.add(s.dusun);
        });
        return Array.from(dusuns).sort();
    }, [shops]);

    const filteredShops = useMemo(() => {
        let result = shops.filter((shop) => {
            const query = searchQuery.toLowerCase().trim();
            const matchSearch =
                !query ||
                shop.name.toLowerCase().includes(query) ||
                shop.ownerName.toLowerCase().includes(query) ||
                shop.dusun.toLowerCase().includes(query);

            const matchCategory =
                selectedCategory === 'all' || shop.category === selectedCategory;

            const matchDusun =
                selectedDusun === 'all' || shop.dusun === selectedDusun;

            return matchSearch && matchCategory && matchDusun;
        });

        // Apply sorting
        if (sortBy === 'most-products') {
            result = [...result].sort((a, b) => (b.productCount || 0) - (a.productCount || 0));
        } else if (sortBy === 'name-asc') {
            result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        }

        return result;
    }, [shops, searchQuery, selectedCategory, selectedDusun, sortBy]);

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSelectedDusun('all');
        setSortBy('featured');
    };

    return {
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
    };
}
```

- [ ] **Step 2: Commit custom hook**

```bash
git add resources/js/hooks/useShopFilters.ts
git commit -m "feat: add useShopFilters custom hook for shops directory"
```

---

### Task 2: Create `ShopHeroHeader` Component

**Files:**
- Create: `resources/js/components/shops/ShopHeroHeader.tsx`

**Interfaces:**
- Consumes: `{ totalShops: number; verifiedShopsCount: number; dusunCount: number }`
- Produces: React Hero component rendering dual-column bento overview and village metrics.

- [ ] **Step 1: Write `ShopHeroHeader.tsx`**

```tsx
import { Store, ShieldCheck, MapPin } from 'lucide-react';
import React from 'react';

interface ShopHeroHeaderProps {
    totalShops: number;
    verifiedShopsCount: number;
    dusunCount: number;
}

export default function ShopHeroHeader({
    totalShops,
    verifiedShopsCount,
    dusunCount,
}: ShopHeroHeaderProps) {
    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Bento Tile 1: Editorial Overview */}
            <div className="relative flex flex-col justify-between space-y-6 overflow-hidden rounded-3xl border border-navy-200/60 bg-white p-6 shadow-2xs sm:p-8 lg:col-span-8">
                <div className="space-y-3">
                    <span className="block font-mono text-xs font-bold tracking-wider text-navy-400 uppercase">
                        Kecamatan Getasan, Kabupaten Semarang
                    </span>

                    <h1 className="sm:text-3.5xl text-2xl leading-tight font-black tracking-tight text-navy-900 uppercase">
                        Direktori Rumah Produksi{' '}
                        <span className="text-pastel-teal">Desa Samirono</span>
                    </h1>

                    <p className="max-w-xl text-xs leading-relaxed font-normal text-navy-500 sm:text-sm">
                        Temukan produsen olahan susu murni, pengrajin bambu, dan kuliner lokal Samirono. Hubungi langsung pemilik toko atau jelajahi katalog produk mereka.
                    </p>
                </div>
            </div>

            {/* Bento Tile 2: Live Village Metrics Card */}
            <div className="relative flex flex-col justify-between space-y-6 overflow-hidden rounded-3xl border border-navy-800 bg-navy-900 p-6 text-white shadow-md sm:p-8 lg:col-span-4">
                <div className="space-y-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pastel-teal text-white">
                        <Store className="h-5 w-5" />
                    </div>

                    <div>
                        <span className="text-3.5xl block font-black tracking-tight text-white sm:text-4xl">
                            {totalShops}
                        </span>
                        <span className="mt-1 block text-xs font-bold tracking-wider text-navy-400 uppercase">
                            Usaha & Rumah Produksi Terdaftar
                        </span>
                    </div>
                </div>

                <div className="space-y-2 border-t border-navy-800/80 pt-4">
                    <div className="flex items-center justify-between text-xs font-medium text-navy-300">
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5 text-pastel-mint" />
                            <span>Toko Terverifikasi</span>
                        </span>
                        <span className="font-bold text-white">
                            {verifiedShopsCount} Mitra
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium text-navy-300">
                        <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-pastel-peach" />
                            <span>Cakupan Wilayah</span>
                        </span>
                        <span className="font-bold text-white">
                            {dusunCount} Dusun
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
```

- [ ] **Step 2: Commit component**

```bash
git add resources/js/components/shops/ShopHeroHeader.tsx
git commit -m "feat: add ShopHeroHeader bento component"
```

---

### Task 3: Create `ShopFilterToolbar` Component

**Files:**
- Create: `resources/js/components/shops/ShopFilterToolbar.tsx`

**Interfaces:**
- Consumes: Filter states and callbacks (`searchQuery`, `selectedCategory`, `selectedDusun`, `sortBy`, `viewMode`, `categories`, `uniqueDusuns`, `totalResults`, `totalShops`, handlers).
- Produces: Integrated filter toolbar with search, category dropdown, dusun dropdown, sort dropdown, view mode toggle, and result counter.

- [ ] **Step 1: Write `ShopFilterToolbar.tsx`**

```tsx
import { Search, LayoutGrid, List, X } from 'lucide-react';
import React from 'react';
import type { Category } from '@/types';
import type { SortOption, ViewMode } from '@/hooks/useShopFilters';

interface ShopFilterToolbarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    selectedCategory: string;
    onCategoryChange: (value: string) => void;
    selectedDusun: string;
    onDusunChange: (value: string) => void;
    sortBy: SortOption;
    onSortChange: (value: SortOption) => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    categories: Category[];
    uniqueDusuns: string[];
    totalResults: number;
    totalShops: number;
}

export default function ShopFilterToolbar({
    searchQuery,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    selectedDusun,
    onDusunChange,
    sortBy,
    onSortChange,
    viewMode,
    onViewModeChange,
    categories,
    uniqueDusuns,
    totalResults,
    totalShops,
}: ShopFilterToolbarProps) {
    return (
        <div className="space-y-4 rounded-3xl border border-navy-200/60 bg-white p-5 shadow-2xs sm:p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <Search
                        className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-navy-400"
                        aria-hidden="true"
                    />
                    <input
                        type="search"
                        placeholder="Cari nama toko, pemilik, atau dusun..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full rounded-2xl border border-navy-200/60 bg-navy-50 py-2.5 pr-9 pl-10 text-xs font-medium text-navy-800 placeholder-navy-400 transition-all focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none"
                        aria-label="Cari nama toko, pemilik, atau dusun"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-navy-400 hover:text-navy-700"
                            aria-label="Bersihkan pencarian"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="cursor-pointer rounded-2xl border border-navy-200/60 bg-white px-3.5 py-2.5 text-xs font-bold tracking-wider text-navy-700 uppercase shadow-2xs focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none"
                        aria-label="Filter kategori toko"
                    >
                        <option value="all">Semua Kategori ({categories.length})</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    {/* Dusun Filter */}
                    <select
                        value={selectedDusun}
                        onChange={(e) => onDusunChange(e.target.value)}
                        className="cursor-pointer rounded-2xl border border-navy-200/60 bg-white px-3.5 py-2.5 text-xs font-bold tracking-wider text-navy-700 uppercase shadow-2xs focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none"
                        aria-label="Filter dusun toko"
                    >
                        <option value="all">Semua Dusun</option>
                        {uniqueDusuns.map((dusun) => (
                            <option key={dusun} value={dusun}>
                                {dusun}
                            </option>
                        ))}
                    </select>

                    {/* Sort Selector */}
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value as SortOption)}
                        className="cursor-pointer rounded-2xl border border-navy-200/60 bg-white px-3.5 py-2.5 text-xs font-bold tracking-wider text-navy-700 uppercase shadow-2xs focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none"
                        aria-label="Urutkan toko"
                    >
                        <option value="featured">Urutkan: Featured</option>
                        <option value="most-products">Produk Terbanyak</option>
                        <option value="name-asc">Nama (A-Z)</option>
                    </select>

                    {/* View Mode Switcher */}
                    <div className="flex items-center rounded-2xl border border-navy-200/60 bg-navy-50 p-1">
                        <button
                            onClick={() => onViewModeChange('grid')}
                            className={`rounded-xl p-1.5 transition-all ${
                                viewMode === 'grid'
                                    ? 'bg-white text-pastel-teal shadow-2xs'
                                    : 'text-navy-400 hover:text-navy-700'
                            }`}
                            aria-label="Tampilan Grid"
                            title="Tampilan Grid"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => onViewModeChange('list')}
                            className={`rounded-xl p-1.5 transition-all ${
                                viewMode === 'list'
                                    ? 'bg-white text-pastel-teal shadow-2xs'
                                    : 'text-navy-400 hover:text-navy-700'
                            }`}
                            aria-label="Tampilan List"
                            title="Tampilan List"
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Status Bar */}
            <div className="flex items-center justify-between border-t border-navy-100 pt-3 text-xs font-medium text-navy-500">
                <span>
                    Menampilkan <strong className="font-bold text-navy-900">{totalResults}</strong> dari{' '}
                    <strong className="font-bold text-navy-900">{totalShops}</strong> Rumah Produksi
                </span>
            </div>
        </div>
    );
}
```

- [ ] **Step 2: Commit component**

```bash
git add resources/js/components/shops/ShopFilterToolbar.tsx
git commit -m "feat: add ShopFilterToolbar component with search, filters, sort and view toggle"
```

---

### Task 4: Create `ShopListCard` Component & Refactor `ShopEmptyState`

**Files:**
- Create: `resources/js/components/shops/ShopListCard.tsx`
- Create: `resources/js/components/shops/ShopEmptyState.tsx`

**Interfaces:**
- Consumes: `{ shop: Shop; productCount: number }` for `ShopListCard`.
- Consumes: `{ onReset: () => void }` for `ShopEmptyState`.

- [ ] **Step 1: Write `ShopListCard.tsx`**

```tsx
import { Link } from '@inertiajs/react';
import { MapPin, Phone, CheckCircle2, ShoppingBag, ArrowRight, Clock } from 'lucide-react';
import React from 'react';
import type { Shop } from '@/types';
import { getWhatsAppLink } from '@/utils';

interface ShopListCardProps {
    shop: Shop;
    productCount: number;
}

export default function ShopListCard({ shop, productCount }: ShopListCardProps) {
    const handleContactWhatsApp = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const message = `Halo ${shop.ownerName} dari ${shop.name}, saya melihat profil toko digital Anda di platform SERASA Desa Samirono. Saya ingin menanyakan produk-produk kreatif Anda.`;
        const url = getWhatsAppLink(shop.phone, message);
        window.open(url, '_blank');
    };

    return (
        <article
            className="group flex flex-col overflow-hidden rounded-3xl border border-navy-200/60 bg-white font-sans shadow-2xs transition-all duration-300 hover:border-pastel-teal hover:shadow-md sm:flex-row"
            id={`shop-list-card-${shop.id}`}
        >
            {/* Left Image / Banner */}
            <Link
                href={`/shops/${shop.id}`}
                className="relative block h-40 shrink-0 overflow-hidden bg-navy-50 sm:h-auto sm:w-56 lg:w-64"
            >
                <img
                    src={shop.image}
                    alt={`Banner ${shop.name}`}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-95 transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-navy-900/60 via-transparent to-transparent sm:bg-none" />

                {/* Logo Avatar Overlap */}
                <div className="absolute bottom-3 left-3 h-12 w-12 overflow-hidden rounded-xl border-2 border-white bg-white shadow-xs sm:top-3 sm:bottom-auto">
                    <img
                        src={shop.logo}
                        alt={`Logo ${shop.name}`}
                        className="h-full w-full object-cover"
                    />
                </div>
            </Link>

            {/* Content Details */}
            <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg border border-pastel-teal/20 bg-pastel-teal-light px-2.5 py-0.5 text-xs font-extrabold tracking-wider text-pastel-teal uppercase">
                            {shop.category}
                        </span>
                        {shop.isVerified && (
                            <span className="inline-flex items-center gap-1 rounded-lg border border-pastel-teal/20 bg-white px-2 py-0.5 text-xs font-black tracking-wider text-pastel-teal uppercase shadow-2xs">
                                <CheckCircle2 className="h-3.5 w-3.5 text-pastel-teal" />
                                <span>Terverifikasi</span>
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1 rounded-lg bg-navy-100 px-2 py-0.5 text-xs font-bold text-navy-700">
                            <MapPin className="h-3 w-3 text-pastel-peach" />
                            <span>{shop.dusun}</span>
                        </span>
                    </div>

                    <h3 className="font-sans text-base leading-snug font-black text-navy-900 transition-colors group-hover:text-pastel-teal sm:text-lg">
                        <Link href={`/shops/${shop.id}`}>{shop.name}</Link>
                    </h3>

                    <p className="text-xs font-bold tracking-wider text-navy-400 uppercase">
                        Pemilik: <span className="font-black text-navy-700">{shop.ownerName}</span>
                    </p>

                    <p className="line-clamp-2 text-xs leading-relaxed text-navy-600 sm:text-sm">
                        {shop.description}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="mt-4 flex flex-col gap-3 border-t border-navy-100 pt-3.5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-navy-500">
                        <div className="flex items-center gap-1 font-bold text-navy-700">
                            <ShoppingBag className="h-3.5 w-3.5 text-pastel-teal" />
                            <span>{productCount} Produk</span>
                        </div>
                        {shop.jamKerja && (
                            <div className="flex items-center gap-1 text-navy-500">
                                <Clock className="h-3.5 w-3.5 text-pastel-teal" />
                                <span>{shop.jamKerja}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleContactWhatsApp}
                            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-navy-200 px-3 py-2 text-xs font-extrabold tracking-wider text-navy-700 uppercase shadow-2xs transition-all hover:border-pastel-teal/30 hover:bg-pastel-teal-light hover:text-pastel-teal"
                        >
                            <Phone className="h-3.5 w-3.5 text-pastel-teal" />
                            <span>WA</span>
                        </button>
                        <Link
                            href={`/shops/${shop.id}`}
                            className="group/btn flex items-center justify-center gap-1.5 rounded-xl bg-pastel-teal px-3 py-2 text-xs font-extrabold tracking-wider text-white uppercase shadow-2xs transition-all hover:bg-pastel-teal/90"
                        >
                            <span>Katalog</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
```

- [ ] **Step 2: Write `ShopEmptyState.tsx`**

```tsx
import { Store } from 'lucide-react';
import React from 'react';

interface ShopEmptyStateProps {
    onReset: () => void;
}

export default function ShopEmptyState({ onReset }: ShopEmptyStateProps) {
    return (
        <div className="mx-auto max-w-lg rounded-3xl border border-navy-200/60 bg-white p-12 text-center shadow-2xs sm:p-16">
            <Store
                className="mx-auto mb-4 h-12 w-12 text-navy-300"
                aria-hidden="true"
            />
            <h2 className="text-sm font-extrabold text-navy-800">
                Toko Tidak Ditemukan
            </h2>
            <p className="mt-1 text-xs text-navy-500">
                Kami tidak menemukan toko yang cocok dengan pencarian atau filter Anda. Silakan cari dengan kata kunci lain.
            </p>
            <button
                onClick={onReset}
                className="mt-5 cursor-pointer rounded-xl bg-pastel-teal px-5 py-2.5 text-xs font-extrabold tracking-wider text-white uppercase shadow-2xs transition-all hover:bg-pastel-teal/90"
            >
                Reset Filter Toko
            </button>
        </div>
    );
}
```

- [ ] **Step 3: Commit components**

```bash
git add resources/js/components/shops/ShopListCard.tsx resources/js/components/shops/ShopEmptyState.tsx
git commit -m "feat: add ShopListCard and ShopEmptyState components"
```

---

### Task 5: Refactor `shops.tsx` Page Container

**Files:**
- Modify: `resources/js/pages/shops.tsx`

**Interfaces:**
- Assembles `useShopFilters`, `ShopHeroHeader`, `ShopFilterToolbar`, `ShopCard` (Grid View), `ShopListCard` (List View), and `ShopEmptyState`.

- [ ] **Step 1: Replace `shops.tsx` with refactored clean modular structure**

```tsx
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
```

- [ ] **Step 2: Verify PHP Pest tests and build**

Run: `php artisan test --compact --filter=MarketplaceControllerTest`

- [ ] **Step 3: Commit refactored shops page**

```bash
git add resources/js/pages/shops.tsx
git commit -m "feat: refactor shops page to use modular components and custom filter hook"
```
