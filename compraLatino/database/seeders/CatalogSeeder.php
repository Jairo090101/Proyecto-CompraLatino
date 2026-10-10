<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['id' => 'electronica', 'name' => 'Electrónica', 'image' => null, 'item_count' => 12400],
            ['id' => 'automoviles', 'name' => 'Automóviles', 'image' => null, 'item_count' => 8320],
            ['id' => 'coleccionables', 'name' => 'Coleccionables', 'image' => null, 'item_count' => 5870],
            ['id' => 'moda', 'name' => 'Moda', 'image' => null, 'item_count' => 9600],
            ['id' => 'hogar', 'name' => 'Hogar', 'image' => null, 'item_count' => 7450],
            ['id' => 'juguetes-anime', 'name' => 'Juguetes & Anime', 'image' => null, 'item_count' => 6200],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(['id' => $category['id']], $category);
        }

        $products = [
            ['name' => 'Sony WH-1000XM5 Audífonos Inalámbricos', 'category_id' => 'electronica', 'price_usd' => 249, 'original_price_usd' => 345, 'status' => 'disponible', 'featured' => true],
            ['name' => 'Nintendo Switch OLED Edición Blanca', 'category_id' => 'electronica', 'price_usd' => 389, 'original_price_usd' => 459, 'status' => 'disponible', 'featured' => true],
            ['name' => 'Nendoroid Tanjiro Kamado Demon Slayer', 'category_id' => 'coleccionables', 'price_usd' => 69, 'original_price_usd' => 99, 'status' => 'disponible', 'featured' => true],
            ['name' => 'Kimono Tradicional Mujer Floral Azul', 'category_id' => 'moda', 'price_usd' => 189, 'original_price_usd' => 233, 'status' => 'disponible', 'featured' => false],
            ['name' => 'Set Bonsai Juniper con Maceta Cerámica', 'category_id' => 'hogar', 'price_usd' => 119, 'original_price_usd' => 159, 'status' => 'disponible', 'featured' => false],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(['name' => $product['name']], $product);
        }
    }
}
