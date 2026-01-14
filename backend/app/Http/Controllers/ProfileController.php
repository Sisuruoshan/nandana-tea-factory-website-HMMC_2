<?php

namespace App\Http\Controllers;

use App\Models\UserSignup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

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
            'current_password' => 'nullable|string',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        // If password change is requested, verify current password
        if (!empty($validated['password'])) {
            if (empty($validated['current_password'])) {
                return response()->json(
                    ['message' => 'Current password is required to change your password', 'errors' => ['current_password' => 'Current password is required']],
                    422
                );
            }

            if (!Hash::check($validated['current_password'], $user->password)) {
                return response()->json(
                    ['message' => 'Current password is incorrect', 'errors' => ['current_password' => 'Current password does not match']],
                    422
                );
            }
        }

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
     * Upload user avatar
     */
    public function uploadAvatar(Request $request)
    {
        if (!$this->checkAuth()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
        ]);

        $user = $this->getAuthUser();

        // Delete old avatar if exists
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        // Store new avatar
        $path = $request->file('avatar')->store('avatars', 'public');
        
        $user->avatar = $path;
        $user->save();

        return response()->json([
            'message' => 'Avatar uploaded successfully',
            'avatar_url' => Storage::url($path)
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
