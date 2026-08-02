<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

test('admin can toggle shop legal permit NIB, HALAL, or PIRT', function () {
    $admin = User::factory()->admin()->create();
    $shop = Shop::create([
        'id' => (string) Str::ulid(),
        'user_id' => $admin->id,
        'name' => 'Toko Test Permit',
        'owner_name' => 'Pemilik Test',
        'description' => 'Deskripsi Toko',
        'category' => 'Kuliner',
        'phone' => '628123456789',
        'address' => 'Jl. Samirono',
        'dusun' => 'Dusun I',
        'image' => 'https://example.com/image.jpg',
        'logo' => 'https://example.com/logo.jpg',
        'is_verified' => true,
        'lat' => -7.7,
        'lng' => 110.4,
        'nib' => false,
        'halal' => false,
        'pirt' => false,
    ]);

    $this->actingAs($admin)
        ->post(route('admin.shops.permit', $shop->id), ['permit' => 'nib'])
        ->assertRedirect();

    expect($shop->fresh()->nib)->toBeTrue();
});

test('admin can delete inappropriate product and its reviews', function () {
    $admin = User::factory()->admin()->create();
    $shop = Shop::create([
        'id' => (string) Str::ulid(),
        'user_id' => $admin->id,
        'name' => 'Toko Test Product Delete',
        'owner_name' => 'Pemilik Test',
        'description' => 'Deskripsi Toko',
        'category' => 'Kuliner',
        'phone' => '628123456789',
        'address' => 'Jl. Samirono',
        'dusun' => 'Dusun I',
        'image' => 'https://example.com/image.jpg',
        'logo' => 'https://example.com/logo.jpg',
        'is_verified' => true,
        'lat' => -7.7,
        'lng' => 110.4,
    ]);

    $category = Category::create([
        'id' => 'cat-test-delete',
        'name' => 'Kuliner',
        'icon_name' => 'Utensils',
        'description' => 'Produk kuliner',
        'color' => 'teal',
    ]);

    $product = Product::create([
        'id' => (string) Str::ulid(),
        'shop_id' => $shop->id,
        'category_id' => $category->id,
        'name' => 'Produk Test Delete',
        'description' => 'Deskripsi Produk',
        'price' => 15000,
        'unit' => 'pcs',
        'image' => 'https://example.com/product.jpg',
        'rating' => 5.0,
        'reviews_count' => 0,
        'is_available' => true,
    ]);

    $this->actingAs($admin)
        ->delete(route('admin.products.delete', $product->id))
        ->assertRedirect();

    expect(Product::find($product->id))->toBeNull();
});

test('admin can delete review and recalculate rating', function () {
    $admin = User::factory()->admin()->create();
    $shop = Shop::create([
        'id' => (string) Str::ulid(),
        'user_id' => $admin->id,
        'name' => 'Toko Test Review Delete',
        'owner_name' => 'Pemilik Test',
        'description' => 'Deskripsi Toko',
        'category' => 'Kuliner',
        'phone' => '628123456789',
        'address' => 'Jl. Samirono',
        'dusun' => 'Dusun I',
        'image' => 'https://example.com/image.jpg',
        'logo' => 'https://example.com/logo.jpg',
        'is_verified' => true,
        'lat' => -7.7,
        'lng' => 110.4,
    ]);

    $category = Category::create([
        'id' => 'cat-test-review',
        'name' => 'Kuliner',
        'icon_name' => 'Utensils',
        'description' => 'Produk kuliner',
        'color' => 'teal',
    ]);

    $product = Product::create([
        'id' => (string) Str::ulid(),
        'shop_id' => $shop->id,
        'category_id' => $category->id,
        'name' => 'Produk Test Review',
        'description' => 'Deskripsi Produk',
        'price' => 15000,
        'unit' => 'pcs',
        'image' => 'https://example.com/product.jpg',
        'rating' => 1.0,
        'reviews_count' => 1,
        'is_available' => true,
    ]);

    $review = Review::create([
        'id' => 'rev-test-1',
        'product_id' => $product->id,
        'user_name' => 'Budi',
        'rating' => 1,
        'comment' => 'Spam comment',
    ]);

    $this->actingAs($admin)
        ->delete(route('admin.reviews.delete', $review->id))
        ->assertRedirect();

    expect(Review::find($review->id))->toBeNull();
});

test('admin can create and delete category', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('admin.categories.store'), [
            'name' => 'Jasa Warga',
            'description' => 'Sektor Layanan & Jasa',
        ])
        ->assertRedirect();

    $cat = Category::where('name', 'Jasa Warga')->first();
    expect($cat)->not->toBeNull();

    $this->actingAs($admin)
        ->delete(route('admin.categories.delete', $cat->id))
        ->assertRedirect();

    expect(Category::find($cat->id))->toBeNull();
});

test('admin can update user role', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create(['role' => 'user']);

    $this->actingAs($admin)
        ->post(route('admin.users.role', $user->id), ['role' => 'owner'])
        ->assertRedirect();

    expect($user->fresh()->role)->toBe('owner');
});

test('admin can save hero and flash sale settings', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('admin.settings.save'), [
            'appName' => 'Etalase Desa Samirono',
            'tagline' => 'Platform UMKM Unggulan',
            'villageName' => 'Desa Samirono',
            'kecamatanName' => 'Kecamatan Getasan',
            'kabupatenName' => 'Kabupaten Semarang',
            'description' => 'Portal Resmi UMKM Warga',
            'adminPhone' => '6285725900000',
            'heroBanner' => 'https://example.com/hero.jpg',
            'mapCenterLat' => -7.3712,
            'mapCenterLng' => 110.4561,
            'mapZoom' => 15,
            'footerCredits' => '© 2026 TIM KKN TEST',
            'flashSaleTitle' => 'PROMO FLASH WARGA',
            'flashSaleProductId' => 'prod-123',
            'flashSaleHours' => 5,
            'flashSaleMinutes' => 30,
            'flashSaleTag' => 'Diskon Spesial',
            'flashSaleProgress' => 92,
            'promoSlides' => [
                [
                    'id' => 'slide-1',
                    'title' => 'Susu Murni Promo',
                    'tagline' => 'Diskon Warga',
                    'description' => 'Deskripsi susu murni',
                    'image' => 'https://example.com/susu.jpg',
                    'badge' => 'SUSU SEGAR',
                    'btnQuery' => 'susu',
                ],
            ],
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('settings', [
        'key' => 'flash_sale_title',
        'value' => 'PROMO FLASH WARGA',
    ]);

    $this->assertDatabaseHas('settings', [
        'key' => 'kecamatan_name',
        'value' => 'Kecamatan Getasan',
    ]);

    $this->assertDatabaseHas('settings', [
        'key' => 'footer_credits',
        'value' => '© 2026 TIM KKN TEST',
    ]);
});
