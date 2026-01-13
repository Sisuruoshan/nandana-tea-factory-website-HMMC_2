<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact - Nandana Tea</title>
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
        <div class="header-icons">
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

    <main class="container" style="padding-top: 8rem;">
        <div class="contact-grid">
            <div class="contact-form">
                <h1 style="font-family: var(--font-heading); font-size: 3rem; margin-bottom: 1rem;">Get in Touch</h1>
                <p style="color:var(--text-medium); margin-bottom: 2rem;">We're here to assist you with any inquiries or feedback. Please reach out to us through the form or our contact details.</p>
                @if (session('status'))
                    <div style="background:#e6ffed;color:#03543f;border:1px solid #84e1bc;padding:12px;border-radius:8px;margin-bottom:16px;">
                        {{ session('status') }}
                    </div>
                @endif
                @if ($errors->any())
                    <div style="background:#ffebeb;color:#8a1f1f;border:1px solid #f5a9a9;padding:12px;border-radius:8px;margin-bottom:16px;">
                        <ul style="margin:0;padding-left:18px;">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif
                <form id="contact-form" method="POST" action="{{ url('/contact') }}" novalidate>
                    @csrf
                    <div class="form-group"><input type="text" name="name" placeholder="Enter your name" required></div>
                    <div class="form-group"><input type="email" name="email" placeholder="Enter your email" required></div>
                    <div class="form-group"><input type="text" name="subject" placeholder="Enter the subject" required></div>
                    <div class="form-group"><textarea name="message" rows="5" placeholder="Enter your message" required></textarea></div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Message</button>
                </form>
                <br>
                <br>
                <div id="form-status" style="margin-top: 1rem; display: none;"></div>
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
    
    @include('partials.footer')
    <script src="{{ asset('js/main.js') }}"></script>
    <script src="{{ asset('js/validation.js') }}"></script>
</body>
</html>