<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use App\Models\WholesaleInquiry;
use App\Models\Product;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        $inquiries = Inquiry::latest()->get();
        $wholesaleInquiries = WholesaleInquiry::latest()->get();
        
        return view('admin', [
            'inquiries' => $inquiries,
            'wholesaleInquiries' => $wholesaleInquiries
        ]);
    }

    public function getInquiries()
    {
        $inquiries = Inquiry::latest()->get();
        return response()->json($inquiries);
    }

    public function getWholesaleInquiries()
    {
        $wholesaleInquiries = WholesaleInquiry::latest()->get();
        return response()->json($wholesaleInquiries);
    }

    public function deleteInquiry($id)
    {
        Inquiry::findOrFail($id)->delete();
        return response()->json(['message' => 'Inquiry deleted']);
    }

    public function deleteWholesaleInquiry($id)
    {
        WholesaleInquiry::findOrFail($id)->delete();
        return response()->json(['message' => 'Wholesale inquiry deleted']);
    }

    // Wholesale Products Management
    public function getWholesaleProducts()
    {
        $products = Product::where('is_wholesale', true)->get();
        return response()->json($products);
    }

    public function createWholesaleProduct(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'slug' => 'required|string|unique:products',
            'price' => 'required|numeric|min:0',
            'wholesale_price' => 'required|numeric|min:0',
            'image' => 'nullable|string',
            'stock' => 'nullable|integer|min:0',
        ]);

        $validated['is_wholesale'] = true;
        $validated['stock'] = $validated['stock'] ?? 0;

        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    public function updateWholesaleProduct(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'slug' => 'sometimes|required|string|unique:products,slug,' . $id,
            'price' => 'sometimes|required|numeric|min:0',
            'wholesale_price' => 'sometimes|required|numeric|min:0',
            'image' => 'nullable|string',
            'stock' => 'nullable|integer|min:0',
        ]);

        $product->update($validated);
        return response()->json($product);
    }

    public function deleteWholesaleProduct($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Wholesale product deleted']);
    }

    // Retail Products Management
    public function getProducts()
    {
        $products = Product::where('is_wholesale', false)->orWhereNull('is_wholesale')->get();
        return response()->json($products);
    }

    public function createProduct(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'slug' => 'required|string|unique:products',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|string',
            'origin' => 'nullable|string',
            'notes' => 'nullable|string',
            'brewing_guide' => 'nullable|string',
            'long_description' => 'nullable|string',
            'stock' => 'nullable|integer|min:0',
        ]);

        $validated['is_wholesale'] = false;
        $validated['stock'] = $validated['stock'] ?? 0;

        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    public function updateProduct(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'slug' => 'sometimes|required|string|unique:products,slug,' . $id,
            'price' => 'sometimes|required|numeric|min:0',
            'image' => 'nullable|string',
            'origin' => 'nullable|string',
            'notes' => 'nullable|string',
            'brewing_guide' => 'nullable|string',
            'long_description' => 'nullable|string',
            'stock' => 'nullable|integer|min:0',
        ]);

        $product->update($validated);
        return response()->json($product);
    }

    public function deleteProduct($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }
}
