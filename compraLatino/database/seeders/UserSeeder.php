<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * Cuentas de demostración para iniciar sesión.
 * Se puede ejecutar en cada deploy: si el correo ya existe, no se modifica.
 */
class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    public const PASSWORD = 'Compra123';

    /**
     * @var list<array{name: string, email: string}>
     */
    public const USERS = [
        ['name' => 'María López', 'email' => 'maria@example.com'],
        ['name' => 'Carlos Ruiz', 'email' => 'carlos@example.com'],
    ];

    public function run(): void
    {
        foreach (self::USERS as $user) {
            User::query()->firstOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'password' => self::PASSWORD,
                ],
            );
        }
    }
}
