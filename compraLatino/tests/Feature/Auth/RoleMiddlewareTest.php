<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_endpoint_requires_authentication(): void
    {
        $this->getJson('/api/admin/metrics')->assertUnauthorized();
    }

    public function test_customer_cannot_access_admin_endpoint(): void
    {
        $user = User::factory()->create(['role' => 'customer']);

        $this->actingAs($user, 'sanctum')->getJson('/api/admin/metrics')->assertForbidden();
    }

    public function test_admin_can_access_admin_endpoint(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin, 'sanctum')->getJson('/api/admin/metrics')->assertOk();
    }
}
