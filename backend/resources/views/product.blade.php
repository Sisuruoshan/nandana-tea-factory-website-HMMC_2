<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Product Details - Nandana Tea</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        .alert-container {
            position: fixed;
            top: 6rem;
            right: 2rem;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-width: 400px;
        }

        .alert {
            padding: 1.25rem 1.5rem;
            border-radius: 12px;
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
            backdrop-filter: blur(10px);
        }

        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .alert-success {
            background: rgba(40, 167, 69, 0.95);
            border: 1px solid #28a745;
            color: white;
        }

        .alert-error {
            background: rgba(220, 53, 69, 0.95);
            border: 1px solid #dc3545;
            color: white;
        }

        .alert-info {
            background: rgba(23, 162, 184, 0.95);
            border: 1px solid #17a2b8;
            color: white;
        }

        .alert-warning {
            background: rgba(73, 202, 125, 0.95);
            border: 1px solid #49ca7d;
            color: white;
        }

        .alert-icon {
            font-size: 1.3rem;
            min-width: 24px;
        }

        .alert-content {
            flex: 1;
            font-size: 0.95rem;
            line-height: 1.5;
        }

        .alert-close {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            font-size: 1.2rem;
            opacity: 0.8;
            padding: 0;
            transition: opacity 0.3s ease;
        }

        .alert-close:hover {
            opacity: 1;
        }

        .alert-actions {
            display: flex;
            gap: 0.75rem;
            margin-top: 1rem;
            flex-wrap: wrap;
        }

        .alert-btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.3s ease;
            flex: 1;
            min-width: 100px;
        }

        .alert-btn-primary {
            background: rgba(12, 46, 25, 0.8);
            color: white;
            border: 1px solid rgba(12, 46, 25, 0.9);
        }

        .alert-btn-primary:hover {
            background: rgba(12, 46, 25, 1);
            border-color: rgba(73, 202, 125, 0.8);
        }

        .alert-btn-secondary {
            background: transparent;
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.4);
        }

        .alert-btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.6);
        }

        .alert-content-wrapper {
            flex: 1;
        }

        @media (max-width: 768px) {
            .alert-container {
                top: 5rem;
                right: 1rem;
                left: 1rem;
                max-width: none;
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

    <!-- Alert Container -->
    <div class="alert-container" id="alert-container"></div>

    <main class="container">
        <section class="page-header">
            <h1 id="pd-name">Product Details</h1>
            <p id="pd-subtitle">Explore the flavors of Nandana Tea.</p>
        </section>

        <section class="product-detail">
            <div class="pd-image-wrap">
                <img id="pd-image" src="" alt="Product image">
            </div>
            <div class="pd-info">
                <h2 id="pd-title">Tea Name</h2>
                <p id="pd-desc" class="pd-desc">Description</p>
                <div class="pd-price" id="pd-price">$0.00</div>

                <div class="pd-actions">
                    <label for="pd-qty">Quantity</label>
                    <input id="pd-qty" type="number" min="1" value="1">
                    <button id="pd-add" class="btn btn-primary"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
                    <button id="pd-order" class="btn btn-secondary"><i class="fa-solid fa-credit-card"></i> Place Order</button>
                </div>
            </div>
        </section>

        <section class="product-explainer">
            <div class="pd-meta">
                <h3>Origin & Notes</h3>
                <p id="pd-origin"></p>
                <p id="pd-notes"></p>
            </div>
            <div class="pd-brew">
                <h3>Brewing Guide</h3>
                <ul id="pd-brew"></ul>
            </div>
            <div class="pd-long">
                <h3>About this Tea</h3>
                <p id="pd-long"></p>
            </div>
        </section>
    </main>

    <script>
    const placeholderImage = 'https://via.placeholder.com/400x320?text=Tea';
    const contactUrl = "{{ url('/contact') }}";

    // Alert notification system
    function showAlert(message, type = 'info', duration = 5000, actions = null) {
        const container = document.getElementById('alert-container');
        if (!container) return;

        const alertId = 'alert-' + Date.now();
        const iconMap = {
            'success': 'fa-circle-check',
            'error': 'fa-circle-exclamation',
            'warning': 'fa-triangle-exclamation',
            'info': 'fa-circle-info'
        };

        const actionsHtml = actions ? `
            <div class="alert-actions">
                ${actions.map(action => `
                    <button type="button" class="alert-btn ${action.class || 'alert-btn-primary'}" onclick="${action.onclick}">
                        ${action.label}
                    </button>
                `).join('')}
            </div>
        ` : '';

        const alert = document.createElement('div');
        alert.id = alertId;
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fa-solid ${iconMap[type] || iconMap.info} alert-icon"></i>
            <div class="alert-content-wrapper">
                <div class="alert-content">${message}</div>
                ${actionsHtml}
            </div>
            <button type="button" class="alert-close" onclick="document.getElementById('${alertId}').remove()">
                <i class="fa-solid fa-times"></i>
            </button>
        `;
        container.appendChild(alert);

        // Auto remove after duration (only if no actions, or if actions are provided, don't auto-remove)
        if (duration > 0 && !actions) {
            setTimeout(() => {
                const alertEl = document.getElementById(alertId);
                if (alertEl) {
                    alertEl.style.animation = 'slideIn 0.3s ease reverse';
                    setTimeout(() => alertEl.remove(), 300);
                }
            }, duration);
        }
    }

    // Function to show login required alert with action buttons
    function showLoginAlert(message) {
        const container = document.getElementById('alert-container');
        if (!container) return;

        const alertId = 'alert-' + Date.now();
        const iconMap = {
            'warning': 'fa-triangle-exclamation'
        };

        const removeAlert = () => {
            const alertEl = document.getElementById(alertId);
            if (alertEl) {
                alertEl.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => alertEl.remove(), 300);
            }
        };

        const alert = document.createElement('div');
        alert.id = alertId;
        alert.className = 'alert alert-warning';
        alert.innerHTML = `
            <i class="fa-solid ${iconMap.warning} alert-icon"></i>
            <div class="alert-content-wrapper">
                <div class="alert-content">${message}</div>
                <div class="alert-actions">
                    <button type="button" class="alert-btn alert-btn-primary" onclick="window.location.href='/login'">
                        Go to Login
                    </button>
                    <button type="button" class="alert-btn alert-btn-secondary" onclick="document.getElementById('${alertId}').remove()">
                        Cancel
                    </button>
                </div>
            </div>
            <button type="button" class="alert-close" onclick="document.getElementById('${alertId}').remove()">
                <i class="fa-solid fa-times"></i>
            </button>
        `;
        container.appendChild(alert);
    }

    function getParam(name) {
        const url = new URL(window.location.href);
        return url.searchParams.get(name);
    }

    function resolveImage(path) {
        if (!path) return placeholderImage;
        if (path.startsWith('http')) return path;
        return `/${path.replace(/^\//, '')}`;
    }

    function formatPrice(value) {
        const num = Number(value) || 0;
        return `Rs. ${num.toFixed(2)}`;
    }

    function renderBrewSteps(value) {
        const steps = (value || '')
            .split(/\r?\n/)
            .map(s => s.trim())
            .filter(Boolean);
        return steps.map(step => `<li>${step}</li>`).join('');
    }

    function renderProduct(product) {
        document.getElementById('pd-name').textContent = product.name || 'Product Details';
        document.getElementById('pd-title').textContent = product.name || '';
        document.getElementById('pd-desc').textContent = product.description || '';
        document.getElementById('pd-price').textContent = formatPrice(product.price);

        const img = document.getElementById('pd-image');
        img.src = resolveImage(product.image);
        img.alt = product.name || 'Tea';

        document.getElementById('pd-origin').textContent = product.origin || '';
        document.getElementById('pd-notes').textContent = product.notes || '';
        document.getElementById('pd-long').textContent = product.long_description || '';
        document.getElementById('pd-brew').innerHTML = renderBrewSteps(product.brewing_guide);

        const qtyInput = document.getElementById('pd-qty');
        document.getElementById('pd-add').onclick = async () => {
            const qty = Math.max(1, parseInt(qtyInput.value || '1', 10));
            
            try {
                const response = await fetch('/api/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                    },
                    body: JSON.stringify({
                        product_id: product.id,
                        quantity: qty
                    })
                });

                let data = {};
                try {
                    data = await response.json();
                } catch (e) {
                    // If response is not JSON, use empty object
                    console.error('Failed to parse JSON response:', e);
                }
                
                if (response.ok) {
                    showAlert(`${product.name || 'Product'} added to cart (x${qty}).`, 'success');
                    updateCartCount();
                } else if (response.status === 401) {
                    showLoginAlert(data.error || 'Login to add items to the cart');
                } else {
                    showAlert(data.error || 'Failed to add item to cart.', 'error');
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                showLoginAlert('Login to add items to the cart');
            }
        };

        document.getElementById('pd-order').onclick = async () => {
            const qty = Math.max(1, parseInt(qtyInput.value || '1', 10));
            
            // Check if user is logged in
            try {
                const response = await fetch('/api/cart', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                    }
                });

                if (response.status === 401) {
                    // User is not logged in
                    showLoginAlert('Login to place an order');
                    return;
                }

                // User is logged in, proceed to payment
                const params = new URLSearchParams({ 
                    product: product.slug || product.id, 
                    qty: String(qty) 
                });
                window.location.href = `/payment?${params.toString()}`;
            } catch (error) {
                console.error('Error checking login status:', error);
                showLoginAlert('Login to place an order');
            }
        };
    }

    async function loadProduct() {
        const slug = getParam('id');
        const subtitle = document.getElementById('pd-subtitle');
        if (!slug) {
            subtitle.textContent = 'No product selected.';
            return;
        }

        try {
            const res = await fetch(`/api/products/slug/${encodeURIComponent(slug)}`);
            if (!res.ok) throw new Error('Not found');
            const product = await res.json();
            renderProduct(product);
            subtitle.textContent = 'Explore the flavors of Nandana Tea.';
        } catch (err) {
            console.error('Unable to load product', err);
            subtitle.textContent = 'Product not found. Please return to the products page.';
            document.querySelector('.product-detail').innerHTML = '<p style="padding:1rem;">This product is unavailable.</p>';
        }
    }

    async function updateCartCount() {
        try {
            const res = await fetch('/api/cart');
            if (!res.ok) throw new Error('Failed to fetch cart');
            const data = await res.json();
            const items = Array.isArray(data?.items) ? data.items : [];
            // Sum up all quantities instead of just counting unique products
            const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
            const badge = document.querySelector('.cart-count');
            if (badge) badge.textContent = String(totalQuantity);
        } catch (err) {
            const badge = document.querySelector('.cart-count');
            if (badge) badge.textContent = '0';
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        loadProduct();
        updateCartCount();
    });
    </script>
    @include('partials.footer')
    <script src="{{ asset('js/main.js') }}"></script>

</body>
</html>