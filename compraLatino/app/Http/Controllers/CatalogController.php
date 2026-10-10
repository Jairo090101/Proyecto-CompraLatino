<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    public function categories(): JsonResponse
    {
        return response()->json(Category::query()->orderBy('name')->get());
    }

    public function products(Request $request): JsonResponse
    {
        $products = Product::query()
            ->with('category')
            ->when($request->filled('search'), fn ($query) => $query->where('name', 'like', '%'.$request->string('search').'%'))
            ->when($request->filled('category'), fn ($query) => $query->where('category_id', $request->string('category')))
            ->when($request->boolean('featured'), fn ($query) => $query->where('featured', true))
            ->orderByDesc('featured')
            ->paginate(min($request->integer('per_page', 20), 100));

        return response()->json($products);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json($product->load('category'));
    }
}
