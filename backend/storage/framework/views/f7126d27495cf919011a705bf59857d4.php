<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $__env->yieldContent('title', 'Nandana Tea'); ?></title>
    <link rel="stylesheet" href="<?php echo e(asset('css/style.css')); ?>">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <?php echo $__env->yieldPushContent('head'); ?>
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
        <div class="header-icons">
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

    <main>
        <?php echo $__env->yieldContent('content'); ?>
    </main>

    <?php echo $__env->make('partials.footer', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>

    <script src="<?php echo e(asset('js/main.js')); ?>"></script>
    <?php echo $__env->yieldPushContent('scripts'); ?>
</body>
</html>
<?php /**PATH C:\Users\ASUS\Documents\GitHub\nandana-tea-factory-website-HMMC_2\nandana-tea-factory-website-HMMC_2\backend\resources\views/layouts/app.blade.php ENDPATH**/ ?>