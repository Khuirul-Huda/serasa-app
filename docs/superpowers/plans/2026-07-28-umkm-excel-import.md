# UMKM Excel Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow Admin users to import UMKM data from an Excel spreadsheet (`DATA UMKM 2026.xlsx`) into the platform with automatic fallback resolution, conflict checking, and permit flags (`NIB`, `HALAL`, `P-IRT`).

**Architecture:** Database schema migration to store permit booleans on `shops`, an Inertia backend endpoint `POST /admin/shops/bulk-import` for bulk upsert operations, and a client-side Excel parsing modal using SheetJS (`xlsx`) embedded in the Admin Panel (`AdminPanel.tsx`).

**Tech Stack:** Laravel 13, Inertia.js v3, React 19, Pest PHP v4, TypeScript, Tailwind CSS v4, SheetJS (`xlsx`).

## Global Constraints

- PHP: 8.5
- Laravel Framework: 13.x
- Pest PHP: 4.x
- React: 19.x
- Pint formatting required after PHP changes (`vendor/bin/pint --format agent`)

---

### Task 1: Database Migration & Model Updates for Permit Fields

**Files:**
- Create: `database/migrations/2026_07_28_000001_add_permits_to_shops_table.php`
- Modify: `app/Models/Shop.php`
- Modify: `app/Http/Controllers/Controller.php`
- Modify: `resources/js/types/umkm.ts`
- Test: `tests/Unit/ShopPermitsTest.php`

**Interfaces:**
- Produces: `Shop` model with `nib`, `halal`, and `pirt` boolean fields, and `mapShop()` returning `nib`, `halal`, `pirt`.

- [ ] **Step 1: Write the failing Pest test for Shop permits**

Create `tests/Unit/ShopPermitsTest.php`:
```php
<?php

use App\Models\Shop;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('shop model supports nib, halal, and pirt boolean permit fields', function () {
    $shop = Shop::create([
        'id' => 'shop-test-permits',
        'name' => 'Toko Permit Test',
        'owner_name' => 'Budi',
        'description' => 'Test',
        'category' => 'Kuliner & Olahan',
        'phone' => '628123456789',
        'address' => 'Jl. Test No. 1',
        'dusun' => 'Dusun Test',
        'image' => 'https://example.com/image.jpg',
        'logo' => 'https://example.com/logo.jpg',
        'is_verified' => true,
        'lat' => -7.38,
        'lng' => 110.42,
        'nib' => true,
        'halal' => true,
        'pirt' => false,
    ]);

    expect($shop->nib)->toBeTrue();
    expect($shop->halal)->toBeTrue();
    expect($shop->pirt)->toBeFalse();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test --compact --filter=ShopPermitsTest`
Expected: FAIL because columns `nib`, `halal`, `pirt` do not exist in the `shops` table.

- [ ] **Step 3: Create database migration**

Create file `database/migrations/2026_07_28_000001_add_permits_to_shops_table.php`:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            $table->boolean('nib')->default(false)->after('is_verified');
            $table->boolean('halal')->default(false)->after('nib');
            $table->boolean('pirt')->default(false)->after('halal');
        });
    }

    public function down(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            $table->dropColumn(['nib', 'halal', 'pirt']);
        });
    }
};
```

- [ ] **Step 4: Update Shop model, Controller mapper, and TypeScript types**

In `app/Models/Shop.php`:
Add `'nib'`, `'halal'`, `'pirt'` to `$fillable` array, and `'nib' => 'boolean'`, `'halal' => 'boolean'`, `'pirt' => 'boolean'` to `$casts` array.

In `app/Http/Controllers/Controller.php`:
Update `mapShop()` to include `'nib' => (bool) $shop->nib`, `'halal' => (bool) $shop->halal`, `'pirt' => (bool) $shop->pirt`.

In `resources/js/types/umkm.ts`:
Add `nib?: boolean; halal?: boolean; pirt?: boolean;` to `Shop` interface.

- [ ] **Step 5: Run test and Pint code formatter**

Run: `php artisan test --compact --filter=ShopPermitsTest`
Expected: PASS

Run: `vendor/bin/pint --format agent`

- [ ] **Step 6: Commit**

```bash
git add database/migrations/ app/Models/Shop.php app/Http/Controllers/Controller.php resources/js/types/umkm.ts tests/Unit/ShopPermitsTest.php
git commit -m "feat: add nib, halal, and pirt permit columns to shops table"
```

---

### Task 2: Backend Endpoint for Bulk Shop Import

**Files:**
- Modify: `app/Http/Controllers/AdminDashboardController.php`
- Modify: `routes/web.php`
- Test: `tests/Feature/AdminBulkImportTest.php`

**Interfaces:**
- Consumes: `Shop` model with permit fields
- Produces: Route `POST /admin/shops/bulk-import` accepting `{ shops: Array<ShopInput> }` returning Inertia back redirect.

- [ ] **Step 1: Write failing Pest feature test for bulk import**

Create `tests/Feature/AdminBulkImportTest.php`:
```php
<?php

use App\Models\Shop;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin can bulk import umkm shops', function () {
    $admin = User::factory()->admin()->create();

    $payload = [
        'shops' => [
            [
                'id' => 'shop-bakpia-berkah',
                'name' => 'Bakpia Berkah',
                'owner_name' => 'Eko Susanto',
                'description' => 'Produksi Bakpia',
                'category' => 'Kuliner & Olahan',
                'phone' => '62812345678',
                'address' => 'Pongangan RT 04/ RW 01',
                'dusun' => 'Pongangan',
                'image' => 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=800',
                'logo' => 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=150',
                'is_verified' => true,
                'lat' => -7.38,
                'lng' => 110.42,
                'nib' => true,
                'halal' => true,
                'pirt' => false,
            ]
        ]
    ];

    $response = $this->actingAs($admin)
        ->post(route('admin.shops.bulk-import'), $payload);

    $response->assertRedirect();
    $this->assertDatabaseHas('shops', [
        'id' => 'shop-bakpia-berkah',
        'name' => 'Bakpia Berkah',
        'owner_name' => 'Eko Susanto',
        'nib' => true,
        'halal' => true,
        'pirt' => false,
    ]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test --compact --filter=AdminBulkImportTest`
Expected: FAIL (route `admin.shops.bulk-import` not found)

- [ ] **Step 3: Implement route and controller method**

In `routes/web.php` inside the admin middleware group:
```php
Route::post('/admin/shops/bulk-import', [AdminDashboardController::class, 'bulkImport'])->name('admin.shops.bulk-import');
```

In `app/Http/Controllers/AdminDashboardController.php`:
```php
public function bulkImport(\Illuminate\Http\Request $request): \Illuminate\Http\RedirectResponse
{
    $this->authorizeAdmin();

    $validated = $request->validate([
        'shops' => 'required|array',
        'shops.*.name' => 'required|string',
        'shops.*.owner_name' => 'required|string',
        'shops.*.category' => 'required|string',
        'shops.*.address' => 'required|string',
        'shops.*.dusun' => 'nullable|string',
        'shops.*.phone' => 'nullable|string',
        'shops.*.description' => 'nullable|string',
        'shops.*.nib' => 'nullable|boolean',
        'shops.*.halal' => 'nullable|boolean',
        'shops.*.pirt' => 'nullable|boolean',
        'shops.*.is_verified' => 'nullable|boolean',
    ]);

    DB::transaction(function () use ($validated) {
        foreach ($validated['shops'] as $item) {
            $id = $item['id'] ?? ('shop-' . \Illuminate\Support\Str::slug($item['name']));
            
            Shop::updateOrCreate(
                ['id' => $id],
                [
                    'name' => $item['name'],
                    'owner_name' => $item['owner_name'],
                    'description' => $item['description'] ?? ('UMKM ' . $item['name'] . ' Desa Samirono'),
                    'category' => $item['category'],
                    'phone' => $item['phone'] ?? '6285725912345',
                    'address' => $item['address'],
                    'dusun' => $item['dusun'] ?? 'Desa Samirono',
                    'image' => $item['image'] ?? 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=800',
                    'logo' => $item['logo'] ?? 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=150',
                    'is_verified' => $item['is_verified'] ?? true,
                    'lat' => $item['lat'] ?? -7.38,
                    'lng' => $item['lng'] ?? 110.42,
                    'nib' => $item['nib'] ?? false,
                    'halal' => $item['halal'] ?? false,
                    'pirt' => $item['pirt'] ?? false,
                ]
            );
        }
    });

    Cache::forget('app:settings');
    Cache::forget('app:categories');

    return redirect()->back();
}
```

- [ ] **Step 4: Run test and Pint**

Run: `php artisan test --compact --filter=AdminBulkImportTest`
Expected: PASS

Run: `vendor/bin/pint --format agent`

- [ ] **Step 5: Commit**

```bash
git add routes/web.php app/Http/Controllers/AdminDashboardController.php tests/Feature/AdminBulkImportTest.php
git commit -m "feat: add bulkImport endpoint for UMKM shops admin import"
```

---

### Task 3: Install `xlsx` & Build Frontend Import Modal & Permit Badges

**Files:**
- Modify: `package.json`
- Modify: `resources/js/components/AdminPanel.tsx`
- Modify: `resources/js/pages/shop-detail.tsx`
- Modify: `resources/js/components/ShopCard.tsx`

**Interfaces:**
- Consumes: SheetJS `xlsx` library, Route `/admin/shops/bulk-import`
- Produces: Import button and conflict review modal in `AdminPanel.tsx`, permit badges rendered in `ShopCard.tsx` and `shop-detail.tsx`.

- [ ] **Step 1: Install `xlsx` NPM package**

Run command: `npm install xlsx`

- [ ] **Step 2: Update AdminPanel.tsx with Excel Import Button and Conflict Resolution Modal**

In `resources/js/components/AdminPanel.tsx`:
1. Import `* as XLSX from 'xlsx'`.
2. Add state for `isImportModalOpen`, `parsedImportRows`, `isUploading`.
3. Build `handleFileUpload(e)`:
   - Reads file using `reader.readAsArrayBuffer(file)`.
   - Parses `XLSX.read(...)`.
   - Extracts rows starting from Row 4 (indexing row 0 as titles, row 3 as columns, rows 4+ as data).
   - Maps columns:
     - Owner Name = `Row[1]`
     - Address = `Row[2]`
     - Phone = `Row[3]`
     - Business Name = `Row[4]` (If null/empty, fallback to `Row[5]` `JENIS USAHA` as requested).
     - Business Category = `Row[5]`
     - NIB = `Row[6] === 'v' || Row[6] === 'V'`
     - HALAL = `Row[7] === 'v' || Row[7] === 'V'`
     - P-IRT = `Row[8] === 'v' || Row[8] === 'V'`
   - Checks against existing `shops`: if matching name or owner exists, flag as `conflict: true`.
4. Render "Import UMKM (Excel)" button next to search bar in Shops subtab.
5. Render Modal with interactive conflict table allowing user to toggle action (`Overwrite` or `Skip`) and submit to `/admin/shops/bulk-import`.

- [ ] **Step 3: Render Permit Badges in ShopCard.tsx & shop-detail.tsx**

In `resources/js/components/ShopCard.tsx` & `resources/js/pages/shop-detail.tsx`:
Add permit badges (e.g. `NIB`, `Halal`, `P-IRT`) next to the verified status indicator:
```tsx
{shop.nib && (
  <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[8px] font-black uppercase rounded border border-blue-200">
    NIB
  </span>
)}
{shop.halal && (
  <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase rounded border border-emerald-200">
    HALAL
  </span>
)}
{shop.pirt && (
  <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 text-[8px] font-black uppercase rounded border border-purple-200">
    P-IRT
  </span>
)}
```

- [ ] **Step 4: Run type checks & tests**

Run: `npm run types:check`
Run: `php artisan test --compact`

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json resources/js/components/AdminPanel.tsx resources/js/pages/shop-detail.tsx resources/js/components/ShopCard.tsx
git commit -m "feat: add client-side Excel import modal with conflict resolution and permit badges"
```
