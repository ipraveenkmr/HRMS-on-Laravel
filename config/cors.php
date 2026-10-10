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

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_values(array_unique(array_filter(array_merge(
        [
            'http://localhost:3000',
            'http://localhost:4321',
            'http://localhost:5173',
            'http://localhost:8000',
            'https://hrms.escl.in',
            'https://test.escl.in',
            'https://codingmstr.com',
            'https://seller.codingmstr.com',
            'https://idea.codingmstr.com',
            'https://backend.codingmstr.com',
            'https://idea.trickuweb.com',
        ],
        explode(',', env('CORS_ALLOWED_ORIGINS', '*'))
    )))),

    'allowed_origins_patterns' => [
        '#^https?://.*\.escl\.in$#',
        '#^https?://.*\.codingmstr\.com$#',
        '#^https?://.*\.trickuweb\.com$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['*'],

    'max_age' => 86400,

    'supports_credentials' => false,

];
