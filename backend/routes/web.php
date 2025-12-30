<?php

use Illuminate\Support\Facades\Route;

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

Route::get('/product', function () {
    return view('product');
});

Route::get('/cart', function () {
    return view('cart');
});

Route::get('/wholesale', function () {
    return view('wholesale');
});

Route::get('/signup', function () {
    return view('signup');
});

Route::get('/login', function () {
    return view('user-login');
});

Route::get('/profile', function () {
    return view('profile');
});

Route::get('/admin-login', function () {
    return view('admin-login');
});

Route::get('/admin', function () {
    return view('admin');
});

Route::get('/wholesale-signup', function () {
    return view('wholesale-signup');
});

