'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Product {
  id: number
  name: string
  description: string
  slug: string
  price: number
  wholesalePrice?: number
  image?: string
  stock: number
  isWholesale: boolean
}

export default function AdminPage() {
  const router = useRouter()
  const [section, setSection] = useState<'dashboard' | 'products' | 'wsproducts' | 'inquiries' | 'wsinquiries'>('products')

  const [retailProducts, setRetailProducts] = useState<Product[]>([])
  const [wholesaleProducts, setWholesaleProducts] = useState<Product[]>([])
  const [inquiries, setInquiries] = useState<any[]>([])
  const [wsInquiries, setWsInquiries] = useState<any[]>([])

  // Product modal state
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    slug: '',
    price: '',
    stock: '',
    image: ''
  })

  useEffect(() => {
    const ok = typeof window !== 'undefined' && localStorage.getItem('adminLoggedIn') === 'true'
    if (!ok) router.push('/admin-login')
  }, [router])

  const refreshAll = async () => {
    const [rp, wp, iq, wi] = await Promise.allSettled([
      fetch('/api/products?is_wholesale=false').then((r) => r.json()),
      fetch('/api/products?is_wholesale=true').then((r) => r.json()),
      fetch('/api/admin/inquiries').then((r) => r.json()),
      fetch('/api/admin/wholesale-inquiries').then((r) => r.json()),
    ])

    if (rp.status === 'fulfilled') setRetailProducts(Array.isArray(rp.value) ? rp.value : [])
    if (wp.status === 'fulfilled') setWholesaleProducts(Array.isArray(wp.value) ? wp.value : [])
    if (iq.status === 'fulfilled') setInquiries(Array.isArray(iq.value) ? iq.value : [])
    if (wi.status === 'fulfilled') setWsInquiries(Array.isArray(wi.value) ? wi.value : [])
  }

  useEffect(() => {
    refreshAll()
  }, [])

  const stats = useMemo(() => {
    const newInquiries = inquiries.filter((i) => i.status === 'new').length
    const newWholesale = wsInquiries.filter((i) => i.status === 'new').length
    return {
      retail: retailProducts.length,
      wholesale: wholesaleProducts.length,
      inquiries: newInquiries,
      wsInquiries: newWholesale,
    }
  }, [inquiries, retailProducts, wholesaleProducts, wsInquiries])

  const logout = () => {
    localStorage.removeItem('adminLoggedIn')
    router.push('/admin-login')
  }

  const deleteInquiry = async (id: number) => {
    await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' })
    refreshAll()
  }

  const deleteWsInquiry = async (id: number) => {
    await fetch(`/api/admin/wholesale-inquiries/${id}`, { method: 'DELETE' })
    refreshAll()
  }

  const openAddProductModal = () => {
    setEditingProduct(null)
    setProductForm({
      name: '',
      description: '',
      slug: '',
      price: '',
      stock: '',
      image: ''
    })
    setShowProductModal(true)
  }

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description,
      slug: product.slug,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: product.image || ''
    })
    setShowProductModal(true)
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    alert('Product save functionality to be implemented with backend API')
    setShowProductModal(false)
  }

  const deleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    alert('Product delete functionality to be implemented with backend API')
    // await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    // refreshAll()
  }

  const resolveImage = (path?: string) => {
    if (!path) return '/images/image.png'
    if (path.startsWith('http')) return path
    return `/${path.replace(/^\//, '')}`
  }

  return (
    <body className="admin-body">
      <div className="admin-wrapper">
        <aside className="admin-sidebar">
          <div className="admin-logo">
            <i className="fa-solid fa-leaf"></i>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>Nandana</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Admin</div>
            </div>
          </div>
          <nav className="admin-nav">
            <a href="#dashboard" className={section === 'dashboard' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setSection('dashboard') }}>
              <i className="fa-solid fa-chart-line"></i> Dashboard
            </a>
            <a href="#products" className={section === 'products' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setSection('products') }}>
              <i className="fa-solid fa-boxes-stacked"></i> Retail Products
            </a>
            <a href="#wsproducts" className={section === 'wsproducts' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setSection('wsproducts') }}>
              <i className="fa-solid fa-truck-ramp-box"></i> Wholesale Products
            </a>
            <a href="#inquiries" className={section === 'inquiries' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setSection('inquiries') }}>
              <i className="fa-solid fa-envelope"></i> Customer Inquiries
            </a>
            <a href="#wsinquiries" className={section === 'wsinquiries' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setSection('wsinquiries') }}>
              <i className="fa-solid fa-inbox"></i> Wholesale Inquiries
            </a>
            <Link href="/"><i className="fa-solid fa-house"></i> View Site</Link>
            <a href="#logout" onClick={(e) => { e.preventDefault(); logout() }}><i className="fa-solid fa-right-from-bracket"></i> Logout</a>
          </nav>
        </aside>

        <main className="admin-main">
          {section === 'dashboard' && (
            <div id="dashboard-section" className="admin-section active">
              <section className="admin-stats">
                <div className="stat-card">
                  <h3>Retail Products</h3>
                  <p className="stat-number" id="total-retail-products">{stats.retail}</p>
                </div>
                <div className="stat-card">
                  <h3>Wholesale Products</h3>
                  <p className="stat-number" id="total-wholesale-products">{stats.wholesale}</p>
                </div>
                <div className="stat-card">
                  <h3>New Inquiries</h3>
                  <p className="stat-number" id="inquiry-count">{stats.inquiries}</p>
                </div>
                <div className="stat-card">
                  <h3>Wholesale Requests</h3>
                  <p className="stat-number" id="wholesale-inquiry-count">{stats.wsInquiries}</p>
                </div>
              </section>

              <section className="admin-activity">
                <h3>Recent Admin Activity</h3>
                <div className="activity-table-wrapper">
                  <table className="wholesale-table">
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
                        <td>{new Date().toISOString().slice(0, 16).replace('T', ' ')}</td>
                        <td>Loaded admin dashboard</td>
                        <td>Admin</td>
                        <td><span className="status-badge success">Completed</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {section === 'products' && (
            <div id="products-section" className="admin-section active">
              <div className="section-header-top">
                <h1 className="section-title">Retail Products</h1>
                <button className="btn btn-add-product" onClick={openAddProductModal}>
                  <i className="fa-solid fa-plus"></i> Add New Product
                </button>
              </div>
              
              <div className="products-grid">
                {retailProducts.map((product) => (
                  <div key={product.id} className="product-card-admin">
                    <div className="product-card-content">
                      <div className="product-image-admin">
                        <Image
                          src={resolveImage(product.image)}
                          alt={product.name}
                          width={100}
                          height={100}
                          style={{ objectFit: 'cover', borderRadius: '8px' }}
                        />
                      </div>
                      <div className="product-details-admin">
                        <h3 className="product-name-admin">{product.name}</h3>
                        <p className="product-description-admin">{product.description}</p>
                        <div className="product-price-admin">Rs. {Number(product.price || 0).toFixed(2)}</div>
                        <div className="product-stock-admin">Stock: {product.stock} units</div>
                      </div>
                      <div className="product-actions-admin">
                        <button 
                          className="btn-icon-admin btn-edit" 
                          onClick={() => openEditProductModal(product)}
                          title="Edit"
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button 
                          className="btn-icon-admin btn-delete" 
                          onClick={() => deleteProduct(product.id)}
                          title="Delete"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'wsproducts' && (
            <div id="wsproducts-section" className="admin-section active">
              <section className="admin-products">
                <div className="section-header">
                  <h3>Wholesale Products</h3>
                  <button className="btn btn-primary" onClick={refreshAll}>
                    <i className="fa-solid fa-arrows-rotate"></i> Refresh
                  </button>
                </div>
                <div className="products-list" id="ws-products-list">
                  {wholesaleProducts.map((p) => (
                    <div key={p.id} className="product-item" style={{ border: '1px solid var(--border-color)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center' }}>
                        <div>
                          <h4 style={{ margin: 0 }}>{p.name}</h4>
                          <div style={{ color: 'var(--text-medium)', fontSize: 14 }}>{p.slug}</div>
                        </div>
                        <div style={{ fontWeight: 700 }}>
                          Retail: Rs. {Number(p.price || 0).toFixed(2)}<br />
                          Wholesale: Rs. {Number(p.wholesalePrice ?? p.price ?? 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {section === 'inquiries' && (
            <div id="inquiries-section" className="admin-section active">
              <section className="admin-inquiries">
                <h3>Customer Inquiries</h3>
                <div className="section-header">
                  <button className="btn btn-primary" onClick={refreshAll}>
                    <i className="fa-solid fa-arrows-rotate"></i> Refresh
                  </button>
                </div>
                <div className="activity-table-wrapper">
                  <table className="wholesale-table">
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
                      {inquiries.map((i) => (
                        <tr key={i.id}>
                          <td>{String(i.createdAt || '').slice(0, 10)}</td>
                          <td>{i.name}</td>
                          <td>{i.email}</td>
                          <td>{i.subject}</td>
                          <td style={{ maxWidth: 380 }}>{i.message}</td>
                          <td>
                            <button className="btn btn-secondary" onClick={() => deleteInquiry(i.id)}>
                              <i className="fa-solid fa-trash"></i> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {section === 'wsinquiries' && (
            <div id="wsinquiries-section" className="admin-section active">
              <section className="admin-inquiries">
                <h3>Wholesale Inquiries</h3>
                <div className="section-header">
                  <button className="btn btn-primary" onClick={refreshAll}>
                    <i className="fa-solid fa-arrows-rotate"></i> Refresh
                  </button>
                </div>
                <div className="activity-table-wrapper">
                  <table className="wholesale-table">
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
                      {wsInquiries.map((i) => (
                        <tr key={i.id}>
                          <td>{String(i.createdAt || '').slice(0, 10)}</td>
                          <td>{i.name}</td>
                          <td>{i.company}</td>
                          <td>{i.email}</td>
                          <td style={{ maxWidth: 380 }}>{i.details}</td>
                          <td>{i.status}</td>
                          <td>
                            <button className="btn btn-secondary" onClick={() => deleteWsInquiry(i.id)}>
                              <i className="fa-solid fa-trash"></i> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="modal-close" onClick={() => setShowProductModal(false)}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleProductSubmit} className="product-form">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  required
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Slug *</label>
                  <input
                    type="text"
                    required
                    value={productForm.slug}
                    onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Price (Rs.) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowProductModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </body>
  )
}

