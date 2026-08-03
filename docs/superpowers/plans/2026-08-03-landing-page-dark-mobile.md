# Landing Page Mobile & Dark Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Samirono Etalase landing page UI with comprehensive dark mode support (`.dark`) and responsive mobile UX optimization across layout, hero, category filter bar, product grid, and component surfaces.

**Architecture:** Update React components ([welcome.tsx](file:///home/huda/repo/serasa-app/resources/js/pages/welcome.tsx), [MarketplaceLayout.tsx](file:///home/huda/repo/serasa-app/resources/js/layouts/marketplace-layout.tsx), [Hero.tsx](file:///home/huda/repo/serasa-app/resources/js/components/Hero.tsx), [ProductCard.tsx](file:///home/huda/repo/serasa-app/resources/js/components/ProductCard.tsx), and subcomponents) with `.dark` tailwind variant classes matching the Navy oklch design system tokens and add horizontal touch scrolling for mobile category pills.

**Tech Stack:** React 19, Inertia.js v3, TailwindCSS v4 with `@custom-variant dark`, Lucide React.

## Global Constraints

- Preserve all existing props and business logic (filters, pagination math, search state).
- Follow existing Navy color token mapping (`bg-navy-950` root, `bg-navy-900` cards, `text-navy-100` headings, `border-navy-800`).
- Ensure all interactive elements have 44px minimum touch targets on mobile.

---

### Task 1: Update MarketplaceLayout.tsx for Dark Mode

**Files:**
- Modify: `resources/js/layouts/marketplace-layout.tsx`

**Interfaces:**
- Consumes: `MarketplaceLayoutProps`
- Produces: Dark-mode ready root container and footer

- [ ] **Step 1: Inspect MarketplaceLayout.tsx current markup**

Check lines 49-74 in `resources/js/layouts/marketplace-layout.tsx`.

- [ ] **Step 2: Apply dark mode container and footer classes**

In `resources/js/layouts/marketplace-layout.tsx`:
Change container root:
```tsx
<div
    className="flex min-h-screen flex-col bg-navy-50/40 font-sans text-navy-900 antialiased dark:bg-navy-950/90 dark:text-navy-100"
    id="serasa-root-container"
>
```
Change footer element:
```tsx
<footer
    className="mt-16 border-t border-navy-800 bg-navy-900 py-12 font-sans text-navy-400 dark:border-navy-900 dark:bg-navy-950"
    id="serasa-footer"
>
```

- [ ] **Step 3: Verify Pest tests pass**

Run: `vendor/bin/pest --compact`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add resources/js/layouts/marketplace-layout.tsx
git commit -m "style(layout): add dark mode background and footer styling to MarketplaceLayout"
```

---

### Task 2: Update ProductCard.tsx for Dark Mode & Mobile Touch Targets

**Files:**
- Modify: `resources/js/components/ProductCard.tsx`

**Interfaces:**
- Consumes: `ProductCardProps`
- Produces: Dark-mode aware product card component

- [ ] **Step 1: Apply dark mode classes to ProductCard article, typography, and footer**

In `resources/js/components/ProductCard.tsx`:
- Article container: `border-navy-200/60 bg-white shadow-2xs dark:border-navy-800 dark:bg-navy-900/90`
- Content wrapper: `bg-white dark:bg-navy-900/90`
- Shop link text: `text-navy-500 hover:text-pastel-teal dark:text-navy-400 dark:hover:text-pastel-teal`
- Product title: `text-navy-800 group-hover:text-pastel-teal dark:text-navy-100 dark:group-hover:text-pastel-teal`
- Price text: `text-navy-900 dark:text-white`
- Price unit text: `text-navy-400 dark:text-navy-400`
- Rating text: `text-navy-700 dark:text-navy-300`
- Footer border: `border-navy-100 dark:border-navy-800/80`

- [ ] **Step 2: Verify Pest tests pass**

Run: `vendor/bin/pest --compact`
Expected: PASS

- [ ] **Step 3: Commit changes**

```bash
git add resources/js/components/ProductCard.tsx
git commit -m "style(components): add dark mode styling and touch responsiveness to ProductCard"
```

---

### Task 3: Upgrade Hero Components for Dark Mode & Mobile Category Touch Scroll

**Files:**
- Modify: `resources/js/components/Hero.tsx`
- Modify: `resources/js/components/hero/HeroSearchSection.tsx`
- Modify: `resources/js/components/hero/PromoSlider.tsx`
- Modify: `resources/js/components/hero/FlashSaleCard.tsx`

**Interfaces:**
- Consumes: `HeroProps`, `HeroSearchSectionProps`
- Produces: Responsive dark mode hero section with horizontal scroll category chips

- [ ] **Step 1: Update Hero.tsx background and radial overlay**

In `resources/js/components/Hero.tsx`:
- Root container: `border-navy-200/60 bg-navy-50/40 dark:border-navy-800 dark:bg-navy-950/60`
- Pattern overlay: `bg-[radial-gradient(oklch(0.82_0.01_250)_1px,transparent_1px)] dark:bg-[radial-gradient(oklch(0.35_0.02_250)_1px,transparent_1px)]`

- [ ] **Step 2: Add horizontal touch scroll and dark mode to HeroSearchSection.tsx**

In `resources/js/components/hero/HeroSearchSection.tsx`:
- Container: `border-navy-200/60 bg-white shadow-2xs dark:border-navy-800 dark:bg-navy-900/90`
- Search input: `border-navy-200 bg-white text-navy-900 placeholder:text-navy-400 dark:border-navy-800 dark:bg-navy-950 dark:text-navy-100 dark:placeholder:text-navy-500`
- Category chips wrapper: add `flex overflow-x-auto snap-x no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap`
- Inactive category button: `border-navy-200 bg-navy-50/50 text-navy-700 dark:border-navy-800 dark:bg-navy-950 dark:text-navy-300 dark:hover:border-pastel-teal`

- [ ] **Step 3: Update PromoSlider.tsx and FlashSaleCard.tsx for dark mode**

In `resources/js/components/hero/PromoSlider.tsx`:
- Mobile aspect ratio: `aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9]`
- Slider overlay text & button dark mode enhancements.

In `resources/js/components/hero/FlashSaleCard.tsx`:
- Container: `border-navy-200/60 bg-white dark:border-navy-800 dark:bg-navy-900/90`
- Headings & prices with dark mode variants.

- [ ] **Step 4: Verify Pest tests pass**

Run: `vendor/bin/pest --compact`
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add resources/js/components/Hero.tsx resources/js/components/hero/
git commit -m "style(hero): update Hero search section, promo slider, and flash sale for dark mode and mobile touch"
```

---

### Task 4: Upgrade Welcome.tsx Page Surface, Pagination & Featured Shops Grid

**Files:**
- Modify: `resources/js/pages/welcome.tsx`

**Interfaces:**
- Consumes: `WelcomeProps`
- Produces: Fully responsive, dark-mode complete landing page

- [ ] **Step 1: Apply dark mode utility classes to welcome.tsx**

In `resources/js/pages/welcome.tsx`:
- Catalog title: `text-navy-900 dark:text-navy-100`
- Catalog description: `text-navy-500 dark:text-navy-400`
- Product count badge: `border-navy-200/60 bg-white text-navy-500 dark:border-navy-800 dark:bg-navy-900 dark:text-navy-300`
- Empty state container: `border-navy-200/60 bg-white dark:border-navy-800 dark:bg-navy-900`
- Empty state text: `text-navy-800 dark:text-navy-100` and `text-navy-500 dark:text-navy-400`
- Pagination bar: `border-navy-100 dark:border-navy-800`, text `text-navy-500 dark:text-navy-400`
- Pagination buttons: `border-navy-200 bg-white text-navy-700 dark:border-navy-800 dark:bg-navy-900 dark:text-navy-200`
- Featured Shops container: `border-pastel-teal/15 bg-pastel-teal-light/30 dark:border-navy-800 dark:bg-navy-900/50`
- Featured Shop cards: `border-navy-200/60 bg-white dark:border-navy-800 dark:bg-navy-900`
- Shop card titles: `text-navy-900 dark:text-navy-100`, description `text-navy-500 dark:text-navy-400`

- [ ] **Step 2: Verify Pest tests pass**

Run: `vendor/bin/pest --compact`
Expected: PASS

- [ ] **Step 3: Commit changes**

```bash
git add resources/js/pages/welcome.tsx
git commit -m "style(welcome): implement dark mode variants across landing page catalog, pagination, and shop grid"
```

---

### Task 5: End-to-End Verification & Formatting

**Files:**
- Test across workspace

- [ ] **Step 1: Run Pint code formatter on PHP files if modified**

Run: `vendor/bin/pint --dirty --format agent`

- [ ] **Step 2: Run full Pest test suite**

Run: `vendor/bin/pest --compact`
Expected: 61/61 PASS

- [ ] **Step 3: Final git commit if any remaining formatting edits**

```bash
git add .
git commit -m "chore: complete landing page dark mode and mobile responsiveness upgrade"
```
