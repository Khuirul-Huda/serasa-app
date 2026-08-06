<?php

use App\Models\Category;
use App\Models\Product;
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

test('admin can update an existing shop and link user', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create(['role' => 'user']);
    $shop = Shop::factory()->create(['name' => 'Nama Lama']);

    $response = $this->actingAs($admin)->put(route('admin.shops.update', $shop->id), [
        'name' => 'Nama Baru Toko',
        'owner_name' => $user->name,
        'user_id' => $user->id,
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
    expect($shop->fresh()->user_id)->toBe($user->id);
    expect($user->fresh()->role)->toBe('owner');
});

test('admin can create a new product', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $shop = Shop::factory()->create();
    $category = Category::create([
        'id' => 'cat-kuliner',
        'name' => 'Kuliner & Olahan',
        'slug' => 'kuliner-olahan',
        'icon_name' => 'Utensils',
        'description' => 'Makanan khas desa',
        'color' => 'teal',
    ]);

    $response = $this->actingAs($admin)->post(route('admin.products.store'), [
        'shop_id' => $shop->id,
        'category_id' => $category->id,
        'name' => 'Keripik Singkong Renyah',
        'price' => 15000,
        'unit' => 'bungkus',
        'description' => 'Keripik singkong gurih buatan warga',
        'is_available' => true,
    ]);

    $response->assertRedirect();
    expect(Product::where('name', 'Keripik Singkong Renyah')->exists())->toBeTrue();
});

test('admin can update an existing product', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $shop = Shop::factory()->create();
    $category = Category::create([
        'id' => 'cat-kuliner-2',
        'name' => 'Kuliner 2',
        'slug' => 'kuliner-2',
        'icon_name' => 'Utensils',
        'description' => 'Makanan',
        'color' => 'teal',
    ]);
    $product = Product::create([
        'id' => 'prod-test-1',
        'shop_id' => $shop->id,
        'category_id' => $category->id,
        'name' => 'Nama Produk Lama',
        'description' => 'Deskripsi lama',
        'price' => 10000,
        'unit' => 'pcs',
        'image' => 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        'rating' => 5.0,
        'reviews_count' => 0,
        'is_available' => true,
    ]);

    $response = $this->actingAs($admin)->put(route('admin.products.update', $product->id), [
        'shop_id' => $shop->id,
        'category_id' => $category->id,
        'name' => 'Nama Produk Baru',
        'price' => 20000,
        'unit' => 'pack',
        'description' => 'Deskripsi diperbarui',
        'is_available' => true,
    ]);

    $response->assertRedirect();
    expect($product->fresh()->name)->toBe('Nama Produk Baru');
    expect($product->fresh()->price)->toBe(20000);
});
