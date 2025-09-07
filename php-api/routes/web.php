<?php

$router->group(['prefix' => 'api'], function () use ($router) {
    // CORS preflight for specific endpoints
    $router->options('register', function () { return response('', 204); });
    $router->options('login',    function () { return response('', 204); });
    $router->options('posts',    function () { return response('', 204); });
    $router->options('posts/{id}', function () { return response('', 204); });

    // Public endpoints
    $router->post('register', 'AuthController@register');
    $router->post('login',    'AuthController@login');

    // Protected endpoints
    $router->group(['middleware' => 'jwt.auth'], function () use ($router) {
        $router->get('posts',       'PostController@index');
        $router->get('posts/{id}',  'PostController@show');
        $router->post('posts',      'PostController@store');
    });
});

