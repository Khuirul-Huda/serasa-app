<?php

/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

namespace App\Http\Controllers;

use App\Http\Requests\AddProductRequest;
use App\Http\Requests\RegisterShopRequest;
use App\Http\Requests\UpdateShopRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\Shop;
use Illuminate\Http\RedirectResponse;
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
        $shop = Shop::select([
            'id', 'name', 'owner_name', 'description', 'category', 'phone',
            'address', 'dusun', 'image', 'logo', 'is_verified', 'lat', 'lng',
            'working_hours', 'user_id',
        ])->where('user_id', $user->id)->first();

        $myShop = null;
        $myProducts = [];

        if ($shop) {
            $myShop = $this->mapShop($shop);
            $myProducts = Product::select([
                'id', 'shop_id', 'category_id', 'name', 'description', 'price',
                'unit', 'image', 'rating', 'reviews_count', 'is_available',
            ])->where('shop_id', $shop->id)
                ->get()
                ->map(fn ($p) => $this->mapProduct($p))
                ->toArray();
        }

        $categories = Category::select([
            'id', 'name', 'icon_name', 'description', 'color',
        ])->get()->map(fn ($c) => $this->mapCategory($c));

        $allProducts = Product::select([
            'id', 'shop_id', 'category_id', 'name', 'description', 'price',
            'unit', 'image', 'rating', 'reviews_count', 'is_available',
        ])->get()->map(fn ($p) => $this->mapProduct($p))->toArray();

        return Inertia::render('merchant-dashboard', [
            'settings' => $this->getAppSettings(),
            'myShop' => $myShop,
            'myProducts' => $myProducts,
            'categories' => $categories,
            'products' => $allProducts,
        ]);
    }

    /**
     * Register a new shop.
     */
    public function registerShop(RegisterShopRequest $request): RedirectResponse
    {
        $this->authorizeOwner();

        $user = auth()->user();

        if (Shop::where('user_id', $user->id)->exists()) {
            return redirect()->back()->withErrors(['message' => 'Anda sudah memiliki toko terdaftar.']);
        }

        $id = 'shop-'.Str::slug($request->name).'-'.rand(100, 999);

        $logo = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150';
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('shops/logos', 'public');
            $logo = asset('storage/'.$path);
        } elseif ($request->logo) {
            $logo = $request->logo;
        }

        $image = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800';
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('shops/banners', 'public');
            $image = asset('storage/'.$path);
        } elseif ($request->image) {
            $image = $request->image;
        }

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
    public function updateShop(UpdateShopRequest $request): RedirectResponse
    {
        $this->authorizeOwner();

        $user = auth()->user();
        $shop = Shop::where('user_id', $user->id)->firstOrFail();

        $data = [
            'phone' => $request->phone,
            'address' => $request->address,
            'dusun' => $request->dusun,
            'lat' => $request->lat,
            'lng' => $request->lng,
            'description' => $request->description,
            'working_hours' => $request->jamKerja,
        ];

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('shops/logos', 'public');
            $data['logo'] = asset('storage/'.$path);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('shops/banners', 'public');
            $data['image'] = asset('storage/'.$path);
        }

        $shop->update($data);

        return redirect()->back();
    }

    /**
     * Add a product to the shop inventory.
     */
    public function addProduct(AddProductRequest $request): RedirectResponse
    {
        $this->authorizeOwner();

        $user = auth()->user();
        $shop = Shop::where('user_id', $user->id)->firstOrFail();

        $fallbackImages = [
            'cat-kuliner' => 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=600',
            'cat-pertanian' => 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600',
            'cat-kerajinan' => 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
            'cat-wisata' => 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600',
            'cat-fashion' => 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&q=80&w=600',
        ];

        $image = $request->image ?: ($fallbackImages[$request->categoryId] ?? 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600');

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $image = asset('storage/'.$path);
        }

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
}
