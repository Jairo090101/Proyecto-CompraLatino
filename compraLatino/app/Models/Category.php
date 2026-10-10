<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    // The primary key is a string slug (e.g. "electronica"), not an auto-increment integer.
    // Without these, Eloquent casts the id to int (always 0) and uses whereIntegerInRaw,
    // which breaks eager loading on PostgreSQL (varchar = integer) and returns id 0.
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['id', 'name', 'image', 'item_count'];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
