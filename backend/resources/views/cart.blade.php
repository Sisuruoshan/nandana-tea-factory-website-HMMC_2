<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Shopping Cart - Nandana Tea</title>
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
        .page-header {
            margin-bottom: 2rem;
        }
        .page-header h1 {
            font-family: var(--font-heading);
            font-size: 2.5rem;
            color: var(--text-light);
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        .page-header p {
            color: var(--text-medium);
            font-size: 1rem;
        }
        
        /* Cart Layout */
        .cart-wrapper {
            display: grid;
            grid-template-columns: 1fr 380px;
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .cart-items-section {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .cart-item-card {
            display: grid;
            grid-template-columns: 100px 1fr 120px 120px 60px;
            gap: 1.5rem;
            align-items: center;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 1.5rem;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .cart-item-card:hover {
            background: rgba(73, 202, 125, 0.08);
            border-color: var(--accent-mint-green);
            transform: translateX(4px);
        }
        
        .cart-item-image {
            width: 100px;
            height: 100px;
            background: rgba(73, 202, 125, 0.1);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            flex-shrink: 0;
        }
        
        .cart-item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .cart-item-image i {
            font-size: 2rem;
            color: var(--accent-mint-green);
        }
        
        .cart-item-details h3 {
            font-family: var(--font-heading);
            font-size: 1.1rem;
            color: var(--text-light);
            margin-bottom: 0.25rem;
        }
        
        .cart-item-details p {
            color: var(--text-medium);
            font-size: 0.9rem;
        }
        
        .cart-item-price {
            font-family: var(--font-heading);
            font-size: 1.25rem;
            color: var(--accent-mint-green);
            font-weight: 700;
            text-align: center;
        }
        
        .cart-item-quantity {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            background: rgba(73, 202, 125, 0.1);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 0.5rem;
        }
        
        .qty-btn {
            background: transparent;
            border: none;
            color: var(--accent-mint-green);
            cursor: pointer;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            font-size: 0.9rem;
            transition: all 0.2s;
        }
        
        .qty-btn:hover {
            background: var(--accent-mint-green);
            color: var(--primary-dark-green);
        }
        
        .cart-qty-input {
            width: 40px;
            text-align: center;
            background: transparent;
            border: none;
            color: var(--text-light);
            font-weight: 600;
        }
        
        .cart-qty-input:focus {
            outline: none;
        }
        
        .cart-item-total {
            font-family: var(--font-heading);
            font-size: 1.25rem;
            color: var(--accent-mint-green);
            font-weight: 700;
            text-align: center;
        }
        
        .cart-item-remove {
            background: transparent;
            border: none;
            color: var(--error-color);
            cursor: pointer;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            transition: all 0.2s;
            font-size: 1.1rem;
        }
        
        .cart-item-remove:hover {
            background: var(--error-color);
            color: white;
            transform: scale(1.1);
        }
        
        /* Cart Summary */
        .cart-summary-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 1.5rem;
            backdrop-filter: blur(10px);
            height: fit-content;
            position: sticky;
            top: 7rem;
        }
        
        .summary-header {
            font-family: var(--font-heading);
            font-size: 1.3rem;
            color: var(--text-light);
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border-color);
        }
        
        .summary-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            color: var(--text-medium);
            font-size: 0.95rem;
        }
        
        .summary-row.total {
            background: linear-gradient(135deg, rgba(73, 202, 125, 0.15) 0%, rgba(73, 202, 125, 0.05) 100%);
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            border: 1px solid var(--accent-mint-green);
        }
        
        .summary-row.total .label {
            color: var(--text-light);
            font-weight: 700;
            font-family: var(--font-heading);
        }
        
        .summary-row.total .value {
            font-family: var(--font-heading);
            font-size: 1.5rem;
            color: var(--accent-mint-green);
            font-weight: 700;
        }
        
        .summary-row .label {
            color: var(--text-medium);
        }
        
        .summary-row .value {
            color: var(--text-light);
            font-weight: 500;
        }
        
        .cart-actions {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin-top: 1.5rem;
        }
        
        .btn-checkout {
            background: linear-gradient(135deg, var(--accent-mint-green) 0%, #3ab366 100%);
            color: var(--primary-dark-green);
            border: none;
            padding: 0.875rem 1.5rem;
            border-radius: 8px;
            font-weight: 700;
            font-family: var(--font-body);
            cursor: pointer;
            transition: all 0.3s;
            font-size: 0.95rem;
        }
        
        .btn-checkout:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(73, 202, 125, 0.3);
        }
        
        .btn-clear {
            background: transparent;
            color: var(--text-medium);
            border: 1px solid var(--border-color);
            padding: 0.875rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            font-family: var(--font-body);
            cursor: pointer;
            transition: all 0.3s;
            font-size: 0.95rem;
        }
        
        .btn-clear:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: var(--text-medium);
            color: var(--text-light);
        }
        
        /* Empty Cart State */
        .empty-cart-state {
            text-align: center;
            padding: 3rem 2rem;
            display: none;
        }
        
        .empty-cart-icon {
            font-size: 4rem;
            color: var(--accent-mint-green);
            margin-bottom: 1rem;
            opacity: 0.6;
        }
        
        .empty-cart-title {
            font-family: var(--font-heading);
            font-size: 1.8rem;
            color: var(--text-light);
            margin-bottom: 0.5rem;
        }
        
        .empty-cart-text {
            color: var(--text-medium);
            margin-bottom: 2rem;
            font-size: 1rem;
        }
        
        .continue-shopping {
            display: inline-block;
            background: linear-gradient(135deg, var(--accent-mint-green) 0%, #3ab366 100%);
            color: var(--primary-dark-green);
            padding: 0.875rem 2rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 700;
            transition: all 0.3s;
        }
        
        .continue-shopping:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(73, 202, 125, 0.3);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            main {
                padding-top: 5rem;
            }
            .page-header h1 {
                font-size: 1.8rem;
            }
            .cart-wrapper {
                grid-template-columns: 1fr;
            }
            .cart-summary-card {
                position: static;
                top: auto;
            }
            .cart-item-card {
                grid-template-columns: 80px 1fr 50px;
                gap: 1rem;
                padding: 1rem;
            }
            .cart-item-image {
                width: 80px;
                height: 80px;
            }
            .cart-item-price,
            .cart-item-total {
                display: none;
            }
            .cart-item-details h3 {
                font-size: 1rem;
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
            if (!$currentUser && auth()->check()) {
                $currentUser = auth()->user();
            }
        @endphp
        <div class="header-icons" style="display:flex;align-items:center;gap:12px;">
            @if($currentUser)
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
            <h1><i class="fa-solid fa-shopping-bag" style="margin-right: 0.5rem; color: var(--accent-mint-green);"></i>Your Shopping Cart</h1>
            <p id="cart-count-info" style="color: var(--text-medium);"></p>
        </section>

        <div id="cart-container">
            <div class="cart-wrapper">
                <div class="cart-items-section">
                    <div id="cart-items">
                        <!-- Cart items will be rendered here -->
                    </div>
                    <div id="cart-empty" class="empty-cart-state">
                        <div class="empty-cart-icon">
                            <i class="fa-solid fa-shopping-cart"></i>
                        </div>
                        <h2 class="empty-cart-title">Your Cart is Empty</h2>
                        <p class="empty-cart-text">Looks like you haven't added any items yet. Explore our premium tea collection.</p>
                        <a href="{{ url('/products') }}" class="continue-shopping">
                            <i class="fa-solid fa-arrow-left" style="margin-right: 0.5rem;"></i>Continue Shopping
                        </a>
                    </div>
                </div>

                <div class="cart-summary-card" id="cart-summary" style="display:none;">
                    <div class="summary-header">Order Summary</div>
                    
                    <div class="summary-row">
                        <span class="label">Subtotal</span>
                        <span class="value" id="cart-subtotal">Rs. 0.00</span>
                    </div>
                    <div class="summary-row">
                        <span class="label">Shipping</span>
                        <span class="value">Calculated at checkout</span>
                    </div>
                    <div class="summary-row">
                        <span class="label">Taxes</span>
                        <span class="value">Calculated at checkout</span>
                    </div>
                    
                    <div class="summary-row total">
                        <span class="label">Total</span>
                        <span class="value" id="cart-total">Rs. 0.00</span>
                    </div>
                    
                    <div class="cart-actions">
                        <button id="checkout" class="btn-checkout">
                            <i class="fa-solid fa-lock" style="margin-right: 0.5rem;"></i>Proceed to Checkout
                        </button>
                        <button id="clear-cart" class="btn-clear">
                            <i class="fa-solid fa-trash" style="margin-right: 0.5rem;"></i>Clear Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>

    @include('partials.footer')

    <script>
    function formatPrice(v){return `Rs. ${parseFloat(v||0).toFixed(2)}`;}

    // Fetch cart from backend
    async function fetchCart() {
        try {
            const response = await fetch('/api/cart');
            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = '/login';
                    return null;
                }
                throw new Error('Failed to fetch cart');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching cart:', error);
            return null;
        }
    }

    async function updateQuantity(itemId, quantity) {
        try {
            const response = await fetch(`/api/cart/items/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ quantity })
            });
            
            if (!response.ok) throw new Error('Failed to update quantity');
            return await response.json();
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Failed to update quantity. Please try again.');
            return null;
        }
    }

    async function removeItem(itemId) {
        try {
            const response = await fetch(`/api/cart/items/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });
            
            if (!response.ok) throw new Error('Failed to remove item');
            return await response.json();
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Failed to remove item. Please try again.');
            return null;
        }
    }

    async function clearCart() {
        try {
            const response = await fetch('/api/cart/clear', {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });
            
            if (!response.ok) throw new Error('Failed to clear cart');
            return await response.json();
        } catch (error) {
            console.error('Error clearing cart:', error);
            alert('Failed to clear cart. Please try again.');
            return null;
        }
    }

    async function renderCart(){
        const cartData = await fetchCart();
        
        if (!cartData) return;
        
        const items = cartData.items || [];
        const itemsContainer = document.getElementById('cart-items');
        const emptyEl = document.getElementById('cart-empty');
        const summaryEl = document.getElementById('cart-summary');
        const subtotalEl = document.getElementById('cart-subtotal');
        const totalEl = document.getElementById('cart-total');
        const countInfoEl = document.getElementById('cart-count-info');
        
        if (!itemsContainer) return;
        
        if (items.length === 0){
            itemsContainer.innerHTML = '';
            emptyEl.style.display = 'block';
            summaryEl.style.display = 'none';
            countInfoEl.textContent = '';
            window.updateCartCount && window.updateCartCount();
            return;
        }
        
        emptyEl.style.display = 'none';
        summaryEl.style.display = 'block';
        
        const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
        countInfoEl.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''} in cart`;
        
        itemsContainer.innerHTML = items.map((it) => `
            <div class="cart-item-card" data-id="${it.id}">
                <div class="cart-item-image">
                    ${it.product_image ? `<img src="${escapeHtml(it.product_image)}" alt="${escapeHtml(it.product_name)}">` : `<i class="fa-solid fa-leaf"></i>`}
                </div>
                <div class="cart-item-details">
                    <h3>${escapeHtml(it.product_name)}</h3>
                    <p>Premium Tea</p>
                </div>
                <div class="cart-item-price">${formatPrice(it.price)}</div>
                <div class="cart-item-quantity">
                    <button class="qty-btn qty-decrease" data-item-id="${it.id}" data-qty="${it.quantity}">
                        <i class="fa-solid fa-minus"></i>
                    </button>
                    <input type="number" min="1" value="${it.quantity}" data-item-id="${it.id}" class="cart-qty-input" readonly>
                    <button class="qty-btn qty-increase" data-item-id="${it.id}" data-qty="${it.quantity}">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
                <div class="cart-item-total">${formatPrice(it.subtotal)}</div>
                <button class="cart-item-remove" data-item-id="${it.id}" data-name="${escapeHtml(it.product_name)}" title="Remove item">
                    <i class="fa-solid fa-trash-alt"></i>
                </button>
            </div>
        `).join('');

        // Display totals
        subtotalEl.textContent = formatPrice(cartData.total);
        totalEl.textContent = formatPrice(cartData.total);

        // Wire up quantity buttons
        document.querySelectorAll('.qty-increase').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const itemId = parseInt(btn.dataset.itemId, 10);
                const currentQty = parseInt(btn.dataset.qty, 10);
                const newQty = currentQty + 1;
                
                const result = await updateQuantity(itemId, newQty);
                if (result) {
                    await renderCart();
                }
            });
        });

        document.querySelectorAll('.qty-decrease').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const itemId = parseInt(btn.dataset.itemId, 10);
                const currentQty = parseInt(btn.dataset.qty, 10);
                
                if (currentQty > 1) {
                    const newQty = currentQty - 1;
                    const result = await updateQuantity(itemId, newQty);
                    if (result) {
                        await renderCart();
                    }
                }
            });
        });

        // Wire up remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', async () => {
                const itemId = parseInt(btn.dataset.itemId, 10);
                const itemName = btn.dataset.name;
                
                if (confirm(`Remove "${itemName}" from cart?`)) {
                    const result = await removeItem(itemId);
                    if (result) {
                        await renderCart();
                    }
                }
            });
        });

        window.updateCartCount && window.updateCartCount();
    }

    function escapeHtml(str){ 
        if (!str) return ''; 
        return String(str).replace(/[&<>"']/g, function(s){
            return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s];
        }); 
    }

    document.addEventListener('DOMContentLoaded', () => {
        // Add CSRF token to meta tag if not present
        if (!document.querySelector('meta[name="csrf-token"]')) {
            const meta = document.createElement('meta');
            meta.name = 'csrf-token';
            meta.content = '{{ csrf_token() }}';
            document.head.appendChild(meta);
        }
        
        renderCart();
        
        document.getElementById('clear-cart').addEventListener('click', async () => {
            if (!confirm('Are you sure you want to clear your cart? This action cannot be undone.')) return;
            
            const result = await clearCart();
            if (result) {
                await renderCart();
            }
        });
        
        document.getElementById('checkout').addEventListener('click', async () => {
            const cartData = await fetchCart();
            
            if (!cartData || cartData.items.length === 0) {
                alert('Cart is empty');
                return;
            }
            
            window.location.href = '/payment';
        });
    });
    </script>
    <script src="{{ asset('js/main.js') }}"></script>
</body>
</html>