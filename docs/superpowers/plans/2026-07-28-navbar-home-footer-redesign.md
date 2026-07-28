# Navbar, Home Page (/), and Footer Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the Navbar, Home Page (`/`), and Footer of the Samirono Etalase web application to be modern, visually appealing, and authentic (Modern Organic & Artisan Warmth style) without AI clutter.

**Architecture:** Translucent glassmorphic sticky header (`Navbar.tsx`), structured 4-column dark obsidian footer (`marketplace-layout.tsx`), modern Bento-Grid hero and high-density product grid catalog landing (`welcome.tsx`, `Hero.tsx`, `ProductCard.tsx`).

**Tech Stack:** React 19, Inertia.js v3, TailwindCSS v4, Lucide React icons.

## Global Constraints
- Handcrafted spacing, typography, contrast ratios, and authentic color palette (`stone-50`, `emerald-900/800/600`, `amber-700`, `stone-950`).
- Retain all existing functionality, links, cart simulation, notifications, user authentication popovers, and filters.
- Maintain fast load times and clean component interfaces.

---

### Task 1: Refine Navbar Component (`Navbar.tsx`)

**Files:**
- Modify: `resources/js/components/Navbar.tsx`

**Interfaces:**
- Consumes: `settings: AppSettings`, `activeTab: string`, `searchQuery?: string`, `setSearchQuery?: (q: string) => void`, `categories: Category[]`, `products: Product[]`
- Produces: Translucent sticky header with top utility bar, pill-shaped nav tabs, polished search input, and interactive cart & notification dropdowns.

- [ ] **Step 1: Update Navbar container and utility top bar styles**
  - Add sticky glassmorphic container: `bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-2xs`.
  - Style top utility bar with `Desa Samirono` badge, helpline link, and auth state dropdown.

- [ ] **Step 2: Update brand logo, nav links, and search input**
  - Style brand logo with `SAMIRONO ETALASE` title & `SENTRA UMKM DESA` subtitle.
  - Implement active tab pill navigation (`Etalase Warga`, `Daftar UMKM`, `Peta Geografis`).
  - Upgrade search bar input with rounded-xl border, icon prefix, and clear button.

- [ ] **Step 3: Refine Cart and Notification popovers**
  - Enhance cart popover items layout, total price calculation, and direct WhatsApp contact CTA button.
  - Enhance notification drawer with modern item cards.

- [ ] **Step 4: Verify component rendering and interactivity**
  - Ensure no TypeScript or JSX compilation errors.

---

### Task 2: Refine Marketplace Layout & Footer (`marketplace-layout.tsx`)

**Files:**
- Modify: `resources/js/layouts/marketplace-layout.tsx`

**Interfaces:**
- Consumes: `MarketplaceLayoutProps`
- Produces: Page layout wrapper and 4-column structured obsidian footer.

- [ ] **Step 1: Update main layout wrapper styling**
  - Use `min-h-screen bg-stone-50/60 flex flex-col font-sans antialiased text-stone-900`.

- [ ] **Step 2: Redesign Footer into 4-column structured grid**
  - Col 1: Brand emblem logo, Samirono creative economy description, location tag.
  - Col 2: Interactive category links dynamically populated from `categories`.
  - Col 3: Navigation & service links (Daftar UMKM, Peta Geografis, Daftarkan Toko, Admin Panel).
  - Col 4: Payment systems grid (QRIS, BCA, BRI, COD), shipping methods badges (Kurir Dusun, Ambil di Rumah Produksi, J&T/JNE), and Hubungi IT Desa WhatsApp button.

- [ ] **Step 3: Update bottom copyright section**
  - Add monospace credit line for KKN UNNES GIAT 16 DESA SAMIRONO with heart indicator.

---

### Task 3: Refine Hero & Bento Grid Component (`Hero.tsx`)

**Files:**
- Modify: `resources/js/components/Hero.tsx`

**Interfaces:**
- Consumes: `settings: AppSettings`, `categories: Category[]`, `selectedCategory: string`, `setSelectedCategory: (cat: string) => void`, `searchQuery: string`, `setSearchQuery: (q: string) => void`, `totalProducts: number`, `totalShops: number`
- Produces: Bento Grid hero banner with live village metrics and interactive category filter chips.

- [ ] **Step 1: Implement Bento Grid layout in Hero**
  - Main promo showcase banner featuring village artisanal products.
  - Metrics cards (`34+ UMKM Terdaftar`, `120+ Produk Lokal`, `100% Produk Warga Desa`).
  - Interactive category selector chips with item counts.

---

### Task 4: Refine Home Page Catalog & Product Cards (`welcome.tsx` & `ProductCard.tsx`)

**Files:**
- Modify: `resources/js/pages/welcome.tsx`
- Modify: `resources/js/components/ProductCard.tsx`

**Interfaces:**
- Consumes: `WelcomeProps`, `ProductCardProps`
- Produces: High-density 5-column product catalog and "Kenali Pembuat" merchant spotlight section.

- [ ] **Step 1: Refine ProductCard component**
  - Style cards with `rounded-2xl border border-stone-200/80 bg-white hover:border-emerald-600 hover:shadow-md transition-all`.
  - Add image zoom on hover, producer verified checkmark, formatted IDR price, and WhatsApp contact button.

- [ ] **Step 2: Refine Welcome landing layout**
  - Catalog header with product counter badge and empty state fallback.
  - "Kenali Pembuat" (Meet the Makers) section with producer cards.

---

### Task 5: End-to-End Verification & Formatting

- [ ] **Step 1: Test feature tests & routes**
  - Run `php artisan test` to verify zero backend breakages.
- [ ] **Step 2: Build assets check**
  - Run `npm run build` to verify frontend TypeScript and Tailwind compilation.
