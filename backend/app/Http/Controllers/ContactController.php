<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inquiry;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        // Save to database
        Inquiry::create($validated);

        // Return success: JSON for API/AJAX, redirect with flash for normal form
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Inquiry submitted! We will contact you soon.'
            ]);
        }

        return back()->with('status', 'Inquiry submitted! We will contact you soon.');
    }
}
