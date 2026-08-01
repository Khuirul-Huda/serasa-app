<?php

/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ReviewController extends Controller
{
    /**
     * Store a new review for a product and recalculate rating.
     */
    public function store(StoreReviewRequest $request, string $productId): RedirectResponse
    {
        $product = Product::findOrFail($productId);

        DB::transaction(function () use ($request, $product) {
            Review::create([
                'id' => 'rev-'.(string) Str::uuid(),
                'product_id' => $product->id,
                'user_name' => auth()->user()->name,
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]);

            // Recalculate average rating and reviews count
            $reviewsCount = Review::where('product_id', $product->id)->count();
            $averageRating = Review::where('product_id', $product->id)->avg('rating') ?: 5.0;

            $product->update([
                'rating' => round((float) $averageRating, 1),
                'reviews_count' => $reviewsCount,
            ]);
        });

        return redirect()->back();
    }
}
