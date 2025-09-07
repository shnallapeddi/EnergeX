<?php

// Group under /api
$router->group(['prefix' => 'api'], function () use ($router) {
    // Preflight for each endpoint
    $router->options('register', function () { return response('', 204); });
    $router->options('login',    function () { return response('', 204); });
    $router->options('posts',    function () { return response('', 204); });
    $router->options('posts/{id}', function () { return response('', 204); });

    // Actual endpoints
    $router->post('register', 'AuthController@register');
    $router->post('login',    'AuthController@login');

    $router->group(['middleware' => 'jwt.auth'], function () use ($router) {
        $router->get('posts',      'PostController@index');
        $router->get('posts/{id}', 'PostController@show');
        $router->post('posts',     'PostController@store');
    });
});
