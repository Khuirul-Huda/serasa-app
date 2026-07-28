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
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
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
            'working_hours', 'user_id',
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
