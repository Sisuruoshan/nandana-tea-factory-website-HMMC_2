<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Payment - Nandana Tea</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        body {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        main {
            flex: 1;
            padding-top: 6rem;
            padding-bottom: 2rem;
            background: linear-gradient(135deg, var(--primary-dark-green) 0%, #051d0d 100%);
        }
        .payment-wrapper {
            display: grid;
            grid-template-columns: 1fr 400px;
            gap: 2rem;
            margin-top: 2rem;
        }
        .payment-form-section {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 2rem;
            backdrop-filter: blur(10px);
        }
        .order-summary-section {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 2rem;
            backdrop-filter: blur(10px);
            height: fit-content;
            position: sticky;
            top: 6rem;
        }
        .form-group {
            margin-bottom: 1.5rem;
        }
        .form-group label {
            display: block;
            color: var(--text-light);
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        .form-group input,
        .form-group textarea,
        .form-group select {
            width: 100%;
            padding: 0.75rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-light);
            font-family: var(--font-body);
            font-size: 1rem;
        }
        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
            outline: none;
            border-color: var(--accent-mint-green);
            background: rgba(255, 255, 255, 0.08);
        }
        .form-group textarea {
            resize: vertical;
            min-height: 100px;
        }
        .payment-methods {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        .payment-method {
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid var(--border-color);
            border-radius: 8px;
            cursor: pointer;
            text-align: center;
            transition: all 0.3s ease;
        }
        .payment-method:hover {
            border-color: var(--accent-mint-green);
            background: rgba(73, 202, 125, 0.1);
        }
        .payment-method input[type="radio"] {
            display: none;
        }
        .payment-method input[type="radio"]:checked + label {
            color: var(--accent-mint-green);
        }
        .payment-method.selected {
            border-color: var(--accent-mint-green);
            background: rgba(73, 202, 125, 0.15);
        }
        .payment-method label {
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            margin: 0;
        }
        .payment-method i {
            font-size: 1.5rem;
            color: var(--accent-mint-green);
        }
        .summary-item {
            display: flex;
            justify-content: space-between;
            padding: 0.75rem 0;
            border-bottom: 1px solid var(--border-color);
        }
        .summary-item:last-child {
            border-bottom: none;
        }
        .summary-item.total {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--accent-mint-green);
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 2px solid var(--accent-mint-green);
        }
        .product-item {
            display: flex;
            gap: 1rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 8px;
            margin-bottom: 1rem;
        }
        .product-item img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 6px;
        }
        .product-item-details {
            flex: 1;
        }
        .product-item-details h4 {
            color: var(--text-light);
            margin-bottom: 0.25rem;
        }
        .product-item-details p {
            color: var(--text-medium);
            font-size: 0.9rem;
        }
        .btn-pay {
            width: 100%;
            padding: 1rem;
            background: var(--accent-mint-green);
            color: var(--primary-dark-green);
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 1.5rem;
        }
        .btn-pay:hover {
            background: var(--accent-soft);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(73, 202, 125, 0.3);
        }
        .btn-pay:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        @media (max-width: 968px) {
            .payment-wrapper {
                grid-template-columns: 1fr;
            }
            .order-summary-section {
                position: static;
            }
        }
    </style>
</head>
<body>
    <header>
        <a href="{{ url('/') }}" class="logo"><i class="fa-solid fa-leaf"></i> Nandana Tea</a>
        <nav>
            <a href="{{ url('/') }}">Home</a>
            <a href="{{ url('/products') }}">Products</a>
            <a href="{{ url('/about') }}">About Us</a>
            <a href="{{ url('/contact') }}">Contact</a>
        </nav>
        @php
            $currentUser = null;
            if (session()->has('user_signup_id')) {
                $currentUser = \App\Models\UserSignup::find(session()->get('user_signup_id'));
            }
        @endphp
        <div class="header-icons" style="display:flex;align-items:center;gap:12px;">
            @if($currentUser)
                <a href="{{ url('/cart') }}" class="cart-icon" style="margin-right: 12px;">
                    <i class="fa-solid fa-shopping-cart"></i>
                    <span class="cart-count">0</span>
                </a>
                <div class="user-profile-dropdown">
                    <button class="avatar-btn" onclick="toggleUserMenu()" aria-label="Profile menu">
                        @if($currentUser->avatar)
                            <img src="{{ asset('storage/' . $currentUser->avatar) }}" alt="Profile Avatar" class="avatar-image">
                        @else
                            <i class="fa-solid fa-user-circle"></i>
                        @endif
                    </button>
                    <div class="user-menu" id="userMenu">
                        <a href="{{ url('/edit-profile') }}" class="user-menu-item">
                            <i class="fa-solid fa-edit"></i> Edit Profile
                        </a>
                        <form action="{{ route('logout') }}" method="POST" style="margin: 0;">
                            @csrf
                            <button type="submit" class="user-menu-item logout-btn">
                                <i class="fa-solid fa-sign-out-alt"></i> Logout
                            </button>
                        </form>
                    </div>
                </div>
            @else
                <a href="{{ url('/login') }}" title="Login"><i class="fa-solid fa-user"></i></a>
            @endif
        </div>
        <div class="hamburger-menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </div>
    </header>

    <main class="container">
        <section class="page-header">
            <h1>Payment</h1>
            <p>Complete your order securely</p>
        </section>

        <div class="payment-wrapper">
            <div class="payment-form-section">
                <h2 style="color: var(--text-light); margin-bottom: 1.5rem; font-family: var(--font-heading);">
                    <i class="fa-solid fa-credit-card" style="margin-right: 0.5rem; color: var(--accent-mint-green);"></i>
                    Payment Information
                </h2>

                <form id="payment-form">
                    <div class="form-group">
                        <label for="customer_name">Full Name *</label>
                        <input type="text" id="customer_name" name="customer_name" value="{{ $user->name ?? '' }}" required>
                    </div>

                    <div class="form-group">
                        <label for="customer_email">Email *</label>
                        <input type="email" id="customer_email" name="customer_email" value="{{ $user->email ?? '' }}" required>
                    </div>

                    <div class="form-group">
                        <label for="customer_phone">Phone Number *</label>
                        <input type="tel" id="customer_phone" name="customer_phone" value="{{ $user->phone ?? '' }}" required>
                    </div>

                    <div class="form-group">
                        <label for="shipping_address">Shipping Address *</label>
                        <textarea id="shipping_address" name="shipping_address" required placeholder="Enter your complete shipping address">{{ old('shipping_address', $user->address ?? '') }}</textarea>
                    </div>

                    <div class="form-group">
                        <label>Payment Method *</label>
                        <div class="payment-methods">
                            <div class="payment-method" onclick="selectPaymentMethod('cash')">
                                <input type="radio" name="payment_method" id="cash" value="cash" checked>
                                <label for="cash">
                                    <i class="fa-solid fa-money-bill-wave"></i>
                                    <span>Cash on Delivery</span>
                                </label>
                            </div>
                            <div class="payment-method" onclick="selectPaymentMethod('bank')">
                                <input type="radio" name="payment_method" id="bank" value="bank">
                                <label for="bank">
                                    <i class="fa-solid fa-university"></i>
                                    <span>Bank Transfer</span>
                                </label>
                            </div>
                            <div class="payment-method" onclick="selectPaymentMethod('card')">
                                <input type="radio" name="payment_method" id="card" value="card">
                                <label for="card">
                                    <i class="fa-solid fa-credit-card"></i>
                                    <span>Credit/Debit Card</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="notes">Order Notes (Optional)</label>
                        <textarea id="notes" name="notes" placeholder="Any special instructions for your order..."></textarea>
                    </div>

                    <button type="submit" class="btn-pay" id="submit-payment">
                        <i class="fa-solid fa-lock" style="margin-right: 0.5rem;"></i>
                        Complete Payment
                    </button>
                </form>
            </div>

            <div class="order-summary-section">
                <h2 style="color: var(--text-light); margin-bottom: 1.5rem; font-family: var(--font-heading);">
                    <i class="fa-solid fa-receipt" style="margin-right: 0.5rem; color: var(--accent-mint-green);"></i>
                    Order Summary
                </h2>

                @if($product)
                <div class="product-item">
                    <img src="{{ $product->image ? asset($product->image) : asset('images/default-product.jpg') }}" alt="{{ $product->name }}">
                    <div class="product-item-details">
                        <h4>{{ $product->name }}</h4>
                        <p>Quantity: {{ $quantity }}</p>
                        <p style="color: var(--accent-mint-green); font-weight: 600; margin-top: 0.5rem;">
                            Rs. {{ number_format($product->price * $quantity, 2) }}
                        </p>
                    </div>
                </div>
                @endif

                <div class="summary-item">
                    <span style="color: var(--text-medium);">Subtotal</span>
                    <span style="color: var(--text-light);" id="subtotal">
                        Rs. {{ $product ? number_format($product->price * $quantity, 2) : '0.00' }}
                    </span>
                </div>
                <div class="summary-item">
                    <span style="color: var(--text-medium);">Shipping</span>
                    <span style="color: var(--text-light);">Calculated at checkout</span>
                </div>
                <div class="summary-item">
                    <span style="color: var(--text-medium);">Taxes</span>
                    <span style="color: var(--text-light);">Calculated at checkout</span>
                </div>
                <div class="summary-item total">
                    <span>Total</span>
                    <span id="total">
                        Rs. {{ $product ? number_format($product->price * $quantity, 2) : '0.00' }}
                    </span>
                </div>
            </div>
        </div>
    </main>

    @include('partials.footer')
    <script src="{{ asset('js/main.js') }}"></script>
    <script>
        function selectPaymentMethod(method) {
            document.querySelectorAll('.payment-method').forEach(el => {
                el.classList.remove('selected');
            });
            document.getElementById(method).closest('.payment-method').classList.add('selected');
            document.getElementById(method).checked = true;
        }

        // Initialize selected payment method
        document.addEventListener('DOMContentLoaded', () => {
            selectPaymentMethod('cash');
            
            document.getElementById('payment-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitBtn = document.getElementById('submit-payment');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right: 0.5rem;"></i>Processing...';
                
                // Here you would typically send the payment data to your backend
                // For now, we'll show a success message
                setTimeout(() => {
                    alert('Order placed successfully! You will receive a confirmation email shortly.');
                    window.location.href = '/';
                }, 1500);
            });
        });
    </script>
</body>
</html>
