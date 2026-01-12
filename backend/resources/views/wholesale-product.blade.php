<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wholesale Product Details - Nandana Tea</title>
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
        <div class="header-icons">
            <a href="{{ url('/cart') }}"><i class="fa-solid fa-cart-shopping"></i> Cart</a>
            <a href="#"><i class="fa-solid fa-magnifying-glass"></i></a>
        </div>
        <div class="hamburger-menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </div>
    </header>

    <main class="container">
        <section class="page-header">
            <h1 id="pd-name">Wholesale Product Details</h1>
            <p id="pd-subtitle">Exclusive wholesale pricing.</p>
        </section>

        <section class="product-detail">
            <div class="pd-image-wrap">
                <img id="pd-image" src="" alt="Product image">
            </div>
            <div class="pd-info">
                <h2 id="pd-title">Tea Name</h2>
                <p id="pd-desc" class="pd-desc">Description</p>
                <div class="pd-price">
                    <span style="color: var(--text-medium);">Retail: <span id="pd-price-retail">$0.00</span></span>
                    <br>
                    <span style="font-size: 1.5rem; color: var(--accent-mint-green); font-weight: 700;">Wholesale: <span id="pd-price-wholesale">$0.00</span></span>
                </div>
                <p style="color: var(--text-medium); margin-top: 0.5rem;">Stock: <span id="pd-stock">0</span> units</p>

                <div class="pd-actions">
                    <label for="pd-qty">Quantity</label>
                    <input id="pd-qty" type="number" min="1" value="10">
                    <button id="pd-add" class="btn btn-primary"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
                    <button id="pd-inquiry" class="btn btn-secondary"><i class="fa-solid fa-envelope"></i> Send Inquiry</button>
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

    @include('partials.footer')
    <script src="{{ asset('js/main.js') }}"></script>

    <script>
    const placeholderImage = 'https://via.placeholder.com/400x320?text=Tea';
    const contactUrl = "{{ url('/contact') }}";

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
        return `$${num.toFixed(2)}`;
    }

    function renderBrewSteps(value) {
        const steps = (value || '')
            .split(/\r?\n/)
            .map(s => s.trim())
            .filter(Boolean);
        return steps.map(step => `<li>${step}</li>`).join('');
    }

    function renderProduct(product) {
        document.getElementById('pd-name').textContent = product.name || 'Wholesale Product Details';
        document.getElementById('pd-title').textContent = product.name || '';
        document.getElementById('pd-desc').textContent = product.description || '';
        document.getElementById('pd-price-retail').textContent = formatPrice(product.price);
        document.getElementById('pd-price-wholesale').textContent = formatPrice(product.wholesale_price || product.price);
        document.getElementById('pd-stock').textContent = product.stock || 0;

        const img = document.getElementById('pd-image');
        img.src = resolveImage(product.image);
        img.alt = product.name || 'Tea';

        document.getElementById('pd-origin').textContent = product.origin || '';
        document.getElementById('pd-notes').textContent = product.notes || '';
        document.getElementById('pd-long').textContent = product.long_description || '';
        document.getElementById('pd-brew').innerHTML = renderBrewSteps(product.brewing_guide);

        const qtyInput = document.getElementById('pd-qty');
        document.getElementById('pd-add').onclick = () => {
            const qty = Math.max(1, parseInt(qtyInput.value || '1', 10));
            const item = { 
                id: product.id, 
                slug: product.slug, 
                name: product.name, 
                price: Number(product.wholesale_price || product.price), 
                qty,
                isWholesale: true
            };
            const cart = JSON.parse(localStorage.getItem('wholesaleCart') || '[]');
            const existing = cart.find(c => c.id === item.id);
            if (existing) { existing.qty += qty; } else { cart.push(item); }
            localStorage.setItem('wholesaleCart', JSON.stringify(cart));
            alert(`${product.name || 'Product'} added to wholesale cart (x${qty}).`);
        };

        document.getElementById('pd-inquiry').onclick = () => {
            const qty = Math.max(1, parseInt(qtyInput.value || '1', 10));
            const params = new URLSearchParams({ product: product.slug || product.id, qty: String(qty), type: 'wholesale' });
            window.location.href = `${contactUrl}?${params.toString()}`;
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
            const res = await fetch(`/api/wholesale-products/slug/${encodeURIComponent(slug)}`);
            if (!res.ok) throw new Error('Not found');
            const product = await res.json();
            renderProduct(product);
            subtitle.textContent = 'Exclusive wholesale pricing.';
        } catch (err) {
            console.error('Unable to load wholesale product', err);
            subtitle.textContent = 'Product not found. Please return to the wholesale page.';
            document.querySelector('.product-detail').innerHTML = '<p style="padding:1rem;">This wholesale product is unavailable.</p>';
        }
    }

    document.addEventListener('DOMContentLoaded', loadProduct);
    </script>
</body>
</html>
