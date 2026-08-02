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
