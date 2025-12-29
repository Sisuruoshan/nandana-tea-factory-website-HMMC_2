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
     * 0. Admin Dashboard Keyboard Shortcut
     * Navigate to admin login page when Shift + A is pressed on home page
     */
    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && (e.key === 'A' || e.key === 'a')) {
            window.location.href = 'admin_login.html';
        }
    });

    /**
     * 1. Professional Header Scroll Logic
     * Changes the header background from deep black to the primary green 
     * theme color (#03411d) when the user scrolls down.
     */
    const handleHeaderScroll = () => {
        if (!header) return; // No site header on admin pages
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    if (header) {
        window.addEventListener('scroll', handleHeaderScroll);
    }

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
            link.addEventListener('click', function(e) {
                const section = this.getAttribute('data-section');
                if (section) {
                    e.preventDefault();
                    // Remove active class from all links and sections
                    adminLinks.forEach(l => l.classList.remove('active'));
                    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
                    
                    // Add active class to clicked link and corresponding section
                    this.classList.add('active');
                    const targetSection = document.getElementById(`${section}-section`);
                    if (targetSection) {
                        targetSection.classList.add('active');
                    }
                }
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

    /**
     * 5. Product Management System
     */
    initializeProductManagement();

    // 6. Wholesale Portal
    initializeWholesalePortal();

    // 7. Admin Wholesale Management
    initializeAdminWholesaleManagement();
});

/**
 * Product Management System
 * Handles CRUD operations for products in the admin dashboard
 */
let selectedImageDataUrl = null;
function initializeProductManagement() {
    // Initialize products from localStorage or use default products
    if (!localStorage.getItem('products')) {
        const defaultProducts = [
            {
                id: 'black-tea',
                name: 'Nandana Black Tea',
                description: 'Rich, full-bodied black tea.',
                price: 12.00,
                image: 'srs/black tea.jpg'
            },
            {
                id: 'green-tea',
                name: 'Nandana Green Tea',
                description: 'Delicate, refreshing green tea.',
                price: 14.00,
                image: 'srs/green tea.png'
            },
            {
                id: 'white-tea',
                name: 'Nandana White Tea',
                description: 'Rare, subtly sweet white tea.',
                price: 18.00,
                image: 'srs/white tea.png'
            },
            {
                id: 'oolong-tea',
                name: 'Nandana Oolong Tea',
                description: 'Complex, aromatic oolong tea.',
                price: 16.00,
                image: 'srs/oolong tea.png'
            },
            {
                id: 'almond-tea',
                name: 'Nandana Almond Tea',
                description: 'Elegant, refined Ahmad Tea',
                price: 17.00,
                image: 'srs/ahmad tea.png'
            },
            {
                id: 'cinnamon-tea',
                name: 'Nandana Cinnamon Tea',
                description: 'Warm, spicy Cinnamon Tea',
                price: 19.00,
                image: 'srs/cinnamon tea.jpg'
            }
        ];
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }

    const modal = document.getElementById('product-modal');
    const addBtn = document.getElementById('add-product-btn');
    const closeBtn = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancel-btn');
    const productForm = document.getElementById('product-form');
    const fileInput = document.getElementById('product-image-file');
    const previewImg = document.getElementById('image-preview');
    
    if (!modal) return; // Not on admin page

    // Load and display products
    loadProducts();

    // Add product button
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            openModal('add');
        });
    }

    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Form submission
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveProduct();
        });
    }

    // Image file selection
    if (fileInput) {
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) {
                selectedImageDataUrl = null;
                if (previewImg) previewImg.removeAttribute('src');
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                selectedImageDataUrl = reader.result;
                if (previewImg) previewImg.src = selectedImageDataUrl;
            };
            reader.readAsDataURL(file);
        });
    }
}

function loadProducts() {
    const productsList = document.getElementById('products-list');
    if (!productsList) return;

    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Update total products count
    const totalProductsEl = document.getElementById('total-products');
    if (totalProductsEl) {
        totalProductsEl.textContent = products.length;
    }

    productsList.innerHTML = products.map(product => `
        <div class="product-item" data-id="${product.id}">
            <div class="product-item-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/100x100?text=No+Image'">
            </div>
            <div class="product-item-details">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <p class="product-item-price">$${parseFloat(product.price).toFixed(2)}</p>
            </div>
            <div class="product-item-actions">
                <button class="btn-icon edit-btn" onclick="editProduct('${product.id}')" title="Edit">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn-icon delete-btn" onclick="deleteProduct('${product.id}')" title="Delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function openModal(mode, productId = null) {
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('product-form');
    const previewImg = document.getElementById('image-preview');
    const fileInput = document.getElementById('product-image-file');
    
    form.reset();
    
    if (mode === 'add') {
        modalTitle.textContent = 'Add New Product';
        document.getElementById('product-id').value = '';
        selectedImageDataUrl = null;
        if (previewImg) previewImg.removeAttribute('src');
        if (fileInput) fileInput.value = '';
    } else if (mode === 'edit' && productId) {
        modalTitle.textContent = 'Edit Product';
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products.find(p => p.id === productId);
        
        if (product) {
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-description').value = product.description;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-id-slug').value = product.id;
            document.getElementById('product-origin').value = product.origin || '';
            document.getElementById('product-notes').value = product.notes || '';
            document.getElementById('product-brew').value = product.brew ? product.brew.join('\n') : '';
            document.getElementById('product-long-desc').value = product.longDesc || '';
            // Show existing image in preview; keep unless replaced
            if (previewImg) previewImg.src = product.image;
            selectedImageDataUrl = null;
            if (fileInput) fileInput.value = '';
        }
    }
    
    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
}

function saveProduct() {
    const productId = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value.trim();
    const description = document.getElementById('product-description').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const idSlug = document.getElementById('product-id-slug').value.trim();
    const origin = document.getElementById('product-origin').value.trim();
    const notes = document.getElementById('product-notes').value.trim();
    const brewText = document.getElementById('product-brew').value.trim();
    const brew = brewText ? brewText.split('\n').filter(line => line.trim()) : [];
    const longDesc = document.getElementById('product-long-desc').value.trim();
    
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    if (productId) {
        // Edit existing product
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            const imageToUse = selectedImageDataUrl ? selectedImageDataUrl : products[index].image;
            products[index] = { 
                id: idSlug, 
                name, 
                description, 
                price, 
                image: imageToUse,
                origin,
                notes,
                brew,
                longDesc
            };
            logActivity(`Updated Product: ${name}`);
        }
    } else {
        // Add new product
        if (!selectedImageDataUrl) {
            alert('Please select a product image.');
            return;
        }
        const newProduct = { 
            id: idSlug, 
            name, 
            description, 
            price, 
            image: selectedImageDataUrl,
            origin,
            notes,
            brew,
            longDesc
        };
        products.push(newProduct);
        logActivity(`Added New Product: ${name}`);
    }
    
    localStorage.setItem('products', JSON.stringify(products));
    loadProducts();
    closeModal();
    selectedImageDataUrl = null;
    
    alert('Product saved successfully!');
}

function editProduct(productId) {
    openModal('edit', productId);
}

function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    const filteredProducts = products.filter(p => p.id !== productId);
    
    localStorage.setItem('products', JSON.stringify(filteredProducts));
    loadProducts();
    
    if (product) {
        logActivity(`Deleted Product: ${product.name}`);
    }
    
    alert('Product deleted successfully!');
}

function logActivity(action) {
    const activityLog = document.getElementById('activity-log');
    if (!activityLog) return;
    
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${timestamp}</td>
        <td>${action}</td>
        <td>Admin_01</td>
        <td><span class="status-badge success">Completed</span></td>
    `;
    
    activityLog.insertBefore(newRow, activityLog.firstChild);
}

/**
 * Wholesale Portal: dataset and rendering
 */
function ensureWholesaleDefaults() {
    if (!localStorage.getItem('wholesaleProducts')) {
        const retail = JSON.parse(localStorage.getItem('products')) || [];
        const fallback = retail.length ? retail : [
            { id: 'black-tea', name: 'Nandana Black Tea', description: 'Rich, full-bodied black tea.', price: 12.00, image: 'srs/black tea.jpg' },
            { id: 'green-tea', name: 'Nandana Green Tea', description: 'Delicate, refreshing green tea.', price: 14.00, image: 'srs/green tea.png' },
            { id: 'white-tea', name: 'Nandana White Tea', description: 'Rare, subtly sweet white tea.', price: 18.00, image: 'srs/white tea.png' }
        ];
        const ws = fallback.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            wholesalePrice: p.price, // default same; admin can change
            minQty: 10,
            image: p.image
        }));
        localStorage.setItem('wholesaleProducts', JSON.stringify(ws));
    }
}

function initializeWholesalePortal() {
    const loginForm = document.getElementById('wholesale-login-form');
    const loginSection = document.getElementById('login-section');
    const productsSection = document.getElementById('wholesale-products-section');
    const logoutBtn = document.getElementById('logout-btn');
    const grid = document.getElementById('wholesale-products-grid');
    if (!loginForm && !productsSection && !grid) return; // Not on wholesale page

    ensureWholesaleDefaults();

    // Check if already logged in (session storage)
    const isLoggedIn = sessionStorage.getItem('wholesaleLoggedIn');
    if (isLoggedIn === 'true') {
        if (loginSection) loginSection.style.display = 'none';
        if (productsSection) productsSection.style.display = 'block';
        renderWholesaleProducts();
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Mark as logged in
            sessionStorage.setItem('wholesaleLoggedIn', 'true');
            // Hide login, show products
            if (loginSection) loginSection.style.display = 'none';
            if (productsSection) productsSection.style.display = 'block';
            renderWholesaleProducts();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Clear login state
            sessionStorage.removeItem('wholesaleLoggedIn');
            // Reset form and show login section
            if (loginForm) loginForm.reset();
            if (loginSection) loginSection.style.display = 'block';
            if (productsSection) productsSection.style.display = 'none';
        });
    }
}

function renderWholesaleProducts() {
    const grid = document.getElementById('wholesale-products-grid');
    if (!grid) return;
    const products = JSON.parse(localStorage.getItem('wholesaleProducts')) || [];
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/320x200?text=No+Image'">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <div class="price">Wholesale: $${parseFloat(p.wholesalePrice).toFixed(2)} / unit</div>
            <div class="bulk-actions">
                <label>Qty (min ${p.minQty})</label>
                <div class="qty-control">
                    <button type="button" class="qty-btn qty-minus" data-id="${p.id}">−</button>
                    <input type="number" class="bulk-qty" data-id="${p.id}" min="${p.minQty}" value="${p.minQty}" />
                    <button type="button" class="qty-btn qty-plus" data-id="${p.id}">+</button>
                </div>
                <button class="btn btn-primary bulk-add" data-id="${p.id}">Add to Bulk Order</button>
            </div>
        </div>
    `).join('');

    // Wire up quantity validation and add buttons
    const qtyInputs = grid.querySelectorAll('.bulk-qty');
    qtyInputs.forEach(input => {
        const min = parseInt(input.min, 10) || 10;
        const btn = grid.querySelector(`.bulk-add[data-id="${input.dataset.id}"]`);
        const minusBtn = grid.querySelector(`.qty-minus[data-id="${input.dataset.id}"]`);
        const plusBtn = grid.querySelector(`.qty-plus[data-id="${input.dataset.id}"]`);
        
        const validate = () => {
            const val = parseInt(input.value, 10) || 0;
            btn.disabled = val < min;
        };
        
        input.addEventListener('input', validate);
        
        if (minusBtn) {
            minusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const val = parseInt(input.value, 10) || min;
                input.value = Math.max(val - 1, min);
                validate();
            });
        }
        
        if (plusBtn) {
            plusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const val = parseInt(input.value, 10) || min;
                input.value = val + 1;
                validate();
            });
        }
        
        validate();
    });

    const addButtons = grid.querySelectorAll('.bulk-add');
    addButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const input = grid.querySelector(`.bulk-qty[data-id="${id}"]`);
            const qty = parseInt(input.value, 10) || 0;
            const products = JSON.parse(localStorage.getItem('wholesaleProducts')) || [];
            const p = products.find(x => x.id === id);
            if (!p) return;
            if (qty < p.minQty) {
                alert(`Minimum order is ${p.minQty}.`);
                return;
            }
            const total = qty * parseFloat(p.wholesalePrice);
            alert(`Added ${qty} x ${p.name} to bulk order. Total: $${total.toFixed(2)}`);
        });
    });
}

/**
 * Admin Wholesale Management
 */
function initializeAdminWholesaleManagement() {
    const wsSection = document.getElementById('wsproducts-section');
    if (!wsSection) return; // Not on admin page or section not present
    ensureWholesaleDefaults();

    const addBtn = document.getElementById('add-ws-product-btn');
    const modal = document.getElementById('ws-product-modal');
    const closeBtn = document.getElementById('ws-close');
    const cancelBtn = document.getElementById('ws-cancel');
    const form = document.getElementById('ws-product-form');

    loadWholesaleAdminProducts();

    if (addBtn) addBtn.addEventListener('click', () => openWsModal('add'));
    if (closeBtn) closeBtn.addEventListener('click', closeWsModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeWsModal);
    window.addEventListener('click', (e) => { if (e.target === modal) closeWsModal(); });
    if (form) form.addEventListener('submit', (e) => { e.preventDefault(); saveWsProduct(); });
}

function loadWholesaleAdminProducts() {
    const listEl = document.getElementById('ws-products-list');
    if (!listEl) return;
    const products = JSON.parse(localStorage.getItem('wholesaleProducts')) || [];
    listEl.innerHTML = products.map(p => `
        <div class="product-item" data-id="${p.id}">
            <div class="product-item-image">
                <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/100x100?text=No+Image'">
            </div>
            <div class="product-item-details">
                <h4>${p.name}</h4>
                <p>${p.description}</p>
                <p class="product-item-price">Retail: $${parseFloat(p.price).toFixed(2)} | Wholesale: $${parseFloat(p.wholesalePrice).toFixed(2)}</p>
                <p class="product-item-price">Min Qty: ${p.minQty}</p>
            </div>
            <div class="product-item-actions">
                <button class="btn-icon edit-btn" onclick="editWsProduct('${p.id}')" title="Edit">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn-icon delete-btn" onclick="deleteWsProduct('${p.id}')" title="Delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function openWsModal(mode, id = null) {
    const modal = document.getElementById('ws-product-modal');
    const title = document.getElementById('ws-modal-title');
    const form = document.getElementById('ws-product-form');
    form.reset();
    document.getElementById('ws-product-id').value = '';
    if (mode === 'add') {
        title.textContent = 'Add Wholesale Product';
    } else if (mode === 'edit' && id) {
        title.textContent = 'Edit Wholesale Product';
        const products = JSON.parse(localStorage.getItem('wholesaleProducts')) || [];
        const p = products.find(x => x.id === id);
        if (p) {
            document.getElementById('ws-product-id').value = p.id;
            document.getElementById('ws-product-name').value = p.name;
            document.getElementById('ws-product-description').value = p.description;
            document.getElementById('ws-product-price').value = p.price;
            document.getElementById('ws-product-wholesale-price').value = p.wholesalePrice;
            document.getElementById('ws-product-minqty').value = p.minQty;
            document.getElementById('ws-product-image').value = p.image;
            document.getElementById('ws-product-id-slug').value = p.id;
        }
    }
    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeWsModal() {
    const modal = document.getElementById('ws-product-modal');
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
}

function saveWsProduct() {
    const idExisting = document.getElementById('ws-product-id').value;
    const idSlug = document.getElementById('ws-product-id-slug').value.trim();
    const name = document.getElementById('ws-product-name').value.trim();
    const description = document.getElementById('ws-product-description').value.trim();
    const price = parseFloat(document.getElementById('ws-product-price').value);
    const wholesalePrice = parseFloat(document.getElementById('ws-product-wholesale-price').value);
    const minQty = parseInt(document.getElementById('ws-product-minqty').value, 10) || 10;
    const image = document.getElementById('ws-product-image').value.trim();
    const products = JSON.parse(localStorage.getItem('wholesaleProducts')) || [];

    if (idExisting) {
        const index = products.findIndex(p => p.id === idExisting);
        if (index !== -1) {
            products[index] = { id: idSlug, name, description, price, wholesalePrice, minQty, image };
            logActivity(`Updated Wholesale: ${name}`);
        }
    } else {
        products.push({ id: idSlug, name, description, price, wholesalePrice, minQty, image });
        logActivity(`Added Wholesale: ${name}`);
    }
    localStorage.setItem('wholesaleProducts', JSON.stringify(products));
    loadWholesaleAdminProducts();
    closeWsModal();
    alert('Wholesale product saved successfully!');
}

function editWsProduct(id) { openWsModal('edit', id); }

function deleteWsProduct(id) {
    if (!confirm('Are you sure you want to delete this wholesale product?')) return;
    const products = JSON.parse(localStorage.getItem('wholesaleProducts')) || [];
    const p = products.find(x => x.id === id);
    const filtered = products.filter(x => x.id !== id);
    localStorage.setItem('wholesaleProducts', JSON.stringify(filtered));
    loadWholesaleAdminProducts();
    if (p) logActivity(`Deleted Wholesale: ${p.name}`);
    alert('Wholesale product deleted successfully!');
}

/**
 * Inquiry Management for Admin
 */
function initializeInquiryManagement() {
    const inqSection = document.getElementById('inquiries-section');
    if (!inqSection) return;

    const refreshBtn = document.getElementById('refresh-inquiries-btn');
    const modal = document.getElementById('inquiry-modal');
    const closeBtn = document.getElementById('inquiry-close');
    const cancelBtn = document.getElementById('inquiry-cancel');
    const saveBtn = document.getElementById('save-inquiry-btn');
    const sendBtn = document.getElementById('send-reply-btn');

    loadInquiries();

    if (refreshBtn) refreshBtn.addEventListener('click', loadInquiries);
    if (closeBtn) closeBtn.addEventListener('click', closeInquiryModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeInquiryModal);
    window.addEventListener('click', (e) => { if (e.target === modal) closeInquiryModal(); });
    if (saveBtn) saveBtn.addEventListener('click', saveInquiryEdit);
    if (sendBtn) sendBtn.addEventListener('click', sendInquiryReply);
}

function getInquiries() {
    return JSON.parse(localStorage.getItem('inquiries') || '[]');
}

function loadInquiries() {
    const listEl = document.getElementById('inquiries-list');
    if (!listEl) return;
    const inquiries = getInquiries();
    if (inquiries.length === 0) {
        listEl.innerHTML = '<tr><td colspan="6">No inquiries yet.</td></tr>';
        return;
    }

    listEl.innerHTML = inquiries.map(i => `
        <tr data-id="${i.id}">
            <td>${new Date(i.timestamp).toLocaleString()}</td>
            <td>${escapeHtml(i.name)}</td>
            <td>${escapeHtml(i.email)}</td>
            <td>${escapeHtml(i.subject)}</td>
            <td class="short-message">${escapeHtml(i.message).slice(0,120)}${i.message.length>120? '...':''}</td>
            <td>
                <button class="btn btn-small" onclick="openInquiryModal('${i.id}')"><i class="fa-solid fa-pen-to-square"></i> View</button>
                <button class="btn btn-small" onclick="openInquiryModal('${i.id}', true)"><i class="fa-solid fa-reply"></i> Reply</button>
                <button class="btn btn-danger btn-small" onclick="deleteInquiry('${i.id}')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function openInquiryModal(id, focusReply = false) {
    const inquiries = getInquiries();
    const i = inquiries.find(x => x.id === id);
    if (!i) return;
    document.getElementById('inquiry-id').value = i.id;
    document.getElementById('inquiry-name').value = i.name;
    document.getElementById('inquiry-email').value = i.email;
    document.getElementById('inquiry-subject').value = i.subject;
    document.getElementById('inquiry-message').value = i.message;
    document.getElementById('inquiry-reply').value = i.replyMessage || '';

    const modal = document.getElementById('inquiry-modal');
    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('show'), 10);

    if (focusReply) {
        setTimeout(() => document.getElementById('inquiry-reply').focus(), 200);
    }
}

function closeInquiryModal() {
    const modal = document.getElementById('inquiry-modal');
    if (!modal) return;
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
}

function saveInquiryEdit() {
    const id = document.getElementById('inquiry-id').value;
    const name = document.getElementById('inquiry-name').value.trim();
    const email = document.getElementById('inquiry-email').value.trim();
    const subject = document.getElementById('inquiry-subject').value.trim();
    const message = document.getElementById('inquiry-message').value.trim();
    const replyMessage = document.getElementById('inquiry-reply').value.trim();

    const inquiries = getInquiries();
    const idx = inquiries.findIndex(x => x.id === id);
    if (idx === -1) return alert('Inquiry not found');

    inquiries[idx].name = name;
    inquiries[idx].email = email;
    inquiries[idx].subject = subject;
    inquiries[idx].message = message;
    inquiries[idx].replyMessage = replyMessage;

    localStorage.setItem('inquiries', JSON.stringify(inquiries));
    loadInquiries();
    logActivity(`Edited Inquiry: ${subject}`);
    alert('Inquiry saved.');
    closeInquiryModal();
}

function sendInquiryReply() {
    const id = document.getElementById('inquiry-id').value;
    const reply = document.getElementById('inquiry-reply').value.trim();
    const inquiries = getInquiries();
    const idx = inquiries.findIndex(x => x.id === id);
    if (idx === -1) return alert('Inquiry not found');

    const inquiry = inquiries[idx];
    const subject = `Re: ${inquiry.subject}`;
    const body = `${reply}\n\n--- Original Message ---\n${inquiry.message}`;

    // Save reply draft and mark replied
    inquiry.replyMessage = reply;
    inquiry.replied = true;
    localStorage.setItem('inquiries', JSON.stringify(inquiries));
    loadInquiries();

    // Open user's mail client with mailto:
    const mailto = `mailto:${encodeURIComponent(inquiry.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    logActivity(`Replied to Inquiry: ${inquiry.subject}`);
    closeInquiryModal();
}

function deleteInquiry(id) {
    if (!confirm('Delete this inquiry?')) return;
    const inquiries = getInquiries();
    const filtered = inquiries.filter(x => x.id !== id);
    localStorage.setItem('inquiries', JSON.stringify(filtered));
    loadInquiries();
    logActivity('Deleted an inquiry');
}

// Utility: simple HTML escape
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function (s) {
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s];
    });
}

// Initialize inquiries when admin page loads
document.addEventListener('DOMContentLoaded', initializeInquiryManagement);

/**
 * Cart helpers: update cart count in header and listen for storage changes
 */
function updateCartCount() {
    const countEls = document.querySelectorAll('.cart-count');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalQty = cart.reduce((s, i) => s + (parseInt(i.qty, 10) || 0), 0);
    countEls.forEach(el => el.textContent = totalQty);
}

window.updateCartCount = updateCartCount;

// Update count on storage change (other tabs) and on load
window.addEventListener('storage', (e) => {
    if (e.key === 'cart') updateCartCount();
});

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

/**
 * Simple client-side user management (localStorage)
 */
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function createUser({id, name, email, password, phone, address}) {
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false, message: 'Email already registered' };
    }
    const user = { id: id || 'u_' + Date.now(), name, email, password, phone: phone || '', address: address || '' };
    users.push(user);
    saveUsers(users);
    return { ok: true, user };
}

function authenticateUser(email, password) {
    const users = getUsers();
    const u = users.find(x => x.email.toLowerCase() === (email||'').toLowerCase() && x.password === password);
    if (!u) return { ok: false, message: 'Invalid credentials' };
    localStorage.setItem('currentUserId', u.id);
    updateUserUI();
    return { ok: true, user: u };
}

function getCurrentUser() {
    const id = localStorage.getItem('currentUserId');
    if (!id) return null;
    return getUsers().find(u => u.id === id) || null;
}

function logoutUser() {
    localStorage.removeItem('currentUserId');
    updateUserUI();
}

function updateUserProfile(updates) {
    const cur = getCurrentUser();
    if (!cur) return { ok: false };
    const users = getUsers();
    const idx = users.findIndex(u => u.id === cur.id);
    if (idx === -1) return { ok: false };
    users[idx] = { ...users[idx], ...updates };
    saveUsers(users);
    return { ok: true, user: users[idx] };
}

function updateUserUI() {
    const headerIcons = document.querySelectorAll('.header-icons');
    headerIcons.forEach(container => {
        const cur = getCurrentUser();
        if (cur) {
            container.innerHTML = `
                <a href="profile.html" class="user-link"><img src="srs/avatar-placeholder.png" alt="user" class="user-icon"> ${escapeHtml(cur.name.split(' ')[0]||cur.name)}</a>
                <a href="#" id="logout-link" title="Logout"><i class="fa-solid fa-right-from-bracket"></i></a>
            `;
            const logout = container.querySelector('#logout-link');
            if (logout) logout.addEventListener('click', (e)=>{ e.preventDefault(); logoutUser(); });
        } else {
            container.innerHTML = `<a href="user_login.html"><i class="fa-solid fa-user"></i></a>`;
        }
    });
}

// Ensure UI updates on load
document.addEventListener('DOMContentLoaded', updateUserUI);
