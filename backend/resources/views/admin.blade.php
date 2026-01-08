<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Nandana Tea</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body class="admin-body">
    <div class="admin-wrapper">
        <aside class="admin-sidebar">
            <div class="logo"><i class="fa-solid fa-leaf"></i> Nandana Admin</div>
            <nav class="admin-nav">
                <a href="#dashboard" class="active" data-section="dashboard"><i class="fa-solid fa-chart-line"></i> Dashboard</a>
                <a href="#products" data-section="products"><i class="fa-solid fa-boxes-stacked"></i> Retail Products</a>
                <a href="#wsproducts" data-section="wsproducts"><i class="fa-solid fa-truck-ramp-box"></i> Wholesale Products</a>
                <a href="#inquiries" data-section="inquiries"><i class="fa-solid fa-envelope"></i> Customer Inquiries</a>
                <a href="#wsinquiries" data-section="wsinquiries"><i class="fa-solid fa-inbox"></i> Wholesale Inquiries</a>
                <a href="/"><i class="fa-solid fa-house"></i> View Site</a>
            </nav>
        </aside>

        <main class="admin-main">
            <!-- Dashboard Section -->
            <div id="dashboard-section" class="admin-section active">
                <section class="admin-stats">
                    <div class="stat-card">
                        <h3>Total Products</h3>
                        <p class="stat-number" id="total-products">6</p>
                    </div>
                    <div class="stat-card">
                        <h3>New Inquiries</h3>
                        <p class="stat-number" id="inquiry-count">0</p>
                    </div>
                    <div class="stat-card">
                        <h3>Wholesale Requests</h3>
                        <p class="stat-number">5</p>
                    </div>
                </section>

                <section class="admin-activity">
                    <h3>Recent Admin Activity</h3>
                    <div class="activity-table-wrapper">
                        <table class="wholesale-table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Action</th>
                                    <th>User</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="activity-log">
                                <tr>
                                    <td>2025-05-10 14:30</td>
                                    <td>Updated Price: Nandana Green Tea</td>
                                    <td>Admin_01</td>
                                    <td><span class="status-badge success">Completed</span></td>
                                </tr>
                                <tr>
                                    <td>2025-05-10 11:15</td>
                                    <td>Responded to Wholesale Inquiry: TeaCo</td>
                                    <td>Admin_01</td>
                                    <td><span class="status-badge pending">Pending</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            <!-- Retail Products Section -->
            <div id="products-section" class="admin-section">
                <section class="admin-products">
                    <div class="section-header">
                        <h3>Retail Products</h3>
                        <button class="btn btn-primary" id="add-product-btn">
                            <i class="fa-solid fa-plus"></i> Add New Product
                        </button>
                    </div>

                    <div class="products-list" id="products-list">
                        <!-- Products will be loaded here dynamically -->
                    </div>
                </section>
            </div>

            <!-- Inquiries Section -->
            <div id="inquiries-section" class="admin-section">
                <section class="admin-inquiries">
                    <h3>Customer Inquiries</h3>
                    <div class="section-header">
                        <button class="btn btn-primary" id="refresh-inquiries-btn"><i class="fa-solid fa-arrows-rotate"></i> Refresh</button>
                    </div>
                    <div class="activity-table-wrapper">
                        <table class="wholesale-table">
                            <thead>
                                <tr>
                                    <th>Received</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Subject</th>
                                    <th>Message</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="inquiries-list">
                                <!-- Inquiries will be injected here -->
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
            
            <!-- Wholesale Inquiries Section -->
            <div id="wsinquiries-section" class="admin-section">
                <section class="admin-inquiries">
                    <h3>Wholesale Inquiries</h3>
                    <div class="section-header">
                        <button class="btn btn-primary" id="refresh-ws-inquiries-btn"><i class="fa-solid fa-arrows-rotate"></i> Refresh</button>
                    </div>
                    <div class="activity-table-wrapper">
                        <table class="wholesale-table">
                            <thead>
                                <tr>
                                    <th>Received</th>
                                    <th>Name</th>
                                    <th>Company</th>
                                    <th>Email</th>
                                    <th>Details</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="ws-inquiries-list">
                                <!-- Wholesale inquiries will be injected here -->
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
            
            <!-- Wholesale Products Management Section -->
            <div id="wsproducts-section" class="admin-section">
                <section class="admin-products">
                    <div class="section-header">
                        <h3>Wholesale Products</h3>
                        <button class="btn btn-primary" id="add-ws-product-btn">
                            <i class="fa-solid fa-plus"></i> Add Wholesale Product
                        </button>
                    </div>
                    <div class="products-list" id="ws-products-list">
                        <!-- Wholesale products will be loaded here dynamically -->
                    </div>
                </section>
            </div>
        </main>

        <!-- Product Modal -->
        <div id="product-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="modal-title">Add New Product</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <form id="product-form">
                    <input type="hidden" id="product-id">
                    
                    <div class="form-group">
                        <label for="product-name">Product Name</label>
                        <input type="text" id="product-name" required>
                    </div>

                    <div class="form-group">
                        <label for="product-description">Description</label>
                        <textarea id="product-description" rows="3" required></textarea>
                    </div>

                    <div class="form-group">
                        <label for="product-price">Price ($)</label>
                        <input type="number" id="product-price" step="0.01" required>
                    </div>

                    <div class="form-group">
                        <label for="product-image">Image Path</label>
                        <input type="text" id="product-image" placeholder="e.g., srs/black tea.jpg" required>
                        <small>Enter the path to the image file</small>
                    </div>

                    <div class="form-group">
                        <label for="product-id-slug">Product ID (URL slug)</label>
                        <input type="text" id="product-id-slug" placeholder="e.g., black-tea" required>
                        <small>Used in product URLs - lowercase with hyphens</small>
                    </div>

                    <div class="form-group">
                        <label for="product-origin">Origin</label>
                        <textarea id="product-origin" rows="2" placeholder="e.g., Harvested from Sri Lankan highland gardens..."></textarea>
                    </div>

                    <div class="form-group">
                        <label for="product-notes">Notes</label>
                        <textarea id="product-notes" rows="2" placeholder="e.g., Malty and bold with a clean finish..."></textarea>
                    </div>

                    <div class="form-group">
                        <label for="product-brew">Brewing Guide</label>
                        <textarea id="product-brew" rows="4" placeholder="Enter each brewing step on a new line, e.g.:
                                2–3 g per 250 ml
                                95°C water
                                Steep 3–4 minutes
                                Enjoy plain or with milk"></textarea>
                        <small>Enter each brewing step on a new line</small>
                    </div>

                    <div class="form-group">
                        <label for="product-long-desc">About this Tea</label>
                        <textarea id="product-long-desc" rows="4" placeholder="Detailed description about the tea..."></textarea>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">
                            <i class="fa-solid fa-save"></i> Save Product
                        </button>
                        <button type="button" class="btn btn-secondary" id="cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Wholesale Product Modal -->
    <div id="ws-product-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="ws-modal-title">Add Wholesale Product</h3>
                <span class="close-modal" id="ws-close">&times;</span>
            </div>
            <form id="ws-product-form">
                <input type="hidden" id="ws-product-id">

                <div class="form-group">
                    <label for="ws-product-name">Product Name</label>
                    <input type="text" id="ws-product-name" required>
                </div>

                <div class="form-group">
                    <label for="ws-product-description">Description</label>
                    <textarea id="ws-product-description" rows="3" required></textarea>
                </div>

                <div class="form-group">
                    <label for="ws-product-price">Retail Price ($)</label>
                    <input type="number" id="ws-product-price" step="0.01" required>
                </div>

                <div class="form-group">
                    <label for="ws-product-wholesale-price">Wholesale Price ($)</label>
                    <input type="number" id="ws-product-wholesale-price" step="0.01" required>
                </div>

                <div class="form-group">
                    <label for="ws-product-minqty">Minimum Quantity</label>
                    <input type="number" id="ws-product-minqty" min="1" value="10" required>
                </div>

                <div class="form-group">
                    <label for="ws-product-stock">Current Stock/Quantity</label>
                    <input type="number" id="ws-product-stock" min="0" value="0" required>
                    <small>Available quantity in inventory</small>
                </div>

                <div class="form-group">
                    <label for="ws-product-image">Image Path</label>
                    <input type="text" id="ws-product-image" placeholder="e.g., srs/black tea.jpg" required>
                </div>

                <div class="form-group">
                    <label for="ws-product-id-slug">Product ID (URL slug)</label>
                    <input type="text" id="ws-product-id-slug" placeholder="e.g., black-tea" required>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <i class="fa-solid fa-save"></i> Save Wholesale Product
                    </button>
                    <button type="button" class="btn btn-secondary" id="ws-cancel">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Inquiry Modal - Professional Reply Page -->
    <div id="inquiry-modal" class="modal">
        <div class="modal-content reply-modal">
            <div class="modal-header reply-header">
                <div>
                    <h3 id="inquiry-modal-title">Respond to Customer Inquiry</h3>
                    <p class="modal-subtitle">Professional response management</p>
                </div>
                <span class="close-modal" id="inquiry-close">&times;</span>
            </div>
            <form id="inquiry-form" class="reply-form">
                <input type="hidden" id="inquiry-id">
                
                <!-- Customer Information Section -->
                <div class="reply-section">
                    <div class="section-title">
                        <i class="fa-solid fa-user-circle"></i>
                        <h4>Customer Information</h4>
                    </div>
                    <div class="info-grid two-cols">
                        <div class="form-group">
                            <label for="inquiry-name">Name</label>
                            <input type="text" id="inquiry-name" readonly>
                        </div>
                        <div class="form-group">
                            <label for="inquiry-email">Email</label>
                            <input type="email" id="inquiry-email" readonly>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="inquiry-subject">Subject</label>
                        <input type="text" id="inquiry-subject" readonly>
                    </div>
                </div>

                <!-- Original Message Section -->
                <div class="reply-section">
                    <div class="section-title">
                        <i class="fa-solid fa-envelope-open"></i>
                        <h4>Original Message</h4>
                    </div>
                    <div class="form-group">
                        <textarea id="inquiry-message" rows="4" readonly class="message-box"></textarea>
                    </div>
                </div>

                <!-- Reply Composition Section -->
                <div class="reply-section reply-composition">
                    <div class="section-title">
                        <i class="fa-solid fa-pen-to-square"></i>
                        <h4>Your Response</h4>
                    </div>
                    <div class="form-group">
                        <label for="inquiry-reply">Compose Reply</label>
                        <div class="editor-container">
                            <textarea id="inquiry-reply" rows="5" placeholder="Write a professional response to the customer's inquiry..." class="reply-editor"></textarea>
                            <div class="char-count"><span id="inquiry-reply-count">0</span>/1000 characters</div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="form-actions reply-actions">
                    <button type="button" class="btn btn-secondary" id="inquiry-cancel">
                        <i class="fa-solid fa-xmark"></i> Cancel
                    </button>
                    <button type="button" class="btn btn-success" id="send-reply-btn">
                        <i class="fa-solid fa-paper-plane"></i> Send Reply
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Wholesale Inquiry Modal -->
    <div id="ws-inquiry-modal" class="modal">
        <div class="modal-content">
            <span class="close-modal" id="ws-inquiry-close">&times;</span>
        </div>
        <form id="ws-inquiry-form">
            <input type="hidden" id="ws-inquiry-id">
            <div class="form-group">
                <label for="ws-inquiry-name">Name</label>
                <input type="text" id="ws-inquiry-name" required>
            </div>
            <div class="form-group">
                <label for="ws-inquiry-company">Company</label>
                <input type="text" id="ws-inquiry-company" required>
            </div>
            <div class="form-group">
                <label for="ws-inquiry-email">Email</label>
                <input type="email" id="ws-inquiry-email" required>
            </div>
            <div class="form-group">
                <label for="ws-inquiry-phone">Phone</label>
                <input type="tel" id="ws-inquiry-phone" required>
            </div>
            <div class="form-group">
                <label for="ws-inquiry-address">Address</label>
                <textarea id="ws-inquiry-address" rows="2" required></textarea>
            </div>
            <div class="form-group">
                <label for="ws-inquiry-details">Details</label>
                <textarea id="ws-inquiry-details" rows="3" required></textarea>
            </div>
            <div class="form-group">
                <label for="ws-inquiry-reply">Reply</label>
                <textarea id="ws-inquiry-reply" rows="4" placeholder="Write a reply here..."></textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-success" id="ws-send-reply-btn"><i class="fa-solid fa-paper-plane"></i> Send Reply</button>
                <button type="button" class="btn btn-secondary" id="ws-inquiry-cancel">Cancel</button>
            </div>
        </form>
    </div>

    <script>
        // Initialize admin dashboard data and navigation
        document.addEventListener('DOMContentLoaded', function() {
            // Section toggling for admin sidebar
            const links = document.querySelectorAll('.admin-nav a[data-section]');
            const sections = document.querySelectorAll('.admin-section');
            links.forEach(link => {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = this.getAttribute('data-section');
                    if (!target) return;
                    links.forEach(l => l.classList.remove('active'));
                    sections.forEach(s => s.classList.remove('active'));
                    this.classList.add('active');
                    const el = document.getElementById(`${target}-section`);
                    if (el) el.classList.add('active');
                });
            });

            // Load initial data
            loadProducts();
            loadWholesaleProducts();
            loadInquiries();
            loadWholesaleInquiries();
        });

        function loadProducts() {
            const productsList = document.getElementById('products-list');
            if (!productsList) return;
            
            fetch('/api/products')
                .then(response => response.json())
                .then(data => {
                    if (data.length === 0) {
                        productsList.innerHTML = '<p style="text-align: center; color: #666;">No products yet. Click "Add New Product" to create one.</p>';
                    } else {
                        productsList.innerHTML = data.map(product => `
                            <div class="product-item">
                                <div class="product-item-image">
                                    <img src="${product.image || 'https://via.placeholder.com/100'}" alt="${product.name}">
                                </div>
                                <div class="product-item-details">
                                    <h4>${product.name}</h4>
                                    <p>${product.description}</p>
                                    <p class="product-item-price">$${parseFloat(product.price).toFixed(2)}</p>
                                    <p style="color: var(--text-medium); font-size: 0.85rem;">Stock: ${product.stock || 0} units</p>
                                </div>
                                <div class="product-item-actions">
                                    <button class="btn-icon" onclick="editProduct(${product.id})" title="Edit">
                                        <i class="fa-solid fa-edit"></i>
                                    </button>
                                    <button class="btn-icon delete-btn" onclick="deleteProduct(${product.id})" title="Delete">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('');
                    }
                })
                .catch(error => {
                    console.error('Error loading products:', error);
                    productsList.innerHTML = '<p style="text-align: center; color: #666;">No products yet. Click "Add New Product" to create one.</p>';
                });
        }

        function loadWholesaleProducts() {
            const wsProductsList = document.getElementById('ws-products-list');
            if (!wsProductsList) return;
            
            fetch('/api/wholesale-products')
                .then(response => response.json())
                .then(data => {
                    if (data.length === 0) {
                        wsProductsList.innerHTML = '<p style="text-align: center; color: #666;">No wholesale products yet. Click "Add Wholesale Product" to create one.</p>';
                    } else {
                        wsProductsList.innerHTML = data.map(product => `
                            <div class="product-item">
                                <div class="product-item-image">
                                    <img src="${product.image || 'https://via.placeholder.com/100'}" alt="${product.name}">
                                </div>
                                <div class="product-item-details">
                                    <h4>${product.name}</h4>
                                    <p>${product.description}</p>
                                    <p class="product-item-price">Retail: $${parseFloat(product.price).toFixed(2)} | Wholesale: $${parseFloat(product.wholesale_price || product.price).toFixed(2)}</p>
                                    <p style="color: var(--text-medium); font-size: 0.85rem;">Stock: ${product.stock || 0} units</p>
                                </div>
                                <div class="product-item-actions">
                                    <button class="btn-icon" onclick="editWholesaleProduct(${product.id})" title="Edit">
                                        <i class="fa-solid fa-edit"></i>
                                    </button>
                                    <button class="btn-icon delete-btn" onclick="deleteWholesaleProduct(${product.id})" title="Delete">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('');
                    }
                })
                .catch(error => {
                    console.error('Error loading wholesale products:', error);
                    wsProductsList.innerHTML = '<p style="text-align: center; color: #666;">No wholesale products yet. Click "Add Wholesale Product" to create one.</p>';
                });
        }


            function loadInquiries() {
                fetch('/api/inquiries')
                    .then(response => response.json())
                    .then(data => {
                        const inquiriesList = document.getElementById('inquiries-list');
                        const inquiryCount = document.getElementById('inquiry-count');
                    
                        if (!inquiriesList) return;
                    
                        if (data.length === 0) {
                            inquiriesList.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #666;">No inquiries yet.</td></tr>';
                            inquiryCount.textContent = '0';
                        } else {
                            inquiriesList.innerHTML = data.map(inquiry => `
                                <tr>
                                    <td>${new Date(inquiry.created_at).toLocaleDateString()}</td>
                                    <td>${inquiry.name}</td>
                                    <td>${inquiry.email}</td>
                                    <td>${inquiry.subject}</td>
                                    <td><span class="message-preview">${inquiry.message.substring(0, 50)}...</span></td>
                                    <td>
                                        <button class="btn-action" onclick="openInquiryModal(${inquiry.id})" title="Reply">
                                            <i class="fa-solid fa-reply"></i>
                                        </button>
                                        <button class="btn-action" onclick="deleteInquiry(${inquiry.id})" title="Delete">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('');
                            inquiryCount.textContent = data.length;
                        }
                    })
                    .catch(error => console.error('Error loading inquiries:', error));
            }

            function openInquiryModal(id) {
                fetch(`/api/inquiries`)
                    .then(response => response.json())
                    .then(data => {
                        const inquiry = data.find(item => item.id === id);
                        if (!inquiry) return;

                        document.getElementById('inquiry-id').value = inquiry.id;
                        document.getElementById('inquiry-name').value = inquiry.name;
                        document.getElementById('inquiry-email').value = inquiry.email;
                        document.getElementById('inquiry-subject').value = inquiry.subject;
                        document.getElementById('inquiry-message').value = inquiry.message;
                        document.getElementById('inquiry-reply').value = inquiry.reply || '';
                        document.getElementById('inquiry-modal-title').textContent = `Reply to ${inquiry.name}`;

                        inquiryModal.style.display = 'block';
                        setTimeout(() => inquiryModal.classList.add('show'), 10);
                    })
                    .catch(error => console.error('Error loading inquiry', error));
            }

            function closeInquiryModal() {
                inquiryModal.classList.remove('show');
                setTimeout(() => inquiryModal.style.display = 'none', 200);
            }

            function sendInquiryReply() {
                const id = document.getElementById('inquiry-id').value;
                const reply = document.getElementById('inquiry-reply').value.trim();
                if (!reply) {
                    alert('Please enter a reply message.');
                    return;
                }

                fetch(`/api/inquiries/${id}/reply`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                    },
                    body: JSON.stringify({ reply })
                })
                .then(response => response.json())
                .then(data => {
                    alert('Reply sent and saved.');
                    closeInquiryModal();
                    loadInquiries();
                })
                .catch(error => {
                    console.error('Error sending reply:', error);
                    alert('Unable to send reply. Please try again.');
                });
            }

            function deleteInquiry(id) {
                if (confirm('Are you sure you want to delete this inquiry?')) {
                    fetch(`/api/inquiries/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert('Inquiry deleted successfully');
                        loadInquiries();
                    })
                    .catch(error => console.error('Error deleting inquiry:', error));
                }
            }

            function loadWholesaleInquiries() {
                fetch('/api/wholesale-inquiries')
                    .then(response => response.json())
                    .then(data => {
                        const inquiriesList = document.getElementById('ws-inquiries-list');
                    
                        if (!inquiriesList) return;
                    
                        if (data.length === 0) {
                            inquiriesList.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #666;">No wholesale inquiries yet.</td></tr>';
                        } else {
                            inquiriesList.innerHTML = data.map(inquiry => `
                                <tr>
                                    <td>${new Date(inquiry.created_at).toLocaleDateString()}</td>
                                    <td>${inquiry.name}</td>
                                    <td>${inquiry.company}</td>
                                    <td>${inquiry.email}</td>
                                    <td><span class="message-preview">${inquiry.details.substring(0, 50)}...</span></td>
                                    <td><span class="status-badge status-${inquiry.status}">${inquiry.status}</span></td>
                                    <td>
                                        <button class="btn-action" onclick="openWholesaleInquiryModal(${inquiry.id})" title="Reply">
                                            <i class="fa-solid fa-reply"></i>
                                        </button>
                                        <button class="btn-action" onclick="deleteWholesaleInquiry(${inquiry.id})" title="Delete">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('');
                        }
                    })
                    .catch(error => console.error('Error loading wholesale inquiries:', error));
            }

            function openWholesaleInquiryModal(id) {
                fetch(`/api/wholesale-inquiries`)
                    .then(response => response.json())
                    .then(data => {
                        const inquiry = data.find(item => item.id === id);
                        if (!inquiry) return;

                        document.getElementById('ws-inquiry-id').value = inquiry.id;
                        document.getElementById('ws-inquiry-name').value = inquiry.name;
                        document.getElementById('ws-inquiry-company').value = inquiry.company;
                        document.getElementById('ws-inquiry-email').value = inquiry.email;
                        document.getElementById('ws-inquiry-phone').value = inquiry.phone;
                        document.getElementById('ws-inquiry-address').value = inquiry.address;
                        document.getElementById('ws-inquiry-details').value = inquiry.details;
                        document.getElementById('ws-inquiry-reply').value = inquiry.reply || '';

                        wsInquiryModal.style.display = 'block';
                        setTimeout(() => wsInquiryModal.classList.add('show'), 10);
                    })
                    .catch(error => console.error('Error loading wholesale inquiry', error));
            }

            function closeWholesaleInquiryModal() {
                wsInquiryModal.classList.remove('show');
                setTimeout(() => wsInquiryModal.style.display = 'none', 200);
            }

            function sendWholesaleInquiryReply() {
                const id = document.getElementById('ws-inquiry-id').value;
                const reply = document.getElementById('ws-inquiry-reply').value.trim();
                if (!reply) {
                    alert('Please enter a reply message.');
                    return;
                }

                fetch(`/api/wholesale-inquiries/${id}/reply`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                    },
                    body: JSON.stringify({ reply })
                })
                .then(response => response.json())
                .then(data => {
                    alert('Reply sent and saved.');
                    closeWholesaleInquiryModal();
                    loadWholesaleInquiries();
                })
                .catch(error => {
                    console.error('Error sending reply:', error);
                    alert('Unable to send reply. Please try again.');
                });
            }

            function deleteWholesaleInquiry(id) {
                if (confirm('Are you sure you want to delete this wholesale inquiry?')) {
                    fetch(`/api/wholesale-inquiries/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert('Wholesale inquiry deleted successfully');
                        loadWholesaleInquiries();
                    })
                    .catch(error => console.error('Error deleting wholesale inquiry:', error));
                }
            }

        function editProduct(id) {
            fetch(`/api/products`)
                .then(response => response.json())
                .then(products => {
                    const product = products.find(p => p.id === id);
                    if (!product) return;
                    
                    document.getElementById('modal-title').textContent = 'Edit Product';
                    document.getElementById('product-id').value = product.id;
                    document.getElementById('product-name').value = product.name;
                    document.getElementById('product-description').value = product.description;
                    document.getElementById('product-price').value = product.price;
                    document.getElementById('product-image').value = product.image || '';
                    document.getElementById('product-id-slug').value = product.slug;
                    document.getElementById('product-origin').value = product.origin || '';
                    document.getElementById('product-notes').value = product.notes || '';
                    document.getElementById('product-brew').value = product.brewing_guide || '';
                    document.getElementById('product-long-desc').value = product.long_description || '';
                    
                    productModal.style.display = 'block';
                })
                .catch(error => console.error('Error loading product:', error));
        }

        function deleteProduct(id) {
            if (confirm('Are you sure you want to delete this product?')) {
                fetch(`/api/products/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    alert('Product deleted successfully');
                    loadProducts();
                })
                .catch(error => console.error('Error deleting product:', error));
            }
        }

        function editWholesaleProduct(id) {
            fetch(`/api/wholesale-products`)
                .then(response => response.json())
                .then(products => {
                    const product = products.find(p => p.id === id);
                    if (!product) return;
                    
                    document.getElementById('ws-modal-title').textContent = 'Edit Wholesale Product';
                    document.getElementById('ws-product-id').value = product.id;
                    document.getElementById('ws-product-name').value = product.name;
                    document.getElementById('ws-product-description').value = product.description;
                    document.getElementById('ws-product-price').value = product.price;
                    document.getElementById('ws-product-wholesale-price').value = product.wholesale_price || product.price;
                    document.getElementById('ws-product-image').value = product.image || '';
                    document.getElementById('ws-product-id-slug').value = product.slug;
                    document.getElementById('ws-product-stock').value = product.stock || 0;
                    
                    wsProductModal.style.display = 'block';
                })
                .catch(error => console.error('Error loading wholesale product:', error));
        }

        function deleteWholesaleProduct(id) {
            if (confirm('Are you sure you want to delete this wholesale product?')) {
                fetch(`/api/wholesale-products/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    alert('Wholesale product deleted successfully');
                    loadWholesaleProducts();
                })
                .catch(error => console.error('Error deleting wholesale product:', error));
            }
        }

        // Modal controls
        const productModal = document.getElementById('product-modal');
        const wsProductModal = document.getElementById('ws-product-modal');
        const inquiryModal = document.getElementById('inquiry-modal');
        const wsInquiryModal = document.getElementById('ws-inquiry-modal');
        const addProductBtn = document.getElementById('add-product-btn');
        const addWsProductBtn = document.getElementById('add-ws-product-btn');

        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                document.getElementById('modal-title').textContent = 'Add New Product';
                document.getElementById('product-form').reset();
                document.getElementById('product-id').value = '';
                productModal.style.display = 'block';
            });
        }

        if (addWsProductBtn) {
            addWsProductBtn.addEventListener('click', () => {
                document.getElementById('ws-modal-title').textContent = 'Add Wholesale Product';
                document.getElementById('ws-product-form').reset();
                document.getElementById('ws-product-id').value = '';
                wsProductModal.style.display = 'block';
            });
        }

        // Close modals
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            productModal.style.display = 'none';
        });

        document.getElementById('ws-cancel').addEventListener('click', () => {
            wsProductModal.style.display = 'none';
        });

        // Inquiry modal controls
        document.getElementById('save-inquiry-btn').addEventListener('click', sendInquiryReply);
        document.getElementById('send-reply-btn').addEventListener('click', sendInquiryReply);
        document.getElementById('inquiry-close').addEventListener('click', closeInquiryModal);
        document.getElementById('inquiry-cancel').addEventListener('click', closeInquiryModal);

        // Wholesale Inquiry modal controls
        document.getElementById('ws-send-reply-btn').addEventListener('click', sendWholesaleInquiryReply);
        document.getElementById('ws-inquiry-close').addEventListener('click', closeWholesaleInquiryModal);
        document.getElementById('ws-inquiry-cancel').addEventListener('click', closeWholesaleInquiryModal);

        // Refresh buttons
        const refreshWsInquiriesBtn = document.getElementById('refresh-ws-inquiries-btn');
        if (refreshWsInquiriesBtn) {
            refreshWsInquiriesBtn.addEventListener('click', loadWholesaleInquiries);
        }

        // Character counters for reply textareas
        const inquiryReplyElement = document.getElementById('inquiry-reply');
        if (inquiryReplyElement) {
            inquiryReplyElement.addEventListener('input', (e) => {
                const count = e.target.value.length;
                const countElement = document.getElementById('inquiry-reply-count');
                if (countElement) {
                    countElement.textContent = Math.min(count, 1000);
                }
                if (count > 1000) {
                    e.target.value = e.target.value.substring(0, 1000);
                }
            });
        }

        const wsInquiryReplyElement = document.getElementById('ws-inquiry-reply');
        if (wsInquiryReplyElement) {
            wsInquiryReplyElement.addEventListener('input', (e) => {
                const count = e.target.value.length;
                const countElement = document.getElementById('ws-inquiry-reply-count');
                if (countElement) {
                    countElement.textContent = Math.min(count, 1000);
                }
                if (count > 1000) {
                    e.target.value = e.target.value.substring(0, 1000);
                }
            });
        }

        // Form submissions
        document.getElementById('product-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const productId = document.getElementById('product-id').value;
            const formData = {
                name: document.getElementById('product-name').value,
                description: document.getElementById('product-description').value,
                price: parseFloat(document.getElementById('product-price').value),
                image: document.getElementById('product-image').value,
                slug: document.getElementById('product-id-slug').value,
                origin: document.getElementById('product-origin').value,
                notes: document.getElementById('product-notes').value,
                brewing_guide: document.getElementById('product-brew').value,
                long_description: document.getElementById('product-long-desc').value,
            };
            
            const url = productId ? `/api/products/${productId}` : '/api/products';
            const method = productId ? 'PUT' : 'POST';
            
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                alert(productId ? 'Product updated successfully!' : 'Product created successfully!');
                productModal.style.display = 'none';
                loadProducts();
            })
            .catch(error => {
                console.error('Error saving product:', error);
                alert('Error saving product. Please try again.');
            });
        });

        document.getElementById('ws-product-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const productId = document.getElementById('ws-product-id').value;
            const formData = {
                name: document.getElementById('ws-product-name').value,
                description: document.getElementById('ws-product-description').value,
                price: parseFloat(document.getElementById('ws-product-price').value),
                wholesale_price: parseFloat(document.getElementById('ws-product-wholesale-price').value),
                image: document.getElementById('ws-product-image').value,
                slug: document.getElementById('ws-product-id-slug').value,
                stock: parseInt(document.getElementById('ws-product-stock').value) || 0,
            };
            
            const url = productId ? `/api/wholesale-products/${productId}` : '/api/wholesale-products';
            const method = productId ? 'PUT' : 'POST';
            
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                alert(productId ? 'Wholesale product updated successfully!' : 'Wholesale product created successfully!');
                wsProductModal.style.display = 'none';
                loadWholesaleProducts();
            })
            .catch(error => {
                console.error('Error saving wholesale product:', error);
                alert('Error saving wholesale product. Please try again.');
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === productModal) productModal.style.display = 'none';
            if (e.target === wsProductModal) wsProductModal.style.display = 'none';
            if (e.target === inquiryModal) closeInquiryModal();
        });
    </script>

    @include('partials.footer')
</body>
</html>