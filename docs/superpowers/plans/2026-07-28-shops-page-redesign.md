# Shops Page (/shops) Bento Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 2026 Asymmetric Bento Hero header on `/shops` and remove "Filter Izin" controls completely.

**Architecture:** Asymmetric 2-tile Bento grid header (`welcome.tsx` / `shops.tsx`), search + category filter bar, and 3-column shop list grid.

**Tech Stack:** React 19, Inertia.js v3, TailwindCSS v4, Lucide React.

## Global Constraints
- Remove permit filter bar ("Filter Izin" buttons removed).
- Grounded organic stone palette (`stone-50`, `stone-900`, `emerald-700`).

---

### Task 1: Update `shops.tsx` with Asymmetric Bento Hero

**Files:**
- Modify: `resources/js/pages/shops.tsx`

- [ ] **Step 1: Remove `permitFilter` state and permit filter buttons**
  - Delete `permitFilter` state variable.
  - Simplify `filteredShops` logic to filter only by search query and category.

- [ ] **Step 2: Implement Asymmetric Bento Hero Layout**
  - Add 2-tile grid: Main Tile (`lg:col-span-8`) in white stone and Metrics Tile (`lg:col-span-4`) in obsidian stone.
  - Integrate clean search input and category select inside the main Bento tile.

---

### Task 2: Verification & Asset Build

- [ ] **Step 1: Run Pest tests**
  - `./vendor/bin/pest`
- [ ] **Step 2: Build frontend assets**
  - `npm run build`
