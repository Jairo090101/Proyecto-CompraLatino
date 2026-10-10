<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(Product::with('category')
            ->when($request->filled('search'), fn ($query) => $query->where('name', 'like', '%'.$request->string('search').'%'))
            ->latest()->paginate(min($request->integer('per_page', 20), 100)));
    }

    public function store(ProductRequest $request): JsonResponse
    {
        return response()->json(Product::create($request->validated())->load('category'), 201);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json($product->load('category'));
    }

    public function update(ProductRequest $request, Product $product): JsonResponse
    {
        $product->update($request->validated());
        return response()->json($product->fresh('category'));
    }

    public function destroy(Product $product): JsonResponse
    {
        try {
            $product->delete();
        } catch (QueryException) {
            return response()->json([
                'message' => 'No puedes eliminar un producto que tiene ventas. Márcalo como agotado.',
            ], 409);
        }

        return response()->json(['message' => 'Producto eliminado correctamente.']);
    }
}
