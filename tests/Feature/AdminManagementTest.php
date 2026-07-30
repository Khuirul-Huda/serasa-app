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
