<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Organization;
use App\Models\User;

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
        // Check if user belongs to a specific organization by slug
        Gate:define('view-dashboard', function (User $user, string $org_slug) {
            return $user->organization?->slug === $org_slug;
        });

    }
}
