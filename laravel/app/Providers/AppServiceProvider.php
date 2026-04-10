<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

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
        // check if user belongs to a specific organization by slug
        Gate::define('view-dashboard', function (User $user, string $org_slug) {
            return $user->organization?->slug === $org_slug;
        });

        // high-level "can manage the system" check
        Gate::define('manage-users', function (User $user) {
            return in_array($user->role?->slug, ['admin', 'developer']);
        });

        // can touch the Power BI links check
        Gate::define('manage-pbi-links', function (User $user) {
            return $user->role?->slug === 'developer';
        });

    }
}
