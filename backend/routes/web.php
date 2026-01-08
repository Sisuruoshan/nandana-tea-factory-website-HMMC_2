<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\SignupController;
use App\Http\Controllers\WholesaleController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return view('index');
});

Route::get('/products', function () {
    return view('products');
});

Route::get('/about', function () {
    return view('about');
});

Route::get('/contact', function () {
    return view('contact');
});

Route::post('/contact', [ContactController::class, 'store']);

Route::get('/privacy', function () {
    return view('privacy');
});

Route::get('/terms', function () {
    return view('terms');
});

Route::get('/product', function () {
    return view('product');
});

Route::get('/cart', function () {
    return view('cart');
});

Route::get('/wholesale', function () {
    return view('wholesale');
});

Route::post('/wholesale/inquiry', [WholesaleController::class, 'storeInquiry']);

Route::get('/signup', function () {
    return view('signup');
});

Route::post('/signup', [SignupController::class, 'store']);

Route::get('/login', function () {
    return view('user-login');
});

Route::post('/login', [AuthController::class, 'login']);

Route::get('/profile', function () {
    return view('profile');
});

Route::get('/admin-login', function () {
    return view('admin-login');
});

Route::get('/admin', [AdminController::class, 'index']);
Route::get('/api/inquiries', [AdminController::class, 'getInquiries']);
Route::get('/api/wholesale-inquiries', [AdminController::class, 'getWholesaleInquiries']);
Route::delete('/api/inquiries/{id}', [AdminController::class, 'deleteInquiry']);
Route::delete('/api/wholesale-inquiries/{id}', [AdminController::class, 'deleteWholesaleInquiry']);

// Wholesale Products API
Route::get('/api/wholesale-products', [AdminController::class, 'getWholesaleProducts']);
Route::post('/api/wholesale-products', [AdminController::class, 'createWholesaleProduct']);
Route::put('/api/wholesale-products/{id}', [AdminController::class, 'updateWholesaleProduct']);
Route::delete('/api/wholesale-products/{id}', [AdminController::class, 'deleteWholesaleProduct']);

// Retail Products API
Route::get('/api/products', [AdminController::class, 'getProducts']);
Route::post('/api/products', [AdminController::class, 'createProduct']);
Route::put('/api/products/{id}', [AdminController::class, 'updateProduct']);
Route::delete('/api/products/{id}', [AdminController::class, 'deleteProduct']);

Route::get('/wholesale-signup', function () {
    return view('wholesale-signup');
});

Route::post('/wholesale-signup', [WholesaleController::class, 'storeSignup']);

