/**
 * Nandana Tea - main.js
 * Professional scripts for navigation, mobile menu, and admin interactivity.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Select essential DOM elements
    const header = document.querySelector('header');
    const hamburger = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('nav');
    const adminLinks = document.querySelectorAll('.admin-nav a');

    /**
     * 1. Professional Header Scroll Logic
     * Changes the header background from deep black to the primary green 
     * theme color (#03411d) when the user scrolls down.
     */
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleHeaderScroll);

    /**
     * 2. Mobile Navigation Toggle
     * Manages the hamburger menu animation and the sliding mobile nav 
     * for smaller screen sizes.
     */
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            // Toggles the visual 'X' animation for the hamburger icon
            hamburger.classList.toggle('is-active');
            // Slides the navigation menu in/out on mobile
            nav.classList.toggle('nav-active');
        });
    }

    /**
     * 3. Admin Dashboard Activity & UI Logic
     * Manages the active state of navigation links within the Admin Dashboard.
     */
    if (adminLinks.length > 0) {
        adminLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Remove active class from all links and apply to the clicked one
                adminLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    /**
     * 4. Product Card Interactions
     * Enhances the professional feel by adding subtle click effects or 
     * logging actions for the admin activity log.
     */
    const productCards = document.querySelectorAll('.product-card a');
    productCards.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productName = e.target.closest('.product-card').querySelector('h3').innerText;
            console.log(`Action: Viewing details for ${productName}`);
            // This can be expanded to update an activity database for the admin dashboard.
        });
    });

    // Initial check for scroll position on page load
    handleHeaderScroll();
});
