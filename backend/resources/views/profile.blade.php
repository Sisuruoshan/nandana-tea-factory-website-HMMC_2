<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My Profile - Nandana Tea</title>
  <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        .profile-page{ padding-top:8rem; min-height:100vh; }
        .profile-card{ background:var(--secondary-dark-green); padding:2rem; border-radius:12px; max-width:800px; margin:0 auto; border:1px solid var(--border-color); }
        .profile-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .profile-header h2 { margin: 0; }
        .profile-actions { display: flex; gap: 1rem; }
        .profile-actions a, .profile-actions button { padding: 0.75rem 1.5rem; border-radius: 8px; border: none; cursor: pointer; text-decoration: none; font-size: 0.95rem; font-weight: 600; transition: all 0.3s ease; }
        .btn-edit { background: var(--primary-green); color: white; }
        .btn-edit:hover { background: var(--primary-dark-green); transform: translateY(-2px); box-shadow: 0 4px 8px rgba(76, 175, 80, 0.2); }
        .btn-logout { background: transparent; color: var(--text-dark); border: 1.5px solid var(--primary-green); }
        .btn-logout:hover { background: var(--primary-green); color: white; }
        .profile-grid{ display:grid; grid-template-columns:1fr 320px; gap:1.5rem; }
        .avatar{ width:100%; max-width:260px; border-radius:12px; background:var(--card-bg); padding:1rem; text-align:center; }
        .avatar img{ width:120px; height:120px; border-radius:50%; }
        .profile-info { display: flex; flex-direction: column; gap: 1rem; }
        .info-group { border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; }
        .info-group:last-child { border-bottom: none; }
        .info-label { font-size: 0.85rem; color: var(--text-medium); text-transform: uppercase; }
        .info-value { font-size: 1rem; color: var(--text-dark); font-weight: 500; }
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
        <div class="header-icons">
            @if(session()->has('user_signup_id'))
                <a href="{{ url('/profile') }}" title="My Profile"><i class="fa-solid fa-user"></i></a>
                <form action="{{ route('logout') }}" method="POST" style="display: inline;">
                    @csrf
                    <button type="submit" title="Logout" style="background: none; border: none; color: inherit; cursor: pointer; font-size: 1.2rem; padding: 0.5rem;">
                        <i class="fa-solid fa-sign-out-alt"></i>
                    </button>
                </form>
            @else
                <a href="{{ url('/login') }}" title="Login"><i class="fa-solid fa-user"></i></a>
            @endif
        </div>
        <div class="hamburger-menu"><span class="bar"></span><span class="bar"></span><span class="bar"></span></div>
    </header>

    <main class="container profile-page">
        <div class="profile-card">
            <div class="profile-header">
                <h2>My Profile</h2>
                <div class="profile-actions">
                    <a href="{{ url('/edit-profile') }}" class="btn-edit">
                        <i class="fa-solid fa-edit"></i> Edit Profile
                    </a>
                    <form action="{{ route('logout') }}" method="POST" style="margin: 0;">
                        @csrf
                        <button type="submit" class="btn-logout">
                            <i class="fa-solid fa-sign-out-alt"></i> Logout
                        </button>
                    </form>
                </div>
            </div>

            @if(session()->has('user_signup_id') && $user)
            <div class="profile-grid">
                <div class="profile-info">
                    <div class="info-group">
                        <div class="info-label">Full Name</div>
                        <div class="info-value">{{ $user->name }}</div>
                    </div>
                    <div class="info-group">
                        <div class="info-label">Email Address</div>
                        <div class="info-value">{{ $user->email }}</div>
                    </div>
                    <div class="info-group">
                        <div class="info-label">Phone</div>
                        <div class="info-value">{{ $user->phone ?? 'Not provided' }}</div>
                    </div>
                    <div class="info-group">
                        <div class="info-label">Address</div>
                        <div class="info-value">{{ $user->address ?? 'Not provided' }}</div>
                    </div>
                </div>
                <div class="avatar">
                    <img src="srs/avatar-placeholder.png" alt="avatar">
                    <h3 style="margin-top:0.75rem;">{{ $user->name }}</h3>
                    <p style="color:var(--text-medium); margin: 0;">{{ $user->email }}</p>
                </div>
            </div>
            @else
            <div style="text-align: center; padding: 2rem;">
                <p>Please <a href="{{ url('/login') }}" style="color: var(--primary-green); text-decoration: none; font-weight: 600;">login</a> to view your profile.</p>
            </div>
            @endif
        </div>
    </main>

    <script src="{{ asset('js/main.js') }}"></script>
</body>
</html>

