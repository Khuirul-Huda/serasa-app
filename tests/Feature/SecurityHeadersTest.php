<?php

use App\Http\Middleware\SecurityHeaders;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

test('security headers middleware adds valid content security policy including local vite hosts', function () {
    $middleware = new SecurityHeaders;
    $request = Request::create('/', 'GET');

    $response = $middleware->handle($request, function ($req) {
        return new Response('OK');
    });

    $csp = $response->headers->get('Content-Security-Policy');

    expect($csp)->not->toBeNull();
    expect($csp)->toContain("script-src 'self' 'unsafe-inline'");
    expect($csp)->toContain('script-src-elem');
    expect($csp)->toContain('style-src-elem');
    expect($csp)->toContain('font-src');
    expect($csp)->toContain('https://fonts.bunny.net');
    expect($csp)->toContain('http:');
    expect($csp)->toContain('http://localhost:5173');
    expect($csp)->not->toContain('[::1]');
});
