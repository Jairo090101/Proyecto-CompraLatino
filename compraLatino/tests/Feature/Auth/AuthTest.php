<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private array $payload = [
        'name' => 'Ana Pérez',
        'email' => 'ana@example.com',
        'password' => 'secreto123',
        'password_confirmation' => 'secreto123',
    ];

    public function test_user_can_register(): void
    {
        $this->postJson('/api/auth/register', $this->payload)
            ->assertCreated()
            ->assertJsonStructure(['user' => ['id', 'name', 'email'], 'token', 'token_type'])
            ->assertJsonMissingPath('user.password');

        $this->assertDatabaseHas('users', ['email' => 'ana@example.com']);
    }

    public function test_register_validates_input(): void
    {
        User::factory()->create(['email' => 'ana@example.com']);

        $this->postJson('/api/auth/register', [...$this->payload, 'password_confirmation' => 'otra'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_user_can_login(): void
    {
        User::factory()->create(['email' => 'ana@example.com', 'password' => 'secreto123']);

        $this->postJson('/api/auth/login', ['email' => 'ana@example.com', 'password' => 'secreto123'])
            ->assertOk()
            ->assertJsonStructure(['user', 'token', 'token_type']);
    }

    public function test_login_fails_with_wrong_credentials(): void
    {
        User::factory()->create(['email' => 'ana@example.com', 'password' => 'secreto123']);

        $this->postJson('/api/auth/login', ['email' => 'ana@example.com', 'password' => 'incorrecta'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_me_requires_authentication(): void
    {
        $this->getJson('/api/auth/me')->assertUnauthorized();
    }

    public function test_me_returns_401_even_without_json_accept_header(): void
    {
        $this->get('/api/auth/me')->assertUnauthorized();
    }

    public function test_authenticated_user_can_get_profile_and_logout(): void
    {
        $token = $this->postJson('/api/auth/register', $this->payload)->json('token');

        $this->withToken($token)->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('data.email', 'ana@example.com');

        $this->withToken($token)->postJson('/api/auth/logout')->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
