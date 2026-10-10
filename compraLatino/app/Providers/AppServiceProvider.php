<?php

namespace App\Providers;

use App\Services\YAuctions\FakeYAuctionsGateway;
use App\Services\YAuctions\YAuctionsGateway;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(YAuctionsGateway::class, FakeYAuctionsGateway::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Forzar https en entornos que no sean locales
        if (app()->environment('production') || app()->isProduction()) {
            URL::forceScheme('https');
        }
    }
}
