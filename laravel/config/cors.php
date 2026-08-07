<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['*', 'sanctum/csrf-cookie', 'login', 'logout'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [  
        'http://localhost:5173',          // Vue dev server
        'http://localhost:8080',          // Local Nginx
        'http://local.sdg-dashboard.com', // Local Nginx alias

        // Production URLs
        'https://sdgph.org',
        'https://www.sdgph.org',
        'https://sdg-dashboard.ddnsfree.com', // Keep temporarily for smooth migration
     ], 

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];