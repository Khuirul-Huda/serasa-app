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
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MarketplaceController extends Controller
{
    /**
     * Display the main landing page / catalog list.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search', '');
        $catFilter = $request->query('category', 'all');

        $categories = Category::all()->map(fn ($c) => $this->mapCategory($c));

        // Start product query
        $productQuery = Product::with(['shop', 'category']);

        if (! empty($search)) {
            $productQuery->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('shop', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($catFilter !== 'all') {
            $productQuery->where('category_id', $catFilter);
        }

        // Get active products
        $products = $productQuery->get()->map(fn ($p) => $this->mapProduct($p));

        // Get verified shops for displaying in list
        $shops = Shop::where('is_verified', true)->get()->map(fn ($s) => $this->mapShop($s));

        return Inertia::render('welcome', [
            'settings' => $this->getAppSettings(),
            'categories' => $categories,
            'products' => $products,
            'shops' => $shops,
            'filters' => [
                'search' => $search,
                'category' => $catFilter,
            ],
        ]);
    }

    /**
     * Display the shops directory directory page.
     */
    public function shops(Request $request): Response
    {
        $categories = Category::all()->map(fn ($c) => $this->mapCategory($c));

        // Fetch all verified shops
        $shops = Shop::where('is_verified', true)
            ->withCount('products')
            ->get()
            ->map(function ($shop) {
                $mapped = $this->mapShop($shop);
                $mapped['productCount'] = $shop->products_count;

                return $mapped;
            });

        // Get all products to compute any highlights if needed
        $products = Product::where('is_available', true)->get()->map(fn ($p) => $this->mapProduct($p));

        return Inertia::render('shops', [
            'settings' => $this->getAppSettings(),
            'categories' => $categories,
            'shops' => $shops,
            'products' => $products,
        ]);
    }

    /**
     * Display the Leaflet geographic map page.
     */
    public function map(Request $request): Response
    {
        $categories = Category::all()->map(fn ($c) => $this->mapCategory($c));

        // Fetch all verified shops with coordinates
        $shops = Shop::where('is_verified', true)->get()->map(fn ($s) => $this->mapShop($s));

        // Get products
        $products = Product::where('is_available', true)->get()->map(fn ($p) => $this->mapProduct($p));

        return Inertia::render('map', [
            'settings' => $this->getAppSettings(),
            'categories' => $categories,
            'shops' => $shops,
            'products' => $products,
        ]);
    }

    /**
     * Display a specific shop detail page with its product list.
     */
    public function shopDetail(string $id): Response
    {
        $shop = Shop::with('products')->findOrFail($id);

        $categories = Category::all()->map(fn ($c) => $this->mapCategory($c));
        $mappedShop = $this->mapShop($shop);

        $products = $shop->products->map(fn ($p) => $this->mapProduct($p));
        $allProducts = Product::all()->map(fn ($p) => $this->mapProduct($p));

        return Inertia::render('shop-detail', [
            'settings' => $this->getAppSettings(),
            'categories' => $categories,
            'shop' => $mappedShop,
            'products' => $products,
            'allProducts' => $allProducts,
        ]);
    }

    /**
     * Display a specific product specification details & reviews.
     */
    public function productDetail(string $id): Response
    {
        $product = Product::with(['shop', 'reviews'])->findOrFail($id);

        $categories = Category::all()->map(fn ($c) => $this->mapCategory($c));
        $mappedProduct = $this->mapProduct($product);
        $mappedShop = $this->mapShop($product->shop);

        $reviews = $product->reviews->map(fn ($r) => $this->mapReview($r));
        $allProducts = Product::all()->map(fn ($p) => $this->mapProduct($p));

        return Inertia::render('product-detail', [
            'settings' => $this->getAppSettings(),
            'categories' => $categories,
            'product' => $mappedProduct,
            'shop' => $mappedShop,
            'reviews' => $reviews,
            'allProducts' => $allProducts,
        ]);
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

    private function mapReview($review): array
    {
        return [
            'id' => $review->id,
            'productId' => $review->product_id,
            'userName' => $review->user_name,
            'rating' => (float) $review->rating,
            'comment' => $review->comment,
            'createdAt' => $review->created_at->format('Y-m-d H:i:s'),
            'date' => $review->created_at->diffForHumans(),
        ];
    }
}
