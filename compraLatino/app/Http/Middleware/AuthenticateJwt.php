<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Services\JwtToken;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class AuthenticateJwt
{
    /**
     * Allow the request only when it carries a valid Bearer JWT from login or register.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if ($token === null || $token === '') {
            return $this->unauthenticated();
        }

        try {
            $payload = JwtToken::parse($token);
        } catch (Throwable) {
            return $this->unauthenticated();
        }

        $user = User::query()->find($payload->sub ?? null);

        if ($user === null) {
            return $this->unauthenticated();
        }

        Auth::setUser($user);
        $request->setUserResolver(static fn () => $user);
        $request->attributes->set('jwt_payload', $payload);

        return $next($request);
    }

    private function unauthenticated(): Response
    {
        return response()->json(['message' => 'Unauthenticated.'], 401);
    }
}
