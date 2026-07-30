# Design Specification: Shops Page Directory Overhaul

- **Date**: 2026-07-31
- **Target Page**: `/shops` (`resources/js/pages/shops.tsx`)
- **Controller**: `App\Http\Controllers\MarketplaceController@shops`

---

## 1. Overview & Goals

The `/shops` directory page is the primary showcase for Pelaku UMKM (Local Businesses & Producers) in Desa Samirono. This overhaul elevates the user experience and software architecture by:
- Modernizing UI/UX aesthetics using responsive Bento Grid headers, filter controls (Search, Category, Dusun, Sorting), and dual view modes (Grid vs List).
- Restructuring codebase to follow **SOLID Principles**, specifically Single Responsibility (SRP) and DRY, by extracting reusable sub-components and a custom filter hook (`useShopFilters`).
- Eliminating clutter while enhancing usability, micro-interactions, and accessibility.

---

## 2. Architecture & Directory Structure

```
resources/js/
├── hooks/
│   └── useShopFilters.ts                # Custom hook for search, category/dusun filter, sort & view mode
├── components/
│   └── shops/
│       ├── ShopHeroHeader.tsx           # Editorial bento banner & live village metrics
│       ├── ShopFilterToolbar.tsx        # Search, category select, dusun select, sorting & view switcher
│       ├── ShopListCard.tsx             # Horizontal list card view component
│       └── ShopEmptyState.tsx           # Accessible empty search state with reset CTA
└── pages/
    └── shops.tsx                        # Main page container leveraging custom hook & sub-components
```

---

## 3. Component Breakdown & Responsibilities

### 3.1 `useShopFilters.ts` (Custom Hook)
- **State**:
  - `searchQuery` (string)
  - `selectedCategory` (string)
  - `selectedDusun` (string)
  - `sortBy` ('featured' | 'most-products' | 'name-asc')
  - `viewMode` ('grid' | 'list')
- **Computed Outputs**:
  - `uniqueDusuns`: Extracted dynamically from shop props.
  - `filteredShops`: Memoized array of filtered & sorted shop items.
  - `resetFilters`: Resets search and dropdown filters to default.

### 3.2 `ShopHeroHeader.tsx`
- **Left Tile (8 cols)**: Title ("Direktori Rumah Produksi Desa Samirono"), description, location badge.
- **Right Tile (4 cols)**: Dark Navy background (`bg-navy-900`), displaying live metrics: total shops count, verified partners count, and Dusun location count.

### 3.3 `ShopFilterToolbar.tsx`
- Search bar with clear button.
- Category selection dropdown.
- Dusun sub-location selection dropdown.
- Sorting dropdown (*Terbaru*, *Produk Terbanyak*, *Nama A-Z*).
- Grid View vs List View toggle buttons.
- Directory count indicator ("Menampilkan X dari Y UMKM").

### 3.4 `ShopListCard.tsx`
- Compact horizontal row format for list view option.
- Left thumbnail image/logo, center info (name, owner, dusun, category, product count, working hours), right CTA buttons (WhatsApp & Catalog link).

### 3.5 `ShopEmptyState.tsx`
- Friendly state when search/filter returns zero results, with a clear "Reset Filter" button.

---

## 4. Verification & Quality Assurance

- **Pest Unit/Feature Tests**: Run `php artisan test --compact --filter=MarketplaceControllerTest` to ensure routes and responses pass cleanly.
- **Frontend Code Formatting**: Run ESLint / Prettier check or verify TSX syntax.
- **PHP Code Formatting**: Run `vendor/bin/pint --format agent` if PHP files are modified.
