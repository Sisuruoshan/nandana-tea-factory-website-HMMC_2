<?php

namespace App\Http\Controllers;

use App\Models\UserSignup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function showLoginForm(Request $request)
    {
        $fromQuery = $request->query('redirect');
        $previous = $request->headers->get('referer');

        $intended = $this->sanitizeRedirect($fromQuery ?? $previous ?? '/');
        $request->session()->put('intended_url', $intended);

        return view('user-login', ['redirect' => $intended]);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = UserSignup::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return back()
                ->withInput($request->only('email'))
                ->withErrors(['email' => 'Invalid email or password.']);
        }

        // Lightweight session login (non-guard)
        $request->session()->put('user_signup_id', $user->id);
        $request->session()->put('user_signup_name', $user->name);
        $request->session()->put('is_logged_in', true);

        $redirectTarget = $this->sanitizeRedirect(
            $request->input('redirect', $request->session()->pull('intended_url'))
        );

        return redirect($redirectTarget)->with('success', 'Signed in successfully.');
    }

    private function sanitizeRedirect(?string $target): string
    {
        if (!$target) {
            return '/';
        }

        $parsed = parse_url($target);

        // Prevent external redirects
        if (isset($parsed['host']) && $parsed['host'] !== parse_url(url('/'), PHP_URL_HOST)) {
            return '/';
        }

        $path = $parsed['path'] ?? '/';
        $query = isset($parsed['query']) ? '?' . $parsed['query'] : '';
        $clean = $path . $query;

        // Avoid loops to auth-related pages
        $blocked = ['login', 'signup', 'admin-login'];
        if (in_array(trim($path, '/'), $blocked, true)) {
            return '/';
        }

        return $clean ?: '/';
    }
}
