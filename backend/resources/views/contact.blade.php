@extends('layouts.app')

@section('title', 'Contact - Nandana Tea')

@section('content')
    <main class="container" style="padding-top: 8rem;">
        <div class="contact-grid">
            <div class="contact-form">
                <h1 style="font-family: var(--font-heading); font-size: 3rem; margin-bottom: 1rem;">Get in Touch</h1>
                <p style="color:var(--text-medium); margin-bottom: 2rem;">We're here to assist you with any inquiries or feedback. Please reach out to us through the form or our contact details.</p>
                <form id="contact-form" novalidate>
                    <div class="form-group"><input type="text" name="name" placeholder="Enter your name" required></div>
                    <div class="form-group"><input type="email" name="email" placeholder="Enter your email" required></div>
                    <div class="form-group"><input type="text" name="subject" placeholder="Enter the subject" required></div>
                    <div class="form-group"><textarea name="message" rows="5" placeholder="Enter your message" required></textarea></div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Message</button>
                </form>
            </div>
            <div class="contact-info">
                <h2>Contact Information</h2>
                <div class="info-item">
                    <i class="fa-solid fa-phone"></i>
                    <span>+94 71 637 8331</span>
                </div>
                <div class="info-item">
                    <i class="fa-solid fa-envelope"></i>
                    <span>info@nandanatea.com</span>
                </div>
                <div class="info-item">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>123 Tea Estate Road, Akuressa, Sri Lanka</span>
                </div>
                <div class="social-info" style="margin-top: 4rem;">
                    <h2>Follow Us</h2>
                    <div class="social-icons">
                        <a href="https://www.facebook.com/share/1Ay4bEF4K6/"><i class="fab fa-facebook-f"></i></a>
                        <a href="https://www.instagram.com/nandanatea?igsh=MTJsd3h5ZXpyaGFmbQ=="><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </main>

@endsection

@push('scripts')
<script src="{{ asset('js/validation.js') }}"></script>
@endpush
@endsection
