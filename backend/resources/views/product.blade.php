@extends('layouts.app')

@section('title', 'Product Details - Nandana Tea')

@section('content')
    <section class="page-header">
        <h1 id="pd-name">Product Details</h1>
        <p id="pd-subtitle">Explore the flavors of Nandana Tea.</p>
    </section>

    <section class="product-detail container">
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

    <section class="product-explainer container">
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

@endsection

@push('scripts')
<script>
// Product data and client-side loader (from original static page)
const PRODUCTS = {
    'black-tea': { id: 'black-tea', name: 'Nandana Black Tea', desc: 'Rich, full-bodied black tea.', price: 12.00, image: 'srs/black tea.jpg', origin: 'Harvested from Sri Lankan highland gardens known for brisk, malty character.', notes: 'Malty and bold with a clean finish; subtle hints of cocoa.', longDesc: 'Our Black Tea is crafted from carefully selected leaves, with a traditional Sri Lankan profile that balances strength and smoothness. It pairs well with breakfast and stands up beautifully to milk or lemon.', brew: ['2–3 g per 250 ml', '95°C water', 'Steep 3–4 minutes', 'Enjoy plain or with milk'] },
    'green-tea': { id: 'green-tea', name: 'Nandana Green Tea', desc: 'Delicate, refreshing green tea.', price: 14.00, image: 'srs/green tea.png', origin: 'Handpicked leaves steamed to preserve freshness and gentle sweetness.', notes: 'Fresh and grassy with a soft, sweet finish.', longDesc: 'This Green Tea offers a crisp cup with lively vegetal notes. Its gentle processing preserves antioxidants and a light, refreshing character ideal for afternoon sipping.', brew: ['2 g per 250 ml', '80°C water', 'Steep 2–3 minutes', 'Avoid oversteeping for best sweetness'] },
    'white-tea': { id: 'white-tea', name: 'Nandana White Tea', desc: 'Rare, subtly sweet white tea.', price: 18.00, image: 'srs/white tea.png', origin: 'Tender buds sun-withered to retain natural sweetness and aroma.', notes: 'Soft florals with honey-like sweetness and silky texture.', longDesc: 'Our White Tea is delicate and nuanced, prized for its minimal processing. It delivers a serene cup with gentle florals and a lingering sweetness.', brew: ['2 g per 250 ml', '75–85°C water', 'Steep 3–5 minutes', 'Savor without milk'] },
    'oolong-tea': { id: 'oolong-tea', name: 'Nandana Oolong Tea', desc: 'Complex, aromatic oolong tea.', price: 16.00, image: 'srs/oolong tea.png', origin: 'Carefully oxidized leaves for layered aroma and flavor.', notes: 'Orchid-like aromatics with baked sweetness and stone-fruit hints.', longDesc: 'This Oolong balances floral aromatics and baked sweetness. Multiple infusions reveal evolving notes, making it a favorite for mindful tea sessions.', brew: ['3 g per 250 ml', '90°C water', 'Steep 2–3 minutes', 'Reinfuse 2–3 times, slightly longer each brew'] },
    'almond-tea': { id: 'almond-tea', name: 'Nandana Almond Tea', desc: 'Elegant, refined Almond Tea.', price: 17.00, image: 'srs/ahmad tea.png', origin: 'Aromatic blend marrying smooth tea with natural almond notes.', notes: 'Rounded nuttiness with gentle sweetness; comforting and smooth.', longDesc: 'Our Almond Tea blends a mellow base with natural almond accents for a cozy, dessert-like cup. Lovely on its own or lightly sweetened.', brew: ['2–3 g per 250 ml', '90–95°C water', 'Steep 3–4 minutes', 'Enjoy plain or lightly sweetened'] },
    'cinnamon-tea': { id: 'cinnamon-tea', name: 'Nandana Cinnamon Tea', desc: 'Warm, spicy Cinnamon Tea.', price: 19.00, image: 'srs/cinnamon tea.jpg', origin: 'Infused with true cinnamon for vibrant spice and warmth.', notes: 'Bright spice, gentle sweetness, and a cozy finish.', longDesc: 'A spirited cup featuring true cinnamon. It delivers warmth and a pleasantly sweet-spicy profile perfect for cool mornings and evenings.', brew: ['2–3 g per 250 ml', '95°C water', 'Steep 3–4 minutes', 'Optional: a slice of orange or a dash of honey'] }
};

function getParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

function formatPrice(value) { return `$${value.toFixed(2)}`; }

function loadProduct() {
    const id = getParam('id');
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    let product = storedProducts.find(p => p.id === id);
    if (!product) product = PRODUCTS[id] || PRODUCTS['black-tea'];

    document.getElementById('pd-name').textContent = product.name;
    document.getElementById('pd-title').textContent = product.name;
    document.getElementById('pd-desc').textContent = product.desc || product.description;
    document.getElementById('pd-price').textContent = formatPrice(product.price);
    const img = document.getElementById('pd-image');
    img.src = product.image.startsWith('/') ? product.image : ('/' + product.image);
    img.alt = product.name;

    document.getElementById('pd-origin').textContent = product.origin || '';
    document.getElementById('pd-notes').textContent = product.notes || '';
    document.getElementById('pd-long').textContent = product.longDesc || '';
    document.getElementById('pd-brew').innerHTML = (product.brew || []).map(step => `<li>${step}</li>`).join('');

    const qtyInput = document.getElementById('pd-qty');
    document.getElementById('pd-add').onclick = () => {
        const qty = Math.max(1, parseInt(qtyInput.value || '1', 10));
        const item = { id: product.id, name: product.name, price: product.price, qty };
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(c => c.id === item.id);
        if (existing) { existing.qty += qty; } else { cart.push(item); }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} added to cart (x${qty}).`);
        updateCartCount();
    };

    document.getElementById('pd-order').onclick = () => {
        const qty = Math.max(1, parseInt(qtyInput.value || '1', 10));
        const params = new URLSearchParams({ product: product.id, qty: String(qty) });
        window.location.href = '/contact?' + params.toString();
    };
}

loadProduct();
</script>
@endpush
