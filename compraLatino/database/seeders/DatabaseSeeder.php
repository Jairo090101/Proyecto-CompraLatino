<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database. Must be idempotent: it runs on every deploy.
     */
    public function run(): void
    {
        $this->call(CatalogSeeder::class);

        User::updateOrCreate(
            ['email' => 'admin@compralatino.test'],
            [
                'name' => 'Administrador',
                'password' => 'Admin12345',
                'role' => 'admin',
                'country' => 'MX',
            ]
        );

        if (! User::where('email', '!=', 'admin@compralatino.test')->exists()) {
            User::factory(5)->create();
        }

        $this->call(OrderSeeder::class);
    }
}
