<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Us - Nandana Tea</title>
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

    <main class="container">
        <section class="page-header1">
            <br>
            <h1>About Nandana Tea Factory</h1>
            <p>Discover the rich heritage and unwavering commitment to quality that defines Nandana Tea Factory, a premier Sri Lankan tea manufacturer and distributor.</p>
            <br>
            <br>
        </section>

        <section class="about-section">
            <div class="about-text">
                <h2>Our Story</h2>
                <p>The Nandana Tea Experiences are meaningful and will stir your soul on what is possible when authenticity, generous hospitality and values come together. Just ask anyone who has been to Nandana or go through the comments made about us online and in person, you’ll find out why. We welcome guests from all over the world to stay with us, share a meal with us and experience Tea EduTourism at it’s finest. We hope to see you soon.</p>
            </div>
            <img src="srs/nandana-tea-monastery (1).jpg" alt="Tea cup and bowl">
        </section>
        
        <section class="certifications">
             <h2>Our Certifications</h2>
             <div class="cert-grid">
                 <div class="cert-card">
                     <i class="fa-solid fa-certificate"></i>
                     <br>
                     <h3>ISO 22000:2005</h3>
                 </div>
                 <div class="cert-card">
                     <i class="fa-solid fa-shield-halved"></i>
                     <h3>prestigious Product Certification</h3>
                 </div>
                 <div class="cert-card">
                     <i class="fa-solid fa-leaf"></i>
                     <h3>Sustainable Practices</h3>
                 </div>
             </div>
        </section>

        <section class="about-section">
            <img src="srs/nandana-tea-factory_02.jpg" alt="Tea packaging and loose leaves">
             <div class="about-text">
                <h2>Our Process & Vision</h2>
                <p>We want to show to the world that you can create a sustainable business leveraging an honest product while supporting your local community. Because together we can achieve so much!</p>
                <br>
                <br>
                <h2>Our Mission</h2>

                <p>We want to show to the world that you can create a sustainable business leveraging an honest product while supporting your local community. Because together we can achieve so much!</p>
            </div>
        </section>
    </main>
    
    <?php echo $__env->make('partials.footer', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
    <script src="<?php echo e(asset('js/main.js')); ?>"></script>
</body>
</html><?php /**PATH C:\Users\ASUS\Documents\GitHub\nandana-tea-factory-website-HMMC_2\nandana-tea-factory-website-HMMC_2\backend\resources\views/about.blade.php ENDPATH**/ ?>