<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wholesale Signup - Nandana Tea</title>
    <link rel="stylesheet" href="<?php echo e(asset('css/style.css')); ?>">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>
    <header>
        <a href="<?php echo e(url('/')); ?>" class="logo"><i class="fa-solid fa-leaf"></i> Nandana Tea</a>
       <nav>
            <a href="<?php echo e(url('/')); ?>">Home</a>
            <a href="<?php echo e(url('/products')); ?>">Products</a>
            <a href="<?php echo e(url('/about')); ?>">About Us</a>
            <a href="<?php echo e(url('/contact')); ?>">Contact</a>
        </nav>
        <?php
            $currentUser = null;
            if (session()->has('user_signup_id')) {
                $currentUser = \App\Models\UserSignup::find(session()->get('user_signup_id'));
            }
            if (!$currentUser && auth()->check()) {
                $currentUser = auth()->user();
            }
        ?>
        <div class="header-icons" style="display:flex;align-items:center;gap:12px;">
            <?php if(!$currentUser): ?>
                <a href="#">Cart (0)</a>
            <?php endif; ?>
            <?php if($currentUser): ?>
                <div class="user-profile-dropdown">
                    <button class="avatar-btn" onclick="toggleUserMenu()" aria-label="Profile menu">
                        <?php if($currentUser->avatar): ?>
                            <img src="<?php echo e(asset('storage/' . $currentUser->avatar)); ?>" alt="Profile Avatar" class="avatar-image">
                        <?php else: ?>
                            <i class="fa-solid fa-user-circle"></i>
                        <?php endif; ?>
                    </button>
                    <div class="user-menu" id="userMenu">
                        <a href="<?php echo e(url('/edit-profile')); ?>" class="user-menu-item">
                            <i class="fa-solid fa-edit"></i> Edit Profile
                        </a>
                        <form action="<?php echo e(route('logout')); ?>" method="POST" style="margin: 0;">
                            <?php echo csrf_field(); ?>
                            <button type="submit" class="user-menu-item logout-btn">
                                <i class="fa-solid fa-sign-out-alt"></i> Logout
                            </button>
                        </form>
                    </div>
                </div>
            <?php else: ?>
                <a href="<?php echo e(url('/login')); ?>" title="Login"><i class="fa-solid fa-user"></i></a>
            <?php endif; ?>
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
            <form id="wholesale-signup-form" method="POST" action="<?php echo e(url('/wholesale-signup')); ?>" novalidate>
                <?php echo csrf_field(); ?>
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
            <p style="text-align:center; margin-top:1rem;">Already have an account? <a href="<?php echo e(url('/wholesale')); ?>">Login here</a>.</p>
        </section>
    </main>

    <?php echo $__env->make('partials.footer', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
    <script src="<?php echo e(asset('js/main.js')); ?>"></script>
    <script src="<?php echo e(asset('js/validation.js')); ?>"></script>
</body>
</html>
<?php /**PATH C:\Users\ASUS\Documents\GitHub\nandana-tea-factory-website-HMMC_2\nandana-tea-factory-website-HMMC_2\backend\resources\views/wholesale-signup.blade.php ENDPATH**/ ?>