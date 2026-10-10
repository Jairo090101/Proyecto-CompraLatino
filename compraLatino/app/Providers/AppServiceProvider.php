<?php

namespace App\Providers;

use App\Services\YAuctions\FakeYAuctionsGateway;
use App\Services\YAuctions\YAuctionsGateway;
use Illuminate\Support\ServiceProvider;

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
        //
    }
}
