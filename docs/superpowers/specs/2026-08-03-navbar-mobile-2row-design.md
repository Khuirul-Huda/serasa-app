# Design Specification: 2-Row Mobile Responsive Navbar (< 550px) Upgrade

- **Date**: 2026-08-03
- **Scope**: `Navbar.tsx`
- **Objective**: Fix navbar responsiveness on mobile viewports under 550px by splitting header layout into a 2-row mobile structure (< 640px).

---

## 1. Mobile Layout Strategy (< 640px)

- **Row 1 (Logo & Header Actions)**:
  - Left: Brand Logo & Title (`firstWord` + `restWords`). Tagline hidden on `< 400px` (`hidden xs:block`).
  - Right: Cart Dropdown, Notification Dropdown, Mobile Menu Toggle.
  - Spacing: Clean horizontal layout with zero crowding or clipping.
- **Row 2 (Full-Width Search Input on Mobile)**:
  - Rendered on `< 640px` (`block sm:hidden px-3 pb-2.5`).
  - Full-width search bar with clear button (`X`) and search icon.
- **Desktop Layout (≥ 640px)**:
  - Rendered inline as a single flex row (`hidden sm:flex`).

---

## 2. Dark Mode System

- Header container: `bg-white/95 dark:bg-navy-900/95 border-navy-200/60 dark:border-navy-800`.
- Mobile search input: `bg-navy-50 dark:bg-navy-950 border-navy-200 dark:border-navy-800 text-navy-800 dark:text-navy-100`.

---

## 3. Verification Plan

- Run Pest test suite (`vendor/bin/pest`).
- Run production build (`npm run build`).
- Verify responsiveness under 550px viewport sizes (`360px`, `390px`, `414px`, `520px`).
