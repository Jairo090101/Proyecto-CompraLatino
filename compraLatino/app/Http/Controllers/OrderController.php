<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Models\Product;
use App\Services\YAuctions\YAuctionsGateway;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json($request->user()->orders()->with('items')->latest()->paginate(20));
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        abort_unless($order->user_id === $request->user()->id, 404);

        return response()->json($order->load('items'));
    }

    public function store(StoreOrderRequest $request, YAuctionsGateway $gateway): JsonResponse
    {
        $idempotencyKey = $request->header('Idempotency-Key');
        if ($idempotencyKey && ($existing = Order::where('idempotency_key', $idempotencyKey)->first())) {
            return response()->json($existing->load('items'));
        }

        $order = DB::transaction(function () use ($request, $idempotencyKey): Order {
            $products = Product::whereIn('id', collect($request->validated('items'))->pluck('product_id'))->get()->keyBy('id');
            $lines = collect($request->validated('items'))->map(function (array $item) use ($products): array {
                $product = $products[$item['product_id']];
                $lineTotal = (float) $product->price_usd * $item['quantity'];
                return compact('product', 'item', 'lineTotal');
            });
            $subtotal = $lines->sum('lineTotal');
            $order = Order::create([
                'user_id' => $request->user()->id,
                'status' => 'pending',
                'subtotal' => $subtotal,
                'commission' => round($subtotal * .10, 2),
                'total' => round($subtotal * 1.10, 2),
                'idempotency_key' => $idempotencyKey,
            ]);
            $order->items()->createMany($lines->map(fn (array $line): array => [
                'product_id' => $line['product']->id,
                'quantity' => $line['item']['quantity'],
                'unit_price' => $line['product']->price_usd,
                'line_total' => $line['lineTotal'],
                'product_name' => $line['product']->name,
            ])->all());
            return $order;
        });

        try {
            $purchase = $gateway->placePurchase($order->load('items'));
            $order->update(['status' => $purchase['status'], 'yauctions_reference' => $purchase['reference']]);
        } catch (\Throwable) {
            $order->update(['status' => 'failed']);
        }

        return response()->json($order->fresh('items'), 201);
    }
}
