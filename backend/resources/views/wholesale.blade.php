@extends('layouts.app')

@section('title', 'Wholesale Portal - Nandana Tea')

@section('content')
    <section class="page-header">
        <h1>Wholesale Portal</h1>
        <p>Access exclusive pricing and bulk ordering.</p>
    </section>
    
    <section id="login-section" class="wholesale-grid container">
        <div class="form-container">
            <h2>Login to your Account</h2>
            <form id="wholesale-login-form">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" placeholder="you@example.com">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password">
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
            </form>
        </div>
        <div style="padding-top: 3rem;">
            <h2>New Wholesale Partner?</h2>
            <p style="color:var(--text-medium); line-height: 1.8; margin: 1rem 0 2rem 0;">Register for a wholesale account to unlock benefits like tiered pricing, dedicated support, and early access to new tea collections.</p>
            <a href="{{ url('/wholesale-signup') }}" class="btn btn-primary">Create an Account</a>
        </div>
    </section>

    <section id="wholesale-products-section" style="display:none; margin-top: 2rem;" class="container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h2>Wholesale Products</h2>
            <button id="logout-btn" class="btn btn-secondary">Logout</button>
        </div>
        <div class="product-controls">
            <a href="#" class="btn active">Wholesale</a>
            <a href="{{ url('/products') }}" class="btn">Retail</a>
        </div>
        <div class="product-grid" id="wholesale-products-grid"></div>
    </section>

    <section class="form-container container" style="margin-top: 4rem; max-width: none;">
        <h2 style="text-align: center;">Specific Wholesale Inquiry</h2>
        <form id="wholesale-inquiry-form" novalidate>
            <div class="form-group">
                <label for="ws-name">Your Name</label>
                <input type="text" id="ws-name" required>
            </div>
            <div class="form-group">
                <label for="ws-company">Company Name</label>
                <input type="text" id="ws-company" required>
            </div>
            <div class="form-group">
                <label for="ws-email">Your Email</label>
                <input type="email" id="ws-email" required>
            </div>
            <div class="form-group">
                <label for="ws-details">Inquiry Details</label>
                <textarea id="ws-details" rows="5" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Inquiry</button>
        </form>
    </section>

@endsection

@push('scripts')
<script src="{{ asset('js/validation.js') }}"></script>
@endpush
