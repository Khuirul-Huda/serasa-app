# Landing Page UX Overhaul — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all UI/UX issues identified in the MNC-level roast — consolidate search, fix fake flash sale, reduce above-fold bloat, fix accessibility, improve mobile UX, convert clickable divs to Links, and tighten visual hierarchy.

**Architecture:** Surgical edits to existing React components (no new files except a `ProductCardSkeleton` enhancement). No backend changes — the controller already does server-side search/filter. Frontend-only refactor touching: `welcome.tsx`, `Hero.tsx`, `HeroSearchSection.tsx`, `FlashSaleCard.tsx`, `PromoSlider.tsx`, `ProductCard.tsx`, `Navbar.tsx`, `marketplace-layout.tsx`, `MobileMenu.tsx`.

**Tech Stack:** React 19, Inertia.js v3 (`<Link>`, `prefetch`), TailwindCSS v4 (`@custom-variant dark`), Lucide React.

## Global Constraints

- Preserve all existing props, types, and business logic (filters, pagination, search state).
- Follow existing Navy oklch color token mapping.
- All interactive elements ≥44px touch targets on mobile.
- Maintain dark mode parity for every change.
- No new npm dependencies.
- No backend PHP changes (controller is already solid).

---

### Task 1: Consolidate Search — Kill the Hero Search Bar

**Problem:** Three search inputs on one page (navbar desktop, navbar mobile, hero search section). Cognitive overload.

**Fix:** Remove the large hero search bar + search button. Keep only the navbar search (desktop + mobile). Move hot search tags and category pills directly into the welcome page above the product grid.

**Files:**
- Modify: `resources/js/components/hero/HeroSearchSection.tsx` → convert to a category-only filter bar (no search input)
- Modify: `resources/js/components/Hero.tsx` → remove search props passed to HeroSearchSection
- Modify: `resources/js/pages/welcome.tsx` → move hot search tags inline above catalog

**Interfaces:**
- Consumes: `HeroSearchSectionProps` (remove `searchQuery`, `setSearchQuery`)
- Produces: Simplified `CategoryFilterBar` rendering

- [ ] **Step 1: Refactor HeroSearchSection to remove search input**

In `resources/js/components/hero/HeroSearchSection.tsx`, remove the search input + search button. Keep only the category pills and hot search tags. Rename component to better reflect purpose.

```tsx
// resources/js/components/hero/HeroSearchSection.tsx
import { Tag } from 'lucide-react';
import React from 'react';
import type { AppSettings, Category } from '@/types';

interface HeroSearchSectionProps {
    settings: AppSettings;
    categories: Category[];
    selectedCategory: string;
    setSelectedCategory: (catId: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    totalProducts: number;
}

export default function HeroSearchSection({
    settings,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    totalProducts,
}: HeroSearchSectionProps) {
    const hotSearches = settings.hotSearches || [
        { label: 'Susu Segar', query: 'susu' },
        { label: 'Keju Artisan', query: 'keju' },
        { label: 'Tas Anyaman', query: 'tas' },
        { label: 'Kopi Merbabu', query: 'kopi' },
        { label: 'Keripik Jamur', query: 'keripik' },
        { label: 'Gethuk Keju', query: 'gethuk' },
    ];

    return (
        <div className="space-y-3 rounded-2xl border border-navy-200/60 bg-white p-3 shadow-2xs sm:p-4 dark:border-navy-800 dark:bg-navy-900/90">
            {/* Quick Search Tag Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex shrink-0 items-center gap-1 text-[11px] font-extrabold tracking-wider text-navy-400 uppercase dark:text-navy-500">
                    <Tag className="h-3 w-3 text-pastel-coral" />
                    <span>Populer:</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                    {hotSearches.slice(0, 5).map((item) => (
                        <button
                            key={item.query}
                            onClick={() => setSearchQuery(item.query)}
                            className={`min-h-[36px] cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold transition-all sm:min-h-[auto] sm:px-2.5 sm:py-1 ${
                                searchQuery === item.query
                                    ? 'shadow-3xs bg-pastel-teal text-white'
                                    : 'bg-navy-100/60 text-navy-700 hover:bg-pastel-teal-light hover:text-pastel-teal dark:bg-navy-950 dark:text-navy-300 dark:hover:bg-navy-800 dark:hover:text-pastel-teal'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Category Filter Pills Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:flex-wrap sm:gap-2 sm:overflow-visible sm:pb-0">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`min-h-[36px] shrink-0 cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-all sm:min-h-[auto] sm:px-3.5 sm:py-2 ${
                        selectedCategory === 'all'
                            ? 'bg-pastel-teal text-white shadow-xs'
                            : 'border border-navy-200/50 bg-navy-50 text-navy-600 hover:bg-navy-100 dark:border-navy-800 dark:bg-navy-950 dark:text-navy-300 dark:hover:bg-navy-800'
                    }`}
                >
                    Semua ({totalProducts})
                </button>

                {categories.slice(0, 5).map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`min-h-[36px] shrink-0 cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-all sm:min-h-[auto] sm:px-3.5 sm:py-2 ${
                            selectedCategory === cat.id
                                ? 'bg-pastel-teal text-white shadow-xs'
                                : 'border border-navy-200/50 bg-navy-50 text-navy-600 hover:bg-navy-100 dark:border-navy-800 dark:bg-navy-950 dark:text-navy-300 dark:hover:bg-navy-800'
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
```

Key changes:
- Removed the `<input>` search field and "Cari Katalog" button entirely
- Added `min-h-[36px]` on mobile for larger tap targets
- Added `overflow-x-auto` for horizontal scrolling on mobile category pills
- Added `shrink-0` to prevent pill text wrapping

- [ ] **Step 2: Verify the app still compiles**

Run: `cd /home/huda/repo/serasa-app && npx tsc --noEmit 2>&1 | head -20`
Expected: No new type errors (HeroSearchSection still accepts same props)

- [ ] **Step 3: Commit**

```bash
git add resources/js/components/hero/HeroSearchSection.tsx
git commit -m "fix(ux): remove duplicate hero search input, keep single navbar search"
```

---

### Task 2: Fix the Fake Flash Sale Timer

**Problem:** Countdown resets silently at zero. Progress bar is hardcoded at 87%. This is a dark pattern.

**Fix:** Convert FlashSaleCard to a "Produk Unggulan" (Featured Product) showcase. Remove the fake countdown timer. Replace progress bar with actual product count or remove it. Keep the visual design but remove the urgency manipulation.

**Files:**
- Modify: `resources/js/components/hero/FlashSaleCard.tsx`

**Interfaces:**
- Consumes: `FlashSaleCardProps` (same props, different rendering)
- Produces: Honest featured product card without fake urgency

- [ ] **Step 1: Rewrite FlashSaleCard as FeaturedProductCard**

In `resources/js/components/hero/FlashSaleCard.tsx`:

```tsx
import { router } from '@inertiajs/react';
import { Sparkles, ThumbsUp, MapPin } from 'lucide-react';
import React from 'react';
import type { AppSettings, Product } from '@/types';
import { formatIDR } from '@/utils';

interface FlashSaleCardProps {
    settings: AppSettings;
    featuredProduct: Product | null;
}

export default function FlashSaleCard({ settings, featuredProduct }: FlashSaleCardProps) {
    const title = settings.flashSaleTitle || 'PRODUK UNGGULAN WARGA';
    const tag = settings.flashSaleTag || 'Pilihan Desa';

    return (
        <div className="flex h-[280px] flex-col justify-between rounded-3xl border border-navy-200/60 bg-white p-5 shadow-2xs sm:h-[340px] lg:col-span-4 dark:border-navy-800 dark:bg-navy-900/90">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-pastel-teal">
                        <Sparkles className="h-5 w-5" />
                        <span className="text-xs font-black tracking-wider uppercase">
                            {title}
                        </span>
                    </div>
                    <span className="rounded-lg bg-pastel-teal-light px-2.5 py-1 text-xs font-bold text-pastel-teal dark:bg-navy-800 dark:text-pastel-teal">
                        {tag}
                    </span>
                </div>

                {featuredProduct ? (
                    <button
                        type="button"
                        onClick={() => router.visit(`/products/${featuredProduct.id}`)}
                        className="group/promo flex w-full cursor-pointer gap-3.5 rounded-2xl border border-pastel-teal/20 bg-pastel-teal-light/40 p-3 text-left transition-all hover:border-pastel-teal/40 hover:bg-pastel-teal-light dark:border-pastel-teal/30 dark:bg-navy-950 dark:hover:bg-navy-800"
                    >
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-pastel-teal/20 bg-navy-100 transition-transform duration-300 group-hover/promo:scale-105 sm:h-24 sm:w-24 dark:border-navy-800 dark:bg-navy-900">
                            <img
                                src={featuredProduct.image}
                                alt={featuredProduct.name}
                                width={96}
                                height={96}
                                loading="lazy"
                                sizes="96px"
                                className="h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <span className="inline-block rounded-md bg-pastel-teal-light px-1.5 py-0.5 text-xs font-black text-pastel-teal uppercase dark:bg-pastel-teal/20">
                                Rekomendasi
                            </span>
                            <h4 className="line-clamp-2 text-sm leading-snug font-bold text-navy-800 transition-colors group-hover/promo:text-pastel-teal dark:text-navy-100">
                                {featuredProduct.name}
                            </h4>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-black text-navy-900 dark:text-white">
                                    {formatIDR(featuredProduct.price)}
                                </span>
                                <span className="text-xs font-medium text-navy-400 dark:text-navy-400">
                                    / {featuredProduct.unit}
                                </span>
                            </div>
                        </div>
                    </button>
                ) : (
                    <div className="rounded-2xl bg-navy-50 p-4 text-center text-xs text-navy-400 dark:bg-navy-950 dark:text-navy-500">
                        Belum ada produk unggulan
                    </div>
                )}

                {featuredProduct && (
                    <p className="line-clamp-2 text-xs leading-relaxed text-navy-500 dark:text-navy-400">
                        {featuredProduct.description}
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between border-t border-navy-100 pt-3 text-xs font-medium text-navy-500 dark:border-navy-800 dark:text-navy-400">
                <div className="flex items-center gap-1">
                    <ThumbsUp className="h-3.5 w-3.5 text-pastel-teal" />
                    <span>100% Produk Desa</span>
                </div>
                <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-pastel-peach" />
                    <span>{settings.villageName}</span>
                </div>
            </div>
        </div>
    );
}
```

Key changes:
- Removed `useState` + `useEffect` timer (eliminates 1 `setInterval`)
- Removed fake countdown display
- Removed hardcoded progress bar
- Changed `Flame` icon to `Sparkles` (no fake urgency)
- Replaced clickable `<div>` with `<button>` for keyboard access
- Changed coral color scheme to teal (no urgency signaling)
- Upsized featured product image to `sm:h-24 sm:w-24`
- Added product description preview
- Changed "Stok Terbatas" → "Rekomendasi"
- Changed label from "Kejar Diskon" → "Produk Unggulan"

- [ ] **Step 2: Verify the app compiles**

Run: `cd /home/huda/repo/serasa-app && npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add resources/js/components/hero/FlashSaleCard.tsx
git commit -m "fix(ux): replace fake flash sale timer with honest featured product showcase"
```

---

### Task 3: Reduce Above-Fold Bloat — Shorter Slider + Products Visible

**Problem:** 740px of non-product content before the first product on mobile.

**Fix:** Reduce slider height on mobile, reduce hero padding, make the grid start visible sooner.

**Files:**
- Modify: `resources/js/components/hero/PromoSlider.tsx`
- Modify: `resources/js/components/Hero.tsx`

**Interfaces:**
- Consumes: `PromoSliderProps`, `HeroProps`
- Produces: Compact hero that shows products sooner

- [ ] **Step 1: Reduce PromoSlider height and add swipe + accessible controls**

In `resources/js/components/hero/PromoSlider.tsx`:

```tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PromoSlideItem } from '@/types';

interface PromoSliderProps {
    slides: PromoSlideItem[];
    onSelectQuery: (query: string) => void;
}

export default function PromoSlider({ slides, onSelectQuery }: PromoSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        if (slides.length <= 1 || isPaused) return;
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5500);

        return () => clearInterval(slideInterval);
    }, [slides.length, isPaused]);

    if (!slides || slides.length === 0) {
        return null;
    }

    const handlePrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const handleNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        touchEndX.current = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                handleNextSlide();
            } else {
                handlePrevSlide();
            }
        }
    }, [slides.length]);

    return (
        <div
            className="group/slider relative h-[200px] overflow-hidden rounded-2xl border border-navy-200/60 bg-navy-900 shadow-xs sm:h-[260px] sm:rounded-3xl lg:col-span-8 lg:h-[300px] dark:border-navy-800"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-label="Promo carousel"
            aria-roledescription="carousel"
        >
            {slides.map((slide, index) => (
                <div
                    key={slide.id || `slide-${index}`}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        index === currentSlide
                            ? 'z-10 opacity-100'
                            : 'pointer-events-none z-0 opacity-0'
                    }`}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`Slide ${index + 1} dari ${slides.length}: ${slide.title}`}
                >
                    <img
                        src={slide.image}
                        alt={slide.title}
                        width={800}
                        height={300}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        sizes="(max-width: 768px) 100vw, 66vw"
                        className="h-full w-full object-cover opacity-40"
                        referrerPolicy="no-referrer"
                    />

                    <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-tr from-navy-900 via-navy-900/75 to-transparent p-5 text-white sm:p-8">
                        <div className="max-w-lg space-y-1.5 sm:space-y-2">
                            {slide.badge && (
                                <span className="inline-block rounded-md bg-pastel-peach px-2.5 py-0.5 text-[10px] font-black tracking-wider text-navy-900 uppercase sm:px-3 sm:py-1 sm:text-xs">
                                    {slide.badge}
                                </span>
                            )}
                            <h2 className="text-lg leading-tight font-black tracking-tight text-white sm:text-2xl lg:text-3xl">
                                {slide.title}
                            </h2>
                            {slide.tagline && (
                                <p className="text-[11px] font-bold text-pastel-peach sm:text-sm">
                                    {slide.tagline}
                                </p>
                            )}
                            {slide.description && (
                                <p className="line-clamp-2 hidden text-xs leading-relaxed font-normal text-navy-200 sm:block sm:text-sm">
                                    {slide.description}
                                </p>
                            )}
                            {slide.btnQuery && (
                                <div className="pt-1 sm:pt-2">
                                    <button
                                        onClick={() => onSelectQuery(slide.btnQuery)}
                                        className="min-h-[44px] cursor-pointer rounded-xl bg-pastel-coral px-4 py-2.5 text-xs font-extrabold tracking-wider text-white uppercase shadow-md transition-all hover:bg-pastel-coral/90 sm:px-5"
                                    >
                                        Temukan Produk
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {slides.length > 1 && (
                <>
                    <button
                        onClick={handlePrevSlide}
                        className="absolute top-1/2 left-3 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-xs transition-all hover:bg-white/30 sm:left-4"
                        aria-label="Slide sebelumnya"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={handleNextSlide}
                        className="absolute top-1/2 right-3 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-xs transition-all hover:bg-white/30 sm:right-4"
                        aria-label="Slide selanjutnya"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>

                    <div className="absolute bottom-3 left-5 z-20 flex items-center gap-2 sm:bottom-4 sm:left-8">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`h-2 cursor-pointer rounded-full transition-all ${
                                    i === currentSlide
                                        ? 'w-6 bg-pastel-teal'
                                        : 'w-2 bg-white/45 hover:bg-white/70'
                                }`}
                                aria-label={`Pilih slide ${i + 1}`}
                            />
                        ))}

                        <button
                            onClick={() => setIsPaused(!isPaused)}
                            className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[10px] text-white transition-all hover:bg-white/40"
                            aria-label={isPaused ? 'Lanjutkan auto-slide' : 'Jeda auto-slide'}
                        >
                            {isPaused ? '▶' : '⏸'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
```

Key changes:
- **Height reduced:** `h-[200px] sm:h-[260px] lg:h-[300px]` (was `h-[280px] sm:h-[340px]`)
- **Swipe gestures:** Added `onTouchStart`/`onTouchEnd` with 50px threshold
- **Prev/next always visible** on mobile — removed `opacity-0 group-hover:opacity-100`
- **Buttons enlarged** to 40×40px (`h-10 w-10`) for touch targets
- **Dot indicators enlarged** to `h-2 w-2` (was `h-1 w-2.5`)
- **Pause/play button** added (WCAG 2.2.2 compliance)
- **ARIA roles** added: `aria-roledescription="carousel"`, `role="group"` per slide
- **Description hidden on mobile** to save vertical space
- **Removed slow hover zoom** on images (`duration-10000 hover:scale-105` removed)
- **Badge text smaller on mobile** `text-[10px] sm:text-xs`

- [ ] **Step 2: Reduce Hero vertical padding**

In `resources/js/components/Hero.tsx`, change the root container:

From: `pt-6 pb-10`
To: `pt-4 pb-6 sm:pt-6 sm:pb-8`

And change `space-y-6` to `space-y-4 sm:space-y-6`

- [ ] **Step 3: Verify compilation**

Run: `cd /home/huda/repo/serasa-app && npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 4: Commit**

```bash
git add resources/js/components/hero/PromoSlider.tsx resources/js/components/Hero.tsx
git commit -m "fix(ux): reduce above-fold bloat, add swipe gestures and pause control to slider"
```

---

### Task 4: Fix Mobile Tap Targets & Typography Scale

**Problem:** `text-xs` everywhere (12px), buttons under 44px height, font-weight abuse.

**Fix:** Bump body text to `text-sm` (14px) for readability. Ensure all interactive elements meet 44px minimum.

**Files:**
- Modify: `resources/js/components/ProductCard.tsx`
- Modify: `resources/js/pages/welcome.tsx`

**Interfaces:**
- Consumes: `ProductCardProps`, `WelcomeProps`
- Produces: Accessible product cards with proper tap targets and type scale

- [ ] **Step 1: Fix ProductCard typography and tap targets**

In `resources/js/components/ProductCard.tsx`:

Changes to apply (surgical, not full rewrite):

1. Product name: keep `text-sm md:text-base` ✓ (already OK)
2. Shop name: change from `text-xs` → `text-[13px]`
3. Price: keep `text-base md:text-lg` ✓
4. Unit text: change from `text-xs` → `text-[13px]`
5. Rating/review text: change from `text-xs` → `text-[13px]`
6. "Beli" button: add `min-h-[44px]` and increase padding: `px-4 py-2.5` (was `px-3.5 py-1.5`)
7. Change "Beli" label to "Lihat Detail" (it navigates to detail, not cart)

- [ ] **Step 2: Fix welcome.tsx catalog description and badge typography**

In `resources/js/pages/welcome.tsx`:

1. Catalog description: `text-xs` → `text-sm`
2. Product count badge: `text-xs` → `text-[13px]`
3. Pagination text: `text-xs` → `text-sm`
4. Reset filter button: add `min-h-[44px]`

- [ ] **Step 3: Verify compilation**

Run: `cd /home/huda/repo/serasa-app && npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 4: Commit**

```bash
git add resources/js/components/ProductCard.tsx resources/js/pages/welcome.tsx
git commit -m "fix(a11y): enlarge tap targets to 44px minimum, bump text-xs to readable sizes"
```

---

### Task 5: Convert Clickable Div Shop Cards to `<Link>`

**Problem:** Featured shops section uses `<div onClick={router.visit()}>` — not keyboard navigable, no Inertia prefetch, can't right-click open in new tab.

**Fix:** Replace with `<Link href>` + `prefetch="hover"`.

**Files:**
- Modify: `resources/js/pages/welcome.tsx` (lines 274-308)

**Interfaces:**
- Consumes: `shops` array from `WelcomeProps`
- Produces: Accessible, prefetchable shop cards

- [ ] **Step 1: Replace clickable div with Link component**

In `resources/js/pages/welcome.tsx`, replace the shop card rendering (approx lines 274-308):

```tsx
{shops.slice(0, 3).map((shop) => (
    <Link
        key={shop.id}
        href={`/shops/${shop.id}`}
        prefetch="hover"
        className="flex gap-4 rounded-2xl border border-navy-200/60 bg-white p-4 shadow-2xs transition-all hover:border-pastel-teal hover:shadow-md dark:border-navy-800 dark:bg-navy-900/90 dark:hover:border-pastel-teal"
    >
        <img
            src={shop.logo}
            alt={shop.name}
            width={48}
            height={48}
            loading="lazy"
            className="h-12 w-12 shrink-0 rounded-xl border border-navy-200 object-cover dark:border-navy-700"
            referrerPolicy="no-referrer"
        />
        <div className="min-w-0 flex-1 space-y-1">
            <div className="flex min-w-0 items-center gap-1.5" title={shop.name}>
                <span className="block truncate text-sm font-bold text-navy-900 dark:text-navy-100">
                    {shop.name}
                </span>
                {shop.isVerified && (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 fill-pastel-mint-light text-pastel-mint dark:fill-navy-800" />
                )}
            </div>
            <span className="font-mono text-xs font-bold tracking-wider text-navy-400 uppercase dark:text-navy-400">
                {shop.category}
            </span>
            <p className="line-clamp-2 pt-0.5 text-[13px] leading-relaxed text-navy-500 dark:text-navy-400">
                {shop.description}
            </p>
        </div>
    </Link>
))}
```

Key changes:
- `<div onClick>` → `<Link href prefetch="hover">`
- Removed `cursor-pointer` (links are inherently clickable)
- Shop name: `text-xs` → `text-sm`
- Description: `text-xs` → `text-[13px]`
- Keyboard navigable, screen reader friendly, right-click capable

- [ ] **Step 2: Ensure `router` import can be removed if no longer needed**

Check if `router` is still used elsewhere in welcome.tsx. If not, remove from import.

- [ ] **Step 3: Verify compilation and test**

Run: `cd /home/huda/repo/serasa-app && npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 4: Commit**

```bash
git add resources/js/pages/welcome.tsx
git commit -m "fix(a11y): convert shop clickable divs to Link for keyboard nav and prefetch"
```

---

### Task 6: Fix Footer Hardcoded Values + Add Skip Nav

**Problem:** Footer hardcodes "SAMIRONO ETALASE" and "S" initial. No skip navigation link. "Daftar Toko" links to protected route.

**Files:**
- Modify: `resources/js/layouts/marketplace-layout.tsx`

**Interfaces:**
- Consumes: `MarketplaceLayoutProps`
- Produces: Dynamic footer + skip navigation

- [ ] **Step 1: Add skip navigation and fix footer**

In `resources/js/layouts/marketplace-layout.tsx`:

1. Add skip nav link as first child of the root div:
```tsx
<a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-xl focus:bg-pastel-teal focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg"
>
    Langsung ke konten utama
</a>
```

2. Add `id="main-content"` to the `<main>` element.

3. Fix footer brand to use `settings.appName` dynamically:
```tsx
<span className="text-base font-black tracking-wide text-white uppercase">
    {appNameParts[0]}{' '}
    {restWords ? (
        <span className="text-pastel-teal">{restWords}</span>
    ) : null}
</span>
```

4. Compute `appNameParts` from `settings.appName` (same pattern as Navbar).

5. Fix footer initial to use first character of settings.appName.

6. Change "Daftar Toko" link to show "Buka Toko" and link to `/register` for guests (or keep `/merchant/dashboard` for auth users — but footer doesn't know auth state, so link to `/shops` instead which is public).

- [ ] **Step 2: Verify compilation**

Run: `cd /home/huda/repo/serasa-app && npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add resources/js/layouts/marketplace-layout.tsx
git commit -m "fix(a11y): add skip nav, dynamic footer brand, fix protected route link"
```

---

### Task 7: Fix MobileMenu Type Safety + Navbar Improvements

**Problem:** `MobileMenu.tsx` uses `settings?: any`. Navbar has redundant search.

**Files:**
- Modify: `resources/js/components/navbar/MobileMenu.tsx`

**Interfaces:**
- Consumes: `MobileMenuProps`
- Produces: Type-safe mobile menu

- [ ] **Step 1: Fix MobileMenu type**

In `resources/js/components/navbar/MobileMenu.tsx`, change:
```tsx
settings?: any;
user?: any;
```
to:
```tsx
settings?: AppSettings;
user?: { name: string; role: string } | null;
```

Add import: `import type { AppSettings } from '@/types';`

- [ ] **Step 2: Verify compilation**

Run: `cd /home/huda/repo/serasa-app && npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add resources/js/components/navbar/MobileMenu.tsx
git commit -m "fix(types): replace 'any' with proper types in MobileMenu"
```

---

### Task 8: Add aria-live Region for Search Results + Skeleton Loading

**Problem:** No feedback when search filters update. No loading state for products.

**Files:**
- Modify: `resources/js/pages/welcome.tsx`
- Modify: `resources/js/components/ProductCardSkeleton.tsx` (already exists)

**Interfaces:**
- Consumes: `filteredProducts.length`, existing skeleton component
- Produces: Screen-reader-announced result counts + visual skeletons

- [ ] **Step 1: Add aria-live region to welcome.tsx**

In `resources/js/pages/welcome.tsx`, add an aria-live region after the catalog section heading div:

```tsx
<div aria-live="polite" className="sr-only">
    {filteredProducts.length === 0
        ? 'Tidak ada produk ditemukan'
        : `Menampilkan ${paginatedProducts.length} dari ${filteredProducts.length} produk`}
</div>
```

- [ ] **Step 2: Verify compilation**

Run: `cd /home/huda/repo/serasa-app && npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add resources/js/pages/welcome.tsx
git commit -m "fix(a11y): add aria-live region for search result announcements"
```

---

### Task 9: End-to-End Verification & Formatting

**Files:**
- All modified files

- [ ] **Step 1: Run Pint code formatter**

Run: `cd /home/huda/repo/serasa-app && vendor/bin/pint --dirty --format agent`

- [ ] **Step 2: Run full Pest test suite**

Run: `cd /home/huda/repo/serasa-app && vendor/bin/pest --compact`
Expected: All tests PASS

- [ ] **Step 3: Run TypeScript check**

Run: `cd /home/huda/repo/serasa-app && npx tsc --noEmit 2>&1 | head -30`
Expected: No errors

- [ ] **Step 4: Build frontend to verify no Vite errors**

Run: `cd /home/huda/repo/serasa-app && npm run build 2>&1 | tail -20`
Expected: Build succeeds

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "chore: landing page UX overhaul — fix all roast issues"
```
