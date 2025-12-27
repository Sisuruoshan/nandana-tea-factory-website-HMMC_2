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
    
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    if (productId) {
        // Edit existing product
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            const imageToUse = selectedImageDataUrl ? selectedImageDataUrl : products[index].image;
            products[index] = { id: idSlug, name, description, price, image: imageToUse };
            logActivity(`Updated Product: ${name}`);
        }
    } else {
        // Add new product
        if (!selectedImageDataUrl) {
            alert('Please select a product image.');
            return;
        }
        const newProduct = { id: idSlug, name, description, price, image: selectedImageDataUrl };
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

