<?php

/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

namespace App\Http\Controllers;

use App\Actions\ProcessShopImportAction;
use App\Http\Requests\SaveSettingsRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use App\Models\Setting;
use App\Models\Shop;
use App\Models\User;
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
     * Display the admin panel dashboard with full platform management data.
     */
    public function index(): Response
    {
        $this->authorizeAdmin();

        $shops = Shop::select([
            'id', 'name', 'owner_name', 'description', 'category', 'phone',
            'address', 'dusun', 'image', 'logo', 'is_verified', 'lat', 'lng',
            'working_hours', 'user_id', 'nib', 'halal', 'pirt',
        ])->latest()->take(300)->get()->map(fn ($s) => $this->mapShop($s))->toArray();

        $products = Product::select([
            'id', 'shop_id', 'category_id', 'name', 'description', 'price',
            'unit', 'image', 'rating', 'reviews_count', 'is_available',
        ])->latest()->take(500)->get()->map(fn ($p) => $this->mapProduct($p))->toArray();

        $categories = $this->getCachedCategories();

        $reviews = Review::with('product')
            ->latest()
            ->take(100)
            ->get()
            ->map(function ($r): array {
                /** @var Review $r */
                return [
                    'id' => $r->id,
                    'productId' => $r->product_id,
                    'productName' => $r->product instanceof Product ? $r->product->name : 'Produk',
                    'userName' => $r->user_name,
                    'rating' => $r->rating,
                    'comment' => $r->comment,
                    'createdAt' => $r->created_at ? $r->created_at->diffForHumans() : 'Baru Saja',
                ];
            })->toArray();

        $users = User::select(['id', 'name', 'email', 'role', 'created_at'])
            ->latest()
            ->take(200)
            ->get()
            ->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role,
                'createdAt' => $u->created_at ? $u->created_at->format('d M Y') : '-',
            ])->toArray();

        return Inertia::render('admin-dashboard', [
            'settings' => $this->getAppSettings(),
            'shops' => $shops,
            'products' => $products,
            'categories' => $categories,
            'reviews' => $reviews,
            'users' => $users,
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
     * Toggle legal permit status (NIB, HALAL, PIRT) for a shop.
     */
    public function toggleShopPermit(Request $request, string $id): RedirectResponse
    {
        $this->authorizeAdmin();

        $request->validate([
            'permit' => 'required|in:nib,halal,pirt',
        ]);

        $shop = Shop::findOrFail($id);
        $permit = $request->input('permit');

        $shop->update([
            $permit => ! $shop->{$permit},
        ]);

        return redirect()->back();
    }

    /**
     * Toggle availability status of a product.
     */
    public function toggleProduct(string $id): RedirectResponse
    {
        $this->authorizeAdmin();

        $product = Product::findOrFail($id);
        $product->update([
            'is_available' => ! $product->is_available,
        ]);

        return redirect()->back();
    }

    /**
     * Delete a product from the platform.
     */
    public function deleteProduct(string $id): RedirectResponse
    {
        $this->authorizeAdmin();

        DB::transaction(function () use ($id) {
            $product = Product::findOrFail($id);
            Review::where('product_id', $product->id)->delete();
            $product->delete();
        });

        return redirect()->back();
    }

    /**
     * Delete a product review and recalculate product average rating.
     */
    public function deleteReview(string $id): RedirectResponse
    {
        $this->authorizeAdmin();

        DB::transaction(function () use ($id) {
            $review = Review::findOrFail($id);
            $productId = $review->product_id;
            $review->delete();

            if ($product = Product::find($productId)) {
                $stats = Review::where('product_id', $product->id)
                    ->selectRaw('COUNT(*) as total_reviews, AVG(rating) as avg_rating')
                    ->first();

                $product->update([
                    'rating' => round((float) ($stats->avg_rating ?? 5.0), 1),
                    'reviews_count' => (int) ($stats->total_reviews ?? 0),
                ]);
            }
        });

        return redirect()->back();
    }

    /**
     * Add a new sector category to the platform.
     */
    public function addCategory(Request $request): RedirectResponse
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name',
            'description' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:30',
        ]);

        Category::create([
            'id' => 'cat-'.Str::slug($validated['name']),
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'icon_name' => 'Store',
            'description' => $validated['description'] ?? ('Sektor '.$validated['name'].' Desa Samirono'),
            'color' => $validated['color'] ?? 'teal',
        ]);

        Cache::forget('app:categories');

        return redirect()->back();
    }

    /**
     * Delete a sector category from the platform.
     */
    public function deleteCategory(string $id): RedirectResponse
    {
        $this->authorizeAdmin();

        $category = Category::findOrFail($id);

        // Reassign products to first category or default before deleting
        $defaultCat = Category::where('id', '!=', $category->id)->first();
        if ($defaultCat) {
            Product::where('category_id', $category->id)->update(['category_id' => $defaultCat->id]);
        }

        $category->delete();

        Cache::forget('app:categories');

        return redirect()->back();
    }

    /**
     * Update user role.
     */
    public function updateUserRole(Request $request, string $id): RedirectResponse
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'role' => 'required|in:admin,owner,user',
        ]);

        $user = User::findOrFail($id);
        $user->update(['role' => $validated['role']]);

        return redirect()->back();
    }

    /**
     * Bulk import or update shops from parsed Excel.
     */
    public function bulkImport(Request $request, ProcessShopImportAction $action): RedirectResponse
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'shops' => 'required|array',
            'shops.*.name' => 'required|string',
            'shops.*.owner_name' => 'nullable|string',
            'shops.*.ownerName' => 'nullable|string',
            'shops.*.category' => 'nullable|string',
            'shops.*.address' => 'nullable|string',
            'shops.*.dusun' => 'nullable|string',
            'shops.*.phone' => 'nullable|string',
            'shops.*.description' => 'nullable|string',
            'shops.*.nib' => 'nullable|boolean',
            'shops.*.halal' => 'nullable|boolean',
            'shops.*.pirt' => 'nullable|boolean',
            'shops.*.is_verified' => 'nullable|boolean',
        ]);

        $importedCount = $action->execute($validated['shops']);

        return redirect()->back()->with('success', "Berhasil mengimpor {$importedCount} data toko.");
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

        $settingsData = [
            ['key' => 'app_name', 'value' => $request->appName],
            ['key' => 'tagline', 'value' => $request->tagline],
            ['key' => 'village_name', 'value' => $request->villageName],
            ['key' => 'kecamatan_name', 'value' => $request->kecamatanName ?? 'Kecamatan Getasan'],
            ['key' => 'kabupaten_name', 'value' => $request->kabupatenName ?? 'Kabupaten Semarang'],
            ['key' => 'description', 'value' => $request->description],
            ['key' => 'admin_phone', 'value' => $request->adminPhone],
            ['key' => 'hero_banner', 'value' => $request->heroBanner],
            ['key' => 'map_center_lat', 'value' => (string) ($request->mapCenterLat ?? -7.371239)],
            ['key' => 'map_center_lng', 'value' => (string) ($request->mapCenterLng ?? 110.456123)],
            ['key' => 'map_zoom', 'value' => (string) ($request->mapZoom ?? 14)],
            ['key' => 'footer_credits', 'value' => $request->footerCredits ?? '© 2026 TIM KKN UNNES GIAT 16 DESA SAMIRONO'],
            ['key' => 'flash_sale_title', 'value' => $request->flashSaleTitle ?? 'KEJAR DISKON WARGA'],
            ['key' => 'flash_sale_product_id', 'value' => $request->flashSaleProductId ?? ''],
            ['key' => 'flash_sale_hours', 'value' => (string) ($request->flashSaleHours ?? 3)],
            ['key' => 'flash_sale_minutes', 'value' => (string) ($request->flashSaleMinutes ?? 44)],
            ['key' => 'flash_sale_tag', 'value' => $request->flashSaleTag ?? 'Diskon Harian'],
            ['key' => 'flash_sale_progress', 'value' => (string) ($request->flashSaleProgress ?? 87)],
        ];

        if ($request->filled('hotSearches')) {
            $settingsData[] = ['key' => 'hot_searches', 'value' => json_encode($request->hotSearches)];
        }

        if ($request->filled('promoSlides')) {
            $settingsData[] = ['key' => 'promo_slides', 'value' => json_encode($request->promoSlides)];
        }

        Setting::upsert($settingsData, ['key'], ['value']);

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
