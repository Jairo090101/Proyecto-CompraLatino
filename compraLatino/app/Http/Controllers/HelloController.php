<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class HelloController extends Controller
{
    /**
     * Probe endpoint used to confirm the API is reachable after deploy.
     */
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'message' => 'Hola mundo',
            'service' => 'compraLatino',
        ]);
    }
}
