<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeder_creates_users_that_can_log_in_and_is_idempotent(): void
    {
        $this->seed(UserSeeder::class);
        $this->seed(UserSeeder::class);

        $this->assertSame(count(UserSeeder::USERS), User::query()->count());

        foreach (UserSeeder::USERS as $user) {
            $stored = User::query()->where('email', $user['email'])->firstOrFail();

            $this->assertSame($user['name'], $stored->name);
            $this->assertTrue(Hash::check(UserSeeder::PASSWORD, $stored->password));

            $this->postJson('/api/auth/login', [
                'email' => $user['email'],
                'password' => UserSeeder::PASSWORD,
            ])->assertOk()
                ->assertJsonPath('user.email', $user['email']);
        }
    }
}