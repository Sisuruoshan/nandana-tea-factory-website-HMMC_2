<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    /**
     * Display the cart page with cart items.
     */
    public function index(Request $request)
    {
        $userId = $request->session()->get('user_signup_id');
        
        if (!$userId) {
            return redirect('/login')->with('error', 'Please login to view your cart.');
        }

        // Get or create cart for the user
        $cart = Cart::with(['items.product'])->firstOrCreate(
            ['user_id' => $userId],
            ['total_amount' => 0]
        );

        return view('cart', [
            'cart' => $cart,
            'cartItems' => $cart->items,
            'totalAmount' => $cart->total_amount
        ]);
    }

    /**
     * Add a product to the cart.
     */
    public function addToCart(Request $request)
    {
        $userId = $request->session()->get('user_signup_id');
        
        if (!$userId) {
            return response()->json(['error' => 'Please login to add items to cart.'], 401);
        }

        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        // Get or create cart
        $cart = Cart::firstOrCreate(
            ['user_id' => $userId],
            ['total_amount' => 0]
        );

        // Check if product already exists in cart
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            // Update quantity
            $cartItem->quantity += $request->quantity;
            $cartItem->updateSubtotal();
        } else {
            // Create new cart item
            $cartItem = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => $request->quantity,
                'price' => $product->price,
                'subtotal' => $product->price * $request->quantity,
            ]);
        }

        // Update cart total
        $cart->updateTotal();

        return response()->json([
            'success' => true,
            'message' => 'Product added to cart successfully.',
            'cart_count' => $cart->items()->count(),
            'cart_total' => $cart->total_amount
        ]);
    }

    /**
     * Update cart item quantity.
     */
    public function updateQuantity(Request $request, $itemId)
    {
        $userId = $request->session()->get('user_signup_id');
        
        if (!$userId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = CartItem::findOrFail($itemId);
        
        // Verify cart belongs to user
        if ($cartItem->cart->user_id != $userId) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $cartItem->quantity = $request->quantity;
        $cartItem->updateSubtotal();
        $cartItem->cart->updateTotal();

        return response()->json([
            'success' => true,
            'subtotal' => $cartItem->subtotal,
            'cart_total' => $cartItem->cart->total_amount
        ]);
    }

    /**
     * Remove item from cart.
     */
    public function removeItem(Request $request, $itemId)
    {
        $userId = $request->session()->get('user_signup_id');
        
        if (!$userId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $cartItem = CartItem::findOrFail($itemId);
        
        // Verify cart belongs to user
        if ($cartItem->cart->user_id != $userId) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $cart = $cartItem->cart;
        $cartItem->delete();
        $cart->updateTotal();

        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart.',
            'cart_total' => $cart->total_amount
        ]);
    }

    /**
     * Clear all items from cart.
     */
    public function clearCart(Request $request)
    {
        $userId = $request->session()->get('user_signup_id');
        
        if (!$userId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $cart = Cart::where('user_id', $userId)->first();
        
        if ($cart) {
            $cart->items()->delete();
            $cart->total_amount = 0;
            $cart->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared successfully.'
        ]);
    }

    /**
     * Get cart data as JSON (for AJAX requests).
     */
    public function getCartData(Request $request)
    {
        $userId = $request->session()->get('user_signup_id');
        
        if (!$userId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $cart = Cart::with(['items.product'])->where('user_id', $userId)->first();

        if (!$cart) {
            return response()->json([
                'items' => [],
                'total' => 0,
                'count' => 0
            ]);
        }

        return response()->json([
            'items' => $cart->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'product_image' => $item->product->image ?? '/images/default-product.jpg',
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'subtotal' => $item->subtotal,
                ];
            }),
            'total' => $cart->total_amount,
            'count' => $cart->items->count()
        ]);
    }
}
