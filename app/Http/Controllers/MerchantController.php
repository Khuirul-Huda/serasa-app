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
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MerchantController extends Controller
{
    /**
     * Display the owner dashboard.
     */
    public function dashboard(): Response
    {
        $this->authorizeOwner();

        $user = auth()->user();
        $shop = Shop::where('user_id', $user->id)->first();

        $myShop = null;
        $myProducts = [];

        if ($shop) {
            $myShop = $this->mapShop($shop);
            $myProducts = Product::where('shop_id', $shop->id)
                ->get()
                ->map(fn ($p) => $this->mapProduct($p))
                ->toArray();
        }

        $categories = Category::all()->map(fn ($c) => $this->mapCategory($c));

        return Inertia::render('merchant-dashboard', [
            'settings' => $this->getAppSettings(),
            'myShop' => $myShop,
            'myProducts' => $myProducts,
            'categories' => $categories,
        ]);
    }

    /**
     * Register a new shop.
     */
    public function registerShop(Request $request): RedirectResponse
    {
        $this->authorizeOwner();

        $user = auth()->user();

        if (Shop::where('user_id', $user->id)->exists()) {
            return redirect()->back()->withErrors(['message' => 'Anda sudah memiliki toko terdaftar.']);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'ownerName' => 'required|string|max:255',
            'phone' => 'required|string|max:30',
            'address' => 'required|string|max:255',
            'dusun' => 'required|string|max:100',
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
            'category' => 'required|string|max:100',
        ]);

        $id = 'shop-'.Str::slug($request->name).'-'.rand(100, 999);
        $image = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800';
        $logo = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150';

        Shop::create([
            'id' => $id,
            'name' => $request->name,
            'owner_name' => $request->ownerName,
            'description' => $request->description ?: 'Menyediakan produk ekonomi kreatif khas Desa Samirono berkualitas tinggi.',
            'category' => $request->category,
            'phone' => $request->phone,
            'address' => $request->address,
            'dusun' => $request->dusun,
            'image' => $image,
            'logo' => $logo,
            'is_verified' => false,
            'lat' => $request->lat,
            'lng' => $request->lng,
            'working_hours' => $request->jamKerja ?: '08:00 - 17:00',
            'user_id' => $user->id,
        ]);

        return redirect()->route('merchant.dashboard');
    }

    /**
     * Update existing shop profile details.
     */
    public function updateShop(Request $request): RedirectResponse
    {
        $this->authorizeOwner();

        $user = auth()->user();
        $shop = Shop::where('user_id', $user->id)->firstOrFail();

        $request->validate([
            'phone' => 'required|string|max:30',
            'address' => 'required|string|max:255',
            'dusun' => 'required|string|max:100',
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
            'description' => 'required|string',
            'jamKerja' => 'required|string|max:100',
        ]);

        $shop->update([
            'phone' => $request->phone,
            'address' => $request->address,
            'dusun' => $request->dusun,
            'lat' => $request->lat,
            'lng' => $request->lng,
            'description' => $request->description,
            'working_hours' => $request->jamKerja,
        ]);

        return redirect()->back();
    }

    /**
     * Add a product to the shop inventory.
     */
    public function addProduct(Request $request): RedirectResponse
    {
        $this->authorizeOwner();

        $user = auth()->user();
        $shop = Shop::where('user_id', $user->id)->firstOrFail();

        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
            'categoryId' => 'required|string|exists:categories,id',
        ]);

        $fallbackImages = [
            'cat-kuliner' => 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=600',
            'cat-pertanian' => 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600',
            'cat-kerajinan' => 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
            'cat-wisata' => 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600',
            'cat-fashion' => 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&q=80&w=600',
        ];

        $image = $request->image ?: ($fallbackImages[$request->categoryId] ?? 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600');
        $id = 'prod-'.Str::slug($request->name).'-'.rand(100, 999);

        Product::create([
            'id' => $id,
            'shop_id' => $shop->id,
            'category_id' => $request->categoryId,
            'name' => $request->name,
            'description' => $request->description ?: 'Produk UMKM unggulan yang diproduksi secara higienis dan penuh kearifan lokal di Desa Samirono.',
            'price' => $request->price,
            'unit' => $request->unit,
            'image' => $image,
            'rating' => 5.0,
            'reviews_count' => 0,
            'is_available' => true,
        ]);

        return redirect()->back();
    }

    /**
     * Toggle product availability.
     */
    public function toggleProduct(string $id): RedirectResponse
    {
        $this->authorizeOwner();

        $user = auth()->user();
        $shop = Shop::where('user_id', $user->id)->firstOrFail();
        $product = Product::where('id', $id)->where('shop_id', $shop->id)->firstOrFail();

        $product->update([
            'is_available' => ! $product->is_available,
        ]);

        return redirect()->back();
    }

    /**
     * Delete product.
     */
    public function deleteProduct(string $id): RedirectResponse
    {
        $this->authorizeOwner();

        $user = auth()->user();
        $shop = Shop::where('user_id', $user->id)->firstOrFail();
        $product = Product::where('id', $id)->where('shop_id', $shop->id)->firstOrFail();

        $product->delete();

        return redirect()->back();
    }

    /* AUTHORIZATION HELPERS */

    private function authorizeOwner(): void
    {
        if (auth()->user()->role !== 'owner') {
            abort(403, 'Hanya Pemilik Toko (Merchant) yang dapat mengakses halaman ini.');
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
