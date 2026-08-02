<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('merchant can upload multiple images when creating product', function () {
    Storage::fake('public');

    $user = User::factory()->create(['role' => 'owner']);

    $category = Category::create([
        'id' => 'cat-kuliner',
        'name' => 'Kuliner',
        'icon_name' => 'Utensils',
        'description' => 'Produk kuliner',
        'color' => 'peach',
    ]);

    $shop = Shop::create([
        'id' => 'shop-test',
        'user_id' => $user->id,
        'name' => 'Toko Test',
        'owner_name' => $user->name,
        'description' => 'Deskripsi Toko',
        'category' => 'Kuliner',
        'phone' => '08123456789',
        'address' => 'Alamat Test',
        'dusun' => 'Dusun Test',
        'image' => 'https://example.com/banner.jpg',
        'logo' => 'https://example.com/logo.jpg',
        'is_verified' => true,
    ]);

    $response = $this->actingAs($user)->post(route('merchant.products.store'), [
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

    $product = Product::where('name', 'Keripik Tempe Multi')->first();
    expect($product->images)->toBeArray()->toHaveCount(2);
    expect($product->image)->toBe($product->images[0]);
});
