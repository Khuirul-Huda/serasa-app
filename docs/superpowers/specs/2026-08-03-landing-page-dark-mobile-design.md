# Design Specification: Landing Page Mobile & Dark Mode Upgrade

- **Date**: 2026-08-03
- **Scope**: Landing Page (`welcome.tsx`, `MarketplaceLayout.tsx`, `Hero.tsx`, `ProductCard.tsx`, `HeroSearchSection.tsx`, `PromoSlider.tsx`, `FlashSaleCard.tsx`)
- **Objective**: Full dark mode support and responsive mobile UX optimization across the Samirono Etalase marketplace landing page.

---

## 1. Dark Mode Color System

All landing page components will support the `.dark` class using the defined Navy token system:

- **Root & Container Background**:
  - Light: `bg-navy-50/40`
  - Dark: `dark:bg-navy-950/90`
- **Card & Component Surfaces**:
  - Light: `bg-white`
  - Dark: `dark:bg-navy-900/90`
- **Borders & Dividers**:
  - Light: `border-navy-200/60` or `border-navy-100`
  - Dark: `dark:border-navy-800` or `dark:border-navy-800/80`
- **Typography Scale**:
  - Headings & Titles: `text-navy-900 dark:text-navy-100`
  - Subtitles & Descriptions: `text-navy-700 dark:text-navy-300`
  - Meta Info & Subtext: `text-navy-500 dark:text-navy-400`
- **Featured Section Surfaces**:
  - Light: `bg-pastel-teal-light/30 border-pastel-teal/15`
  - Dark: `dark:bg-navy-900/50 dark:border-navy-800`

---

## 2. Mobile Responsive Layout Enhancements

- **Category Pills Navigation**:
  - Add horizontal swipe scrolling on mobile screens with `overflow-x-auto snap-x no-scrollbar pb-1` and negative margins `-mx-4 px-4 sm:mx-0 sm:px-0`.
- **Hero & Banner Slider**:
  - Responsive aspect ratios: `aspect-[16/10]` on mobile, `aspect-[16/9]` on tablet, `aspect-[21/9]` on desktop.
  - Controls & badge placement adjusted for touch devices.
- **Product Grid**:
  - `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4`.
  - Touch-friendly 44px minimum touch targets for "Beli" buttons and shop links.
- **Pagination Bar**:
  - Stack page counter text and navigation buttons vertically on `< 640px` viewports (`flex-col sm:flex-row`).

---

## 3. Component Change List

1. `resources/js/layouts/marketplace-layout.tsx`: Update layout container background and footer colors for `.dark`.
2. `resources/js/pages/welcome.tsx`: Update catalog title, count badge, empty state container, pagination controls, and featured shop cards with `dark:` variants and responsive spacing.
3. `resources/js/components/Hero.tsx`: Update section background, radial pattern, and subcomponents.
4. `resources/js/components/hero/HeroSearchSection.tsx`: Add horizontal scrolling to category chips and dark mode input styling.
5. `resources/js/components/hero/PromoSlider.tsx` & `FlashSaleCard.tsx`: Add dark mode surface background and borders.
6. `resources/js/components/ProductCard.tsx`: Update card background, image overlay, title hover, price text, and footer divider for dark mode.

---

## 4. Verification & Testing Plan

- Automated test execution with `vendor/bin/pest`.
- Visual inspection across simulated mobile viewports (`375px`, `414px`, `768px`, `1280px`).
- Dark mode toggle verification (confirming zero hardcoded unreadable text or white flash cards).
