<?php

/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Append security-hardening HTTP headers to every web response.
 *
 * CSP uses 'unsafe-inline' to support Inertia's inline script bootstrapping
 * and Vite's HMR. Tighten to a nonce-based policy once SSR is fully adopted.
 */
class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only mutate HTTP responses with a header bag
        if (! property_exists($response, 'headers') || ! $response->headers) {
            return $response;
        }

        $directives = [
            'default-src' => ["'self'"],
            'img-src' => [
                "'self'",
                'data:',
                'blob:',
                'https://images.unsplash.com',
                'https://lh3.googleusercontent.com',
                'https://storage.googleapis.com',
                'https://*.tile.openstreetmap.org',
            ],
            'font-src' => [
                "'self'",
                'data:',
                'https://fonts.bunny.net',
                'https://fonts.gstatic.com',
            ],
            'script-src' => ["'self'", "'unsafe-inline'"],
            'script-src-elem' => ["'self'", "'unsafe-inline'"],
            'style-src' => [
                "'self'",
                "'unsafe-inline'",
                'https://fonts.bunny.net',
                'https://fonts.googleapis.com',
            ],
            'style-src-elem' => [
                "'self'",
                "'unsafe-inline'",
                'https://fonts.bunny.net',
                'https://fonts.googleapis.com',
            ],
            'connect-src' => ["'self'", 'ws:', 'wss:'],
            'worker-src' => ['blob:'],
        ];

        if (app()->environment('local', 'testing')) {
            $devHosts = [
                'http:',
                'http://localhost:*',
                'http://127.0.0.1:*',
                'http://localhost:5173',
                'http://127.0.0.1:5173',
                'ws:',
                'ws://localhost:*',
                'ws://127.0.0.1:*',
                'ws://localhost:5173',
                'ws://127.0.0.1:5173',
            ];

            $directives['script-src'][] = "'unsafe-eval'";
            $directives['script-src-elem'][] = "'unsafe-eval'";

            foreach ($devHosts as $host) {
                if (! in_array($host, $directives['script-src'], true)) {
                    $directives['script-src'][] = $host;
                }
                if (! in_array($host, $directives['script-src-elem'], true)) {
                    $directives['script-src-elem'][] = $host;
                }
                if (! in_array($host, $directives['style-src'], true)) {
                    $directives['style-src'][] = $host;
                }
                if (! in_array($host, $directives['style-src-elem'], true)) {
                    $directives['style-src-elem'][] = $host;
                }
                if (! in_array($host, $directives['connect-src'], true)) {
                    $directives['connect-src'][] = $host;
                }
                if (! in_array($host, $directives['img-src'], true)) {
                    $directives['img-src'][] = $host;
                }
                if (! in_array($host, $directives['font-src'], true)) {
                    $directives['font-src'][] = $host;
                }
            }
        }

        $cspHeader = [];
        foreach ($directives as $name => $values) {
            $cspHeader[] = $name.' '.implode(' ', array_unique($values));
        }

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
        $response->headers->set('Content-Security-Policy', implode('; ', $cspHeader));

        return $response;
    }
}
