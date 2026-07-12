<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id', 'shop_id', 'category_id', 'name', 'description',
        'price', 'unit', 'image', 'rating', 'reviews_count', 'is_available',
    ];

    protected $casts = [
        'price' => 'integer',
        'rating' => 'double',
        'reviews_count' => 'integer',
        'is_available' => 'boolean',
    ];

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
