<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price_usd' => ['required', 'numeric', 'gt:0'],
            'original_price_usd' => ['nullable', 'numeric', 'gte:price_usd'],
            'status' => ['required', Rule::in(['disponible', 'subasta', 'agotado'])],
            'image' => ['nullable', 'url', 'max:2048'],
            'condition' => ['nullable', 'string', 'max:100'],
            'yauctions_item_id' => ['nullable', 'string', 'max:255'],
            'featured' => ['sometimes', 'boolean'],
        ];
    }
}
