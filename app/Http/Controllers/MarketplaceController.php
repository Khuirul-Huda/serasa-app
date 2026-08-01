<?php

/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Review;
use App\Models\Shop;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class MarketplaceController extends Controller
{
    /**
     * Display the main landing page / catalog list.
     */
    public function index(Request $request): HttpResponse
    {
        $search = $request->query('search', '');
        $catFilter = $request->query('category', 'all');

        $productQuery = Product::query();

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

        $products = $productQuery->select([
            'id', 'shop_id', 'category_id', 'name', 'description', 'price',
            'unit', 'image', 'rating', 'reviews_count', 'is_available',
        ])->latest()->take(60)->get()->map(fn ($p) => $this->mapProduct($p));

        $shops = Shop::select([
            'id', 'name', 'owner_name', 'description', 'category', 'phone',
            'address', 'dusun', 'image', 'logo', 'is_verified', 'lat', 'lng',
            'working_hours', 'user_id',
        ])->where('is_verified', true)->get()->map(fn ($s) => $this->mapShop($s));

        return Inertia::render('welcome', [
            'settings' => $this->getAppSettings(),
            'categories' => $this->getCachedCategories(),
            'products' => $products,
            'shops' => $shops,
            'filters' => ['search' => $search, 'category' => $catFilter],
        ])->toResponse($request)->withHeaders([
            'Cache-Control' => 'public, max-age=60, stale-while-revalidate=300',
            'Vary' => 'Accept',
        ]);
    }

    /**
     * Display the shops directory page.
     */
    public function shops(Request $request): HttpResponse
    {
        $shops = Shop::select([
            'id', 'name', 'owner_name', 'description', 'category', 'phone',
            'address', 'dusun', 'image', 'logo', 'is_verified', 'lat', 'lng',
            'working_hours', 'user_id',
        ])->where('is_verified', true)
            ->withCount('products')
            ->get()
            ->map(function ($shop) {
                $mapped = $this->mapShop($shop);
                $mapped['productCount'] = $shop->products_count;

                return $mapped;
            });

        $products = Product::select([
            'id', 'shop_id', 'category_id', 'name', 'description', 'price',
            'unit', 'image', 'rating', 'reviews_count', 'is_available',
        ])->where('is_available', true)->latest()->take(30)->get()->map(fn ($p) => $this->mapProduct($p));

        return Inertia::render('shops', [
            'settings' => $this->getAppSettings(),
            'categories' => $this->getCachedCategories(),
            'shops' => $shops,
            'products' => $products,
        ])->toResponse($request)->withHeaders([
            'Cache-Control' => 'public, max-age=60, stale-while-revalidate=300',
            'Vary' => 'Accept',
        ]);
    }

    /**
     * Display the Leaflet geographic map page.
     */
    public function map(Request $request): HttpResponse
    {
        $shops = Shop::select([
            'id', 'name', 'owner_name', 'description', 'category', 'phone',
            'address', 'dusun', 'image', 'logo', 'is_verified', 'lat', 'lng',
            'working_hours', 'user_id',
        ])->where('is_verified', true)->get()->map(fn ($s) => $this->mapShop($s));

        $products = Product::select([
            'id', 'shop_id', 'category_id', 'name', 'description', 'price',
            'unit', 'image', 'rating', 'reviews_count', 'is_available',
        ])->where('is_available', true)->latest()->take(30)->get()->map(fn ($p) => $this->mapProduct($p));

        return Inertia::render('map', [
            'settings' => $this->getAppSettings(),
            'categories' => $this->getCachedCategories(),
            'shops' => $shops,
            'products' => $products,
        ])->toResponse($request)->withHeaders([
            'Cache-Control' => 'public, max-age=60, stale-while-revalidate=300',
            'Vary' => 'Accept',
        ]);
    }

    /**
     * Display a specific shop detail page with its product list.
     */
    public function shopDetail(Request $request, string $id): HttpResponse
    {
        $shop = Shop::select([
            'id', 'name', 'owner_name', 'description', 'category', 'phone',
            'address', 'dusun', 'image', 'logo', 'is_verified', 'lat', 'lng',
            'working_hours', 'user_id',
        ])->with([
            'products' => function ($query) {
                $query->select([
                    'id', 'shop_id', 'category_id', 'name', 'description', 'price',
                    'unit', 'image', 'rating', 'reviews_count', 'is_available',
                ]);
            },
        ])->findOrFail($id);

        $mappedShop = $this->mapShop($shop);
        $products = $shop->products->map(function ($p) {
            /** @var Product $p */
            return $this->mapProduct($p);
        });

        // Fetch up to 4 related shops in the same category or dusun
        $relatedShops = Shop::select([
            'id', 'name', 'owner_name', 'description', 'category', 'phone',
            'address', 'dusun', 'image', 'logo', 'is_verified', 'lat', 'lng',
            'working_hours', 'user_id',
        ])->where('is_verified', true)
            ->where('id', '!=', $shop->id)
            ->where(function ($q) use ($shop) {
                $q->where('category', $shop->category)
                    ->orWhere('dusun', $shop->dusun);
            })
            ->withCount('products')
            ->limit(4)
            ->get()
            ->map(function ($s) {
                $mapped = $this->mapShop($s);
                $mapped['productCount'] = $s->products_count;

                return $mapped;
            });

        $allProducts = Product::select([
            'id', 'shop_id', 'category_id', 'name', 'description', 'price',
            'unit', 'image', 'rating', 'reviews_count', 'is_available',
        ])->latest()->limit(12)->get()->map(fn ($p) => $this->mapProduct($p));

        return Inertia::render('shop-detail', [
            'settings' => $this->getAppSettings(),
            'categories' => $this->getCachedCategories(),
            'shop' => $mappedShop,
            'products' => $products,
            'allProducts' => $allProducts,
            'relatedShops' => $relatedShops,
        ])->toResponse($request);
    }

    /**
     * Display a specific product specification details & reviews.
     */
    public function productDetail(Request $request, string $id): HttpResponse
    {
        $product = Product::select([
            'id', 'shop_id', 'category_id', 'name', 'description', 'price',
            'unit', 'image', 'rating', 'reviews_count', 'is_available',
        ])->with([
            'shop' => function ($query) {
                $query->select([
                    'id', 'name', 'owner_name', 'description', 'category', 'phone',
                    'address', 'dusun', 'image', 'logo', 'is_verified', 'lat', 'lng',
                    'working_hours', 'user_id',
                ]);
            },
            'reviews' => function ($query) {
                $query->select([
                    'id', 'product_id', 'user_name', 'rating', 'comment', 'created_at',
                ]);
            },
        ])->findOrFail($id);

        $mappedProduct = $this->mapProduct($product);
        $mappedShop = $product->shop instanceof Shop ? $this->mapShop($product->shop) : [];
        $reviews = $product->reviews->map(function ($r) {
            /** @var Review $r */
            return $this->mapReview($r);
        });

        // Limit to latest 12 for the "Produk Lainnya" sidebar — avoids full table scan
        $allProducts = Product::select([
            'id', 'shop_id', 'category_id', 'name', 'description', 'price',
            'unit', 'image', 'rating', 'reviews_count', 'is_available',
        ])->latest()->limit(12)->get()->map(fn ($p) => $this->mapProduct($p));

        return Inertia::render('product-detail', [
            'settings' => $this->getAppSettings(),
            'categories' => $this->getCachedCategories(),
            'product' => $mappedProduct,
            'shop' => $mappedShop,
            'reviews' => $reviews,
            'allProducts' => $allProducts,
        ])->toResponse($request);
    }

    /* MAPPING HELPERS */

    private function mapReview(Review $review): array
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
