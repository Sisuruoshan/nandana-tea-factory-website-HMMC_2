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
        .profile-grid{ display:grid; grid-template-columns:1fr 320px; gap:1.5rem; }
        .avatar{ width:100%; max-width:260px; border-radius:12px; background:var(--card-bg); padding:1rem; text-align:center; }
        .avatar img{ width:120px; height:120px; border-radius:50%; }
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
            <a href="{{ url('/login') }}"><i class="fa-solid fa-user"></i></a>
        </div>
        <div class="hamburger-menu"><span class="bar"></span><span class="bar"></span><span class="bar"></span></div>
    </header>

    <main class="container profile-page">
        <div class="profile-card">
            <h2>My Profile</h2>
            <div class="profile-grid">
                <div>
                    <form id="profile-form">
                        <input type="hidden" id="profile-id">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" id="profile-name" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="profile-email" required>
                        </div>
                        <div class="form-group">
                            <label>Password (leave blank to keep current)</label>
                            <input type="password" id="profile-password">
                        </div>
                        <div class="form-group">
                            <label>Phone</label>
                            <input type="text" id="profile-phone">
                        </div>
                        <div class="form-group">
                            <label>Address</label>
                            <textarea id="profile-address" rows="3"></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" id="save-profile" class="btn btn-primary">Save Profile</button>
                            <button type="button" id="logout-btn" class="btn btn-secondary">Logout</button>
                        </div>
                    </form>
                </div>
                <div class="avatar">
                    <img src="srs/avatar-placeholder.png" alt="avatar" id="avatar-img">
                    <h3 id="avatar-name" style="margin-top:0.75rem;"></h3>
                    <p id="avatar-email" style="color:var(--text-medium);"></p>
                </div>
            </div>
        </div>
    </main>

