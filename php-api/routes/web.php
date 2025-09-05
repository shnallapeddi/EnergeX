<?php

$router->group(['prefix' => 'api'], function () use ($router) {
    $router->post('register', 'AuthController@register');
    $router->post('login',    'AuthController@login');

    // Protected routes (JWT required)
    $router->group(['middleware' => 'jwt.auth'], function () use ($router) {
        $router->get('posts',        'PostController@index');   // cached
        $router->get('posts/{id}',   'PostController@show');    // cached
        $router->post('posts',       'PostController@store');   // invalidates list cache
    });
});
