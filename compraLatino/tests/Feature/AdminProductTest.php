<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_customers_cannot_manage_products(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => 'customer']));

        $this->getJson('/api/admin/products')->assertForbidden();
    }

    public function test_admin_can_create_product(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => 'admin']));
        $category = Category::create(['id' => 'test', 'name' => 'Test']);

        $this->postJson('/api/admin/products', [
            'category_id' => $category->id,
            'name' => 'Producto de prueba',
            'description' => 'Descripción',
            'price_usd' => 25,
            'status' => 'disponible',
        ])->assertCreated()->assertJsonPath('name', 'Producto de prueba');
    }

    public function test_admin_can_delete_product_without_sales(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => 'admin']));
        $category = Category::create(['id' => 'test', 'name' => 'Test']);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Producto',
            'description' => 'Descripción',
            'price_usd' => 25,
            'status' => 'disponible',
        ]);

        $this->deleteJson("/api/admin/products/{$product->id}")
            ->assertOk()
            ->assertJsonPath('message', 'Producto eliminado correctamente.');
    }
}
