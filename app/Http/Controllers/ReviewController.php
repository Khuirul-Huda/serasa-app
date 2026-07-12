<?php

/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReviewController extends Controller
{
    /**
     * Store a new review for a product and recalculate rating.
     */
    public function store(Request $request, string $productId): RedirectResponse
    {
        $request->validate([
            'userName' => 'required|string|max:100',
            'rating' => 'required|numeric|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        $product = Product::findOrFail($productId);

        Review::create([
            'id' => 'rev-'.(string) Str::uuid(),
            'product_id' => $product->id,
            'user_name' => $request->userName,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        // Recalculate average rating and reviews count
        $reviewsCount = Review::where('product_id', $product->id)->count();
        $averageRating = Review::where('product_id', $product->id)->avg('rating') ?: 5.0;

        $product->update([
            'rating' => round($averageRating, 1),
            'reviews_count' => $reviewsCount,
        ]);

        return redirect()->back();
    }
}
