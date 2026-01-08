<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use App\Models\WholesaleInquiry;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

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

    public function replyToInquiry(Request $request, $id)
    {
        $data = $request->validate([
            'reply' => 'required|string'
        ]);

        $inquiry = Inquiry::findOrFail($id);
        $inquiry->reply = $data['reply'];
        $inquiry->status = 'replied';
        $inquiry->save();

        // Try to send email; if mail config fails, we still return success.
        try {
            Mail::raw(
                "Hello {$inquiry->name},\n\n" . $data['reply'] . "\n\n--- Original Message ---\n" . $inquiry->message,
                function ($message) use ($inquiry) {
                    $message->to($inquiry->email)->subject('Re: ' . $inquiry->subject);
                }
            );
        } catch (\Throwable $e) {
            // Log but do not block the response if mailing is misconfigured.
            logger()->warning('Inquiry reply email failed', ['error' => $e->getMessage()]);
        }

        return response()->json([
            'message' => 'Reply sent and saved successfully',
            'inquiry' => $inquiry
        ]);
    }

    public function replyToWholesaleInquiry(Request $request, $id)
    {
        $data = $request->validate([
            'reply' => 'required|string'
        ]);

        $inquiry = WholesaleInquiry::findOrFail($id);
        $inquiry->reply = $data['reply'];
        $inquiry->status = 'contacted';
        $inquiry->save();

        // Try to send email; if mail config fails, we still return success.
        try {
            Mail::raw(
                "Hello {$inquiry->name},\n\n" . $data['reply'] . "\n\n--- Original Inquiry ---\nCompany: {$inquiry->company}\nDetails: {$inquiry->details}",
                function ($message) use ($inquiry) {
                    $message->to($inquiry->email)->subject('Re: Your Wholesale Inquiry');
                }
            );
        } catch (\Throwable $e) {
            // Log but do not block the response if mailing is misconfigured.
            logger()->warning('Wholesale inquiry reply email failed', ['error' => $e->getMessage()]);
        }

        return response()->json([
            'message' => 'Reply sent and saved successfully',
            'inquiry' => $inquiry
        ]);
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
