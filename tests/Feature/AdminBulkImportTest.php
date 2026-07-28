<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin can bulk import umkm shops', function () {
    $admin = User::factory()->admin()->create();

    $payload = [
        'shops' => [
            [
                'id' => 'shop-bakpia-berkah',
                'name' => 'Bakpia Berkah',
                'owner_name' => 'Eko Susanto',
                'description' => 'Produksi Bakpia',
                'category' => 'Kuliner & Olahan',
                'phone' => '62812345678',
                'address' => 'Pongangan RT 04/ RW 01',
                'dusun' => 'Pongangan',
                'image' => 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=800',
                'logo' => 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=150',
                'is_verified' => true,
                'lat' => -7.38,
                'lng' => 110.42,
                'nib' => true,
                'halal' => true,
                'pirt' => false,
            ],
        ],
    ];

    $response = $this->actingAs($admin)
        ->post(route('admin.shops.bulk-import'), $payload);

    $response->assertRedirect();
    $this->assertDatabaseHas('shops', [
        'id' => 'shop-bakpia-berkah',
        'name' => 'Bakpia Berkah',
        'owner_name' => 'Eko Susanto',
        'nib' => true,
        'halal' => true,
        'pirt' => false,
    ]);
});
