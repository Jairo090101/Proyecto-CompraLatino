<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $fillable = [
        'category_id', 'name', 'description', 'price_usd', 'original_price_usd',
        'status', 'image', 'condition', 'yauctions_item_id', 'featured',
    ];

    protected function casts(): array
    {
        return [
            'price_usd' => 'decimal:2',
            'original_price_usd' => 'decimal:2',
            'featured' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
