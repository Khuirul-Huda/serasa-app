<?php

/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\MarketplaceController;
use App\Http\Controllers\MerchantController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;

// Public marketplace pages
Route::get('/', [MarketplaceController::class, 'index'])->name('home');
Route::get('/shops', [MarketplaceController::class, 'shops'])->name('shops.index');
Route::get('/shops/{id}', [MarketplaceController::class, 'shopDetail'])->name('shops.detail');
Route::get('/products/{id}', [MarketplaceController::class, 'productDetail'])->name('products.detail');
Route::get('/map', [MarketplaceController::class, 'map'])->name('map.index');
Route::post('/products/{id}/reviews', [ReviewController::class, 'store'])
    ->name('reviews.store')
    ->middleware('throttle:10,1');

// Authenticated user page groups
Route::middleware(['auth', 'verified'])->group(function () {
    // Merchant dashboard & store management
    Route::get('/dashboard', function () {
        if (auth()->user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('merchant.dashboard');
    })->name('dashboard');

    Route::get('/merchant/dashboard', [MerchantController::class, 'dashboard'])->name('merchant.dashboard');
    Route::post('/merchant/shop', [MerchantController::class, 'registerShop'])->name('merchant.shop.register');
    Route::put('/merchant/shop', [MerchantController::class, 'updateShop'])->name('merchant.shop.update');
    Route::post('/merchant/products', [MerchantController::class, 'addProduct'])->name('merchant.products.store');
    Route::put('/merchant/products/{id}/toggle', [MerchantController::class, 'toggleProduct'])->name('merchant.products.toggle');
    Route::delete('/merchant/products/{id}', [MerchantController::class, 'deleteProduct'])->name('merchant.products.delete');

    // Admin dashboard & approval management
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::post('/admin/shops/{id}/verify', [AdminDashboardController::class, 'toggleVerifyShop'])->name('admin.shops.verify');
    Route::post('/admin/shops/{id}/permit', [AdminDashboardController::class, 'toggleShopPermit'])->name('admin.shops.permit');
    Route::delete('/admin/shops/{id}', [AdminDashboardController::class, 'deleteShop'])->name('admin.shops.delete');
    Route::post('/admin/shops/bulk-import', [AdminDashboardController::class, 'bulkImport'])->name('admin.shops.bulk-import');
    Route::post('/admin/settings', [AdminDashboardController::class, 'saveSettings'])->name('admin.settings.save');
    Route::post('/admin/products/{id}/toggle', [AdminDashboardController::class, 'toggleProduct'])->name('admin.products.toggle');
    Route::delete('/admin/products/{id}', [AdminDashboardController::class, 'deleteProduct'])->name('admin.products.delete');
    Route::delete('/admin/reviews/{id}', [AdminDashboardController::class, 'deleteReview'])->name('admin.reviews.delete');
    Route::post('/admin/categories', [AdminDashboardController::class, 'addCategory'])->name('admin.categories.store');
    Route::delete('/admin/categories/{id}', [AdminDashboardController::class, 'deleteCategory'])->name('admin.categories.delete');
    Route::post('/admin/users/{id}/role', [AdminDashboardController::class, 'updateUserRole'])->name('admin.users.role');
});

require __DIR__.'/settings.php';
