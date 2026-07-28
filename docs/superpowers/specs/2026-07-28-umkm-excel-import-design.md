# Design Specification: UMKM Excel Import & Permit Badges

## 1. Overview
This feature allows Admin users of Desa Samirono to import UMKM data from an Excel spreadsheet (`DATA UMKM 2026.xlsx`) directly through the Admin Dashboard.
The import mechanism features client-side Excel parsing, auto-filling missing values (e.g. fallback `nama_usaha` to `jenis_usaha`), detecting conflicts with existing database records, interactive conflict resolution (Overwrite/Skip), and saving permit badges (`NIB`, `HALAL`, `P-IRT`) as boolean flags on UMKM shops.

## 2. Database & Model Changes
- **Migration**: Create `add_permits_to_shops_table` adding:
  - `nib` (boolean, default false)
  - `halal` (boolean, default false)
  - `pirt` (boolean, default false)
- **Model** (`App\Models\Shop`): Add `nib`, `halal`, `pirt` to `$fillable` and cast as `boolean` in `$casts`.
- **Controller Mapper** (`App\Http\Controllers\Controller`): Update `mapShop()` helper to include `nib`, `halal`, and `pirt` booleans in frontend payload.

## 3. Backend Routes & Bulk Import Handler
- **Route**: `POST /admin/shops/bulk-import`
- **Controller** (`App\Http\Controllers\AdminDashboardController@bulkImport`):
  - Validate request payload (array of shops with fields: `id`, `name`, `owner_name`, `address`, `dusun`, `phone`, `category`, `nib`, `halal`, `pirt`, `is_verified`, etc.).
  - Process items inside a DB transaction (`DB::transaction`).
  - Use `Shop::updateOrCreate` matching by `id` or slugified name.

## 4. Frontend Parsing & Conflict Review UI
- **Package**: `xlsx` (SheetJS) installed on frontend.
- **Component** (`resources/js/components/AdminPanel.tsx`):
  - Add "Import UMKM (Excel)" button to open an **Import Modal**.
  - Dropzone for `.xlsx` file.
  - Parse sheet starting from Row 4 (headers in Row 3/4).
  - Map columns:
    - `NAMA` -> `ownerName`
    - `ALAMAT` -> `address` & parse `dusun`
    - `NO HP` -> `phone`
    - `NAMA USAHA` -> `name` (If null/empty, fallback to `JENIS USAHA`)
    - `JENIS USAHA` -> `category`
    - `IJIN USAHA (NIB)` -> `nib` (true if cell value is 'v' / 'V' / '1')
    - `IJIN USAHA (HALAL)` -> `halal` (true if cell value is 'v' / 'V' / '1')
    - `IJIN USAHA (P-IRT)` -> `pirt` (true if cell value is 'v' / 'V' / '1')
  - Compare with existing loaded `shops`: Mark conflicts where business name matches existing records.
  - Present an interactive review table allowing Admin to select action per row: `Create/Update` or `Skip`.
  - Send finalized rows via Inertia `router.post('/admin/shops/bulk-import', ...)`.

## 5. UI Permit Badges
- Render badges for `NIB`, `Halal`, and `P-IRT` on:
  - Admin verification table (`AdminPanel.tsx`)
  - Shop Details (`resources/js/pages/shop-detail.tsx`)
  - Shop Cards (`resources/js/components/ShopCard.tsx`)
