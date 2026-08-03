# Design Specification: Minimalist Flex-Wrap Category & Tag Filter

- **Date**: 2026-08-03
- **Scope**: `HeroSearchSection.tsx`
- **Objective**: Eliminate horizontal scrolling (`overflow-x-auto`) on landing page category and popular search filters by implementing a minimalist flex-wrapped layout.

---

## 1. Container & Pill Styling Strategy

- **Category Container**:
  - Replace `overflow-x-auto` with `flex flex-wrap items-center gap-1.5 sm:gap-2 border-t border-navy-100 pt-2.5 dark:border-navy-800`.
  - Removes horizontal scrollbars entirely.
- **Category Button Styling**:
  - `px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold rounded-xl transition-all cursor-pointer`.
  - Active: `bg-pastel-teal text-white shadow-xs`.
  - Inactive: `border border-navy-200/50 bg-navy-50 text-navy-600 hover:bg-navy-100 dark:border-navy-800 dark:bg-navy-950 dark:text-navy-300 dark:hover:bg-navy-800`.
- **Hot Searches Container & Chips**:
  - Replace `overflow-x-auto` with `flex flex-wrap items-center gap-1.5`.
  - Chip styling: `px-2.5 py-1 text-[11px] font-bold rounded-lg bg-navy-100/60 dark:bg-navy-950 dark:text-navy-300`.

---

## 2. Verification Plan

- Run Pest test suite (`vendor/bin/pest`).
- Run production build (`npm run build`).
- Verify landing page filter rendering on mobile and desktop screens.
