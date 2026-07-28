# Design Specification: Shops Page (/shops) Bento Hero & Clean Directory

**Date:** 2026-07-28  
**Topic:** 2026 Trending Asymmetric Bento Hero for /shops  
**Target Components:**
- `resources/js/pages/shops.tsx` (UMKM Directory Page)
- `resources/js/components/ShopCard.tsx` (Shop Card Component)

---

## 1. Objectives & Visual Direction
- **Aesthetic Direction:** 2026 Asymmetric Bento Hero & Calm Organic Directory.
- **Key Changes:**
  - Completely remove the permit filter bar ("Filter Izin" NIB/Halal/P-IRT buttons removed).
  - Replace generic banner with an **Asymmetric Bento Grid Hero Header**:
    - **Main Bento Tile (Left, 8 Cols):** Warm editorial title (`Direktori Rumah Produksi & Usaha Warga`), village description, integrated search box, and category dropdown.
    - **Metrics Bento Tile (Right, 4 Cols):** Minimalist card featuring live stats (`34+ Rumah Produksi`, `120+ Produk Lokal`, `Desa Samirono, Getasan`).
  - Retain `rounded-3xl` stone cards (`ShopCard.tsx`) with verification pills, dusun location tags, and WhatsApp seller contact actions.

---

## 2. Component Specifications

### 2.1 Directory Page Layout (`resources/js/pages/shops.tsx`)
- **Bento Hero Grid Layout:** `grid grid-cols-1 lg:grid-cols-12 gap-5`.
- **Tile 1 (Main Hero Tile - `lg:col-span-8`):**
  - `bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs flex flex-col justify-between space-y-6`.
  - Top Badge: `Sentra Ekonomi Warga Desa Samirono`.
  - Editorial Title: `Rumah Produksi & Usaha Lokal`.
  - Search & Category Toolbar: Inline search box with icon + category select menu.
- **Tile 2 (Metrics Tile - `lg:col-span-4`):**
  - `bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xs flex flex-col justify-between space-y-6`.
  - Live metric pills for total shops and village location.

---

## 3. Verification Plan
- Run Pest test suite (`./vendor/bin/pest`).
- Verify Vite frontend build (`npm run build`).
