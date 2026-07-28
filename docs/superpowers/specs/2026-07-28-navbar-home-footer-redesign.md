# Design Specification: Navbar, Home Page (/), and Footer Redesign

**Date:** 2026-07-28  
**Topic:** Modern Organic & Artisan Warmth UI Refinement  
**Target Components:**
- `resources/js/components/Navbar.tsx`
- `resources/js/layouts/marketplace-layout.tsx` (Footer & Container Layout)
- `resources/js/pages/welcome.tsx` (Home Catalog Landing Page)
- `resources/js/components/Hero.tsx` (Hero & Bento Grid Component)
- `resources/js/components/ProductCard.tsx` (Product card styling on Home Page)

---

## 1. Objectives & Aesthetics
- **Aesthetic Direction:** Modern Organic & Artisan Warmth. Grounded, authentic, accessible, and high-performance UI tailored for a rural village creative economy marketplace (*Samirono Etalase*, Kecamatan Getasan, Kab. Semarang).
- **Design Principles:**
  - **No AI Slop:** Handcrafted spacing, typography, contrast ratios, subtle micro-interactions, clean badge aesthetics, and non-generic color palettes.
  - **Color Palette:** Warm stone backgrounds (`stone-50/100`), crisp white card containers, deep forest emerald headers & accents (`emerald-900`, `emerald-800`, `emerald-600`), warm amber craft accents (`amber-700`), and dark obsidian footer (`stone-950`).
  - **Responsive & Accessible:** Translucent backdrop blur for sticky navigation, mobile drawer menu, clear keyboard/focus indicators, clean readable text size hierarchy.

---

## 2. Component Specifications

### 2.1 Sticky Translucent Navbar (`resources/js/components/Navbar.tsx`)
- **Container:** `sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-2xs`.
- **Top Utility Bar:**
  - Left: Village location pill (`Desa Samirono, Kecamatan Getasan`) + Helpline link with phone icon.
  - Right: Authentication actions (Login/Register buttons or User menu popover with Role tag `Admin` / `Merchant`).
- **Main Navigation Bar:**
  - **Brand Logo:** Modern emblem icon with `SAMIRONO ETALASE` title & `SENTRA UMKM DESA` subtitle.
  - **Nav Links:** Integrated pill buttons (`Etalase Warga`, `Daftar UMKM`, `Peta Geografis`) with active indicator backgrounds.
  - **Global Search:** Full-width rounded input with magnifying glass icon prefix, instant search handler, and clear button.
  - **Popovers:** Interactive Cart simulator dropdown (items list, total price, WhatsApp order link) and Notifications popover drawer.

### 2.2 Marketplace Layout & Footer (`resources/js/layouts/marketplace-layout.tsx`)
- **Main Wrapper:** `min-h-screen bg-stone-50/60 flex flex-col font-sans antialiased text-stone-900`.
- **Footer Container:** `bg-stone-950 text-stone-300 py-14 border-t border-stone-800 font-sans mt-12`.
- **Grid Layout (4 Columns):**
  - **Col 1 (Brand & Vision):** Emblem logo, concise tagline explaining Samirono's creative digital platform, and version/location badge.
  - **Col 2 (Sektor Kreatif):** Dynamic list of category links pointing to category-filtered catalog endpoints.
  - **Col 3 (Layanan & Navigasi):** Direct links for UMKM directory, Geographical Village Map, Merchant onboarding, & Admin verification panel.
  - **Col 4 (Pembayaran & Logistik):** High-clarity badge grid for payment options (QRIS, BCA, BRI, COD) and shipping choices (Kurir Dusun, Ambil di Rumah Produksi, J&T/JNE Getasan), with a prominent WhatsApp Helpline button.
- **Bottom Bar:** Monospace copyright line for KKN UNNES GIAT 16 DESA SAMIRONO with heart indicator.

### 2.3 Home Page Landing & Hero (`resources/js/pages/welcome.tsx` & `resources/js/components/Hero.tsx`)
- **Hero & Bento Grid:**
  - Primary promo highlight banner featuring high-resolution visuals of Samirono products (Mozzarella, Susu Segar, Bamboo Crafts, Cassava Snacks).
  - Metrics row (`34+ UMKM Warga`, `120+ Produk Lokal`, `100% Produk Desa`).
  - Interactive category selector chips with live count indicators.
- **Product Catalog Grid (`ProductCard.tsx`):**
  - Section header with category name & product count indicator.
  - 5-column responsive grid (mobile 2-col, tablet 3-col, desktop 5-col).
  - Cards featuring rounded-2xl borders, aspect-ratio square images, producer shop title with verification checkmark, category badge, and formatted IDR price.
- **Featured Merchants Row:**
  - "Kenali Pembuat" (Meet the Village Makers) showcase cards with logo, category, description, and direct link to shop profile.

---

## 3. Verification Plan
- Verify frontend rendering with zero build errors or missing icons.
- Test responsive layout on desktop and mobile viewports.
- Run tests (`php artisan test`) to ensure no regressions in routing or controllers.
