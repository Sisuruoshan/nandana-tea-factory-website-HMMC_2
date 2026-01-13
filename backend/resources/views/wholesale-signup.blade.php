<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wholesale Signup - Nandana Tea</title>
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
            <h1>Create Wholesale Account</h1>
            <p>Register as a wholesale partner to access bulk pricing and special offers.</p>
        </section>

        <section class="form-container" style="max-width:640px; margin: 2rem auto;">
            <form id="wholesale-signup-form" method="POST" action="{{ url('/wholesale-signup') }}" novalidate>
                @csrf
                <div class="form-group">
                    <label for="ws-signup-company">Company Name</label>
                    <input type="text" name="ws-signup-company" required>
                </div>
                <div class="form-group">
                    <label for="ws-signup-name">Contact Person</label>
                    <input type="text" name="ws-signup-name" required>
                </div>
                <div class="form-group">
                    <label for="ws-signup-email">Email</label>
                    <input type="email" name="ws-signup-email" required>
                </div>
                <div class="form-group">
                    <label for="ws-signup-phone">Phone</label>
                    <input type="tel" name="ws-signup-phone">
                </div>
                <div class="form-group">
                    <label for="ws-signup-address">Address</label>
                    <input type="text" name="ws-signup-address">
                </div>
                <div class="form-group">
                    <label for="ws-signup-password">Password</label>
                    <input type="password" name="ws-signup-password" required>
                </div>
                <div class="form-group">
                    <label for="ws-signup-password-confirm">Confirm Password</label>
                    <input type="password" name="ws-signup-password-confirm" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">Create Account</button>
            </form>
            <p style="text-align:center; margin-top:1rem;">Already have an account? <a href="{{ url('/wholesale') }}">Login here</a>.</p>
        </section>
    </main>

    @include('partials.footer')
    <script src="{{ asset('js/main.js') }}"></script>
    <script src="{{ asset('js/validation.js') }}"></script>
</body>
</html>
