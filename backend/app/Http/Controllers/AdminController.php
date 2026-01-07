<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use App\Models\WholesaleInquiry;
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
}
