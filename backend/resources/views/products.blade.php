@extends('layouts.app')

@section('title', 'Our Teas - Nandana Tea')

@section('content')
    <section class="page-header">
        <h1>Our Teas</h1>
    </section>

    <div class="product-controls">
        <a href="#" class="btn active">Retail</a>
        <a href="{{ url('/wholesale') }}" class="btn">Wholesale</a>
    </div>
    
    <div class="product-grid">
        <div class="product-card">
            <img src="{{ asset('srs/black tea.jpg') }}" alt="Black Tea">
            <h3>Nandana Black Tea</h3>
            <p>Rich, full-bodied black tea.</p>
            <div class="price">$12.00</div>
            <a href="{{ url('/product') }}?id=black-tea">View More</a>
        </div>
        <div class="product-card">
            <img src="{{ asset('srs/green tea.png') }}" alt="Green Tea">
            <h3>Nandana Green Tea</h3>
            <p>Delicate, refreshing green tea.</p>
            <div class="price">$14.00</div>
            <a href="{{ url('/product') }}?id=green-tea">View More</a>
        </div>
        <div class="product-card">
            <img src="{{ asset('srs/white tea.png') }}" alt="White Tea">
            <h3>Nandana White Tea</h3>
            <p>Rare, subtly sweet white tea.</p>
            <div class="price">$18.00</div>
            <a href="{{ url('/product') }}?id=white-tea">View More</a>
        </div>
        <div class="product-card">
            <img src="{{ asset('srs/oolong tea.png') }}" alt="Oolong Tea">
            <h3>Nandana Oolong Tea</h3>
            <p>Complex, aromatic oolong tea.</p>
            <div class="price">$16.00</div>
            <a href="{{ url('/product') }}?id=oolong-tea">View More</a>
         </div>

        <div class="product-card">
            <img src="{{ asset('srs/ahmad tea.png') }}" alt="Ahmad Tea">
            <h3>Nandana Almond Tea</h3>
            <p>Elegant, refined Ahmad Tea</p>
            <div class="price">$17.00</div>
            <a href="{{ url('/product') }}?id=almond-tea">View More</a>
        </div>

        <div class="product-card">
            <img src="{{ asset('srs/cinnamon tea.jpg') }}" alt="Cinnamon Tea">
            <h3>Nandana Cinnamon Tea</h3>
            <p>Warm, spicy Cinnamon Tea</p>
            <div class="price">$19.00</div>
            <a href="{{ url('/product') }}?id=cinnamon-tea">View More</a>
        </div>
        
    </div>
    <div id="no-results" style="display:none;padding:20px;text-align:center;color:#555;">No matching products found.</div>
@endsection
