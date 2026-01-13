<?php

namespace App\Http\Controllers;

use App\Models\UserSignup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
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

        return redirect('/cart')->with('success', 'Signed in successfully.');
    }
}
