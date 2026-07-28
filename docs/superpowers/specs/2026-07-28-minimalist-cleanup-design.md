# Design Specification: Minimalist UI Cleanup & Stylish Footer

**Date:** 2026-07-28  
**Topic:** UI Label Decluttering & Minimalist Footer Refinement  
**Target Components:**
- `resources/js/layouts/marketplace-layout.tsx` (Footer & Page Layout)
- `resources/js/components/Navbar.tsx` (Utility Bar)
- `resources/js/components/Hero.tsx` (Hero Section)
- `resources/js/pages/welcome.tsx` (Home Catalog Page)
- `resources/js/pages/shops.tsx` (Shops Directory Page)

---

## 1. Objectives & Guidelines
- **Remove Excess Labels & Badges:** Eliminate cluttering badges (`Platform Ekonomi Warga`, `Sentra UMKM Warga`, `Katalog Sektor Kreatif:`, `Data Warga`).
- **Remove Payment & Delivery Sections:** Completely remove Payment System icons and Delivery Method chips from the Footer.
- **Ultra-Minimalist & Stylish Footer:**
  - Modern dark obsidian canvas (`bg-stone-950 text-stone-400 py-12 border-t border-stone-800`).
  - Top Row: Sleek logo (`SAMIRONO ETALASE`), brief village tagline, and clean horizontal link navigation.
  - Middle Row: Direct WhatsApp helpline link button with subtle hover styling.
  - Bottom Row: Monospace copyright line for KKN UNNES GIAT 16 DESA SAMIRONO.

---

## 2. Component Modifications

### 2.1 Footer (`resources/js/layouts/marketplace-layout.tsx`)
- Delete Payment System grid & icons (QRIS, BCA, BRI, COD).
- Delete Delivery Methods chips (Kurir Dusun, Ambil di Rumah Produksi, J&T/JNE).
- Refine layout into 2 minimalist rows:
  - Top Flex Row: Brand emblem + main navigation links (`Etalase Warga`, `Daftar UMKM`, `Peta Geografis`, `Daftarkan Toko`, `Admin Panel`).
  - Bottom Flex Row: Border divider + copyright line.

### 2.2 Navbar (`resources/js/components/Navbar.tsx`)
- Remove `"Platform Ekonomi Warga"` badge pill from top utility bar.

### 2.3 Hero & Welcome (`resources/js/components/Hero.tsx` & `welcome.tsx`)
- Remove `"Katalog Sektor Kreatif:"` text prefix above category buttons.
- Remove `"Sentra UMKM Warga"` badge pill in welcome page shop section.

### 2.4 Shops Page (`resources/js/pages/shops.tsx`)
- Remove `"Sentra UMKM Warga"` and `"Data Warga"` badge pills from the Bento hero header.

---

## 3. Verification Plan
- Run `./vendor/bin/pest` test suite.
- Build assets with `npm run build`.
