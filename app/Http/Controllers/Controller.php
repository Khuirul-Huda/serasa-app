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

            $village = $settings['village_name'] ?? 'Desa Samirono';

            $hotSearchesJson = $settings['hot_searches'] ?? null;
            $hotSearches = $hotSearchesJson ? json_decode($hotSearchesJson, true) : null;
            if (! is_array($hotSearches)) {
                $hotSearches = [
                    ['label' => 'Susu Segar', 'query' => 'susu'],
                    ['label' => 'Keju Artisan', 'query' => 'keju'],
                    ['label' => 'Tas Anyaman', 'query' => 'tas'],
                    ['label' => 'Kopi Merbabu', 'query' => 'kopi'],
                    ['label' => 'Keripik Jamur', 'query' => 'keripik'],
                    ['label' => 'Gethuk Keju', 'query' => 'gethuk'],
                ];
            }

            $promoSlidesJson = $settings['promo_slides'] ?? null;
            $promoSlides = $promoSlidesJson ? json_decode($promoSlidesJson, true) : null;
            if (! is_array($promoSlides)) {
                $promoSlides = [
                    [
                        'id' => 'slide-1',
                        'title' => 'Susu Sapi Murni '.$village,
                        'tagline' => 'Spesial Murni Dari Peternakan Desa',
                        'description' => 'Segar murni dari peternakan lereng gunung, diperah higienis harian oleh warga desa.',
                        'image' => 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
                        'badge' => '🥛 SUSU SEGAR',
                        'btnQuery' => 'susu',
                    ],
                    [
                        'id' => 'slide-2',
                        'title' => 'Keju Mozzarella & Ricotta',
                        'tagline' => 'Karya Tani Unggulan '.$village,
                        'description' => 'Diproduksi oleh sentra pengolahan dengan cita rasa keju artisan bersertifikat pangan.',
                        'image' => 'https://images.unsplash.com/photo-1559561853-080268185995?auto=format&fit=crop&w=800&q=80',
                        'badge' => '🧀 KEJU LOKAL',
                        'btnQuery' => 'keju',
                    ],
                    [
                        'id' => 'slide-3',
                        'title' => 'Kerajinan Anyaman Bambu',
                        'tagline' => '100% Produk Kreatif Ramah Lingkungan',
                        'description' => 'Dianyam telaten dengan bambu pilihan lereng pegunungan untuk perabot estetis fungsional.',
                        'image' => 'https://images.unsplash.com/photo-1590736969955-71cb94801759?auto=format&fit=crop&w=800&q=80',
                        'badge' => '🎋 KRIYA BAMBU',
                        'btnQuery' => 'anyaman',
                    ],
                ];
            }

            return [
                'appName' => $settings['app_name'] ?? 'Samirono Etalase',
                'tagline' => $settings['tagline'] ?? 'Platform UMKM Warga',
                'villageName' => $village,
                'kecamatanName' => $settings['kecamatan_name'] ?? 'Kecamatan Getasan',
                'kabupatenName' => $settings['kabupaten_name'] ?? 'Kabupaten Semarang',
                'description' => $settings['description'] ?? 'Platform digitalisasi kreatif',
                'adminPhone' => $settings['admin_phone'] ?? '6285725912345',
                'heroBanner' => $settings['hero_banner'] ?? 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=80',
                'mapCenterLat' => isset($settings['map_center_lat']) ? (float) $settings['map_center_lat'] : -7.371239,
                'mapCenterLng' => isset($settings['map_center_lng']) ? (float) $settings['map_center_lng'] : 110.456123,
                'mapZoom' => isset($settings['map_zoom']) ? (int) $settings['map_zoom'] : 14,
                'footerCredits' => $settings['footer_credits'] ?? '© 2026 TIM KKN UNNES GIAT 16 DESA SAMIRONO',
                'hotSearches' => $hotSearches,
                'promoSlides' => $promoSlides,
                'flashSaleTitle' => $settings['flash_sale_title'] ?? 'KEJAR DISKON WARGA',
                'flashSaleProductId' => $settings['flash_sale_product_id'] ?? null,
                'flashSaleHours' => isset($settings['flash_sale_hours']) ? (int) $settings['flash_sale_hours'] : 3,
                'flashSaleMinutes' => isset($settings['flash_sale_minutes']) ? (int) $settings['flash_sale_minutes'] : 44,
                'flashSaleTag' => $settings['flash_sale_tag'] ?? 'Diskon Harian',
                'flashSaleProgress' => isset($settings['flash_sale_progress']) ? (int) $settings['flash_sale_progress'] : 87,
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
            'images' => $product->gallery,
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
            'lat' => $shop->lat !== null ? (float) $shop->lat : null,
            'lng' => $shop->lng !== null ? (float) $shop->lng : null,
            'jamKerja' => $shop->working_hours,
            'userId' => $shop->user_id,
            'nib' => (bool) $shop->nib,
            'halal' => (bool) $shop->halal,
            'pirt' => (bool) $shop->pirt,
        ];
    }
}
