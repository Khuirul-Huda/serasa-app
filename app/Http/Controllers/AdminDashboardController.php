<?php

/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

namespace App\Http\Controllers;

use App\Http\Requests\SaveSettingsRequest;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Shop;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    /**
     * Display the admin panel dashboard.
     */
    public function index(): Response
    {
        $this->authorizeAdmin();

        $shops = Shop::select([
            'id', 'name', 'owner_name', 'description', 'category', 'phone',
            'address', 'dusun', 'image', 'logo', 'is_verified', 'lat', 'lng',
            'working_hours', 'user_id', 'nib', 'halal', 'pirt',
        ])->get()->map(fn ($s) => $this->mapShop($s))->toArray();

        $products = Product::select([
            'id', 'shop_id', 'category_id', 'name', 'description', 'price',
            'unit', 'image', 'rating', 'reviews_count', 'is_available',
        ])->get()->map(fn ($p) => $this->mapProduct($p))->toArray();

        $categories = $this->getCachedCategories();

        return Inertia::render('admin-dashboard', [
            'settings' => $this->getAppSettings(),
            'shops' => $shops,
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    /**
     * Toggle the verified status of a shop.
     */
    public function toggleVerifyShop(string $id): RedirectResponse
    {
        $this->authorizeAdmin();

        $shop = Shop::findOrFail($id);
        $shop->update([
            'is_verified' => ! $shop->is_verified,
        ]);

        return redirect()->back();
    }

    /**
     * Bulk import or update shops from parsed Excel.
     */
    public function bulkImport(Request $request): RedirectResponse
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'shops' => 'required|array',
            'shops.*.name' => 'required|string',
            'shops.*.owner_name' => 'required|string',
            'shops.*.category' => 'required|string',
            'shops.*.address' => 'required|string',
            'shops.*.dusun' => 'nullable|string',
            'shops.*.phone' => 'nullable|string',
            'shops.*.description' => 'nullable|string',
            'shops.*.nib' => 'nullable|boolean',
            'shops.*.halal' => 'nullable|boolean',
            'shops.*.pirt' => 'nullable|boolean',
            'shops.*.is_verified' => 'nullable|boolean',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['shops'] as $item) {
                $id = ! empty($item['id']) ? $item['id'] : ('shop-'.Str::slug($item['name']));

                Shop::updateOrCreate(
                    ['id' => $id],
                    [
                        'name' => $item['name'],
                        'owner_name' => $item['owner_name'],
                        'description' => $item['description'] ?? ('UMKM '.$item['name'].' Desa Samirono'),
                        'category' => $item['category'],
                        'phone' => $item['phone'] ?? '6285725912345',
                        'address' => $item['address'],
                        'dusun' => $item['dusun'] ?? 'Desa Samirono',
                        'image' => $item['image'] ?? 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=800',
                        'logo' => $item['logo'] ?? 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=150',
                        'is_verified' => $item['is_verified'] ?? true,
                        'lat' => $item['lat'] ?? -7.38,
                        'lng' => $item['lng'] ?? 110.42,
                        'nib' => $item['nib'] ?? false,
                        'halal' => $item['halal'] ?? false,
                        'pirt' => $item['pirt'] ?? false,
                    ]
                );
            }
        });

        Cache::forget('app:settings');
        Cache::forget('app:categories');

        return redirect()->back();
    }

    /**
     * Delete a shop from the database.
     */
    public function deleteShop(string $id): RedirectResponse
    {
        $this->authorizeAdmin();

        DB::transaction(function () use ($id) {
            $shop = Shop::findOrFail($id);
            Product::where('shop_id', $shop->id)->delete();
            $shop->delete();
        });

        return redirect()->back();
    }

    /**
     * Save portal configuration branding settings.
     */
    public function saveSettings(SaveSettingsRequest $request): RedirectResponse
    {
        $this->authorizeAdmin();

        Setting::updateOrCreate(['key' => 'app_name'], ['value' => $request->appName]);
        Setting::updateOrCreate(['key' => 'tagline'], ['value' => $request->tagline]);
        Setting::updateOrCreate(['key' => 'village_name'], ['value' => $request->villageName]);
        Setting::updateOrCreate(['key' => 'description'], ['value' => $request->description]);
        Setting::updateOrCreate(['key' => 'admin_phone'], ['value' => $request->adminPhone]);
        Setting::updateOrCreate(['key' => 'hero_banner'], ['value' => $request->heroBanner]);

        // Bust cached settings so all workers pick up new values immediately
        Cache::forget('app:settings');
        Cache::forget('app:categories');

        return redirect()->back();
    }

    /* AUTHORIZATION HELPERS */

    private function authorizeAdmin(): void
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Hanya Admin Desa yang dapat mengakses halaman ini.');
        }
    }
}
