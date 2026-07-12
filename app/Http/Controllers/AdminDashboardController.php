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
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

        $shops = Shop::all()->map(fn ($s) => $this->mapShop($s))->toArray();
        $products = Product::all()->map(fn ($p) => $this->mapProduct($p))->toArray();
        $categories = Category::all()->map(fn ($c) => $this->mapCategory($c));

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

        $shop = Shop::findOrFail($id);
        Product::where('shop_id', $shop->id)->delete();
        $shop->delete();

        return redirect()->back();
    }

    /**
     * Save portal configuration branding settings.
     */
    public function saveSettings(Request $request): RedirectResponse
    {
        $this->authorizeAdmin();

        $request->validate([
            'appName' => 'required|string|max:255',
            'tagline' => 'required|string|max:255',
            'villageName' => 'required|string|max:255',
            'description' => 'required|string',
            'adminPhone' => 'required|string|max:30',
            'heroBanner' => 'required|url',
        ]);

        Setting::updateOrCreate(['key' => 'app_name'], ['value' => $request->appName]);
        Setting::updateOrCreate(['key' => 'tagline'], ['value' => $request->tagline]);
        Setting::updateOrCreate(['key' => 'village_name'], ['value' => $request->villageName]);
        Setting::updateOrCreate(['key' => 'description'], ['value' => $request->description]);
        Setting::updateOrCreate(['key' => 'admin_phone'], ['value' => $request->adminPhone]);
        Setting::updateOrCreate(['key' => 'hero_banner'], ['value' => $request->heroBanner]);

        return redirect()->back();
    }

    /* AUTHORIZATION HELPERS */

    private function authorizeAdmin(): void
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Hanya Admin Desa yang dapat mengakses halaman ini.');
        }
    }

    /* MAPPING HELPERS */

    private function getAppSettings(): array
    {
        $settings = Setting::pluck('value', 'key')->toArray();

        return [
            'appName' => $settings['app_name'] ?? 'Samirono Etalase',
            'tagline' => $settings['tagline'] ?? 'Platform UMKM Warga',
            'villageName' => $settings['village_name'] ?? 'Desa Samirono',
            'description' => $settings['description'] ?? 'Platform digitalisasi kreatif',
            'adminPhone' => $settings['admin_phone'] ?? '6285725912345',
            'heroBanner' => $settings['hero_banner'] ?? 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=80',
        ];
    }

    private function mapCategory(Category $category): array
    {
        return [
            'id' => $category->id,
            'name' => $category->name,
            'iconName' => $category->icon_name,
            'description' => $category->description,
            'color' => $category->color,
        ];
    }

    private function mapProduct(Product $product): array
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

    private function mapShop(Shop $shop): array
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
