# Design Specification: ShopCard Component Redesign

- **Date**: 2026-07-31
- **Target File**: `resources/js/components/ShopCard.tsx`
- **Related Files**: `resources/js/components/shops/ShopListCard.tsx`, `resources/js/pages/shops.tsx`

---

## 1. Overview & Goals

The `ShopCard` component represents individual UMKM business profiles in grid views across the application (such as the main landing page catalog, `/shops` directory, and search results). This redesign elevates visual aesthetics, spatial hierarchy, permit badge indicators, and interactive micro-animations.

---

## 2. Design Breakdown

### 2.1 Hero Banner & Overlapping Avatar
- **Banner Container**: Height `h-44` with overflow hidden, rounded `rounded-3xl` top corners, and smooth 500ms image zoom on card hover (`group-hover:scale-105`).
- **Gradient Overlay**: Soft single linear gradient `from-navy-900/80 via-navy-900/20 to-transparent` to increase contrast for top floating badges.
- **Logo Avatar**: Elevated square container (`h-16 w-16`) positioned at `-top-10 left-5`, with `rounded-2xl border-4 border-white shadow-md bg-white`.

### 2.2 Glassmorphism Top Badges
- **Top-Left (Verified Badge)**: `inline-flex items-center gap-1 rounded-lg border border-pastel-teal/20 bg-white/95 px-2.5 py-1 text-xs font-black tracking-wider text-pastel-teal uppercase shadow-2xs backdrop-blur-md`.
- **Top-Right (Dusun Badge)**: `inline-flex items-center gap-1 rounded-lg bg-navy-900/85 px-2.5 py-1 text-xs font-bold tracking-wider text-navy-100 uppercase backdrop-blur-md`.

### 2.3 Badges Row & Typography
- **Permit & Category Badges**: Placed inline below logo avatar (`pt-9` padding top):
  - Category Badge: `bg-pastel-teal-light text-pastel-teal border border-pastel-teal/20 px-2.5 py-0.5 rounded-lg text-xs font-extrabold uppercase`.
  - NIB Badge: `bg-pastel-lavender-light text-pastel-lavender border border-pastel-lavender/20 px-2 py-0.5 rounded-lg text-xs font-black uppercase`.
  - Halal Badge: `bg-pastel-teal-light text-pastel-teal border border-pastel-teal/20 px-2 py-0.5 rounded-lg text-xs font-black uppercase`.
  - P-IRT Badge: `bg-pastel-peach-light text-pastel-peach border border-pastel-peach/20 px-2 py-0.5 rounded-lg text-xs font-black uppercase`.
- **Title**: `text-lg font-black text-navy-900 group-hover:text-pastel-teal transition-colors leading-snug`.
- **Owner Name**: `text-xs font-bold tracking-wider text-navy-400 uppercase` with owner name highlighted in `font-black text-navy-700`.
- **Description**: Truncated 2-line text `line-clamp-2 text-xs leading-relaxed text-navy-600 sm:text-sm`.

### 2.4 Metadata Footer & Actions
- **Metadata Bar**:
  - Address with `MapPin` icon (`text-pastel-teal`).
  - Product count badge with `ShoppingBag` icon (`text-pastel-teal`) and count text.
  - Operating hours with `Clock` icon (`text-pastel-teal`).
- **Action Buttons**:
  - **Kontak WA**: WhatsApp trigger with `getWhatsAppLink`, pre-filled message, `Phone` icon, border `border-navy-200` with hover state `hover:bg-pastel-teal-light hover:text-pastel-teal hover:border-pastel-teal/30`.
  - **Katalog**: Link to `/shops/${shop.id}`, `bg-pastel-teal text-white hover:bg-pastel-teal/90 shadow-2xs group/btn` with right arrow animation (`group-hover/btn:translate-x-1`).

---

## 3. Verification Plan

- Run `npm run build` to verify frontend compilation.
- Run `./vendor/bin/pest --filter=MarketplaceControllerTest` to ensure no route regressions.
