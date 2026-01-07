<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserSignup;

class SignupController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:user_signups,email',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        // Hash password
        $validated['password'] = bcrypt($validated['password']);

        // Save to database
        UserSignup::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Account created successfully! You can now login.'
        ]);
    }
}
