<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $customer = User::where('role', 'customer')->first();
        $products = Product::limit(2)->get();

        if (! $customer || $products->isEmpty()) {
            return;
        }

        $items = $products->map(fn (Product $product): array => [
            'product_id' => $product->id,
            'quantity' => 1,
            'unit_price' => $product->price_usd,
            'line_total' => $product->price_usd,
            'product_name' => $product->name,
        ]);
        $subtotal = $items->sum('line_total');
        $order = Order::create([
            'user_id' => $customer->id,
            'status' => 'completed',
            'subtotal' => $subtotal,
            'commission' => round($subtotal * .10, 2),
            'total' => round($subtotal * 1.10, 2),
            'yauctions_reference' => 'YA-DEMO-1',
            'idempotency_key' => 'seed-demo-order',
        ]);
        $order->items()->createMany($items->all());
    }
}
