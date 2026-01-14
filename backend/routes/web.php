<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\SignupController;
use App\Http\Controllers\WholesaleController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\PaymentController;

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

Route::get('/wholesale-product', function () {
    return view('wholesale-product');
});

// Cart routes - require authentication
Route::middleware(['user.session'])->group(function () {
    Route::get('/cart', [CartController::class, 'index'])->name('cart');
    Route::post('/api/cart/add', [CartController::class, 'addToCart']);
    Route::put('/api/cart/items/{itemId}', [CartController::class, 'updateQuantity']);
    Route::delete('/api/cart/items/{itemId}', [CartController::class, 'removeItem']);
    Route::delete('/api/cart/clear', [CartController::class, 'clearCart']);
    Route::get('/api/cart', [CartController::class, 'getCartData']);
});

// Payment routes - require authentication
Route::middleware(['user.session'])->group(function () {
    Route::get('/payment', [PaymentController::class, 'index'])->name('payment');
});

Route::get('/wholesale', function () {
    return view('wholesale');
});

Route::post('/wholesale/inquiry', [WholesaleController::class, 'storeInquiry']);

Route::get('/signup', function () {
    return view('signup');
});

Route::post('/signup', [SignupController::class, 'store']);

Route::get('/login', [AuthController::class, 'showLoginForm']);

Route::post('/login', [AuthController::class, 'login']);

// Profile routes
Route::get('/profile', [ProfileController::class, 'show'])->name('profile');
Route::get('/edit-profile', [ProfileController::class, 'edit'])->name('edit-profile');
Route::get('/api/profile', [ProfileController::class, 'getProfile']);
Route::post('/api/profile/update', [ProfileController::class, 'update']);
Route::post('/api/profile/upload-avatar', [ProfileController::class, 'uploadAvatar']);
Route::post('/logout', [ProfileController::class, 'logout'])->name('logout');

Route::get('/admin-login', function () {
    return view('admin-login');
});

Route::get('/admin', [AdminController::class, 'index']);
Route::get('/api/inquiries', [AdminController::class, 'getInquiries']);
Route::get('/api/wholesale-inquiries', [AdminController::class, 'getWholesaleInquiries']);
Route::delete('/api/inquiries/{id}', [AdminController::class, 'deleteInquiry']);
Route::delete('/api/wholesale-inquiries/{id}', [AdminController::class, 'deleteWholesaleInquiry']);
Route::post('/api/inquiries/{id}/reply', [AdminController::class, 'replyToInquiry']);
Route::post('/api/wholesale-inquiries/{id}/reply', [AdminController::class, 'replyToWholesaleInquiry']);

// Wholesale Products API
Route::get('/api/wholesale-products', [AdminController::class, 'getWholesaleProducts']);
Route::get('/api/wholesale-products/slug/{slug}', [AdminController::class, 'getWholesaleProductBySlug']);
Route::post('/api/wholesale-products', [AdminController::class, 'createWholesaleProduct']);
Route::put('/api/wholesale-products/{id}', [AdminController::class, 'updateWholesaleProduct']);
Route::delete('/api/wholesale-products/{id}', [AdminController::class, 'deleteWholesaleProduct']);

// Retail Products API
Route::get('/api/products', [AdminController::class, 'getProducts']);
Route::get('/api/products/slug/{slug}', [AdminController::class, 'getProductBySlug']);
Route::post('/api/products', [AdminController::class, 'createProduct']);
Route::put('/api/products/{id}', [AdminController::class, 'updateProduct']);
Route::delete('/api/products/{id}', [AdminController::class, 'deleteProduct']);
Route::post('/api/products/upload-image', [AdminController::class, 'uploadProductImage']);

Route::get('/wholesale-signup', function () {
    return view('wholesale-signup');
});

Route::post('/wholesale-signup', [WholesaleController::class, 'storeSignup']);

