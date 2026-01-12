<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Edit Profile - Nandana Tea</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        .edit-profile-page {
            padding-top: 8rem;
            min-height: 100vh;
        }

        .edit-profile-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 1rem 3rem;
        }

        .edit-profile-card {
            background: var(--secondary-dark-green);
            padding: 2.5rem;
            border-radius: 12px;
            border: 1px solid var(--border-color);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .edit-profile-header {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            margin-bottom: 2.5rem;
            padding-bottom: 1.5rem;
            border-bottom: 2px solid var(--border-color);
        }

        .profile-avatar {
            position: relative;
        }

        .profile-avatar img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid var(--primary-green);
        }

        .avatar-upload-btn {
            position: absolute;
            bottom: 0;
            right: 0;
            background: var(--primary-green);
            color: white;
            border: none;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            transition: background 0.3s ease;
        }

        .avatar-upload-btn:hover {
            background: var(--primary-dark-green);
        }

        #avatar-file {
            display: none;
        }

        .profile-info h1 {
            font-size: 1.75rem;
            margin: 0 0 0.25rem 0;
            color: var(--text-dark);
        }

        .profile-info p {
            margin: 0;
            color: var(--text-medium);
            font-size: 0.95rem;
        }

        .form-section {
            margin-bottom: 2rem;
        }

        .form-section-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--primary-green);
            margin-bottom: 1rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid var(--border-color);
        }

        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .form-grid.full {
            grid-template-columns: 1fr;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-group label {
            font-size: 0.95rem;
            font-weight: 500;
            color: var(--text-dark);
            margin-bottom: 0.5rem;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
            padding: 0.75rem;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            font-size: 0.95rem;
            background: var(--card-bg);
            color: var(--text-dark);
            font-family: inherit;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
            outline: none;
            border-color: var(--primary-green);
            box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }

        .form-group textarea {
            resize: vertical;
            min-height: 100px;
        }

        .form-group.disabled input,
        .form-group.disabled textarea,
        .form-group.disabled select {
            background: var(--border-color);
            cursor: not-allowed;
        }

        .form-help-text {
            font-size: 0.85rem;
            color: var(--text-medium);
            margin-top: 0.35rem;
        }

        .password-toggle {
            position: relative;
        }

        .password-toggle-btn {
            position: absolute;
            right: 0.75rem;
            top: 2.15rem;
            background: none;
            border: none;
            color: var(--text-medium);
            cursor: pointer;
            padding: 0.5rem;
            font-size: 0.9rem;
            transition: color 0.3s ease;
        }

        .password-toggle-btn:hover {
            color: var(--primary-green);
        }

        .form-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border-color);
        }

        .form-actions button {
            padding: 0.85rem 2rem;
            border: none;
            border-radius: 8px;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            flex: 1;
        }

        .btn-save {
            background: var(--primary-green);
            color: white;
        }

        .btn-save:hover {
            background: var(--primary-dark-green);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(76, 175, 80, 0.2);
        }

        .btn-cancel {
            background: transparent;
            color: var(--primary-green);
            border: 1.5px solid var(--primary-green);
        }

        .btn-cancel:hover {
            background: var(--primary-green);
            color: white;
        }

        .btn-danger {
            background: #dc3545;
            color: white;
        }

        .btn-danger:hover {
            background: #c82333;
        }

        .alert {
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            display: flex;
            gap: 1rem;
            align-items: flex-start;
        }

        .alert-success {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
        }

        .alert-error {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
        }

        .alert-info {
            background: #d1ecf1;
            border: 1px solid #bee5eb;
            color: #0c5460;
        }

        .alert i {
            margin-top: 0.2rem;
            min-width: 20px;
        }

        .alert-close {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            font-size: 1.25rem;
            opacity: 0.7;
            padding: 0;
            margin-left: auto;
        }

        .alert-close:hover {
            opacity: 1;
        }

        .loading-spinner {
            display: none;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 0.8s linear infinite;
        }

        .btn-save.loading .loading-spinner {
            display: inline-block;
            margin-right: 0.5rem;
        }

        .btn-save.loading {
            pointer-events: none;
            opacity: 0.8;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }

        @media (max-width: 768px) {
            .edit-profile-card {
                padding: 1.5rem;
            }

            .edit-profile-header {
                flex-direction: column;
                text-align: center;
                gap: 1rem;
            }

            .form-grid {
                grid-template-columns: 1fr;
            }

            .form-actions {
                flex-direction: column;
            }

            .form-actions button {
                flex: unset;
                width: 100%;
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

    <main class="container edit-profile-page">
        <div class="edit-profile-container">
            <!-- Check if user is logged in -->
            @unless(session()->has('user_signup_id'))
            <div style="text-align: center; padding: 3rem 1rem; max-width: 600px; margin: 0 auto;">
                <div style="background: var(--secondary-dark-green); padding: 2rem; border-radius: 12px; border: 1px solid var(--border-color);">
                    <i class="fa-solid fa-lock" style="font-size: 3rem; color: var(--primary-green); margin-bottom: 1rem;"></i>
                    <h2 style="margin-top: 0; color: var(--text-dark);">Access Denied</h2>
                    <p style="color: var(--text-medium); margin-bottom: 1.5rem;">You need to be logged in to edit your profile.</p>
                    <a href="{{ url('/login') }}" style="display: inline-block; background: var(--primary-green); color: white; padding: 0.85rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 600; transition: all 0.3s ease;">
                        Go to Login
                    </a>
                </div>
            </div>
            @else
            <!-- Alert Messages -->
            <div id="alerts-container"></div>

            <div class="edit-profile-card">
                <!-- Profile Header -->
                <div class="edit-profile-header">
                    <div class="profile-avatar">
                        <img id="avatar-preview" src="srs/avatar-placeholder.png" alt="Profile Avatar">
                        <button type="button" class="avatar-upload-btn" title="Upload new avatar">
                            <i class="fa-solid fa-camera"></i>
                        </button>
                        <input type="file" id="avatar-file" accept="image/*">
                    </div>
                    <div class="profile-info">
                        <h1 id="profile-name-display">Your Name</h1>
                        <p id="profile-email-display">your.email@example.com</p>
                    </div>
                </div>

                <!-- Edit Profile Form -->
                <form id="edit-profile-form">
                    <!-- Personal Information Section -->
                    <div class="form-section">
                        <h3 class="form-section-title">Personal Information</h3>
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="full-name">Full Name *</label>
                                <input type="text" id="full-name" name="name" required placeholder="Enter your full name">
                                <span class="form-help-text">Your public name on the platform</span>
                            </div>
                            <div class="form-group">
                                <label for="email">Email Address *</label>
                                <input type="email" id="email" name="email" required placeholder="Enter your email address">
                                <span class="form-help-text">Used for login and notifications</span>
                            </div>
                        </div>
                        <div class="form-grid full">
                            <div class="form-group">
                                <label for="phone">Phone Number</label>
                                <input type="tel" id="phone" name="phone" placeholder="Enter your phone number">
                                <span class="form-help-text">Optional - helps us contact you faster</span>
                            </div>
                        </div>
                        <div class="form-grid full">
                            <div class="form-group">
                                <label for="address">Address</label>
                                <textarea id="address" name="address" placeholder="Enter your address"></textarea>
                                <span class="form-help-text">Your delivery address</span>
                            </div>
                        </div>
                    </div>

                    <!-- Security Section -->
                    <div class="form-section">
                        <h3 class="form-section-title">Security</h3>
                        <div class="form-grid full">
                            <div class="form-group password-toggle">
                                <label for="new-password">New Password</label>
                                <input type="password" id="new-password" name="password" placeholder="Leave blank to keep current password">
                                <button type="button" class="password-toggle-btn" title="Show/hide password">
                                    <i class="fa-solid fa-eye"></i>
                                </button>
                                <span class="form-help-text">Leave blank if you don't want to change your password</span>
                            </div>
                        </div>
                        <div class="form-grid full">
                            <div class="form-group password-toggle">
                                <label for="confirm-password">Confirm Password</label>
                                <input type="password" id="confirm-password" name="confirm_password" placeholder="Confirm your new password">
                                <button type="button" class="password-toggle-btn" title="Show/hide password">
                                    <i class="fa-solid fa-eye"></i>
                                </button>
                                <span class="form-help-text" id="password-match-msg"></span>
                            </div>
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="form-actions">
                        <button type="submit" class="btn-save">
                            <span class="loading-spinner"></span>
                            <span>Save Changes</span>
                        </button>
                        <button type="button" class="btn-cancel" onclick="history.back()">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </main>

    @include('partials.footer')

    <script src="{{ asset('js/main.js') }}"></script>
    <script>
        // Profile Edit Form Handler
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('edit-profile-form');
            const avatarBtn = document.querySelector('.avatar-upload-btn');
            const avatarFile = document.getElementById('avatar-file');
            const avatarPreview = document.getElementById('avatar-preview');
            const passwordInputs = document.querySelectorAll('.password-toggle-btn');
            const newPasswordInput = document.getElementById('new-password');
            const confirmPasswordInput = document.getElementById('confirm-password');
            const passwordMatchMsg = document.getElementById('password-match-msg');

            // Load user profile data
            loadProfileData();

            // Avatar upload
            avatarBtn.addEventListener('click', () => avatarFile.click());
            
            avatarFile.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        avatarPreview.src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });

            // Password visibility toggle
            passwordInputs.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const input = this.previousElementSibling;
                    const icon = this.querySelector('i');
                    
                    if (input.type === 'password') {
                        input.type = 'text';
                        icon.classList.remove('fa-eye');
                        icon.classList.add('fa-eye-slash');
                    } else {
                        input.type = 'password';
                        icon.classList.remove('fa-eye-slash');
                        icon.classList.add('fa-eye');
                    }
                });
            });

            // Password match validation
            [newPasswordInput, confirmPasswordInput].forEach(input => {
                input.addEventListener('input', validatePasswordMatch);
            });

            function validatePasswordMatch() {
                const newPass = newPasswordInput.value;
                const confirmPass = confirmPasswordInput.value;

                if (newPass && confirmPass) {
                    if (newPass === confirmPass) {
                        passwordMatchMsg.textContent = '✓ Passwords match';
                        passwordMatchMsg.style.color = '#28a745';
                        confirmPasswordInput.style.borderColor = '#28a745';
                    } else {
                        passwordMatchMsg.textContent = '✗ Passwords do not match';
                        passwordMatchMsg.style.color = '#dc3545';
                        confirmPasswordInput.style.borderColor = '#dc3545';
                    }
                } else {
                    passwordMatchMsg.textContent = '';
                    confirmPasswordInput.style.borderColor = '';
                }
            }

            // Form submission
            form.addEventListener('submit', async function(e) {
                e.preventDefault();

                // Validate passwords if provided
                if (newPasswordInput.value || confirmPasswordInput.value) {
                    if (newPasswordInput.value !== confirmPasswordInput.value) {
                        showAlert('Passwords do not match', 'error');
                        return;
                    }
                    if (newPasswordInput.value.length < 8) {
                        showAlert('Password must be at least 8 characters long', 'error');
                        return;
                    }
                }

                const submitBtn = form.querySelector('.btn-save');
                submitBtn.classList.add('loading');

                const formData = new FormData(form);

                try {
                    const response = await fetch('/api/profile/update', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                        }
                    });

                    const data = await response.json();

                    if (response.ok) {
                        showAlert('Profile updated successfully!', 'success');
                        setTimeout(() => {
                            window.location.href = '/profile';
                        }, 1500);
                    } else {
                        showAlert(data.message || 'An error occurred', 'error');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    showAlert('Failed to update profile. Please try again.', 'error');
                } finally {
                    submitBtn.classList.remove('loading');
                }
            });

            function showAlert(message, type) {
                const container = document.getElementById('alerts-container');
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
                    <i class="fa-solid ${iconMap[type]}"></i>
                    <span>${message}</span>
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
                        if (user.avatar) {
                            avatarPreview.src = user.avatar;
                        }
                    }
                } catch (error) {
                    console.error('Error loading profile:', error);
                }
            }
        });
    </script>
            @endunless
        </div>
    </main>

    @include('partials.footer')

    <script src="{{ asset('js/main.js') }}"></script>
</body>
</html>
