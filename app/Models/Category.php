<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['id', 'name', 'icon_name', 'description', 'color'];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'category_id');
    }
}
