# Minimalist Flex-Wrap Category & Tag Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade [HeroSearchSection.tsx](file:///home/huda/repo/serasa-app/resources/js/components/hero/HeroSearchSection.tsx) to eliminate horizontal scrolling (`overflow-x-auto`) and render a minimalist flex-wrapped category and tag filter layout.

**Architecture:** Replace single-line horizontal scrolling containers with `flex flex-wrap items-center gap-1.5` containers and remove `shrink-0` from category buttons.

**Tech Stack:** React 19, Inertia.js v3, TailwindCSS v4 with `@custom-variant dark`, Lucide React.

## Global Constraints

- Retain category filtering logic (`selectedCategory`, `setSelectedCategory`).
- Retain search tag query handling (`searchQuery`, `setSearchQuery`).
- Full dark mode support (`.dark`).

---

### Task 1: Update HeroSearchSection.tsx for Minimalist Flex-Wrap Layout

**Files:**
- Modify: `resources/js/components/hero/HeroSearchSection.tsx`

**Interfaces:**
- Consumes: `HeroSearchSectionProps`
- Produces: Flex-wrapped category pills and hot search tag chips

- [ ] **Step 1: View HeroSearchSection.tsx**

View lines 75 to 130 of `resources/js/components/hero/HeroSearchSection.tsx`.

- [ ] **Step 2: Update HeroSearchSection.tsx markup**

In `resources/js/components/hero/HeroSearchSection.tsx`:
Replace hot searches and category container markup with:
```tsx
            {/* Quick Search Tag Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex shrink-0 items-center gap-1 text-[11px] font-extrabold tracking-wider text-navy-400 uppercase dark:text-navy-500">
                    <Tag className="h-3 w-3 text-pastel-coral" />
                    <span>Populer:</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                    {hotSearches.map((item) => (
                        <button
                            key={item.query}
                            onClick={() => setSearchQuery(item.query)}
                            className={`cursor-pointer rounded-xl px-2.5 py-1 text-xs font-bold transition-all ${
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

            {/* Category Filter Pills Bar (Flex-Wrap Minimalist) */}
            <div className="flex flex-wrap items-center gap-1.5 border-t border-navy-100 pt-2.5 sm:gap-2 dark:border-navy-800">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-all sm:px-3.5 sm:py-2 ${
                        selectedCategory === 'all'
                            ? 'bg-pastel-teal text-white shadow-xs'
                            : 'border border-navy-200/50 bg-navy-50 text-navy-600 hover:bg-navy-100 dark:border-navy-800 dark:bg-navy-950 dark:text-navy-300 dark:hover:bg-navy-800'
                    }`}
                >
                    Semua Komoditas ({totalProducts})
                </button>

                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-all sm:px-3.5 sm:py-2 ${
                            selectedCategory === cat.id
                                ? 'bg-pastel-teal text-white shadow-xs'
                                : 'border border-navy-200/50 bg-navy-50 text-navy-600 hover:bg-navy-100 dark:border-navy-800 dark:bg-navy-950 dark:text-navy-300 dark:hover:bg-navy-800'
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
```

- [ ] **Step 3: Verify Pest test suite**

Run: `vendor/bin/pest --compact`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add resources/js/components/hero/HeroSearchSection.tsx
git commit -m "style(landing): convert category and tag filters to minimalist flex-wrapped layout"
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
