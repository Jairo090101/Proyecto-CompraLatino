<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogTest extends TestCase
{
    use RefreshDatabase;

    private function seedProduct(): Product
    {
        Category::create(['id' => 'electronica', 'name' => 'Electrónica', 'item_count' => 1]);

        return Product::create([
            'category_id' => 'electronica',
            'name' => 'Producto de prueba',
            'description' => 'Descripción',
            'price_usd' => 10,
        ]);
    }

    public function test_categories_keep_their_string_id(): void
    {
        $this->seedProduct();

        $this->getJson('/api/categories')
            ->assertOk()
            ->assertJsonPath('0.id', 'electronica');
    }

    public function test_products_list_includes_the_category(): void
    {
        $this->seedProduct();

        $this->getJson('/api/products')
            ->assertOk()
            ->assertJsonPath('data.0.category.id', 'electronica');
    }

    public function test_product_detail_includes_the_category(): void
    {
        $product = $this->seedProduct();

        $this->getJson("/api/products/{$product->id}")
            ->assertOk()
            ->assertJsonPath('category.id', 'electronica');
    }
}
