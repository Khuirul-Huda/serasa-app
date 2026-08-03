# Mobile Search Toggle Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide the mobile search bar by default on viewports `< 640px` and display a search icon button that toggles an expandable mobile search bar row.

**Architecture:** Add `isMobileSearchOpen` state in [Navbar.tsx](file:///home/huda/repo/serasa-app/resources/js/components/Navbar.tsx). Show a mobile search toggle button in the header actions bar and render the mobile search bar conditionally.

**Tech Stack:** React 19, Inertia.js v3, TailwindCSS v4 with `@custom-variant dark`, Lucide React.

## Global Constraints

- Retain search input state (`searchQuery`, `setSearchQuery`).
- Auto-open mobile search input if `searchQuery` has an active string.
- Full dark mode support (`.dark`).

---

### Task 1: Add Mobile Search Toggle State and UI to Navbar.tsx

**Files:**
- Modify: `resources/js/components/Navbar.tsx`

**Interfaces:**
- Consumes: `NavbarProps`
- Produces: Expandable mobile search bar with toggle button

- [ ] **Step 1: Inspect Navbar.tsx state**

In `resources/js/components/Navbar.tsx`:
Add state:
```tsx
const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(Boolean(searchQuery));
```

- [ ] **Step 2: Update Navbar.tsx header markup**

In `resources/js/components/Navbar.tsx`:
1. Add mobile search toggle button right beside `CartDropdown` and `NotificationDropdown`:
```tsx
                        {/* Mobile Search Toggle Button */}
                        <button
                            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                            className="cursor-pointer rounded-xl p-2 text-navy-600 transition-colors hover:bg-navy-50 hover:text-pastel-teal sm:hidden dark:text-navy-300 dark:hover:bg-navy-800 dark:hover:text-pastel-teal"
                            aria-label="Toggle search"
                            title="Cari produk"
                        >
                            <Search className="h-5 w-5" />
                        </button>
```

2. Conditionally render mobile search bar row under Row 1:
```tsx
                {/* Row 2: Mobile Search Bar (Conditional on < sm) */}
                {(isMobileSearchOpen || searchQuery) && (
                    <div className="mt-2 block sm:hidden animate-fade-in">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Cari produk desa..."
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                autoFocus
                                className="w-full rounded-xl border border-navy-200 bg-navy-50 py-2 pr-9 pl-9 text-xs font-medium text-navy-800 placeholder-navy-400 transition-all focus:border-pastel-teal focus:bg-white focus:ring-2 focus:ring-pastel-teal/15 focus:outline-none dark:border-navy-800 dark:bg-navy-950 dark:text-navy-100 dark:placeholder-navy-500 dark:focus:bg-navy-950"
                                id="global-search-input-mobile"
                            />
                            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-navy-400 dark:text-navy-500" />

                            <button
                                onClick={() => {
                                    handleSearchChange('');
                                    setIsMobileSearchOpen(false);
                                }}
                                className="absolute top-1/2 right-3 -translate-y-1/2 p-0.5 text-navy-400 hover:text-navy-600 dark:text-navy-500 dark:hover:text-navy-300"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                )}
```

- [ ] **Step 3: Verify Pest test suite**

Run: `vendor/bin/pest --compact`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add resources/js/components/Navbar.tsx
git commit -m "feat(navbar): add mobile search toggle button and expandable search input row"
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
