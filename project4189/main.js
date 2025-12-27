/**
 * Nandana Tea - main.js
 * Professional scripts for navigation, secret access, and admin systems.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Core UI Elements
    const UI = {
        header: document.querySelector('header'),
        hamburger: document.querySelector('.hamburger-menu'),
        nav: document.querySelector('nav'),
        adminLinks: document.querySelectorAll('.admin-nav .nav-item[data-target]'),
        adminTabs: document.querySelectorAll('.admin-tab'),
        currentTitle: document.getElementById('current-section-title')
    };

    /**
     * 2. Header & Scroll Logic
     */
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            UI.header?.classList.add('scrolled');
        } else {
            UI.header?.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleHeaderScroll);
    UI.hamburger?.addEventListener('click', () => {
        UI.hamburger.classList.toggle('is-active');
        UI.nav.classList.toggle('nav-active');
    });

    /**
     * 3. Secret Admin Entry Logic
     * Press 'Shift + A' on any page to go to the login portal.
     */
    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key.toLowerCase() === 'a') {
            window.location.href = 'login.html';
        }
    });

    /**
     * 4. Admin Dashboard Tab Navigation
     * Switches between Dashboard, Products, and Inquiries instantly.
     */
    if (UI.adminLinks.length > 0) {
        UI.adminLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-target');

                // Toggle Link Active State
                UI.adminLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Toggle Tab Visibility
                UI.adminTabs.forEach(tab => {
                    tab.classList.remove('active');
                    if (tab.id === targetId) tab.classList.add('active');
                });

                // Update Header Title
                if (UI.currentTitle) {
                    UI.currentTitle.innerText = link.innerText.trim() + " Overview";
                }
            });
        });
    }

    /**
     * 5. Initializing Logic Systems
     */
    ProductSystem.init();
    WholesaleSystem.init();
    AdminActivity.init();
    
    // Check if a user is already logged in to show an admin shortcut
    if (sessionStorage.getItem('isAdmin') === 'true' && !UI.adminLinks.length) {
        showFloatingAdminButton();
    }
});

/**
 * 6. Product Management System
 */
const ProductSystem = {
    storageKey: 'nandana_products',

    init() {
        this.container = document.getElementById('products-list');
        this.form = document.getElementById('product-form');
        this.modal = document.getElementById('product-modal');
        
        if (!this.container) return;

        this.render();
        this.bindEvents();
    },

    render() {
        const products = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        const totalEl = document.querySelector('.stat-number');
        if (totalEl) totalEl.textContent = products.length;

        if (products.length === 0) {
            this.container.innerHTML = `<p class="empty-msg">No products in inventory.</p>`;
            return;
        }

        this.container.innerHTML = products.map(p => `
            <div class="product-item">
                <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/60'">
                <div class="product-item-details">
                    <h4>${p.name}</h4>
                    <p>$${parseFloat(p.price).toFixed(2)}</p>
                </div>
                <div class="product-item-actions">
                    <button class="btn-icon delete-btn" onclick="ProductSystem.delete('${p.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },

    delete(id) {
        if (confirm('Permanently remove this product?')) {
            let products = JSON.parse(localStorage.getItem(this.storageKey)) || [];
            products = products.filter(p => p.id !== id);
            localStorage.setItem(this.storageKey, JSON.stringify(products));
            this.render();
            AdminActivity.log(`Deleted SKU: ${id}`, 'Inventory');
        }
    },

    bindEvents() {
        document.getElementById('open-product-modal')?.addEventListener('click', () => {
            this.modal.style.display = 'block';
            setTimeout(() => this.modal.classList.add('show'), 10);
        });

        document.querySelectorAll('.close-modal, .close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.modal.classList.remove('show');
                setTimeout(() => this.modal.style.display = 'none', 300);
            });
        });
    }
};

/**
 * 7. Admin Activity Logging
 */
const AdminActivity = {
    init() {
        this.logTable = document.getElementById('activity-log');
    },

    log(action, category = 'System') {
        if (!this.logTable) return;

        const now = new Date();
        const timestamp = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${timestamp}</td>
            <td>${action}</td>
            <td>${category}</td>
            <td><span class="status-badge success">Synced</span></td>
        `;
        this.logTable.prepend(row);
    }
};

/**
 * 8. Wholesale Portal Helper
 */
const WholesaleSystem = {
    init() {
        const logoutBtn = document.getElementById('admin-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                sessionStorage.clear();
                window.location.href = 'login.html';
            });
        }
    }
};

/**
 * Helper: Show a floating button for logged-in admins on the main site
 */
function showFloatingAdminButton() {
    const btn = document.createElement('a');
    btn.href = 'admin.html';
    btn.innerHTML = `<i class="fa-solid fa-user-shield"></i> Admin Dashboard`;
    btn.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; z-index: 9999;
        background: var(--accent-mint-green); color: var(--primary-dark-green);
        padding: 12px 24px; border-radius: 50px; font-weight: 700;
        text-decoration: none; box-shadow: var(--shadow-lg);
    `;
    document.body.appendChild(btn);
}