<?php

use App\Models\Shop;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

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
