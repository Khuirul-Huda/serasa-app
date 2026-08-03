# Design Specification: Mobile Expandable Search Toggle Button

- **Date**: 2026-08-03
- **Scope**: `Navbar.tsx`
- **Objective**: Hide the mobile search bar by default on viewports `< 640px` and display a search icon button that toggles an expandable mobile search input row.

---

## 1. Interaction & Layout Strategy

- **Default State (`< 640px`)**:
  - Search input is hidden (`isMobileSearchOpen = false`).
  - Search button icon (`Search`) appears in the mobile header action buttons: `[Cart] [Notif] [Search Toggle] [Mobile Menu Toggle]`.
- **Expanded State (`< 640px`)**:
  - Clicking the search toggle button sets `isMobileSearchOpen = true` and displays a full-width search bar below the header row.
  - Automatically opens if `searchQuery` has an active value.
- **Desktop Viewports (`≥ 640px`)**:
  - Mobile search toggle button is hidden (`sm:hidden`).
  - Inline search bar is displayed as normal (`hidden sm:block`).

---

## 2. Verification Plan

- Run Pest test suite (`vendor/bin/pest`).
- Run production build (`npm run build`).
- Verify mobile viewport search bar toggle on viewports under 640px.
