# Multiple Product Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add support for uploading and managing up to 5 product photos per product with Tokopedia-style multi-image preview and interactive detail page gallery.

**Architecture:** Add an `images` JSON column to the `products` table via migration. Update the `Product` model to cast `images` as an array and expose a `gallery` accessor (`images ?: [image]`). Update `AddProductRequest` and `MerchantController` to process multi-file uploads into `storage/app/public/products`, updating `image` (cover) and `images` (gallery array). Update React Inertia components (`AddProductForm` and `product-detail`) to handle multiple file preview and gallery switching.

**Tech Stack:** Laravel 13, Inertia.js v3, React 19, Pest PHP 4, TypeScript.

## Global Constraints

- PHP version: 8.5
- React version: 19
- Inertia version: v3
- Use Pest for PHP tests (`php artisan test --compact`)
- Clean code with no unused imports or unhandled exceptions

---

### Task 1: Migration & Product Model Extension

**Files:**
- Create: `database/migrations/2026_08_02_000001_add_images_to_products_table.php`
- Modify: `app/Models/Product.php`
- Test: `tests/Unit/ProductModelTest.php`

**Interfaces:**
- Produces: `Product::$casts['images'] => 'array'`, `Product->gallery` returning `array<string>`.

- [ ] **Step 1: Write the failing unit test for Product gallery accessor**

Create `tests/Unit/ProductModelTest.php`:
```php
<?php

use App\Models\Product;

test('product gallery attribute returns images array when populated', function () {
    $product = new Product([
        'image' => 'http://example.com/cover.jpg',
        'images' => [
            'http://example.com/cover.jpg',
            'http://example.com/gallery1.jpg',
        ],
    ]);

    expect($product->gallery)->toBe([
        'http://example.com/cover.jpg',
        'http://example.com/gallery1.jpg',
    ]);
});

test('product gallery attribute falls back to single image when images is empty', function () {
    $product = new Product([
        'image' => 'http://example.com/cover.jpg',
        'images' => null,
    ]);

    expect($product->gallery)->toBe([
        'http://example.com/cover.jpg',
    ]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test --compact --filter=ProductModelTest`
Expected: FAIL due to missing migration/accessor or array casting.

- [ ] **Step 3: Create database migration**

Create `database/migrations/2026_08_02_000001_add_images_to_products_table.php`:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->json('images')->nullable()->after('image');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('images');
        });
    }
};
```

- [ ] **Step 4: Update `Product` model**

Modify `app/Models/Product.php`:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id', 'shop_id', 'category_id', 'name', 'description',
        'price', 'unit', 'image', 'images', 'rating', 'reviews_count', 'is_available',
    ];

    protected $casts = [
        'price' => 'integer',
        'rating' => 'double',
        'reviews_count' => 'integer',
        'is_available' => 'boolean',
        'images' => 'array',
    ];

    public function getGalleryAttribute(): array
    {
        if (! empty($this->images) && is_array($this->images)) {
            return $this->images;
        }

        return $this->image ? [$this->image] : [];
    }

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
```

- [ ] **Step 5: Run migration and test to verify it passes**

Run: `php artisan migrate --no-interaction`
Run: `php artisan test --compact --filter=ProductModelTest`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add database/migrations/2026_08_02_000001_add_images_to_products_table.php app/Models/Product.php tests/Unit/ProductModelTest.php
git commit -m "feat: add images json column and gallery accessor to Product model"
```

---

### Task 2: Backend Controller & Request Validation

**Files:**
- Modify: `app/Http/Requests/AddProductRequest.php`
- Modify: `app/Http/Controllers/MerchantController.php`
- Modify: `app/Http/Controllers/MarketplaceController.php`
- Modify: `app/Http/Controllers/AdminDashboardController.php`
- Test: `tests/Feature/MultipleImageUploadTest.php`

**Interfaces:**
- Consumes: `Product->gallery`
- Produces: API/Inertia props `product.images` array in merchant/marketplace/admin views.

- [ ] **Step 1: Write the failing feature test for uploading multiple images**

Create `tests/Feature/MultipleImageUploadTest.php`:
```php
<?php

use App\Models\Category;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('merchant can upload multiple images when creating product', function () {
    Storage::fake('public');

    $user = User::factory()->create(['role' => 'owner']);
    $shop = Shop::factory()->create(['user_id' => $user->id]);
    $category = Category::factory()->create(['id' => 'cat-kuliner']);

    $response = $this->actingAs($user)->post(route('merchant.products.add'), [
        'name' => 'Keripik Tempe Multi',
        'categoryId' => $category->id,
        'price' => 15000,
        'unit' => 'Bungkus',
        'description' => 'Keripik gurih renyah.',
        'images' => [
            UploadedFile::fake()->image('photo1.jpg'),
            UploadedFile::fake()->image('photo2.jpg'),
        ],
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('products', [
        'name' => 'Keripik Tempe Multi',
        'shop_id' => $shop->id,
    ]);

    $product = \App\Models\Product::where('name', 'Keripik Tempe Multi')->first();
    expect($product->images)->toBeArray()->toHaveCount(2);
    expect($product->image)->toBe($product->images[0]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test --compact --filter=MultipleImageUploadTest`
Expected: FAIL

- [ ] **Step 3: Update `AddProductRequest.php`**

Modify `app/Http/Requests/AddProductRequest.php`:
```php
<?php

/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AddProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'owner';
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
            'categoryId' => 'required|string|exists:categories,id',
            'description' => 'nullable|string',
            'images' => 'nullable|array|max:5',
            'images.*' => 'file|image|max:2048',
            'image' => $this->hasFile('image') ? 'file|image|max:2048' : 'nullable|string',
        ];
    }
}
```

- [ ] **Step 4: Update `MerchantController::addProduct` and `mapProduct`**

In `app/Http/Controllers/MerchantController.php`:
1. In `addProduct()`:
```php
        $imageUrls = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('products', 'public');
                $imageUrls[] = asset('storage/'.$path);
            }
        }

        $fallbackImages = [
            'cat-kuliner' => 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=600',
            'cat-pertanian' => 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600',
            'cat-kerajinan' => 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
            'cat-wisata' => 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600',
            'cat-fashion' => 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&q=80&w=600',
        ];

        $image = !empty($imageUrls) ? $imageUrls[0] : ($request->image ?: ($fallbackImages[$request->categoryId] ?? 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600'));

        if ($request->hasFile('image') && empty($imageUrls)) {
            $path = $request->file('image')->store('products', 'public');
            $image = asset('storage/'.$path);
            $imageUrls = [$image];
        } elseif (empty($imageUrls)) {
            $imageUrls = [$image];
        }

        $id = 'prod-'.Str::slug($request->name).'-'.rand(100, 999);

        Product::create([
            'id' => $id,
            'shop_id' => $shop->id,
            'category_id' => $request->categoryId,
            'name' => $request->name,
            'description' => $request->description ?: 'Produk UMKM unggulan yang diproduksi secara higienis dan penuh kearifan lokal di Desa Samirono.',
            'price' => $request->price,
            'unit' => $request->unit,
            'image' => $image,
            'images' => $imageUrls,
            'rating' => 5.0,
            'reviews_count' => 0,
            'is_available' => true,
        ]);
```

2. Update `mapProduct()` helper in `MerchantController`, `MarketplaceController`, and `AdminDashboardController` to include `'images' => $p->gallery`.

- [ ] **Step 5: Run tests to verify pass**

Run: `php artisan test --compact --filter=MultipleImageUploadTest`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add app/Http/Requests/AddProductRequest.php app/Http/Controllers/MerchantController.php app/Http/Controllers/MarketplaceController.php app/Http/Controllers/AdminDashboardController.php tests/Feature/MultipleImageUploadTest.php
git commit -m "feat: handle multiple image uploads in AddProductRequest and MerchantController"
```

---

### Task 3: Frontend React Components (Types, AddProductForm, product-detail)

**Files:**
- Modify: `resources/js/types/umkm.ts`
- Modify: `resources/js/components/owner/AddProductForm.tsx`
- Modify: `resources/js/components/owner/CatalogTab.tsx`
- Modify: `resources/js/pages/product-detail.tsx`

**Interfaces:**
- Updates `Product` type definition to include `images?: string[]`.
- Multi-file state in `AddProductForm.tsx` & thumbnail preview.
- Dynamic image gallery switcher in `product-detail.tsx`.

- [ ] **Step 1: Update TypeScript definitions in `resources/js/types/umkm.ts`**

In `resources/js/types/umkm.ts`:
Add `images?: string[];` to `Product` interface.

- [ ] **Step 2: Update `AddProductForm.tsx` with Tokopedia-style multi-image upload & preview grid**

In `resources/js/components/owner/AddProductForm.tsx`:
- Allow file input with `multiple` attribute.
- Accept up to 5 files (`max 5`).
- Display thumbnails of selected files with `"Sampul Utama"` badge on file `0` and a close/delete `X` button on each preview thumbnail.

- [ ] **Step 3: Update `CatalogTab.tsx` form state handling**

In `resources/js/components/owner/CatalogTab.tsx`:
Ensure form data initializes `images: []` and submits `images` correctly via Inertia `useForm`.

- [ ] **Step 4: Update `product-detail.tsx` with interactive gallery component**

In `resources/js/pages/product-detail.tsx`:
- Maintain state `[activeImage, setActiveImage] = useState<string>(product.image)`
- Render main image viewer showing `activeImage`.
- If `product.images` has more than 1 image (or `gallery.length > 1`), render a thumbnail row under the main image.
- Each thumbnail button updates `setActiveImage(img)` on click and has `border-2 border-pastel-teal` when selected.

- [ ] **Step 5: Run Pint code formatter**

Run: `vendor/bin/pint --format agent`

- [ ] **Step 6: Commit**

```bash
git add resources/js/types/umkm.ts resources/js/components/owner/AddProductForm.tsx resources/js/components/owner/CatalogTab.tsx resources/js/pages/product-detail.tsx
git commit -m "feat: add multi-image upload preview and product detail gallery switcher"
```

---

### Task 4: Seeders & End-to-End Verification

**Files:**
- Modify: `database/seeders/DatabaseSeeder.php`

- [ ] **Step 1: Update `DatabaseSeeder.php`**

Add sample multi-image gallery arrays (`images => [...]`) to seeded products in `DatabaseSeeder.php`.

- [ ] **Step 2: Run seed and automated test suite**

Run: `php artisan migrate:fresh --seed`
Run: `php artisan test --compact`
Expected: All tests PASS.

- [ ] **Step 3: Commit**

```bash
git add database/seeders/DatabaseSeeder.php
git commit -m "seed: add gallery images for seeded products"
```
