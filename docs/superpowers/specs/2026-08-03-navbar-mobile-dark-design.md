# Design Specification: Enhanced Mobile Navbar & Dark Mode Upgrade

- **Date**: 2026-08-03
- **Scope**: Navigation components (`Navbar.tsx`, `TopBar.tsx`, `MobileMenu.tsx`, `UserMenu.tsx`, `CartDropdown.tsx`, `NotificationDropdown.tsx`)
- **Objective**: Full dark mode support (`.dark`) and mobile responsive drawer optimization across Samirono Etalase header navigation.

---

## 1. Dark Mode Color System

- **Sticky Header**:
  - Light: `bg-white/95 border-navy-200/60`
  - Dark: `dark:bg-navy-900/95 dark:border-navy-800`
- **Top Utility Bar**:
  - Light: `bg-navy-50 border-navy-200/60 text-navy-600`
  - Dark: `dark:bg-navy-950 dark:border-navy-900 dark:text-navy-400`
- **Search Input**:
  - Light: `bg-navy-50 border-navy-200 text-navy-800 placeholder-navy-400`
  - Dark: `dark:bg-navy-950 dark:border-navy-800 dark:text-navy-100 dark:placeholder-navy-500`
- **Dropdown & Drawer Surfaces**:
  - Light: `bg-white border-navy-200`
  - Dark: `dark:bg-navy-900 dark:border-navy-800 dark:text-navy-100`
- **Nav Links & Items**:
  - Inactive: `text-navy-600 hover:bg-navy-50 dark:text-navy-200 dark:hover:bg-navy-800`
  - Active: `bg-pastel-teal-light text-pastel-teal dark:bg-navy-800 dark:text-pastel-teal dark:border-navy-700`

---

## 2. Mobile Responsive Layout & Touch Enhancements

- **Header Spacing**:
  - Flexible layout distribution between brand logo, search input, and action icons.
  - Minimum 44px touch targets on mobile toggle button and dropdown triggers.
- **Mobile Menu Drawer**:
  - Slide-down menu with dark mode background (`bg-white dark:bg-navy-900`).
  - Active tab indicators with Lucide icons (`ShoppingBag`, `Store`, `MapPin`).
  - Admin/Merchant role-based quick action buttons with dark mode variants.
  - Direct WhatsApp helpline button in mobile drawer.

---

## 3. Component Change List

1. `resources/js/components/Navbar.tsx`: Update header container, brand logo text, search input, and mobile menu toggle for dark mode and mobile responsiveness.
2. `resources/js/components/navbar/TopBar.tsx`: Add dark mode background and text colors.
3. `resources/js/components/navbar/MobileMenu.tsx`: Add dark mode background, drawer borders, link colors, and action buttons.
4. `resources/js/components/navbar/UserMenu.tsx`: Add dark mode background, user button styling, and dropdown menu colors.
5. `resources/js/components/navbar/CartDropdown.tsx`: Add dark mode dropdown styling.
6. `resources/js/components/navbar/NotificationDropdown.tsx`: Add dark mode dropdown styling.

---

## 4. Verification Plan

- Run Pest test suite (`vendor/bin/pest`).
- Verify dark mode rendering on mobile and desktop viewports (`375px`, `768px`, `1280px`).
- Confirm zero unreadable text or bright white dropdown flashes in dark mode.
