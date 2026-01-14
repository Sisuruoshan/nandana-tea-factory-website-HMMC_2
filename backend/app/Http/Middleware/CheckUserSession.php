<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserSession
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->session()->has('user_signup_id')) {
            // Check if this is an API route (starts with /api/)
            $path = $request->path();
            $isApiRoute = str_starts_with($path, 'api/');
            
            if ($request->expectsJson() || $isApiRoute) {
                // Check if this is a cart-related endpoint
                if ($request->is('api/cart/*') || $request->is('api/cart') || $path === 'api/cart/add') {
                    return response()->json(['error' => 'Login to add items to the cart'], 401)
                        ->header('Content-Type', 'application/json');
                }
                return response()->json(['error' => 'Unauthorized'], 401)
                    ->header('Content-Type', 'application/json');
            }
            return redirect('/login')->with('error', 'Please login to access this page.');
        }

        return $next($request);
    }
}
