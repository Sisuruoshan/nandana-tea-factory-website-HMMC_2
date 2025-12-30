@extends('layouts.app')

@section('title', 'Shopping Cart - Nandana Tea')

@section('content')
    <section class="page-header">
        <h1>Your Cart</h1>
    </section>

    <div id="cart-container" class="container">
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
            <tbody id="cart-items"></tbody>
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
@endsection

@push('scripts')
<script>
function formatPrice(v){return `$${parseFloat(v||0).toFixed(2)}`;}
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

    const subtotal = items.reduce((s,i)=>s + (i.price * i.qty), 0);
    subtotalEl.textContent = formatPrice(subtotal);

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
        const lines = cart.map(i=>`${i.qty} x ${i.name} - ${formatPrice(i.price*i.qty)}`);
        const body = `Order summary:\n\n${lines.join('\n')}\n\nSubtotal: ${formatPrice(cart.reduce((s,i)=>s+(i.price*i.qty),0))}`;
        const mailto = `mailto:info@nandanatea.com?subject=${encodeURIComponent('New Order')}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
    });
});
</script>
@endpush
