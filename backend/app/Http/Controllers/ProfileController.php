<?php

namespace App\Http\Controllers;

use App\Models\UserSignup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    /**
     * Check if user is logged in
     */
    private function checkAuth()
    {
        if (!session()->has('user_signup_id')) {
            return false;
        }
        return true;
    }

    /**
     * Get current logged-in user
     */
    private function getAuthUser()
    {
        $userId = session()->get('user_signup_id');
        if (!$userId) {
            return null;
        }
        return UserSignup::find($userId);
    }

    /**
     * Show user profile page
     */
    public function show()
    {
        if (!$this->checkAuth()) {
            return redirect('/login');
        }

        $user = $this->getAuthUser();
        return view('profile', ['user' => $user]);
    }

    /**
     * Show edit profile page
     */
    public function edit()
    {
        if (!$this->checkAuth()) {
            return redirect('/login');
        }

        $user = $this->getAuthUser();
        return view('edit-profile', ['user' => $user]);
    }

    /**
     * Get user profile data via API
     */
    public function getProfile()
    {
        if (!$this->checkAuth()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = $this->getAuthUser();
        return response()->json($user);
    }

    /**
     * Update user profile
     */
    public function update(Request $request)
    {
        if (!$this->checkAuth()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = $this->getAuthUser();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:user_signups,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        // Update basic info
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->phone = $validated['phone'] ?? $user->phone;
        $user->address = $validated['address'] ?? $user->address;

        // Update password if provided
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        // Update session
        session()->put('user_signup_name', $user->name);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->session()->flush();
        return redirect('/')->with('success', 'Logged out successfully.');
    }
}
