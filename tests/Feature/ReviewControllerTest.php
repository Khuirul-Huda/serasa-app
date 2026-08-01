<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

test('user can submit a review for keju artisan product and update average rating', function () {
    $user = User::factory()->create();
    $shop = Shop::create([
        'id' => (string) Str::ulid(),
        'user_id' => $user->id,
        'name' => 'Toko Keju Samirono',
        'owner_name' => 'Pak Ahmad',
        'description' => 'Toko olahan susu keju',
        'category' => 'Kuliner & Olahan',
        'phone' => '628123456789',
        'address' => 'Jl. Raya Samirono',
        'dusun' => 'Dusun Samirono',
        'image' => 'https://example.com/shop.jpg',
        'logo' => 'https://example.com/logo.jpg',
        'is_verified' => true,
        'lat' => -7.38,
        'lng' => 110.42,
    ]);

    $category = Category::create([
        'id' => 'kuliner',
        'name' => 'Kuliner & Olahan',
        'icon_name' => 'Utensils',
        'description' => 'Kuliner olahan susu',
        'color' => 'teal',
    ]);

    $product = Product::create([
        'id' => 'prod-keju-artisan',
        'shop_id' => $shop->id,
        'category_id' => $category->id,
        'name' => 'Keju Mozzarella Lokal Samirono',
        'description' => 'Keju lezat olahan peternak desa',
        'price' => 35000,
        'unit' => '250gr',
        'image' => 'https://example.com/keju.jpg',
        'rating' => 5.0,
        'reviews_count' => 0,
        'is_available' => true,
    ]);

    $response = $this->actingAs($user)->post(route('reviews.store', $product->id), [
        'rating' => 5,
        'comment' => 'Kejunya sangat lembut, empuk, dan lezat!',
    ]);

    $response->assertRedirect();

    $review = Review::where('product_id', $product->id)->first();
    expect($review)->not->toBeNull();
    expect($review->user_name)->toBe($user->name);
    expect($review->comment)->toBe('Kejunya sangat lembut, empuk, dan lezat!');

    expect($product->fresh()->reviews_count)->toBe(1);
    expect((float) $product->fresh()->rating)->toBe(5.0);
});

test('unauthenticated user cannot submit a review', function () {
    $user = User::factory()->create();
    $shop = Shop::create([
        'id' => (string) Str::ulid(),
        'user_id' => $user->id,
        'name' => 'Toko Keju',
        'owner_name' => 'Pak Ahmad',
        'description' => 'Toko olahan',
        'category' => 'Kuliner & Olahan',
        'phone' => '628123456789',
        'address' => 'Jl. Raya Samirono',
        'dusun' => 'Dusun Samirono',
        'image' => 'https://example.com/shop.jpg',
        'logo' => 'https://example.com/logo.jpg',
        'is_verified' => true,
        'lat' => -7.38,
        'lng' => 110.42,
    ]);

    $category = Category::create([
        'id' => 'kuliner-2',
        'name' => 'Kuliner & Olahan 2',
        'icon_name' => 'Utensils',
        'description' => 'Kuliner',
        'color' => 'teal',
    ]);

    $product = Product::create([
        'id' => 'prod-keju-2',
        'shop_id' => $shop->id,
        'category_id' => $category->id,
        'name' => 'Keju Mozzarella',
        'description' => 'Keju lezat',
        'price' => 35000,
        'unit' => '250gr',
        'image' => 'https://example.com/keju.jpg',
        'rating' => 5.0,
        'reviews_count' => 0,
        'is_available' => true,
    ]);

    $response = $this->post(route('reviews.store', $product->id), [
        'rating' => 5,
        'comment' => 'Review tanpa login',
    ]);

    $response->assertRedirect(route('login'));
    expect(Review::where('product_id', $product->id)->count())->toBe(0);
});
