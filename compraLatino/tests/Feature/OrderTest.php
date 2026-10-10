<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    private function product(string $status = 'disponible'): Product
    {
        $category = Category::create([
            'id' => 'electronica',
            'name' => 'Electrónica',
            'item_count' => 1,
        ]);

        return Product::create([
            'category_id' => $category->id,
            'name' => 'Producto de prueba',
            'description' => 'Descripción',
            'price_usd' => 10,
            'status' => $status,
        ]);
    }

    public function test_an_order_cannot_be_created_with_an_unavailable_product(): void
    {
        $user = User::factory()->create();
        $product = $this->product('agotado');

        $this->actingAs($user)->postJson('/api/orders', [
            'items' => [['product_id' => $product->id, 'quantity' => 1]],
        ])->assertUnprocessable();

        $this->assertDatabaseCount('orders', 0);
    }

    public function test_idempotency_key_returns_the_existing_order(): void
    {
        $user = User::factory()->create();
        $product = $this->product();
        $headers = ['Idempotency-Key' => 'checkout-test-key'];
        $payload = ['items' => [['product_id' => $product->id, 'quantity' => 2]]];

        $first = $this->actingAs($user)->withHeaders($headers)->postJson('/api/orders', $payload)->assertCreated();
        $second = $this->actingAs($user)->withHeaders($headers)->postJson('/api/orders', $payload)->assertOk();

        $this->assertSame($first->json('id'), $second->json('id'));
        $this->assertDatabaseCount('orders', 1);
    }
}
