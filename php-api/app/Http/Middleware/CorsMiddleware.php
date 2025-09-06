<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Response;

class CorsMiddleware
{
    public function handle($request, Closure $next)
    {
        if ($request->getMethod() === 'OPTIONS') {
            return response('', 204, [
                'Access-Control-Allow-Origin'  => '*',
                'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                'Access-Control-Allow-Headers' => 'Origin, Content-Type, Accept, Authorization, X-Requested-With',
                'Access-Control-Max-Age'       => '86400'
            ]);
        }

        /** @var Response $response */
        $response = $next($request);

        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Requested-With');
        $response->headers->set('Access-Control-Max-Age', '86400');

        return $response;
    }
}
