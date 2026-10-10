<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(CatalogSeeder::class);

        User::factory()->create([
            'name' => 'Administrador',
            'email' => 'admin@compralatino.test',
            'password' => 'Admin12345',
            'role' => 'admin',
            'country' => 'MX',
        ]);

        User::factory(5)->create();
    }
}
