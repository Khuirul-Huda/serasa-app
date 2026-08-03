# Enhanced Mobile Navbar & Dark Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Samirono Etalase header navigation components with comprehensive dark mode support (`.dark`) and responsive mobile drawer optimizations.

**Architecture:** Add Tailwind `.dark` variant classes across [Navbar.tsx](file:///home/huda/repo/serasa-app/resources/js/components/Navbar.tsx), [TopBar.tsx](file:///home/huda/repo/serasa-app/resources/js/components/navbar/TopBar.tsx), [MobileMenu.tsx](file:///home/huda/repo/serasa-app/resources/js/components/navbar/MobileMenu.tsx), [UserMenu.tsx](file:///home/huda/repo/serasa-app/resources/js/components/navbar/UserMenu.tsx), [CartDropdown.tsx](file:///home/huda/repo/serasa-app/resources/js/components/navbar/CartDropdown.tsx), and [NotificationDropdown.tsx](file:///home/huda/repo/serasa-app/resources/js/components/navbar/NotificationDropdown.tsx) matching the Navy design system.

**Tech Stack:** React 19, Inertia.js v3, TailwindCSS v4 with `@custom-variant dark`, Lucide React.

## Global Constraints

- Preserve all existing routes, navigation logic, and authentication state (`auth.user`).
- Ensure all dropdowns and mobile drawer menus render crisply in dark mode without white background flashes.
- Ensure 44px minimum touch target size for mobile toggle and navigation links.

---

### Task 1: Update TopBar.tsx and UserMenu.tsx for Dark Mode

**Files:**
- Modify: `resources/js/components/navbar/TopBar.tsx`
- Modify: `resources/js/components/navbar/UserMenu.tsx`

**Interfaces:**
- Consumes: `TopBarProps`, `UserMenu`
- Produces: Dark-mode ready top bar and user account dropdown

- [ ] **Step 1: Update TopBar.tsx styling for dark mode**

In `resources/js/components/navbar/TopBar.tsx`:
- Container: `bg-navy-50 border-navy-200/60 text-navy-600 dark:bg-navy-950 dark:border-navy-900 dark:text-navy-400`
- Divider: `text-navy-300 dark:text-navy-700`

- [ ] **Step 2: Update UserMenu.tsx styling for dark mode**

In `resources/js/components/navbar/UserMenu.tsx`:
- Login/Register links: `text-navy-600 dark:text-navy-300`
- User trigger button: `border-pastel-teal/15 bg-pastel-teal-light/60 text-navy-700 dark:border-navy-800 dark:bg-navy-900 dark:text-navy-200`
- Dropdown menu container: `border-navy-200 bg-white text-navy-700 dark:border-navy-800 dark:bg-navy-900 dark:text-navy-200`
- Dropdown header: `text-navy-400 border-navy-100 dark:text-navy-500 dark:border-navy-800`
- Hover states: `hover:bg-pastel-teal-light dark:hover:bg-navy-800`

- [ ] **Step 3: Verify Pest test suite**

Run: `vendor/bin/pest --compact`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add resources/js/components/navbar/TopBar.tsx resources/js/components/navbar/UserMenu.tsx
git commit -m "style(navbar): add dark mode variants to TopBar and UserMenu"
```

---

### Task 2: Update CartDropdown.tsx and NotificationDropdown.tsx for Dark Mode

**Files:**
- Modify: `resources/js/components/navbar/CartDropdown.tsx`
- Modify: `resources/js/components/navbar/NotificationDropdown.tsx`

**Interfaces:**
- Consumes: Cart state, Notification state
- Produces: Dark-mode aware cart and notification dropdown menus

- [ ] **Step 1: Update CartDropdown.tsx styling for dark mode**

In `resources/js/components/navbar/CartDropdown.tsx`:
- Toggle trigger button: `text-navy-600 hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-800`
- Dropdown card container: `border-navy-200 bg-white shadow-xl dark:border-navy-800 dark:bg-navy-900/95`
- Header & footer dividers: `border-navy-100 dark:border-navy-800`
- Text titles & prices: `text-navy-900 dark:text-navy-100`, `text-navy-500 dark:text-navy-400`

- [ ] **Step 2: Update NotificationDropdown.tsx styling for dark mode**

In `resources/js/components/navbar/NotificationDropdown.tsx`:
- Dropdown container: `border-navy-200 bg-white shadow-xl dark:border-navy-800 dark:bg-navy-900/95`
- Item list rows: `hover:bg-navy-50 dark:hover:bg-navy-800/60`
- Text headings & timestamp: `text-navy-900 dark:text-navy-100`, `text-navy-400 dark:text-navy-500`

- [ ] **Step 3: Verify Pest test suite**

Run: `vendor/bin/pest --compact`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add resources/js/components/navbar/CartDropdown.tsx resources/js/components/navbar/NotificationDropdown.tsx
git commit -m "style(navbar): add dark mode variants to CartDropdown and NotificationDropdown"
```

---

### Task 3: Update Navbar.tsx for Dark Mode & Mobile Responsive Layout

**Files:**
- Modify: `resources/js/components/Navbar.tsx`

**Interfaces:**
- Consumes: `NavbarProps`
- Produces: Main responsive sticky header bar with dark mode support

- [ ] **Step 1: Update Navbar.tsx root header and typography**

In `resources/js/components/Navbar.tsx`:
- Header container: `border-navy-200/60 bg-white/95 shadow-xs backdrop-blur-md dark:border-navy-800 dark:bg-navy-900/95`
- Brand title: `text-navy-900 dark:text-navy-100`
- Tagline text: `text-navy-400 dark:text-navy-400`
- Desktop Nav Pills container: `border-navy-200/50 bg-navy-50/70 dark:border-navy-800 dark:bg-navy-950/80`
- Active nav pill: `border-pastel-teal/15 bg-pastel-teal-light text-pastel-teal dark:border-navy-700 dark:bg-navy-800 dark:text-pastel-teal`
- Inactive nav pill: `text-navy-600 hover:bg-navy-50 hover:text-pastel-teal dark:text-navy-300 dark:hover:bg-navy-800 dark:hover:text-pastel-teal`
- Search input: `border-navy-200 bg-navy-50 text-navy-800 placeholder-navy-400 focus:border-pastel-teal focus:bg-white dark:border-navy-800 dark:bg-navy-950 dark:text-navy-100 dark:placeholder-navy-500 dark:focus:bg-navy-950`
- Mobile toggle button: `text-navy-600 hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-800`

- [ ] **Step 2: Verify Pest test suite**

Run: `vendor/bin/pest --compact`
Expected: PASS

- [ ] **Step 3: Commit changes**

```bash
git add resources/js/components/Navbar.tsx
git commit -m "style(navbar): update Navbar sticky header container and search input for dark mode"
```

---

### Task 4: Update MobileMenu.tsx for Dark Mode & Mobile Touch Optimization

**Files:**
- Modify: `resources/js/components/navbar/MobileMenu.tsx`

**Interfaces:**
- Consumes: `MobileMenuProps`
- Produces: Mobile slide-down menu with dark mode support and 44px+ touch targets

- [ ] **Step 1: Apply dark mode classes and touch target padding to MobileMenu.tsx**

In `resources/js/components/navbar/MobileMenu.tsx`:
- Container wrapper: `border-t border-navy-200 bg-white shadow-lg dark:border-navy-800 dark:bg-navy-900/95 dark:shadow-2xl`
- Section labels: `text-navy-400 dark:text-navy-500`
- Navigation links: `text-navy-600 hover:bg-navy-50 dark:text-navy-200 dark:hover:bg-navy-800`
- Active nav link: `border-pastel-teal/15 bg-pastel-teal-light text-pastel-teal dark:border-navy-700 dark:bg-navy-800 dark:text-pastel-teal`
- Divider line: `border-navy-100 dark:border-navy-800`
- Login/Register buttons: `border-navy-200 text-navy-600 hover:bg-navy-50 dark:border-navy-700 dark:text-navy-200 dark:hover:bg-navy-800`

- [ ] **Step 2: Verify Pest test suite**

Run: `vendor/bin/pest --compact`
Expected: PASS

- [ ] **Step 3: Commit changes**

```bash
git add resources/js/components/navbar/MobileMenu.tsx
git commit -m "style(navbar): add dark mode variants and touch target enhancements to MobileMenu"
```

---

### Task 5: End-to-End Verification & Formatting

- [ ] **Step 1: Run Pint code formatter**

Run: `vendor/bin/pint --dirty --format agent`

- [ ] **Step 2: Run full Pest test suite**

Run: `vendor/bin/pest --compact`
Expected: 61/61 PASS

- [ ] **Step 3: Run npm build verification**

Run: `npm run build`
Expected: Build succeeds cleanly
