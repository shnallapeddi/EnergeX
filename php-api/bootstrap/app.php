<?php

require_once __DIR__.'/../vendor/autoload.php';

(new Laravel\Lumen\Bootstrap\LoadEnvironmentVariables(
    dirname(__DIR__)
))->bootstrap();

date_default_timezone_set(env('APP_TIMEZONE', 'UTC'));

/*
|--------------------------------------------------------------------------
| Create The Application
|--------------------------------------------------------------------------
*/
$app = new Laravel\Lumen\Application(
    dirname(__DIR__)
);

$app->middleware([
    App\Http\Middleware\CorsMiddleware::class,
]);

/**
 * Enable Facades and Eloquent ORM
 */
$app->withFacades();
$app->withEloquent();

/*
|--------------------------------------------------------------------------
| Register Container Bindings
|--------------------------------------------------------------------------
*/
$app->singleton(
    Illuminate\Contracts\Debug\ExceptionHandler::class,
    App\Exceptions\Handler::class
);

$app->singleton(
    Illuminate\Contracts\Console\Kernel::class,
    App\Console\Kernel::class
);

$app->bind('path.lang', function () {
    return base_path('resources/lang');
});

/*
|--------------------------------------------------------------------------
| Register Config Files
|--------------------------------------------------------------------------
*/
$app->configure('app');
$app->configure('auth');   // <-- needed for JWT guard/provider

/*
|--------------------------------------------------------------------------
| Register Middleware
|--------------------------------------------------------------------------
|
| Add route middleware for default auth and JWT.
| You'll use 'jwt.auth' to protect routes that require a valid token.
|
*/


$app->routeMiddleware([
    'auth'        => App\Http\Middleware\Authenticate::class,
    'jwt.auth'    => PHPOpenSourceSaver\JWTAuth\Http\Middleware\Authenticate::class,
    'jwt.refresh' => PHPOpenSourceSaver\JWTAuth\Http\Middleware\RefreshToken::class,
]);


/*
|--------------------------------------------------------------------------
| Register Service Providers
|--------------------------------------------------------------------------
|
| - Translation + Validation so Lumen's validator works cleanly.
| - Hashing provider for password hashing.
| - JWT service provider for token issuing/verification.
|
*/
$app->register(Illuminate\Translation\TranslationServiceProvider::class);
$app->register(Illuminate\Validation\ValidationServiceProvider::class);
$app->register(Illuminate\Hashing\HashServiceProvider::class);
$app->register(Illuminate\Auth\AuthServiceProvider::class);
$app->register(PHPOpenSourceSaver\JWTAuth\Providers\LumenServiceProvider::class);
/*
|--------------------------------------------------------------------------
| Load The Application Routes
|--------------------------------------------------------------------------
*/
$app->configure('app');

$app->router->group([
    'namespace' => 'App\Http\Controllers',
], function ($router) {
    require __DIR__.'/../routes/web.php';
});

return $app;
