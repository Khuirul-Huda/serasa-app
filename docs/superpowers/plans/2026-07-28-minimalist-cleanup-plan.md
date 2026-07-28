# Minimalist UI Cleanup & Stylish Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove redundant badges/labels, remove payment & delivery sections, and convert the Footer into an ultra-minimalist & stylish design.

**Architecture:** Refined layout components (`marketplace-layout.tsx`, `Navbar.tsx`, `Hero.tsx`, `welcome.tsx`, `shops.tsx`).

**Tech Stack:** React 19, Inertia.js v3, TailwindCSS v4, Lucide React.

## Global Constraints
- Remove payment & delivery sections from footer completely.
- Remove redundant badge pills.

---

### Task 1: Redesign Footer & Clean Navbar (`marketplace-layout.tsx` & `Navbar.tsx`)

**Files:**
- Modify: `resources/js/layouts/marketplace-layout.tsx`
- Modify: `resources/js/components/Navbar.tsx`

- [ ] **Step 1: Redesign Footer in `marketplace-layout.tsx`**
  - Delete Payment System grid & icons.
  - Delete Delivery Methods chips.
  - Implement sleek 2-row layout with brand emblem, clean links, WhatsApp helpline button, and minimal copyright.

- [ ] **Step 2: Remove badge pill from `Navbar.tsx`**
  - Remove `"Platform Ekonomi Warga"` badge pill in top utility bar.

---

### Task 2: Remove Excess Labels from Hero, Welcome, and Shops (`Hero.tsx`, `welcome.tsx`, `shops.tsx`)

**Files:**
- Modify: `resources/js/components/Hero.tsx`
- Modify: `resources/js/pages/welcome.tsx`
- Modify: `resources/js/pages/shops.tsx`

- [ ] **Step 1: Clean up labels in `Hero.tsx` and `welcome.tsx`**
  - Remove `"Katalog Sektor Kreatif:"` text prefix above category buttons.
  - Remove `"Sentra UMKM Warga"` badge pill in welcome page.

- [ ] **Step 2: Clean up labels in `shops.tsx`**
  - Remove `"Sentra UMKM Warga"` and `"Data Warga"` badge pills in `shops.tsx` Bento Hero header.

---

### Task 3: Verification & Asset Build

- [ ] **Step 1: Run Pest tests**
  - `./vendor/bin/pest`
- [ ] **Step 2: Build frontend assets**
  - `npm run build`
