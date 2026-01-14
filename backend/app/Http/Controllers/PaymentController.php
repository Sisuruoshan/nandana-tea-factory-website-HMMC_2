<?php

namespace App\Http\Controllers;

use App\Models\UserSignup;
use App\Models\Product;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Display the payment page.
     */
    public function index(Request $request)
    {
        $userId = $request->session()->get('user_signup_id');
        
        if (!$userId) {
            return redirect('/login')->with('error', 'Please login to proceed with payment.');
        }

        $user = UserSignup::find($userId);
        
        // Get product details from query parameters if coming from product page
        $productId = $request->query('product');
        $quantity = $request->query('qty', 1);
        $product = null;
        
        if ($productId) {
            // Try to find by slug first, then by ID
            $product = Product::where('slug', $productId)->first();
            if (!$product) {
                $product = Product::find($productId);
            }
        }

        return view('payment', [
            'user' => $user,
            'product' => $product,
            'quantity' => $quantity
        ]);
    }
}
