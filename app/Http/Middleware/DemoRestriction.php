<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DemoRestriction
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Allow login endpoint even for POST requests
        if ($this->isLoginRoute($request)) {
            return $next($request);
        }

        // Allow only GET requests for all other routes
        if ($request->method() !== 'GET') {
            return response()->json([
                'message' => 'App is for DEMO only, so POST, PUT, UPDATE, DELETE is not allowed',
                'error' => 'Method not allowed in demo mode',
                'allowed_method' => 'GET',
                'current_method' => $request->method(),
                'note' => 'Login is allowed for demo authentication'
            ], 405);
        }

        return $next($request);
    }

    /**
     * Check if the current request is for the login route
     */
    private function isLoginRoute(Request $request): bool
    {
        return $request->is('api/auth/token') && $request->method() === 'POST';
    }
}