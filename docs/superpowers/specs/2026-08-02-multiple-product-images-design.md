# Multiple Product Images (Tokopedia-Style) Design Spec

**Date**: 2026-08-02  
**Status**: Approved  

---

## 1. Objective
Add support for uploading and managing multiple product images (up to 5 photos) per product in the SERASA UMKM application, similar to Tokopedia's product media gallery.

---

## 2. Database Schema & Model Changes

### 2.1 Database Migration
- **File**: `database/migrations/2026_08_02_000001_add_images_to_products_table.php`
- **Schema Modification**:
  ```php
  Schema::table('products', function (Blueprint $table) {
      $table->json('images')->nullable()->after('image');
  });
  ```

### 2.2 Eloquent Model (`app/Models/Product.php`)
- Add `'images'` to `$fillable`.
- Add `'images' => 'array'` to `$casts`.
- Add custom accessor `getGalleryAttribute()`:
  ```php
  public function getGalleryAttribute(): array
  {
      if (!empty($this->images) && is_array($this->images)) {
          return $this->images;
      }
      return $this->image ? [$this->image] : [];
  }
  ```

---

## 3. Backend Controllers & Form Request

### 3.1 Form Request (`app/Http/Requests/AddProductRequest.php`)
- Add validation rules for multiple image uploads:
  ```php
  'images' => 'nullable|array|max:5',
  'images.*' => 'file|image|max:2048',
  'image' => $this->hasFile('image') ? 'file|image|max:2048' : 'nullable|string',
  ```

### 3.2 Merchant Controller (`app/Http/Controllers/MerchantController.php`)
- Update `addProduct()`:
  - Process `images` array if uploaded (up to 5 files).
  - Store files in `public/storage/products`.
  - Set primary `image` = `$imageUrls[0]` and `images` = `$imageUrls`.
  - Maintain fallback logic if single `image` file or legacy URL is provided.

### 3.3 Data Mapping (`mapProduct`)
- Update `mapProduct()` across `MerchantController`, `MarketplaceController`, and `AdminDashboardController` to include:
  ```php
  'images' => $p->gallery,
  ```

---

## 4. Frontend Component Updates

### 4.1 TypeScript Definitions (`resources/js/types/umkm.ts`)
- Update `Product` interface:
  ```typescript
  export interface Product {
      id: string;
      shopId: string;
      categoryId: string;
      name: string;
      description: string;
      price: number;
      unit: string;
      image: string;
      images?: string[];
      rating: number;
      reviewsCount: number;
      isAvailable: boolean;
      reviews?: Review[];
  }
  ```

### 4.2 Merchant Dashboard Form (`AddProductForm.tsx`)
- Update file input to allow `multiple` selection (max 5).
- Add live preview thumbnail grid:
  - Display photo thumbnails with badge `"Sampul Utama"` on the 1st photo.
  - Hover `X` button to remove individual files prior to submission.

### 4.3 Product Detail Page (`product-detail.tsx`)
- Replace single static image display with interactive gallery:
  - Main large photo viewer displaying active selected image.
  - Horizontal thumbnail bar showing up to 5 images.
  - Active thumbnail outline ring (`border-pastel-teal`).
  - Click to switch active photo.

---

## 5. Seeders & Testing

- Update `DatabaseSeeder.php` to include sample arrays of images (`images => [...]`) for demo products.
- Ensure all existing unit/feature tests pass and add unit tests verifying multiple product photo storage.
