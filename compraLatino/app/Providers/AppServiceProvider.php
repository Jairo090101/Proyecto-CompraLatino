<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
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
