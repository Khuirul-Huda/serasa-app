# Admin User & Shop Creation and Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow admins to create new user accounts, create new UMKM shops, and edit/manage existing shop details directly from the Admin Panel.

**Architecture:** Add `createUser`, `createShop`, and `updateShop` actions in `AdminDashboardController.php`. Register routes in `routes/web.php`. Update `UsersTab.tsx` with user creation modal and `ShopsTab.tsx` with shop creation/edition modals.

**Tech Stack:** Laravel 13, Inertia.js v3, React 19, Tailwind CSS v4, Pest 4.

## Global Constraints
- Passwords must be hashed using `Hash::make()`.
- Validations for email uniqueness and input data integrity.
- 100% test coverage with `php artisan test --compact`.

---

### Task 1: Backend Controller Actions & Routes for User/Shop Creation and Editing

**Files:**
- Modify: `app/Http/Controllers/AdminDashboardController.php`
- Modify: `routes/web.php`
- Test: `tests/Feature/AdminUserShopManagementTest.php`

**Interfaces:**
- Produces:
  - `POST /admin/users` (`admin.users.store`)
  - `POST /admin/shops` (`admin.shops.store`)
  - `PUT /admin/shops/{id}` (`admin.shops.update`)

- [ ] **Step 1: Write Pest tests for user creation, shop creation, and shop updating**

Create `tests/Feature/AdminUserShopManagementTest.php`:
```php
<?php

use App\Models\Shop;
use App\Models\User;

test('admin can create a new user', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post(route('admin.users.store'), [
        'name' => 'Budi Tani',
        'email' => 'budi@samirono.id',
        'password' => 'password123',
        'role' => 'owner',
    ]);

    $response->assertRedirect();
    expect(User::where('email', 'budi@samirono.id')->exists())->toBeTrue();
});

test('admin can create a new shop', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create(['role' => 'owner']);

    $response = $this->actingAs($admin)->post(route('admin.shops.store'), [
        'name' => 'Kue Karamel Samirono',
        'owner_name' => 'Siti Tani',
        'user_id' => $user->id,
        'category' => 'Kuliner & Olahan',
        'dusun' => 'Dusun Bentar',
        'address' => 'RT 02 RW 01 Dusun Bentar',
        'phone' => '62857259112233',
        'description' => 'Kue enak khas desa',
        'nib' => true,
        'halal' => true,
        'pirt' => false,
        'is_verified' => true,
    ]);

    $response->assertRedirect();
    expect(Shop::where('name', 'Kue Karamel Samirono')->exists())->toBeTrue();
});

test('admin can update an existing shop', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $shop = Shop::factory()->create(['name' => 'Nama Lama']);

    $response = $this->actingAs($admin)->put(route('admin.shops.update', $shop->id), [
        'name' => 'Nama Baru Toko',
        'owner_name' => $shop->owner_name,
        'category' => $shop->category,
        'dusun' => $shop->dusun,
        'address' => $shop->address,
        'phone' => $shop->phone,
        'description' => 'Deskripsi diperbarui',
        'nib' => true,
        'halal' => true,
        'pirt' => true,
        'is_verified' => true,
    ]);

    $response->assertRedirect();
    expect($shop->fresh()->name)->toBe('Nama Baru Toko');
});
```

- [ ] **Step 2: Run Pest test to verify failure**

Run: `php artisan test --compact --filter=AdminUserShopManagementTest`
Expected: FAIL due to missing controller actions.

- [ ] **Step 3: Implement controller actions in `AdminDashboardController.php`**

```php
public function createUser(Request $request): RedirectResponse
{
    $this->authorizeAdmin();

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255|unique:users,email',
        'password' => 'required|string|min:8',
        'role' => 'required|in:admin,owner,user',
    ]);

    User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
        'role' => $validated['role'],
    ]);

    return redirect()->back()->with('success', 'Akun pengguna berhasil dibuat!');
}

public function createShop(Request $request): RedirectResponse
{
    $this->authorizeAdmin();

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'owner_name' => 'required|string|max:255',
        'user_id' => 'nullable|exists:users,id',
        'category' => 'required|string|max:100',
        'dusun' => 'nullable|string|max:100',
        'address' => 'nullable|string|max:255',
        'phone' => 'nullable|string|max:50',
        'description' => 'nullable|string',
        'image' => 'nullable|string|max:1000',
        'logo' => 'nullable|string|max:1000',
        'nib' => 'boolean',
        'halal' => 'boolean',
        'pirt' => 'boolean',
        'is_verified' => 'boolean',
        'lat' => 'nullable|numeric',
        'lng' => 'nullable|numeric',
    ]);

    $id = 'shop-'.Str::slug($validated['name']).'-'.Str::random(4);

    Shop::create([
        'id' => $id,
        'user_id' => $validated['user_id'] ?? null,
        'name' => $validated['name'],
        'owner_name' => $validated['owner_name'],
        'category' => $validated['category'],
        'dusun' => $validated['dusun'] ?? 'Dusun Samirono',
        'address' => $validated['address'] ?? 'Desa Samirono',
        'phone' => $validated['phone'] ?? '6285725900000',
        'description' => $validated['description'] ?? '',
        'image' => $validated['image'] ?? 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        'logo' => $validated['logo'] ?? 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
        'nib' => $validated['nib'] ?? false,
        'halal' => $validated['halal'] ?? false,
        'pirt' => $validated['pirt'] ?? false,
        'is_verified' => $validated['is_verified'] ?? true,
        'lat' => $validated['lat'] ?? -7.371239,
        'lng' => $validated['lng'] ?? 110.456123,
    ]);

    return redirect()->back()->with('success', 'Toko UMKM berhasil dibuat!');
}

public function updateShop(Request $request, string $id): RedirectResponse
{
    $this->authorizeAdmin();

    $shop = Shop::findOrFail($id);

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'owner_name' => 'required|string|max:255',
        'user_id' => 'nullable|exists:users,id',
        'category' => 'required|string|max:100',
        'dusun' => 'nullable|string|max:100',
        'address' => 'nullable|string|max:255',
        'phone' => 'nullable|string|max:50',
        'description' => 'nullable|string',
        'image' => 'nullable|string|max:1000',
        'logo' => 'nullable|string|max:1000',
        'nib' => 'boolean',
        'halal' => 'boolean',
        'pirt' => 'boolean',
        'is_verified' => 'boolean',
        'lat' => 'nullable|numeric',
        'lng' => 'nullable|numeric',
    ]);

    $shop->update([
        'name' => $validated['name'],
        'owner_name' => $validated['owner_name'],
        'user_id' => $validated['user_id'] ?? $shop->user_id,
        'category' => $validated['category'],
        'dusun' => $validated['dusun'] ?? $shop->dusun,
        'address' => $validated['address'] ?? $shop->address,
        'phone' => $validated['phone'] ?? $shop->phone,
        'description' => $validated['description'] ?? $shop->description,
        'image' => $validated['image'] ?? $shop->image,
        'logo' => $validated['logo'] ?? $shop->logo,
        'nib' => $validated['nib'] ?? $shop->nib,
        'halal' => $validated['halal'] ?? $shop->halal,
        'pirt' => $validated['pirt'] ?? $shop->pirt,
        'is_verified' => $validated['is_verified'] ?? $shop->is_verified,
        'lat' => $validated['lat'] ?? $shop->lat,
        'lng' => $validated['lng'] ?? $shop->lng,
    ]);

    return redirect()->back()->with('success', 'Data toko UMKM berhasil diperbarui!');
}
```

- [ ] **Step 4: Register routes in `routes/web.php`**

Inside `middleware(['can:admin'])`:
```php
Route::post('/admin/users', [AdminDashboardController::class, 'createUser'])->name('admin.users.store');
Route::post('/admin/shops', [AdminDashboardController::class, 'createShop'])->name('admin.shops.store');
Route::put('/admin/shops/{id}', [AdminDashboardController::class, 'updateShop'])->name('admin.shops.update');
```

- [ ] **Step 5: Run tests to verify pass**

Run: `php artisan test --compact --filter=AdminUserShopManagementTest`
Expected: PASS.

---

### Task 2: Frontend Modals for User Creation (`UsersTab.tsx`) and Shop Creation/Editing (`ShopsTab.tsx`)

**Files:**
- Modify: `resources/js/components/admin/UsersTab.tsx`
- Modify: `resources/js/components/admin/ShopsTab.tsx`

**Interfaces:**
- Consumes: User creation & shop creation/edit endpoints

- [ ] **Step 1: Update `UsersTab.tsx` with User Creation Modal**

Add:
- "Tambah Pengguna Baru" button opening a clean modal.
- Form fields: Nama Lengkap (`name`), Email (`email`), Password (`password`), Role (`user`, `owner`, `admin`).
- Form submission calling `router.post('/admin/users', payload)`.

- [ ] **Step 2: Update `ShopsTab.tsx` with Shop Creation and Editing Modals**

Add:
- "Tambah UMKM Baru" button opening shop creation modal.
- "Edit Toko" icon button on each shop row opening edit modal pre-filled with shop data.
- Form fields in modal: Nama Toko (`name`), Nama Pemilik (`owner_name`), Pemilik Akun (`user_id`), Kategori Sektor (`category`), Dusun (`dusun`), Alamat Lengkap (`address`), No WA (`phone`), Deskripsi (`description`), Status Legalkes (NIB, Halal, P-IRT), Status Verifikasi (`is_verified`), Gambar Sampul (`image`), Logo (`logo`).
- Submissions calling `router.post('/admin/shops', payload)` or `router.put('/admin/shops/${id}', payload)`.

- [ ] **Step 3: Run Pest test suite**

Run: `php artisan test --compact`
Expected: PASS.

- [ ] **Step 4: Format PHP code**

Run: `vendor/bin/pint --dirty --format agent`

---
