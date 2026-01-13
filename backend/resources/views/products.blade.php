<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale-1.0">
    <title>Our Teas - Nandana Tea</title>
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
            <!-- Search Button (hidden when logged in) -->
            <div class="search-cart-container">
                <input type="text" id="product-search" placeholder="Search products..." class="search-bar" aria-label="Search products" />
                <button id="search-btn" class="icon-btn" type="button" onclick="toggleSearch()">
                <i class="fa-solid fa-magnifying-glass"></i>
                </button>
            </div>
        @endif
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
        <script>
            function toggleSearch() {
                const searchBar = document.getElementById('product-search');
                if (searchBar.style.display === 'none' || searchBar.style.display === '') {
                    searchBar.style.display = 'block';
                    searchBar.focus();
                } else {
                    searchBar.style.display = 'none';
                    searchBar.value = '';
                    filterProducts('');
                }
            }

            function filterProducts(query) {
                const q = (query || '').trim().toLowerCase();
                const cards = document.querySelectorAll('.product-card');
                let anyVisible = false;
                cards.forEach(card => {
                    const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                    const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
                    const price = card.querySelector('.price')?.textContent.toLowerCase() || '';
                    const matches = q === '' || title.includes(q) || desc.includes(q) || price.includes(q);
                    card.style.display = matches ? '' : 'none';
                    if (matches) anyVisible = true;
                });
                const noResults = document.getElementById('no-results');
                if (noResults) {
                    noResults.style.display = anyVisible ? 'none' : 'block';
                }
            }

            document.addEventListener('DOMContentLoaded', () => {
                const searchBar = document.getElementById('product-search');
                searchBar.addEventListener('input', (e) => filterProducts(e.target.value));
                searchBar.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') toggleSearch();
                });
            });
        </script>
    </div>

        <div class="hamburger-menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </div>
    </header>

    <main class="container">
        <section class="page-header">
            <h1>Our Teas</h1>
        </section>

        <div class="product-controls">
            <a href="#" class="btn active">Retail</a>
            <a href="{{ url('/wholesale') }}" class="btn">Wholesale</a>
        </div>
        
        <div class="product-grid" id="product-grid"></div>
        <div id="product-loading" style="padding:20px;text-align:center;color:#555;">Loading products...</div>
        <div id="no-results" style="display:none;padding:20px;text-align:center;color:#555;">No matching products found.</div>
    </main>

    @include('partials.footer')
    <script src="{{ asset('js/main.js') }}"></script>

    <script>
        const placeholderImage = 'https://via.placeholder.com/240x180?text=Tea';

        function resolveImage(path) {
            if (!path) return placeholderImage;
            if (path.startsWith('http')) return path;
            return `/${path.replace(/^\//, '')}`;
        }

        function formatPrice(value) {
            const num = Number(value) || 0;
            return `Rs. ${num.toFixed(2)}`;
        }

        function renderProducts(products) {
            const grid = document.getElementById('product-grid');
            const loading = document.getElementById('product-loading');
            const noResults = document.getElementById('no-results');
            if (!grid || !loading || !noResults) return;

            loading.style.display = 'none';

            if (!products.length) {
                grid.innerHTML = '';
                noResults.style.display = 'block';
                return;
            }

            noResults.style.display = 'none';
            grid.innerHTML = products.map(p => `
                <div class="product-card" data-name="${(p.name || '').toLowerCase()}" data-desc="${(p.description || '').toLowerCase()}">
                    <img src="${resolveImage(p.image)}" alt="${p.name || 'Tea'}">
                    <h3>${p.name || 'Tea'}</h3>
                    <p>${p.description || ''}</p>
                    <div class="price">${formatPrice(p.price)}</div>
                    <a href="{{ url('/product') }}?id=${encodeURIComponent(p.slug)}">View More</a>
                </div>
            `).join('');
        }

        function filterProducts(query) {
            const q = (query || '').trim().toLowerCase();
            const cards = document.querySelectorAll('.product-card');
            let anyVisible = false;
            cards.forEach(card => {
                const name = card.getAttribute('data-name') || '';
                const desc = card.getAttribute('data-desc') || '';
                const matches = q === '' || name.includes(q) || desc.includes(q);
                card.style.display = matches ? '' : 'none';
                if (matches) anyVisible = true;
            });
            const noResults = document.getElementById('no-results');
            if (noResults) {
                noResults.style.display = anyVisible ? 'none' : 'block';
            }
        }

        async function loadProducts() {
            const loading = document.getElementById('product-loading');
            if (loading) loading.style.display = 'block';
            try {
                const res = await fetch('/api/products');
                if (!res.ok) throw new Error('Failed to load products');
                const data = await res.json();
                renderProducts(data || []);
                filterProducts(document.getElementById('product-search')?.value || '');
            } catch (err) {
                console.error(err);
                if (loading) loading.textContent = 'Unable to load products right now.';
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            loadProducts();
            const searchBar = document.getElementById('product-search');
            if (searchBar) {
                searchBar.addEventListener('input', (e) => filterProducts(e.target.value));
            }
        });
    </script>
</body>
</html>