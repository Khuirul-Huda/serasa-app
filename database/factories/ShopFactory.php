<?php

namespace Database\Factories;

use App\Models\Shop;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Shop>
 */
class ShopFactory extends Factory
{
    protected $model = Shop::class;

    public function definition(): array
    {
        $name = 'Toko '.fake()->company();

        return [
            'id' => 'shop-'.Str::slug($name).'-'.Str::random(4),
            'name' => $name,
            'owner_name' => fake()->name(),
            'description' => fake()->sentence(),
            'category' => 'Kuliner & Olahan',
            'phone' => '62857259'.fake()->numerify('#####'),
            'address' => fake()->address(),
            'dusun' => 'Dusun Samirono',
            'image' => 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
            'logo' => 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
            'is_verified' => true,
            'lat' => -7.371239,
            'lng' => 110.456123,
            'nib' => true,
            'halal' => true,
            'pirt' => false,
        ];
    }
}
