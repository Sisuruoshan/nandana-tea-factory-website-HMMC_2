<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wholesale Portal - Nandana Tea</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
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
            @if(!$currentUser)
                <a href="#">Cart (0)</a>
            @endif
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
            <h1>Wholesale Portal</h1>
            <p>Access exclusive pricing and bulk ordering.</p>
        </section>
        
        <section id="login-section" class="wholesale-grid">
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

        <!-- Wholesale Products (shown after login) -->
        <section id="wholesale-products-section" style="display:none; margin-top: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h2>Wholesale Products</h2>
                <button id="logout-btn" class="btn btn-secondary">Logout</button>
            </div>
            <div class="product-controls">
                <a href="#" class="btn active">Wholesale</a>
                <a href="{{ url('/products') }}" class="btn">Retail</a>
            </div>
            <div class="product-grid" id="wholesale-products-grid"></div>
            <div id="wholesale-loading" style="padding:20px;text-align:center;color:#555;">Loading wholesale products...</div>
            <div id="wholesale-no-results" style="display:none;padding:20px;text-align:center;color:#555;">No wholesale products available.</div>
        </section>

        <section class="form-container" style="margin-top: 4rem; max-width: none;">
            <h2 style="text-align: center;">Specific Wholesale Inquiry</h2>
            @if (session('status'))
                <div style="background:#e6ffed;color:#03543f;border:1px solid #84e1bc;padding:12px;border-radius:8px;margin:16px 0;">
                    {{ session('status') }}
                </div>
            @endif
            <form id="wholesale-inquiry-form" method="POST" action="{{ url('/wholesale/inquiry') }}" novalidate>
                @csrf
                <div class="form-group">
                    <label for="ws-name">Your Name</label>
                    <input type="text" name="ws-name" required>
                </div>
                <div class="form-group">
                    <label for="ws-company">Company Name</label>
                    <input type="text" name="ws-company" required>
                </div>
                <div class="form-group">
                    <label for="ws-email">Your Email</label>
                    <input type="email" name="ws-email" required>
                </div>
                <div class="form-group">
                    <label for="ws-details">Inquiry Details</label>
                    <textarea name="ws-details" rows="5" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Inquiry</button>
            </form>
        </section>
    </main>

    @include('partials.footer')
    <script src="{{ asset('js/main.js') }}"></script>
    <script src="{{ asset('js/validation.js') }}"></script>

    <script>
        const placeholderImage = 'https://via.placeholder.com/240x180?text=Tea';

        function resolveImage(path) {
            if (!path) return placeholderImage;
            if (path.startsWith('http')) return path;
            return `/${path.replace(/^\//, '')}`;
        }

        function formatPrice(value) {
            const num = Number(value) || 0;
            return `$${num.toFixed(2)}`;
        }

        function renderWholesaleProducts(products) {
            const grid = document.getElementById('wholesale-products-grid');
            const loading = document.getElementById('wholesale-loading');
            const noResults = document.getElementById('wholesale-no-results');
            if (!grid || !loading || !noResults) return;

            loading.style.display = 'none';

            if (!products.length) {
                grid.innerHTML = '';
                noResults.style.display = 'block';
                return;
            }

            noResults.style.display = 'none';
            grid.innerHTML = products.map(p => `
                <div class="product-card">
                    <img src="${resolveImage(p.image)}" alt="${p.name || 'Tea'}">
                    <h3>${p.name || 'Tea'}</h3>
                    <p>${p.description || ''}</p>
                    <div class="price">Retail: ${formatPrice(p.price)} | Wholesale: ${formatPrice(p.wholesale_price || p.price)}</div>
                    <p style="color: var(--text-medium); font-size: 0.85rem;">Stock: ${p.stock || 0} units</p>
                    <a href="{{ url('/wholesale-product') }}?id=${encodeURIComponent(p.slug)}">View More</a>
                </div>
            `).join('');
        }

        async function loadWholesaleProducts() {
            const loading = document.getElementById('wholesale-loading');
            if (loading) loading.style.display = 'block';
            try {
                const res = await fetch('/api/wholesale-products');
                if (!res.ok) throw new Error('Failed to load wholesale products');
                const data = await res.json();
                renderWholesaleProducts(data || []);
            } catch (err) {
                console.error(err);
                if (loading) loading.textContent = 'Unable to load wholesale products right now.';
            }
        }

        // Check if user is logged in to wholesale section
        const wholesaleProductsSection = document.getElementById('wholesale-products-section');
        const loginSection = document.getElementById('login-section');
        
        // Simple check - in production, use proper session/auth
        const isWholesaleLoggedIn = localStorage.getItem('wholesaleLoggedIn') === 'true';
        
        if (isWholesaleLoggedIn && wholesaleProductsSection) {
            wholesaleProductsSection.style.display = 'block';
            if (loginSection) loginSection.style.display = 'none';
            loadWholesaleProducts();
        }

        // Handle wholesale login form
        const loginForm = document.getElementById('wholesale-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // Simple demo login - in production, validate against backend
                localStorage.setItem('wholesaleLoggedIn', 'true');
                window.location.reload();
            });
        }

        // Handle logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('wholesaleLoggedIn');
                window.location.reload();
            });
        }
    </script>
</body>
</html>
