<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shop extends Model
{
    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id', 'name', 'owner_name', 'description', 'category',
        'phone', 'address', 'dusun', 'image', 'logo',
        'is_verified', 'lat', 'lng', 'working_hours', 'user_id',
        'nib', 'halal', 'pirt',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'lat' => 'double',
        'lng' => 'double',
        'nib' => 'boolean',
        'halal' => 'boolean',
        'pirt' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
