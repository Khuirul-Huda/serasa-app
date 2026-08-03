# 2-Row Mobile Responsive Navbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade [Navbar.tsx](file:///home/huda/repo/serasa-app/resources/js/components/Navbar.tsx) with a 2-row mobile header structure (< 640px) to ensure 100% responsiveness and zero horizontal crowding on screens under 550px.

**Architecture:** Split the mobile header into (1) Top Logo & Actions Row and (2) Full-Width Search Input Row for viewports under `640px`, while retaining inline search on desktop viewports (`≥ 640px`).

**Tech Stack:** React 19, Inertia.js v3, TailwindCSS v4 with `@custom-variant dark`, Lucide React.

## Global Constraints

- Retain search state handling (`searchQuery`, `setSearchQuery`, `handleSearchChange`).
- Ensure all interactive elements retain 44px minimum touch targets on mobile.
- Full dark mode support (`.dark`).

---

### Task 1: Refactor Navbar.tsx Header Layout for 2-Row Mobile Responsiveness

**Files:**
- Modify: `resources/js/components/Navbar.tsx`

**Interfaces:**
- Consumes: `NavbarProps`
- Produces: 2-row mobile header (< 640px) and inline desktop header (≥ 640px)

- [ ] **Step 1: Inspect Navbar.tsx header section**

View lines 60-197 of `resources/js/components/Navbar.tsx`.

- [ ] **Step 2: Update Navbar.tsx to render 2-row mobile header**

In `resources/js/components/Navbar.tsx`:
Replace main header bar container markup with:
```tsx
            {/* 2. MAIN HEADER BAR */}
            <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-6 lg:px-8">
                {/* Row 1: Logo, Desktop Navigation & Header Actions */}
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                    {/* Brand Logo & Desktop Nav */}
                    <div className="flex shrink-0 items-center gap-3 sm:gap-6">
                        <Link
                            href="/"
                            className="group flex cursor-pointer items-center gap-2"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-pastel-teal text-sm font-black text-white shadow-2xs transition-all duration-300 group-hover:scale-105 sm:h-9 sm:w-9 sm:text-base">
                                {initial}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm leading-none font-black tracking-tight text-navy-900 uppercase transition-colors group-hover:text-pastel-teal sm:text-base dark:text-navy-100">
                                    {firstWord}{' '}
                                    {restWords ? (
                                        <span className="text-pastel-teal">
                                            {restWords}
                                        </span>
                                    ) : null}
                                </span>
                                <span className="mt-0.5 hidden text-[8px] leading-tight font-bold tracking-widest text-navy-400 uppercase min-[380px]:block sm:text-[9px] dark:text-navy-400">
                                    {settings?.tagline || 'Sentra UMKM Digital'}
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation Link Pills */}
                        <nav className="hidden items-center gap-1 rounded-xl border border-navy-200/50 bg-navy-50/70 p-1 lg:flex dark:border-navy-800 dark:bg-navy-950/80">
                            <Link
                                href="/"
                                prefetch="hover"
                                className={`cursor-pointer rounded-lg px-3 py-1.5 text-[10.5px] font-black tracking-wider uppercase transition-all ${
                                    activeTab === 'katalog'
                                        ? 'border border-pastel-teal/15 bg-pastel-teal-light text-pastel-teal dark:border-navy-700 dark:bg-navy-800 dark:text-pastel-teal'
                                        : 'text-navy-600 hover:bg-navy-50 hover:text-pastel-teal dark:text-navy-300 dark:hover:bg-navy-800 dark:hover:text-pastel-teal'
                                }`}
                            >
                                Katalog Produk
                            </Link>
                            <Link
                                href="/shops"
                                prefetch="hover"
                                className={`cursor-pointer rounded-lg px-3 py-1.5 text-[10.5px] font-black tracking-wider uppercase transition-all ${
                                    activeTab === 'shops'
                                        ? 'border border-pastel-teal/15 bg-pastel-teal-light text-pastel-teal dark:border-navy-700 dark:bg-navy-800 dark:text-pastel-teal'
                                        : 'text-navy-600 hover:bg-navy-50 hover:text-pastel-teal dark:text-navy-300 dark:hover:bg-navy-800 dark:hover:text-pastel-teal'
                                }`}
                            >
                                Daftar UMKM
                            </Link>
                            <Link
                                href="/map"
                                prefetch="hover"
                                className={`cursor-pointer rounded-lg px-3 py-1.5 text-[10.5px] font-black tracking-wider uppercase transition-all ${
                                    activeTab === 'map'
                                        ? 'border border-pastel-teal/15 bg-pastel-teal-light text-pastel-teal dark:border-navy-700 dark:bg-navy-800 dark:text-pastel-teal'
                                        : 'text-navy-600 hover:bg-navy-50 hover:text-pastel-teal dark:text-navy-300 dark:hover:bg-navy-800 dark:hover:text-pastel-teal'
                                }`}
                            >
                                Peta Geografis
                            </Link>
                        </nav>
                    </div>

                    {/* Desktop Search Input (Hidden on < sm) */}
                    <div className="hidden mx-2 max-w-md flex-1 sm:block">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari produk desa..."
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full rounded-xl border border-navy-200 bg-navy-50 py-2 pr-10 pl-9 text-xs font-medium text-navy-800 placeholder-navy-400 transition-all focus:border-pastel-teal focus:bg-white focus:ring-2 focus:ring-pastel-teal/15 focus:outline-none dark:border-navy-800 dark:bg-navy-950 dark:text-navy-100 dark:placeholder-navy-500 dark:focus:bg-navy-950"
                                id="global-search-input-desktop"
                            />
                            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-navy-400 dark:text-navy-500" />

                            {searchQuery && (
                                <button
                                    onClick={() => handleSearchChange('')}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 p-0.5 text-navy-400 hover:text-navy-600 dark:text-navy-500 dark:hover:text-navy-300"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right side interactions */}
                    <div className="flex shrink-0 items-center gap-1 sm:gap-3 md:gap-4">
                        <CartDropdown />
                        <NotificationDropdown shops={shops} />

                        {user && (
                            <div className="hidden items-center sm:flex">
                                {user.role === 'admin' ? (
                                    <Link
                                        href="/admin/dashboard"
                                        className={`flex cursor-pointer items-center gap-1.5 rounded-xl border px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all ${
                                            activeTab === 'admin'
                                                ? 'shadow-3xs border-pastel-peach bg-pastel-peach text-navy-900'
                                                : 'border-pastel-peach/20 bg-pastel-peach-light text-navy-800 hover:bg-pastel-peach/30 dark:border-navy-700 dark:bg-navy-800 dark:text-navy-200'
                                        }`}
                                    >
                                        <ShieldCheck className="h-3.5 w-3.5 text-pastel-peach" />
                                        <span>Admin Desa</span>
                                    </Link>
                                ) : (
                                    <Link
                                        href="/merchant/dashboard"
                                        className={`flex cursor-pointer items-center gap-1.5 rounded-xl border px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all ${
                                            activeTab === 'merchant'
                                                ? 'shadow-3xs border-pastel-teal bg-pastel-teal text-white'
                                                : 'border-pastel-teal/20 bg-pastel-teal-light text-pastel-teal hover:bg-pastel-teal/15 dark:border-navy-700 dark:bg-navy-800 dark:text-pastel-teal'
                                        }`}
                                    >
                                        <Store className="h-3.5 w-3.5" />
                                        <span>Kelola Toko</span>
                                    </Link>
                                )}
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="cursor-pointer rounded-xl p-2 text-navy-600 transition-colors hover:bg-navy-50 hover:text-pastel-teal lg:hidden dark:text-navy-300 dark:hover:bg-navy-800 dark:hover:text-pastel-teal"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Row 2: Full-Width Mobile Search Bar (Visible on < sm) */}
                <div className="mt-2 block sm:hidden">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Cari produk desa..."
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full rounded-xl border border-navy-200 bg-navy-50 py-2 pr-9 pl-9 text-xs font-medium text-navy-800 placeholder-navy-400 transition-all focus:border-pastel-teal focus:bg-white focus:ring-2 focus:ring-pastel-teal/15 focus:outline-none dark:border-navy-800 dark:bg-navy-950 dark:text-navy-100 dark:placeholder-navy-500 dark:focus:bg-navy-950"
                            id="global-search-input-mobile"
                        />
                        <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-navy-400 dark:text-navy-500" />

                        {searchQuery && (
                            <button
                                onClick={() => handleSearchChange('')}
                                className="absolute top-1/2 right-3 -translate-y-1/2 p-0.5 text-navy-400 hover:text-navy-600 dark:text-navy-500 dark:hover:text-navy-300"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
```

- [ ] **Step 3: Verify Pest test suite**

Run: `vendor/bin/pest --compact`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add resources/js/components/Navbar.tsx
git commit -m "style(navbar): implement 2-row mobile responsive layout for viewports under 640px"
```

---

### Task 2: End-to-End Verification & Build Check

- [ ] **Step 1: Run Pint code formatter**

Run: `vendor/bin/pint --dirty --format agent`

- [ ] **Step 2: Run Pest tests**

Run: `vendor/bin/pest --compact`
Expected: 61/61 PASS

- [ ] **Step 3: Run npm build**

Run: `npm run build`
Expected: Build succeeds cleanly
