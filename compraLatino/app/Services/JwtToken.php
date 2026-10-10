<?php

namespace App\Services;

use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use UnexpectedValueException;

class JwtToken
{
    private const ALGO = 'HS256';

    private const TTL_SECONDS = 86400;

    public static function issue(User $user): string
    {
        $now = time();

        return JWT::encode([
            'iss' => (string) config('app.url'),
            'sub' => (string) $user->getKey(),
            'jti' => (string) Str::uuid(),
            'iat' => $now,
            'exp' => $now + self::TTL_SECONDS,
        ], self::secret(), self::ALGO);
    }

    public static function parse(string $token): object
    {
        $payload = JWT::decode($token, new Key(self::secret(), self::ALGO));

        if (! isset($payload->jti) || Cache::has(self::revokedKey((string) $payload->jti))) {
            throw new UnexpectedValueException('Token revoked.');
        }

        return $payload;
    }

    public static function revoke(object $payload): void
    {
        if (! isset($payload->jti)) {
            return;
        }

        $seconds = max(1, (int) ($payload->exp ?? 0) - time());
        Cache::put(self::revokedKey((string) $payload->jti), true, $seconds);
    }

    private static function secret(): string
    {
        $key = (string) config('app.key');

        if (str_starts_with($key, 'base64:')) {
            $decoded = base64_decode(substr($key, 7), true);

            return $decoded !== false ? $decoded : $key;
        }

        return $key;
    }

    private static function revokedKey(string $jti): string
    {
        return 'jwt:revoked:'.$jti;
    }
}
