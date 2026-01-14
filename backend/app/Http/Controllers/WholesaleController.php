<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WholesaleInquiry;

class WholesaleController extends Controller
{
    public function storeInquiry(Request $request)
    {
        $validated = $request->validate([
            'ws-name' => 'required|string|max:255',
            'ws-company' => 'required|string|max:255',
            'ws-email' => 'required|email|max:255',
            'ws-details' => 'required|string',
        ]);

        WholesaleInquiry::create([
            'name' => $validated['ws-name'],
            'company' => $validated['ws-company'],
            'email' => $validated['ws-email'],
            'details' => $validated['ws-details'],
        ]);

        // JSON for API/AJAX, redirect with flash for normal form
        if ($request->expectsJson() || $request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Inquiry submitted! We will contact you soon.'
            ]);
        }

        return back()->with('status', 'Wholesale inquiry submitted! We will contact you soon.');
    }

    public function storeSignup(Request $request)
    {
        $validated = $request->validate([
            'ws-signup-company' => 'required|string|max:255',
            'ws-signup-name' => 'required|string|max:255',
            'ws-signup-email' => 'required|email|unique:wholesale_inquiries,email',
            'ws-signup-phone' => 'nullable|string',
            'ws-signup-address' => 'nullable|string',
            'ws-signup-password' => 'required|string|min:6',
        ]);

        // Store as a wholesale inquiry with signup status
        WholesaleInquiry::create([
            'company' => $validated['ws-signup-company'],
            'name' => $validated['ws-signup-name'],
            'email' => $validated['ws-signup-email'],
            'phone' => $validated['ws-signup-phone'],
            'address' => $validated['ws-signup-address'],
            'details' => 'Wholesale Account Signup',
            'status' => 'new',
        ]);

        // JSON for API/AJAX, redirect with flash for normal form
        if ($request->expectsJson() || $request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Signup successful! An admin will review your application.'
            ]);
        }

        return back()->with('status', 'Signup submitted! An admin will review your application.');
    }
}
