@extends('layouts.app')

@section('title', 'Nandana Tea - Experience the Essence of Ceylon')

@section('content')
    <section class="hero">
        <div class="hero-content">
            <h1>Experience the Essence of Ceylon</h1>
            <p>Discover the rich heritage and exquisite flavors of Nandana Tea, crafted with passion and tradition.</p>
            <div class="hero-btns">
                <a href="{{ url('/products') }}" class="btn btn-primary">Shop Now</a>
                <a href="{{ url('/contact') }}" class="btn btn-secondary">Contact Us</a>
            </div>
        </div>
    </section>
@endsection