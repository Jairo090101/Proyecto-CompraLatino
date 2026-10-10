<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RecommendationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $purchased = $user->orders()->whereIn('status', ['submitted', 'completed'])->with('items')->get()
            ->flatMap(fn ($order) => $order->items->pluck('product_id'))->unique();
        $categories = $user->orders()->whereIn('status', ['submitted', 'completed'])
            ->join('order_items', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->select('products.category_id', DB::raw('SUM(order_items.quantity) as quantity'))
            ->groupBy('products.category_id')->orderByDesc('quantity')->limit(3)->pluck('category_id');

        $products = Product::with('category')->whereNotIn('id', $purchased)
            ->when($categories->isNotEmpty(), fn ($query) => $query->whereIn('category_id', $categories))
            ->orderByDesc('featured')->limit(8)->get();

        return response()->json($products);
    }
}
