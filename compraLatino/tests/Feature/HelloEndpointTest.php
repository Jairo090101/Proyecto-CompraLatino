<?php

namespace Tests\Feature;

use Tests\TestCase;

class HelloEndpointTest extends TestCase
{
    public function test_hello_endpoint_returns_json(): void
    {
        $response = $this->getJson('/api/hello');

        $response->assertOk()
            ->assertJson([
                'message' => 'Hola mundo',
                'service' => 'compraLatino',
            ]);
    }
}
