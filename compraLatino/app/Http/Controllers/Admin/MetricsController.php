<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class MetricsController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'totals' => [
                'sales' => (float) Order::whereIn('status', ['submitted', 'completed'])->sum('total'),
                'orders' => Order::count(),
                'commission' => (float) Order::whereIn('status', ['submitted', 'completed'])->sum('commission'),
                'average_order' => (float) Order::whereIn('status', ['submitted', 'completed'])->avg('total'),
                'customers' => User::where('role', 'customer')->count(),
                'products' => Product::count(),
            ],
            'sales_by_day' => Order::query()->whereIn('status', ['submitted', 'completed'])
                ->selectRaw('DATE(created_at) as date, SUM(total) as total, COUNT(*) as orders')
                ->groupBy('date')->orderBy('date')->get(),
            'orders_by_status' => Order::query()->select('status', DB::raw('COUNT(*) as count'))
                ->groupBy('status')->get(),
            'top_products' => DB::table('order_items')->join('orders', 'orders.id', '=', 'order_items.order_id')
                ->whereIn('orders.status', ['submitted', 'completed'])
                ->select('product_name', DB::raw('SUM(quantity) as quantity'))
                ->groupBy('product_name')->orderByDesc('quantity')->limit(10)->get(),
        ]);
    }
}
