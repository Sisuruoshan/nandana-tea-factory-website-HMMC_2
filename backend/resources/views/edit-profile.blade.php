<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Edit Profile - Nandana Tea</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: linear-gradient(135deg, #0a2f1a 0%, #051d0d 100%);
            min-height: 100vh;
            font-family: var(--font-body);
        }

        header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(5, 29, 13, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(73, 202, 125, 0.2);
        }

        .edit-profile-page {
            padding-top: 7rem;
            padding-bottom: 4rem;
            min-height: 100vh;
        }

        .edit-profile-container {
            max-width: 950px;
            margin: 0 auto;
            padding: 0 1.5rem;
        }

        .page-header {
            text-align: center;
            margin-bottom: 3rem;
            animation: fadeInDown 0.6s ease;
        }

        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .page-header h1 {
            font-family: var(--font-heading);
            font-size: 2.75rem;
            color: var(--text-light);
            margin-bottom: 0.75rem;
            font-weight: 700;
            letter-spacing: -0.5px;
            line-height: 1.2;
        }

        .page-header p {
            color: var(--text-medium);
            font-size: 1.15rem;
            font-weight: 400;
        }

        .edit-profile-card {
            background: rgba(21, 50, 30, 0.95);
            backdrop-filter: blur(20px);
            padding: 3.5rem;
            border-radius: 20px;
            border: 1px solid rgba(73, 202, 125, 0.25);
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.5);
            animation: fadeInUp 0.7s ease;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .profile-header-section {
            display: flex;
            align-items: center;
            gap: 2.5rem;
            margin-bottom: 3.5rem;
            padding: 2.5rem;
            background: linear-gradient(135deg, rgba(73, 202, 125, 0.12) 0%, rgba(73, 202, 125, 0.06) 100%);
            border-radius: 16px;
            border: 1px solid rgba(73, 202, 125, 0.25);
            position: relative;
            overflow: hidden;
        }

        .profile-header-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--accent-mint-green) 0%, #3ab366 100%);
        }

        .profile-avatar-container {
            position: relative;
            flex-shrink: 0;
        }

        .profile-avatar {
            width: 130px;
            height: 130px;
            border-radius: 50%;
            object-fit: cover;
            border: 5px solid var(--accent-mint-green);
            box-shadow: 0 10px 30px rgba(73, 202, 125, 0.4);
            transition: all 0.3s ease;
            background: rgba(21, 50, 30, 0.8);
        }

        .profile-avatar:hover {
            transform: scale(1.05);
            box-shadow: 0 15px 40px rgba(73, 202, 125, 0.5);
        }

        .avatar-upload-overlay {
            position: absolute;
            bottom: 5px;
            right: 5px;
            background: var(--accent-mint-green);
            color: var(--primary-dark-green);
            border: 4px solid rgba(21, 50, 30, 0.95);
            border-radius: 50%;
            width: 45px;
            height: 45px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        }

        .avatar-upload-overlay:hover {
            background: #3ab366;
            transform: scale(1.15);
            box-shadow: 0 6px 20px rgba(73, 202, 125, 0.6);
        }

        .avatar-upload-overlay:active {
            transform: scale(1.05);
        }

        .profile-header-info {
            flex: 1;
        }

        .profile-header-info h2 {
            font-family: var(--font-heading);
            font-size: 2rem;
            color: var(--text-light);
            margin: 0 0 0.75rem 0;
            font-weight: 700;
            letter-spacing: -0.3px;
        }

        .profile-header-info p {
            color: var(--text-medium);
            font-size: 1.05rem;
            margin: 0 0 1rem 0;
            font-weight: 400;
        }

        .profile-status-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.6rem;
            background: rgba(73, 202, 125, 0.25);
            color: var(--accent-mint-green);
            padding: 0.65rem 1.25rem;
            border-radius: 25px;
            font-size: 0.95rem;
            font-weight: 700;
            border: 1px solid rgba(73, 202, 125, 0.3);
        }

        .form-section {
            margin-bottom: 3rem;
        }

        .form-section:last-of-type {
            margin-bottom: 0;
        }

        .form-section-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 2rem;
            padding-bottom: 1.25rem;
            border-bottom: 2px solid rgba(73, 202, 125, 0.25);
        }

        .form-section-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, var(--accent-mint-green) 0%, #3ab366 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary-dark-green);
            font-size: 1.3rem;
            box-shadow: 0 4px 12px rgba(73, 202, 125, 0.3);
        }

        .form-section-title {
            font-family: var(--font-heading);
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-light);
            margin: 0;
            letter-spacing: -0.3px;
        }

        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 1.5rem;
        }

        .form-grid.single {
            grid-template-columns: 1fr;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-label {
            font-size: 1rem;
            font-weight: 700;
            color: var(--text-light);
            margin-bottom: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .form-label .required {
            color: #ff6b6b;
            font-size: 1rem;
            font-weight: 700;
        }

        .form-input {
            padding: 1rem 1.25rem;
            border: 2px solid rgba(73, 202, 125, 0.3);
            border-radius: 12px;
            font-size: 1rem;
            background: rgba(21, 50, 30, 0.6);
            color: var(--text-light);
            font-family: inherit;
            transition: all 0.3s ease;
            font-weight: 500;
        }

        .form-input::placeholder {
            color: rgba(255, 255, 255, 0.35);
            font-weight: 400;
        }

        .form-input:focus {
            outline: none;
            border-color: var(--accent-mint-green);
            background: rgba(21, 50, 30, 0.8);
            box-shadow: 0 0 0 5px rgba(73, 202, 125, 0.15);
            transform: translateY(-1px);
        }

        .form-input:disabled {
            background: rgba(21, 50, 30, 0.3);
            cursor: not-allowed;
            opacity: 0.6;
            border-color: rgba(73, 202, 125, 0.15);
        }

        .form-textarea {
            min-height: 130px;
            resize: vertical;
            font-family: inherit;
            line-height: 1.6;
        }

        .form-hint {
            font-size: 0.875rem;
            color: var(--text-medium);
            margin-top: 0.65rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 400;
        }

        .form-hint i {
            font-size: 0.85rem;
            opacity: 0.8;
        }

        .password-field {
            position: relative;
        }

        .password-toggle-btn {
            position: absolute;
            right: 1rem;
            top: 2.5rem;
            background: none;
            border: none;
            color: var(--text-medium);
            cursor: pointer;
            padding: 0.5rem;
            font-size: 1rem;
            transition: color 0.3s ease;
        }

        .password-toggle-btn:hover {
            color: var(--accent-mint-green);
        }

        .password-strength {
            margin-top: 0.5rem;
            height: 4px;
            background: rgba(73, 202, 125, 0.2);
            border-radius: 2px;
            overflow: hidden;
        }

        .password-strength-bar {
            height: 100%;
            width: 0%;
            transition: all 0.3s ease;
            border-radius: 2px;
        }

        .password-strength-bar.weak {
            width: 33%;
            background: #ff6b6b;
        }

        .password-strength-bar.medium {
            width: 66%;
            background: #ffd93d;
        }

        .password-strength-bar.strong {
            width: 100%;
            background: var(--accent-mint-green);
        }

        .form-actions {
            display: flex;
            gap: 1rem;
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 2px solid rgba(73, 202, 125, 0.2);
        }

        .btn {
            padding: 1rem 2.5rem;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: var(--font-body);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            flex: 1;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--accent-mint-green) 0%, #3ab366 100%);
            color: var(--primary-dark-green);
            box-shadow: 0 4px 12px rgba(73, 202, 125, 0.3);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(73, 202, 125, 0.4);
        }

        .btn-primary:active {
            transform: translateY(0);
        }

        .btn-secondary {
            background: transparent;
            color: var(--text-light);
            border: 2px solid rgba(73, 202, 125, 0.3);
        }

        .btn-secondary:hover {
            background: rgba(73, 202, 125, 0.1);
            border-color: var(--accent-mint-green);
        }

        .btn-loading {
            pointer-events: none;
            opacity: 0.7;
        }

        .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: currentColor;
            animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .alert-container {
            position: fixed;
            top: 6rem;
            right: 2rem;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-width: 400px;
        }

        .alert {
            padding: 1.25rem 1.5rem;
            border-radius: 12px;
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
            backdrop-filter: blur(10px);
        }

        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .alert-success {
            background: rgba(40, 167, 69, 0.95);
            border: 1px solid #28a745;
            color: white;
        }

        .alert-error {
            background: rgba(220, 53, 69, 0.95);
            border: 1px solid #dc3545;
            color: white;
        }

        .alert-info {
            background: rgba(23, 162, 184, 0.95);
            border: 1px solid #17a2b8;
            color: white;
        }

        .alert-icon {
            font-size: 1.3rem;
            min-width: 24px;
        }

        .alert-content {
            flex: 1;
        }

        .alert-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 1.2rem;
            opacity: 0.8;
            padding: 0;
            transition: opacity 0.3s ease;
        }

        .alert-close:hover {
            opacity: 1;
        }

        .access-denied-container {
            text-align: center;
            padding: 4rem 2rem;
            max-width: 600px;
            margin: 0 auto;
        }

        .access-denied-card {
            background: rgba(21, 50, 30, 0.95);
            backdrop-filter: blur(20px);
            padding: 3rem;
            border-radius: 16px;
            border: 1px solid rgba(73, 202, 125, 0.2);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }

        .access-denied-icon {
            font-size: 4rem;
            color: var(--accent-mint-green);
            margin-bottom: 1.5rem;
            opacity: 0.8;
        }

        .access-denied-card h2 {
            font-family: var(--font-heading);
            font-size: 2rem;
            color: var(--text-light);
            margin: 0 0 1rem 0;
        }

        .access-denied-card p {
            color: var(--text-medium);
            font-size: 1.1rem;
            margin-bottom: 2rem;
        }

        .btn-login {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            background: linear-gradient(135deg, var(--accent-mint-green) 0%, #3ab366 100%);
            color: var(--primary-dark-green);
            padding: 1rem 2.5rem;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 700;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(73, 202, 125, 0.3);
        }

        .btn-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(73, 202, 125, 0.4);
        }

        @media (max-width: 768px) {
            .edit-profile-page {
                padding-top: 5rem;
            }

            .page-header h1 {
                font-size: 2rem;
            }

            .edit-profile-card {
                padding: 2rem 1.5rem;
            }

            .profile-header-section {
                flex-direction: column;
                text-align: center;
                gap: 1.5rem;
            }

            .form-grid {
                grid-template-columns: 1fr;
            }

            .form-actions {
                flex-direction: column;
            }

            .btn {
                width: 100%;
            }

            .alert-container {
                right: 1rem;
                left: 1rem;
                max-width: none;
            }
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
            $user = null;
            if (session()->has('user_signup_id')) {
                $currentUser = \App\Models\UserSignup::find(session()->get('user_signup_id'));
                $user = $currentUser;
            }
            if (!$currentUser && auth()->check()) {
                $currentUser = auth()->user();
                $user = $currentUser;
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
        <div class="hamburger-menu"><span class="bar"></span><span class="bar"></span><span class="bar"></span></div>
    </header>

    <main class="container edit-profile-page">
        <div class="edit-profile-container">
            <!-- Alert Container -->
            <div class="alert-container" id="alert-container"></div>

            <!-- Check if user is logged in -->
            @unless(session()->has('user_signup_id'))
            <div class="access-denied-container">
                <div class="access-denied-card">
                    <div class="access-denied-icon">
                        <i class="fa-solid fa-lock"></i>
                    </div>
                    <h2>Access Restricted</h2>
                    <p>You need to be logged in to edit your profile.</p>
                    <a href="{{ url('/login') }}" class="btn-login">
                        <i class="fa-solid fa-sign-in-alt"></i>
                        Login to Continue
                    </a>
                </div>
            </div>
            @else
            <!-- Page Header -->
            <div class="page-header">
                <h1>
                    <i class="fa-solid fa-user-edit" style="margin-right: 0.5rem; color: var(--accent-mint-green);"></i>
                    Edit Your Profile
                </h1>
                <p>Update your personal information and account settings</p>
            </div>

            <div class="edit-profile-card">
                <!-- Profile Header Section -->
                <div class="profile-header-section">
                    <div class="profile-avatar-container">
                        <img id="avatar-preview" class="profile-avatar" 
                             src="@if($user && $user->avatar){{ asset('storage/' . $user->avatar) }}@else{{ asset('images/default-avatar.png') }}@endif" 
                             alt="Profile Avatar" 
                             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%2349ca7d%22%3E%3Cpath d=%22M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z%22/%3E%3C/svg%3E'">
                        <button type="button" class="avatar-upload-overlay" onclick="document.getElementById('avatar-file').click()" title="Change avatar">
                            <i class="fa-solid fa-camera"></i>
                        </button>
                        <input type="file" id="avatar-file" accept="image/*">
                    </div>
                    <div class="profile-header-info">
                        <h2 id="profile-name-display">{{ $user->name ?? 'Your Name' }}</h2>
                        <p id="profile-email-display">{{ $user->email ?? 'your.email@example.com' }}</p>
                        <span class="profile-status-badge">
                            <i class="fa-solid fa-check-circle"></i>
                            Active Account
                        </span>
                    </div>
                </div>

                <!-- Edit Profile Form -->
                <form id="edit-profile-form">
                    @csrf
                    <!-- Personal Information Section -->
                    <div class="form-section">
                        <div class="form-section-header">
                            <div class="form-section-icon">
                                <i class="fa-solid fa-user"></i>
                            </div>
                            <h3 class="form-section-title">Personal Information</h3>
                        </div>
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label">
                                    Full Name 
                                    <span class="required">*</span>
                                </label>
                                <input type="text" id="full-name" name="name" class="form-input" required placeholder="Enter your full name">
                                <span class="form-hint">
                                    <i class="fa-solid fa-info-circle"></i>
                                    Your display name on the platform
                                </span>
                            </div>
                            <div class="form-group">
                                <label class="form-label">
                                    Email Address 
                                    <span class="required">*</span>
                                </label>
                                <input type="email" id="email" name="email" class="form-input" required placeholder="your.email@example.com">
                                <span class="form-hint">
                                    <i class="fa-solid fa-envelope"></i>
                                    Used for login and notifications
                                </span>
                            </div>
                        </div>
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label">
                                    Phone Number
                                </label>
                                <input type="tel" id="phone" name="phone" class="form-input" placeholder="+1 (555) 000-0000">
                                <span class="form-hint">
                                    <i class="fa-solid fa-phone"></i>
                                    Optional - For order updates
                                </span>
                            </div>
                            <div class="form-group">
                                <label class="form-label">
                                    Member Since
                                </label>
                                <input type="text" class="form-input" value="January 2026" disabled>
                                <span class="form-hint">
                                    <i class="fa-solid fa-calendar"></i>
                                    Account creation date
                                </span>
                            </div>
                        </div>
                        <div class="form-grid single">
                            <div class="form-group">
                                <label class="form-label">
                                    Delivery Address
                                </label>
                                <textarea id="address" name="address" class="form-input form-textarea" placeholder="Enter your complete delivery address"></textarea>
                                <span class="form-hint">
                                    <i class="fa-solid fa-location-dot"></i>
                                    Default address for deliveries
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Security Section -->
                    <div class="form-section">
                        <div class="form-section-header">
                            <div class="form-section-icon">
                                <i class="fa-solid fa-shield-halved"></i>
                            </div>
                            <h3 class="form-section-title">Security & Password</h3>
                        </div>
                        <div class="form-grid">
                            <div class="form-group password-field">
                                <label class="form-label">
                                    New Password
                                </label>
                                <input type="password" id="new-password" name="password" class="form-input" placeholder="Enter new password">
                                <button type="button" class="password-toggle-btn" onclick="togglePassword('new-password', this)">
                                    <i class="fa-solid fa-eye"></i>
                                </button>
                                <div class="password-strength">
                                    <div class="password-strength-bar" id="password-strength"></div>
                                </div>
                                <span class="form-hint">
                                    <i class="fa-solid fa-lock"></i>
                                    Leave blank to keep current password
                                </span>
                            </div>
                            <div class="form-group password-field">
                                <label class="form-label">
                                    Confirm New Password
                                </label>
                                <input type="password" id="confirm-password" name="confirm_password" class="form-input" placeholder="Confirm new password">
                                <button type="button" class="password-toggle-btn" onclick="togglePassword('confirm-password', this)">
                                    <i class="fa-solid fa-eye"></i>
                                </button>
                                <span class="form-hint" id="password-match-msg">
                                    <i class="fa-solid fa-check-circle"></i>
                                    Re-enter your new password
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary" id="save-btn">
                            <i class="fa-solid fa-save"></i>
                            <span>Save Changes</span>
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="window.location.href='/'">
                            <i class="fa-solid fa-times"></i>
                            <span>Cancel</span>
                        </button>
                    </div>
                </form>
            </div>
            @endunless
        </div>
    </main>

    @include('partials.footer')

    <script src="{{ asset('js/main.js') }}"></script>
    <script>
        // Toggle password visibility
        function togglePassword(inputId, button) {
            const input = document.getElementById(inputId);
            const icon = button.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }

        // Show alert notification
        function showAlert(message, type = 'info') {
            const container = document.getElementById('alert-container');
            const alertId = 'alert-' + Date.now();
            
            const iconMap = {
                'success': 'fa-check-circle',
                'error': 'fa-exclamation-circle',
                'info': 'fa-info-circle'
            };

            const alert = document.createElement('div');
            alert.id = alertId;
            alert.className = `alert alert-${type}`;
            alert.innerHTML = `
                <i class="fa-solid ${iconMap[type]} alert-icon"></i>
                <div class="alert-content">${message}</div>
                <button type="button" class="alert-close" onclick="document.getElementById('${alertId}').remove()">
                    <i class="fa-solid fa-times"></i>
                </button>
            `;
            
            container.appendChild(alert);

            // Auto-remove after 5 seconds
            setTimeout(() => {
                const alertEl = document.getElementById(alertId);
                if (alertEl) alertEl.remove();
            }, 5000);
        }

        // Check password strength
        function checkPasswordStrength(password) {
            const strengthBar = document.getElementById('password-strength');
            if (!password) {
                strengthBar.className = 'password-strength-bar';
                return;
            }

            let strength = 0;
            if (password.length >= 8) strength++;
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
            if (password.match(/\d/)) strength++;
            if (password.match(/[^a-zA-Z\d]/)) strength++;

            strengthBar.className = 'password-strength-bar';
            if (strength === 1) strengthBar.classList.add('weak');
            else if (strength === 2 || strength === 3) strengthBar.classList.add('medium');
            else if (strength >= 4) strengthBar.classList.add('strong');
        }

        // Validate password match
        function validatePasswordMatch() {
            const newPass = document.getElementById('new-password').value;
            const confirmPass = document.getElementById('confirm-password').value;
            const matchMsg = document.getElementById('password-match-msg');

            if (newPass && confirmPass) {
                if (newPass === confirmPass) {
                    matchMsg.innerHTML = '<i class="fa-solid fa-check-circle"></i> Passwords match!';
                    matchMsg.style.color = 'var(--accent-mint-green)';
                } else {
                    matchMsg.innerHTML = '<i class="fa-solid fa-times-circle"></i> Passwords do not match';
                    matchMsg.style.color = '#ff6b6b';
                }
            } else {
                matchMsg.innerHTML = '<i class="fa-solid fa-check-circle"></i> Re-enter your new password';
                matchMsg.style.color = 'var(--text-medium)';
            }
        }

        // Load user profile data
        async function loadProfileData() {
            try {
                const response = await fetch('/api/profile', {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    }
                });

                if (response.ok) {
                    const user = await response.json();
                    
                    // Populate form fields
                    document.getElementById('full-name').value = user.name || '';
                    document.getElementById('email').value = user.email || '';
                    document.getElementById('phone').value = user.phone || '';
                    document.getElementById('address').value = user.address || '';

                    // Update display names
                    document.getElementById('profile-name-display').textContent = user.name || 'Your Name';
                    document.getElementById('profile-email-display').textContent = user.email || '';

                    // Load avatar if exists
                    const avatarPreview = document.getElementById('avatar-preview');
                    if (user.avatar) {
                        avatarPreview.src = '/storage/' + user.avatar;
                    }
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                showAlert('Failed to load profile data', 'error');
            }
        }

        // Main initialization
        document.addEventListener('DOMContentLoaded', function() {
            // Load profile data
            loadProfileData();

            // Avatar upload handler
            const avatarFile = document.getElementById('avatar-file');
            const avatarPreview = document.getElementById('avatar-preview');

            avatarFile.addEventListener('change', async function(e) {
                const file = e.target.files[0];
                if (file) {
                    if (file.size > 5 * 1024 * 1024) { // 5MB max
                        showAlert('Image size must be less than 5MB', 'error');
                        return;
                    }

                    // Preview the image immediately
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        avatarPreview.src = event.target.result;
                    };
                    reader.readAsDataURL(file);

                    // Upload to server
                    const formData = new FormData();
                    formData.append('avatar', file);

                    try {
                        showAlert('Uploading avatar...', 'info');
                        
                        const response = await fetch('/api/profile/upload-avatar', {
                            method: 'POST',
                            body: formData,
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest',
                                'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
                            }
                        });

                        const data = await response.json();

                        if (response.ok) {
                            showAlert('Avatar updated successfully!', 'success');
                            // Update avatar preview with the server URL
                            if (data.avatar_url) {
                                avatarPreview.src = data.avatar_url;
                            }
                        } else {
                            showAlert(data.message || 'Failed to upload avatar', 'error');
                        }
                    } catch (error) {
                        console.error('Error uploading avatar:', error);
                        showAlert('Failed to upload avatar. Please try again.', 'error');
                    }
                }
            });

            // Password strength checker
            const newPasswordInput = document.getElementById('new-password');
            const confirmPasswordInput = document.getElementById('confirm-password');

            newPasswordInput.addEventListener('input', function() {
                checkPasswordStrength(this.value);
                validatePasswordMatch();
            });

            confirmPasswordInput.addEventListener('input', validatePasswordMatch);

            // Form submission
            const form = document.getElementById('edit-profile-form');
            const saveBtn = document.getElementById('save-btn');

            form.addEventListener('submit', async function(e) {
                e.preventDefault();

                // Validate passwords if provided
                const newPass = newPasswordInput.value;
                const confirmPass = confirmPasswordInput.value;

                if (newPass || confirmPass) {
                    if (newPass !== confirmPass) {
                        showAlert('Passwords do not match', 'error');
                        return;
                    }
                    if (newPass.length < 8) {
                        showAlert('Password must be at least 8 characters long', 'error');
                        return;
                    }
                }

                // Show loading state
                saveBtn.classList.add('btn-loading');
                saveBtn.innerHTML = '<div class="spinner"></div><span>Saving...</span>';

                const formData = new FormData(form);

                try {
                    const response = await fetch('/api/profile/update', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
                        }
                    });

                    const data = await response.json();

                    if (response.ok) {
                        showAlert('Profile updated successfully!', 'success');
                        setTimeout(() => {
                            window.location.href = '/profile';
                        }, 1500);
                    } else {
                        showAlert(data.message || 'An error occurred while updating profile', 'error');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    showAlert('Failed to update profile. Please try again.', 'error');
                } finally {
                    // Reset button state
                    saveBtn.classList.remove('btn-loading');
                    saveBtn.innerHTML = '<i class="fa-solid fa-save"></i><span>Save Changes</span>';
                }
            });
        });
    </script>
</body>
</html>
