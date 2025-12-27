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
        adminTabs: document.querySelectorAll('.admin-tab')
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
     */
    if (UI.adminLinks.length > 0) {
        // reusable activator for admin tabs
        function activateAdminTab(targetId, pushHash = false) {
            if (!targetId) return;
            UI.adminLinks.forEach(l => l.classList.toggle('active', l.getAttribute('data-target') === targetId));
            UI.adminTabs.forEach(tab => tab.classList.toggle('active', tab.id === targetId));
            if (pushHash) {
                try { window.location.hash = '#' + targetId; } catch (err) { /* ignore */ }
            }
        }

        UI.adminLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-target');
                activateAdminTab(targetId, true);
            });
        });

        // If URL has a hash on load, activate corresponding tab
        const hash = window.location.hash;
        if (hash) {
            const target = hash.replace('#', '');
            activateAdminTab(target, false);
        }

        // Respond to back/forward browser navigation
        window.addEventListener('hashchange', () => {
            const t = window.location.hash.replace('#', '');
            if (t) activateAdminTab(t, false);
        });
    }

    /**
     * 5. Initializing Logic Systems
     */
    ProductSystem.init();
    AdminActivity.init();
    WholesaleSystem.init();
    WholesaleAdmin.init();
    
    // Check if user is admin to show shortcut button
    if (sessionStorage.getItem('isAdmin') === 'true' && !UI.adminLinks.length) {
        showFloatingAdminButton();
    }
});

/**
 * 6. Product Management System
 * Handles adding, deleting, and rendering products via LocalStorage
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
        
        // Update Stats in Dashboard
        const totalEl = document.getElementById('total-inventory-count');
        if (totalEl) totalEl.textContent = products.length;

        if (products.length === 0) {
            this.container.innerHTML = `<p class="empty-msg">Scanning local storage inventory... (Empty)</p>`;
            return;
        }

        this.container.innerHTML = products.map(p => `
            <div class="product-item">
                <img src="${p.img || 'srs/white-tea.jpg'}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/60'">
                <div class="product-item-details">
                    <h4>${p.name}</h4>
                    <p>$${parseFloat(p.price).toFixed(2)} — ID: ${p.id}</p>
                </div>
                <div class="product-item-actions">
                    <button class="btn-icon delete-btn" onclick="ProductSystem.delete('${p.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },

    save(e) {
        e.preventDefault();
        const products = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        
        const newProduct = {
            id: document.getElementById('product-id-slug').value,
            name: document.getElementById('product-name').value,
            price: document.getElementById('product-price').value,
            desc: document.getElementById('product-description').value,
            img: document.getElementById('product-image').value
        };

        products.push(newProduct);
        localStorage.setItem(this.storageKey, JSON.stringify(products));
        
        this.render();
        this.closeModal();
        AdminActivity.log(`Added SKU: ${newProduct.id}`, 'Inventory');
        this.form.reset();
    },

    delete(id) {
        if (confirm('Permanently remove this product from inventory?')) {
            let products = JSON.parse(localStorage.getItem(this.storageKey)) || [];
            products = products.filter(p => p.id !== id);
            localStorage.setItem(this.storageKey, JSON.stringify(products));
            this.render();
            AdminActivity.log(`Deleted SKU: ${id}`, 'Inventory');
        }
    },

    bindEvents() {
        this.form?.addEventListener('submit', (e) => this.save(e));

        document.getElementById('open-product-modal')?.addEventListener('click', () => {
            this.modal.style.display = 'block';
            setTimeout(() => this.modal.classList.add('show'), 10);
        });

        document.querySelectorAll('.close-modal, .close-btn').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
    },

    closeModal() {
        this.modal.classList.remove('show');
        setTimeout(() => this.modal.style.display = 'none', 300);
    }
};

/**
 * 7. Admin Activity Logging
 */
const AdminActivity = {
    init() {
        this.logTable = document.getElementById('activity-log');
        this.updateDashboardKpis();
    },

    updateDashboardKpis() {
        // Update total inventory count
        const products = JSON.parse(localStorage.getItem(ProductSystem.storageKey) || '[]');
        const totalEl = document.getElementById('total-inventory-count');
        if (totalEl) totalEl.textContent = products.length;

        // Update B2B partners count
        const assignments = JSON.parse(localStorage.getItem('wholesale_assignments') || '{}');
        const partnersEl = document.getElementById('total-partners');
        if (partnersEl) partnersEl.textContent = Object.keys(assignments).length;

        // Update actions today (count of activity log rows)
        const actionsEl = document.getElementById('actions-today');
        if (actionsEl && this.logTable) {
            actionsEl.textContent = this.logTable.querySelectorAll('tbody tr').length;
        }
    },

    log(action, category = 'System') {
        if (!this.logTable) return;

        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        
        const row = document.createElement('tr');
        row.style.animation = "fadeIn 0.5s ease forwards";
        row.innerHTML = `
            <td>${date}, ${time}</td>
            <td>${action}</td>
            <td>${category}</td>
            <td><span class="status-badge success">Synced</span></td>
        `;
        this.logTable.prepend(row);
        this.updateDashboardKpis();
    }
};

/**
 * 8. Wholesale & System Helpers
 */
const WholesaleSystem = {
    init() {
        // Handle global logout
        document.getElementById('admin-logout')?.addEventListener('click', (e) => {
            e.preventDefault();
            if(confirm("Logout from Admin Session?")) {
                sessionStorage.clear();
                window.location.href = 'login.html';
            }
        });
    }
};

// Enhance Wholesale behavior: login, logout, and render partner items
WholesaleSystem.init = function() {
    // retain admin logout behavior
    document.getElementById('admin-logout')?.addEventListener('click', (e) => {
        e.preventDefault();
        if(confirm("Logout from Admin Session?")) {
            sessionStorage.clear();
            window.location.href = 'login.html';
        }
    });

    // Wholesale login form (wholesale.html)
    const wsForm = document.getElementById('wholesale-login-form');
    if (wsForm) {
        wsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = (document.getElementById('email')?.value || '').trim().toLowerCase();
            const pass = (document.getElementById('password')?.value || '').trim();

            // Simple demo auth: accept non-empty email/password. Replace with real auth later.
            if (!email || !pass) {
                alert('Please enter email and password.');
                return;
            }

            // Save wholesale session
            const partner = { email, name: email.split('@')[0] };
            sessionStorage.setItem('wholesaleUser', JSON.stringify(partner));

            // Show products section
            document.getElementById('login-section')?.style && (document.getElementById('login-section').style.display = 'none');
            const wsSection = document.getElementById('wholesale-products-section');
            if (wsSection) wsSection.style.display = 'block';

            // Render assigned wholesale products
            renderWholesaleProducts(partner.email);
        });
    }

    // Logout button on wholesale page
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        sessionStorage.removeItem('wholesaleUser');
        window.location.reload();
    });

    // If already logged in as wholesale partner, show products
    try {
        const stored = sessionStorage.getItem('wholesaleUser');
        if (stored) {
            const p = JSON.parse(stored);
            document.getElementById('login-section')?.style && (document.getElementById('login-section').style.display = 'none');
            const wsSection = document.getElementById('wholesale-products-section');
            if (wsSection) wsSection.style.display = 'block';
            renderWholesaleProducts(p.email);
        }
    } catch (err) { /* ignore parse errors */ }
};

function renderWholesaleProducts(partnerEmail) {
    // Load master product list from localStorage (Admin ProductSystem stores items there)
    const products = JSON.parse(localStorage.getItem(ProductSystem.storageKey) || '[]');

    // Assignments: map partnerEmail -> array of product ids stored in localStorage
    const assignments = JSON.parse(localStorage.getItem('wholesale_assignments') || '{}');
    const assignedIds = assignments[partnerEmail] || [];

    const grid = document.getElementById('wholesale-products-grid');
    if (!grid) return;

    const renderList = assignedIds.length > 0 ? products.filter(p => assignedIds.includes(p.id)) : products;

    if (renderList.length === 0) {
        grid.innerHTML = `<p class="empty-msg">No wholesale items assigned for this partner.</p>`;
        return;
    }

    grid.innerHTML = renderList.map(p => {
        const wholesalePrice = (parseFloat(p.price) * 0.8).toFixed(2); // example 20% discount
        return `
            <div class="product-card">
                <img src="${p.img || 'srs/white-tea.jpg'}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p>${p.desc || ''}</p>
                <div class="price">Retail: $${parseFloat(p.price).toFixed(2)}</div>
                <div class="price wholesale-price">Wholesale: $${wholesalePrice}</div>
                <a href="product.html?id=${p.id}" class="btn">View</a>
            </div>
        `;
    }).join('');
}

function showFloatingAdminButton() {
    const btn = document.createElement('a');
    btn.href = 'admin.html';
    btn.innerHTML = `<i class="fa-solid fa-user-shield"></i> Admin Dashboard`;
    btn.className = "floating-admin-nav";
    btn.style.cssText = `
        position: fixed; bottom: 30px; right: 30px; z-index: 10000;
        background: var(--accent-mint-green); color: var(--text-dark);
        padding: 14px 28px; border-radius: 50px; font-weight: 700;
        text-decoration: none; box-shadow: var(--shadow-lg);
        display: flex; align-items: center; gap: 10px;
        transition: all 0.3s ease;
    `;
    document.body.appendChild(btn);
}

/**
 * Admin helpers for wholesale assignments
 */
const WholesaleAdmin = {
    init() {
        this.form = document.getElementById('ws-assign-form');
        this.emailInput = document.getElementById('ws-partner-email');
        this.productList = document.getElementById('ws-product-list');
        this.assignmentsTable = document.getElementById('ws-assignments-table');
        this.refreshBtn = document.getElementById('ws-refresh-btn');

        if (!this.productList) return;

        this.renderProductOptions();
        this.renderAssignmentsTable();

        this.form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAssignment();
        });

        document.getElementById('ws-assign-clear')?.addEventListener('click', () => {
            this.clearSelection();
        });

        this.refreshBtn?.addEventListener('click', () => {
            this.renderProductOptions();
        });
    },

    getProducts() {
        return JSON.parse(localStorage.getItem(ProductSystem.storageKey) || '[]');
    },

    renderProductOptions() {
        const products = this.getProducts();
        if (products.length === 0) {
            this.productList.innerHTML = '<p class="empty-msg">No products in inventory. Add SKUs from the Dashboard.</p>';
            return;
        }

        this.productList.innerHTML = products.map(p => `
            <label><input type="checkbox" value="${p.id}"> <span>${p.name} <small style="color:var(--text-medium);">(${p.id})</small></span></label>
        `).join('');
    },

    saveAssignment() {
        const email = (this.emailInput?.value || '').trim().toLowerCase();
        if (!email) { alert('Enter partner email'); return; }

        const checked = Array.from(this.productList.querySelectorAll('input[type=checkbox]:checked')).map(c => c.value);
        const assignments = JSON.parse(localStorage.getItem('wholesale_assignments') || '{}');
        assignments[email] = checked;
        localStorage.setItem('wholesale_assignments', JSON.stringify(assignments));

        AdminActivity.log(`Assigned ${checked.length} SKUs to ${email}`, 'B2B');
        this.emailInput.value = '';
        this.renderProductOptions();
        this.renderAssignmentsTable();
        alert('Assignment saved');
    },

    renderAssignmentsTable() {
        const tbody = this.assignmentsTable?.querySelector('tbody');
        if (!tbody) return;
        const assignments = JSON.parse(localStorage.getItem('wholesale_assignments') || '{}');
        const rows = Object.keys(assignments).map(email => {
            const ids = assignments[email] || [];
            const label = ids.length === 0 ? '<em>None</em>' : ids.join(', ');
            return `
                <tr>
                    <td>${email}</td>
                    <td>${label}</td>
                    <td><button class="btn btn-secondary" data-email="${email}">Remove</button></td>
                </tr>
            `;
        }).join('');
        tbody.innerHTML = rows || '<tr><td colspan="3"><em>No assignments yet.</em></td></tr>';

        tbody.querySelectorAll('button[data-email]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const em = btn.getAttribute('data-email');
                if (!confirm(`Remove assignments for ${em}?`)) return;
                const assignments = JSON.parse(localStorage.getItem('wholesale_assignments') || '{}');
                delete assignments[em];
                localStorage.setItem('wholesale_assignments', JSON.stringify(assignments));
                AdminActivity.log(`Removed wholesale assignments for ${em}`, 'B2B');
                this.renderAssignmentsTable();
            });
        });
    },

    clearSelection() {
        this.productList.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = false);
    }
};