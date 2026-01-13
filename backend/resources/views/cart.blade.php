<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
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
        }
        .cart-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        .cart-table th, .cart-table td {
            border: none;
            padding: 0.75rem;
            text-align: left;
        }
        .cart-table th {
            background-color: var(--secondary-dark-green);
            color: white;
        }
        .cart-table tr {
            background-color:  var(--primary-dark-green); /* light green for all rows */
        }
        .cart-qty {
            text-align: center;
        }
        .item-total {
            font-weight: bold;
        }
        .cart-qty input {
            border: 2px solid var(--accent-mint-green);
            border-radius: 4px;
            padding: 0.25rem;
            text-align: center;
            width: 60px;
        }
        .cart-qty input:focus {
            outline: none;
            border-color: #4a9b7a;
        }
        .remove-item .fa-trash {
            color: var(--accent-mint-green);
        }
        .remove-item {
            background-color: transparent;
            border: 2px solid var(--accent-mint-green);
            color: var(--accent-mint-green);
            padding: 0.5rem;
            border-radius: 4px;
            cursor: pointer;
        }
        .remove-item:hover {
            background-color: var(--accent-mint-green);
            color: white;
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
            @if(!$currentUser)
                <a href="{{ url('/products') }}"><i class="fa-solid fa-shopping-cart"></i> Cart</a>
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
            <h1>Your Cart</h1>
        </section>

        <div id="cart-container">
            <table class="cart-table" id="cart-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="cart-items">
                    <!-- items -->
                </tbody>
            </table>

            <div id="cart-empty" style="display:none;padding:2rem;text-align:center;color:#666;">Your cart is empty.</div>

            <div class="cart-summary" id="cart-summary" style="display:none;margin-top:1rem;">
                <div class="summary-row"><strong>Subtotal:</strong> <span id="cart-subtotal">$0.00</span></div>
                <div style="margin-top:1rem;">
                    <button id="clear-cart" class="btn btn-secondary">Clear Cart</button>
                    <button id="checkout" class="btn btn-primary">Checkout</button>
                </div>
            </div>
        </div>
    </main>

    @include('partials.footer')

    <script>
    function formatPrice(v){return `Rs. ${parseFloat(v||0).toFixed(2)}`;}

    function getCart(){return JSON.parse(localStorage.getItem('cart')||'[]');}

    function renderCart(){
        const items = getCart();
        const tbody = document.getElementById('cart-items');
        const emptyEl = document.getElementById('cart-empty');
        const summaryEl = document.getElementById('cart-summary');
        const subtotalEl = document.getElementById('cart-subtotal');
        if (!tbody) return;
        if (items.length===0){
            tbody.innerHTML='';
            emptyEl.style.display='block';
            summaryEl.style.display='none';
            window.updateCartCount && window.updateCartCount();
            return;
        }
        emptyEl.style.display='none';
        summaryEl.style.display='block';
        tbody.innerHTML = items.map((it,idx)=>`
            <tr data-id="${it.id}">
                <td>${escapeHtml(it.name)}</td>
                <td>${formatPrice(it.price)}</td>
                <td><input type="number" min="1" value="${it.qty}" data-idx="${idx}" class="cart-qty" style="width:70px"></td>
                <td class="item-total">${formatPrice(it.price * it.qty)}</td>
                <td><button class="btn btn-danger btn-small remove-item" data-idx="${idx}"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
        `).join('');

        // subtotal
        const subtotal = items.reduce((s,i)=>s + (i.price * i.qty), 0);
        subtotalEl.textContent = formatPrice(subtotal);

        // wire up qty change and remove
        document.querySelectorAll('.cart-qty').forEach(inp=>{
            inp.addEventListener('change', (e)=>{
                const val = Math.max(1, parseInt(e.target.value||'1',10));
                const idx = parseInt(e.target.dataset.idx,10);
                const cart = getCart();
                cart[idx].qty = val;
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                window.updateCartCount && window.updateCartCount();
            });
        });
        document.querySelectorAll('.remove-item').forEach(btn=>{
            btn.addEventListener('click', ()=>{
                const idx = parseInt(btn.dataset.idx,10);
                const cart = getCart();
                cart.splice(idx,1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                window.updateCartCount && window.updateCartCount();
            });
        });

        window.updateCartCount && window.updateCartCount();
    }

    function escapeHtml(str){ if (!str) return ''; return String(str).replace(/[&<>"']/g,function(s){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s];}); }

    document.addEventListener('DOMContentLoaded', ()=>{
        renderCart();
        document.getElementById('clear-cart').addEventListener('click', ()=>{
            if (!confirm('Clear cart?')) return;
            localStorage.removeItem('cart');
            renderCart();
            window.updateCartCount && window.updateCartCount();
        });
        document.getElementById('checkout').addEventListener('click', ()=>{
            const cart = getCart();
            if (cart.length===0) return alert('Cart is empty');
            // Simple checkout: open mail client with order summary
            const lines = cart.map(i=>`${i.qty} x ${i.name} - ${formatPrice(i.price*i.qty)}`);
            const body = `Order summary:\n\n${lines.join('\n')}\n\nSubtotal: ${formatPrice(cart.reduce((s,i)=>s+(i.price*i.qty),0))}`;
            const mailto = `mailto:info@nandanatea.com?subject=${encodeURIComponent('New Order')}&body=${encodeURIComponent(body)}`;
            window.location.href = mailto;
        });
    });
    </script>
    <script src="{{ asset('js/main.js') }}"></script>
</body>
</html>