<?php

/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Shop;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

abstract class Controller
{
    /**
     * Get dynamic app branding configurations.
     * Cached for 1 hour — busted by AdminDashboardController::saveSettings().
     */
    protected function getAppSettings(): array
    {
        return Cache::remember('app:settings', now()->addHour(), function () {
            $settings = Setting::pluck('value', 'key')->toArray();

            return [
                'appName' => $settings['app_name'] ?? 'Samirono Etalase',
                'tagline' => $settings['tagline'] ?? 'Platform UMKM Warga',
                'villageName' => $settings['village_name'] ?? 'Desa Samirono',
                'description' => $settings['description'] ?? 'Platform digitalisasi kreatif',
                'adminPhone' => $settings['admin_phone'] ?? '6285725912345',
                'heroBanner' => $settings['hero_banner'] ?? 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=80',
            ];
        });
    }

    /**
     * Get all categories, cached for 1 hour.
     * Busted by AdminDashboardController::saveSettings() if categories ever change.
     */
    protected function getCachedCategories(): Collection
    {
        $categories = Cache::remember('app:categories', now()->addHour(), function () {
            return Category::select([
                'id', 'name', 'icon_name', 'description', 'color',
            ])->get()->map(fn ($c) => $this->mapCategory($c))->toArray();
        });

        return collect($categories);
    }

    /**
     * Map a Category model to frontend array.
     */
    protected function mapCategory(Category $category): array
    {
        return [
            'id' => $category->id,
            'name' => $category->name,
            'iconName' => $category->icon_name,
            'description' => $category->description,
            'color' => $category->color,
        ];
    }

    /**
     * Map a Product model to frontend array.
     */
    protected function mapProduct(Product $product): array
    {
        return [
            'id' => $product->id,
            'shopId' => $product->shop_id,
            'categoryId' => $product->category_id,
            'name' => $product->name,
            'description' => $product->description,
            'price' => (float) $product->price,
            'unit' => $product->unit,
            'image' => $product->image,
            'rating' => (float) $product->rating,
            'reviewsCount' => (int) $product->reviews_count,
            'isAvailable' => (bool) $product->is_available,
        ];
    }

    /**
     * Map a Shop model to frontend array.
     */
    protected function mapShop(Shop $shop): array
    {
        return [
            'id' => $shop->id,
            'name' => $shop->name,
            'ownerName' => $shop->owner_name,
            'description' => $shop->description,
            'category' => $shop->category,
            'phone' => $shop->phone,
            'address' => $shop->address,
            'dusun' => $shop->dusun,
            'image' => $shop->image,
            'logo' => $shop->logo,
            'isVerified' => (bool) $shop->is_verified,
            'lat' => (float) $shop->lat,
            'lng' => (float) $shop->lng,
            'jamKerja' => $shop->working_hours,
            'userId' => $shop->user_id,
        ];
    }
}
