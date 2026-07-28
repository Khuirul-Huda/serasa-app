<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Inertia;

uses(RefreshDatabase::class);

test('shops page can be loaded via normal http request and inertia xhr request', function () {
    $htmlResponse = $this->get(route('shops.index'));
    $htmlResponse->assertOk();

    $inertiaResponse = $this->withHeaders([
        'X-Inertia' => 'true',
        'X-Inertia-Version' => Inertia::getVersion(),
    ])->get(route('shops.index'));

    $inertiaResponse->assertOk();
});

test('marketplace index can be loaded via normal http request and inertia xhr request', function () {
    $htmlResponse = $this->get(route('home'));
    $htmlResponse->assertOk();

    $inertiaResponse = $this->withHeaders([
        'X-Inertia' => 'true',
        'X-Inertia-Version' => Inertia::getVersion(),
    ])->get(route('home'));

    $inertiaResponse->assertOk();
});

test('map page can be loaded via normal http request and inertia xhr request', function () {
    $htmlResponse = $this->get(route('map.index'));
    $htmlResponse->assertOk();

    $inertiaResponse = $this->withHeaders([
        'X-Inertia' => 'true',
        'X-Inertia-Version' => Inertia::getVersion(),
    ])->get(route('map.index'));

    $inertiaResponse->assertOk();
});

test('shop detail page can be loaded via normal http request and inertia xhr request', function () {
    $user = User::factory()->create();
    $shop = Shop::create([
        'id' => (string) Str::ulid(),
        'user_id' => $user->id,
        'name' => 'Toko Test',
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

    $htmlResponse = $this->get(route('shops.detail', $shop->id));
    $htmlResponse->assertOk();

    $inertiaResponse = $this->withHeaders([
        'X-Inertia' => 'true',
        'X-Inertia-Version' => Inertia::getVersion(),
    ])->get(route('shops.detail', $shop->id));

    $inertiaResponse->assertOk();
});

test('product detail page can be loaded via normal http request and inertia xhr request', function () {
    $user = User::factory()->create();
    $shop = Shop::create([
        'id' => (string) Str::ulid(),
        'user_id' => $user->id,
        'name' => 'Toko Test',
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
        'id' => 'kuliner',
        'name' => 'Kuliner',
        'icon_name' => 'Utensils',
        'description' => 'Produk kuliner',
        'color' => 'emerald',
    ]);

    $product = Product::create([
        'id' => (string) Str::ulid(),
        'shop_id' => $shop->id,
        'category_id' => $category->id,
        'name' => 'Produk Test',
        'description' => 'Deskripsi Produk',
        'price' => 15000,
        'unit' => 'pcs',
        'image' => 'https://example.com/product.jpg',
        'rating' => 5.0,
        'reviews_count' => 0,
        'is_available' => true,
    ]);

    $htmlResponse = $this->get(route('products.detail', $product->id));
    $htmlResponse->assertOk();

    $inertiaResponse = $this->withHeaders([
        'X-Inertia' => 'true',
        'X-Inertia-Version' => Inertia::getVersion(),
    ])->get(route('products.detail', $product->id));

    $inertiaResponse->assertOk();
});
