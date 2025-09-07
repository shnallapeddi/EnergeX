<?php

$router->options('/{any:.*}', function () {
    return response('', 204, [
        'Access-Control-Allow-Origin'  => '*',
        'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age'       => '86400',
    ]);
});

$router->group(['prefix' => 'api'], function () use ($router) {
    $router->post('register', 'AuthController@register');
    $router->post('login',    'AuthController@login');

    $router->group(['middleware' => 'jwt.auth'], function () use ($router) {
        $router->get('posts',      'PostController@index');
        $router->get('posts/{id}', 'PostController@show');
        $router->post('posts',     'PostController@store');
    });
});
