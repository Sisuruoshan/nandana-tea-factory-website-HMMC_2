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
  image2?: string
  stock: number
  isWholesale: boolean
  origin?: string
  notes?: string
  brewingGuide?: string
  longDescription?: string
  minWholesaleQty?: number
}

export default function AdminPage() {
  const router = useRouter()
  const [section, setSection] = useState<'dashboard' | 'products' | 'wsproducts' | 'inquiries' | 'wsinquiries'>('dashboard')

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
    image: '',
    image2: '',
    origin: '',
    notes: '',
    brew: '',
    longDesc: '',
    stock: '0'
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageStatus, setImageStatus] = useState('No file chosen')
  const [uploadingImage2, setUploadingImage2] = useState(false)
  const [imageStatus2, setImageStatus2] = useState('No file chosen')

  // Wholesale product modal state
  const [showWholesaleModal, setShowWholesaleModal] = useState(false)
  const [editingWholesaleProduct, setEditingWholesaleProduct] = useState<Product | null>(null)
  const [wholesaleForm, setWholesaleForm] = useState({
    name: '',
    slug: '',
    price: '',
    wholesalePrice: '',
    minQuantity: '10',
    stock: '0',
    image: ''
  })
  const [uploadingWholesaleImage, setUploadingWholesaleImage] = useState(false)
  const [wholesaleImageStatus, setWholesaleImageStatus] = useState('No file chosen')

  useEffect(() => {
    const ok = typeof window !== 'undefined' && localStorage.getItem('adminLoggedIn') === 'true'
    if (!ok) router.push('/admin-login')
  }, [router])

  const refreshAll = async () => {
    const [rp, wp, iq, wi] = await Promise.allSettled([
      fetch('/api/products?is_wholesale=false&limit=1000').then((r) => r.json()),
      fetch('/api/products?is_wholesale=true&limit=1000').then((r) => r.json()),
      fetch('/api/admin/inquiries').then((r) => r.json()),
      fetch('/api/admin/wholesale-inquiries').then((r) => r.json()),
    ])

    if (rp.status === 'fulfilled') {
      const data = rp.value as any
      setRetailProducts(Array.isArray(data) ? data : (data.products || []))
    }
    if (wp.status === 'fulfilled') {
      const data = wp.value as any
      setWholesaleProducts(Array.isArray(data) ? data : (data.products || []))
    }
    if (iq.status === 'fulfilled') setInquiries(Array.isArray(iq.value) ? iq.value : [])
    if (wi.status === 'fulfilled') setWsInquiries(Array.isArray(wi.value) ? wi.value : [])
  }

  const replyToInquiry = (email: string, subject: string, name: string) => {
    const replySubject = `Re: ${subject}`
    const body = `Dear ${name},\n\nThank you for contacting Nandana Tea Factory.\n\n\n\nBest regards,\nNandana Tea Factory Team`
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(body)}`
    window.open(gmailUrl, '_blank')
  }

  const replyToWholesaleInquiry = (email: string, name: string, company: string) => {
    const subject = `Re: Wholesale Inquiry from ${company}`
    const body = `Dear ${name},\n\nThank you for your wholesale inquiry at Nandana Tea Factory.\n\n\n\nBest regards,\nNandana Tea Factory Wholesale Team`
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(gmailUrl, '_blank')
  }

  useEffect(() => {
    refreshAll()
    // Auto-refresh every 5 seconds for real-time updates
    const interval = setInterval(refreshAll, 5000)
    return () => clearInterval(interval)
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
      image: '',
      image2: '',
      origin: '',
      notes: '',
      brew: '',
      longDesc: '',
      stock: '0'
    })
    setImageStatus('No file chosen')
    setImageStatus2('No file chosen')
    setShowProductModal(true)
  }

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description,
      slug: product.slug,
      price: product.price.toString(),
      image: product.image || '',
      image2: product.image2 || '',
      origin: product.origin || '',
      notes: product.notes || '',
      brew: product.brewingGuide || '',
      longDesc: product.longDescription || '',
      stock: product.stock?.toString() || '0'
    })
    setImageStatus(product.image ? 'File selected' : 'No file chosen')
    setImageStatus2(product.image2 ? 'File selected' : 'No file chosen')
    setShowProductModal(true)
  }

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 800;
      // Start with decent quality, can lower if needed
      let quality = 0.7;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          // Resize logic
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Iterate to get below 700KB (approx safe limit)
          const attemptCompression = (q: number) => {
            const dataUrl = canvas.toDataURL('image/jpeg', q);
            // Rough size check: 1 char = 1 byte (Base64 is strictly ASCII)
            if (dataUrl.length < 700000 || q < 0.2) {
              resolve(dataUrl);
            } else {
              attemptCompression(q - 0.1);
            }
          }

          attemptCompression(quality);
        }
      }
      reader.onerror = (error) => reject(error);
    });
  }

  const handleProductImageUpload = async (file: File) => {
    setUploadingImage(true)
    setImageStatus('Compressing & Encoding...')
    try {
      const base64 = await compressImage(file);
      setProductForm(prev => ({ ...prev, image: base64 }))
      setImageStatus(`Ready: ${file.name} (${(base64.length / 1024).toFixed(1)} KB)`)
    } catch (error) {
      console.error(error)
      setImageStatus('Processing failed')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleProductImageUpload(file)
    } else if (file) {
      setImageStatus('Please select an image file')
    }
  }

  const handleProductDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.style.backgroundColor = 'rgba(73, 202, 125, 0.1)'
  }

  const handleProductDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.style.backgroundColor = ''
  }

  const handleProductDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.style.backgroundColor = ''
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleProductImageUpload(file)
    }
  }

  const handleProductImageUpload2 = async (file: File) => {
    setUploadingImage2(true)
    setImageStatus2('Compressing & Encoding...')
    try {
      const base64 = await compressImage(file);
      setProductForm(prev => ({ ...prev, image2: base64 }))
      setImageStatus2(`Ready: ${file.name} (${(base64.length / 1024).toFixed(1)} KB)`)
    } catch (error) {
      console.error(error)
      setImageStatus2('Processing failed')
    } finally {
      setUploadingImage2(false)
    }
  }

  const handleProductImageChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleProductImageUpload2(file)
    } else if (file) {
      setImageStatus2('Please select an image file')
    }
  }

  const handleProductDragOver2 = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.style.backgroundColor = 'rgba(73, 202, 125, 0.1)'
  }

  const handleProductDragLeave2 = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.style.backgroundColor = ''
  }

  const handleProductDrop2 = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.style.backgroundColor = ''
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleProductImageUpload2(file)
    }
  }

  const openAddWholesaleModal = () => {
    setEditingWholesaleProduct(null)
    setWholesaleForm({
      name: '',
      slug: '',
      price: '',
      wholesalePrice: '',
      minQuantity: '10',
      stock: '0',
      image: ''
    })
    setWholesaleImageStatus('No file chosen')
    setShowWholesaleModal(true)
  }

  const openEditWholesaleModal = (product: Product) => {
    setEditingWholesaleProduct(product)
    setWholesaleForm({
      name: product.name,
      slug: product.slug,
      price: product.price.toString(),
      wholesalePrice: product.wholesalePrice?.toString() || '',
      minQuantity: product.minWholesaleQty?.toString() || '10',
      stock: product.stock.toString(),
      image: product.image || ''
    })
    setWholesaleImageStatus(product.image ? 'File selected' : 'No file chosen')
    setShowWholesaleModal(true)
  }

  const handleWholesaleImageUpload = async (file: File) => {
    setUploadingWholesaleImage(true)
    setWholesaleImageStatus('Compressing & Encoding...')
    try {
      const base64 = await compressImage(file);
      setWholesaleForm(prev => ({ ...prev, image: base64 }))
      setWholesaleImageStatus(`Ready: ${file.name} (${(base64.length / 1024).toFixed(1)} KB)`)
    } catch (error) {
      console.error(error)
      setWholesaleImageStatus('Processing failed')
    } finally {
      setUploadingWholesaleImage(false)
    }
  }

  const handleWholesaleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleWholesaleImageUpload(file)
    } else if (file) {
      setWholesaleImageStatus('Please select an image file')
    }
  }

  const handleWholesaleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.style.backgroundColor = 'rgba(73, 202, 125, 0.1)'
  }

  const handleWholesaleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.style.backgroundColor = ''
  }

  const handleWholesaleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.style.backgroundColor = ''
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleWholesaleImageUpload(file)
    }
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!productForm.name || !productForm.slug || !productForm.price) {
      alert('Please fill in required fields: Name, Slug, and Price')
      return
    }

    try {
      const method = editingProduct ? 'PUT' : 'POST'
      const payload = {
        ...(editingProduct && { id: editingProduct.id }),
        name: productForm.name,
        description: productForm.description,
        slug: productForm.slug,
        price: productForm.price,
        image: productForm.image,
        image2: productForm.image2,
        origin: productForm.origin,
        notes: productForm.notes,
        brewingGuide: productForm.brew,
        longDescription: productForm.longDesc,
        stock: parseInt(productForm.stock) || 0,
        isWholesale: false,
      }

      const response = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        alert(data.message || 'Product saved successfully!')
        setShowProductModal(false)
        refreshAll()
      } else {
        alert('Error: ' + (data.error || 'Failed to save product'))
      }
    } catch (error: any) {
      console.error('Error saving product:', error)
      alert('Error saving product: ' + error.message)
    }
  }

  const handleWholesaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!wholesaleForm.name || !wholesaleForm.slug || !wholesaleForm.price || !wholesaleForm.wholesalePrice) {
      alert('Please fill in required fields: Name, Slug, Price, and Wholesale Price')
      return
    }

    try {
      const method = editingWholesaleProduct ? 'PUT' : 'POST'
      const payload = {
        ...(editingWholesaleProduct && { id: editingWholesaleProduct.id }),
        name: wholesaleForm.name,
        slug: wholesaleForm.slug,
        price: wholesaleForm.price,
        wholesalePrice: wholesaleForm.wholesalePrice,
        image: wholesaleForm.image,
        stock: parseInt(wholesaleForm.stock) || 0,
        minWholesaleQty: parseInt(wholesaleForm.minQuantity) || 10,
        isWholesale: true,
      }

      const response = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        alert(data.message || 'Product saved successfully!')
        setShowWholesaleModal(false)
        refreshAll()
      } else {
        alert('Error: ' + (data.error || 'Failed to save product'))
      }
    } catch (error: any) {
      console.error('Error saving product:', error)
      alert('Error saving product: ' + error.message)
    }
  }

  const deleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
      const data = await response.json()

      if (response.ok) {
        alert('Product deleted successfully!')
        refreshAll()
      } else {
        alert('Error: ' + (data.error || 'Failed to delete product'))
      }
    } catch (error: any) {
      console.error('Error deleting product:', error)
      alert('Error deleting product: ' + error.message)
    }
  }

  const deleteWholesaleProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this wholesale product?')) return

    try {
      const response = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
      const data = await response.json()

      if (response.ok) {
        alert('Product deleted successfully!')
        refreshAll()
      } else {
        alert('Error: ' + (data.error || 'Failed to delete product'))
      }
    } catch (error: any) {
      console.error('Error deleting product:', error)
      alert('Error deleting product: ' + error.message)
    }
  }

  const resolveImage = (path?: string) => {
    if (!path) return '/images/image.png'
    if (path.startsWith('http') || path.startsWith('data:')) return path
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
            <a href="/"><i className="fa-solid fa-house"></i> View Site</a>
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
                <h3>Real-Time Activity Feed <span style={{ fontSize: '0.8rem', color: 'var(--accent-mint-green)' }}>● Live</span></h3>
                <div className="activity-table-wrapper">
                  <table className="wholesale-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Activity Type</th>
                        <th>Details</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody id="activity-log">
                      {inquiries.filter(i => i.status === 'new').length > 0 && (
                        <tr style={{ backgroundColor: 'rgba(73, 202, 125, 0.05)' }}>
                          <td>{new Date().toISOString().slice(0, 16).replace('T', ' ')}</td>
                          <td>New Customer Inquiry</td>
                          <td>{inquiries.filter(i => i.status === 'new')[0]?.name} - {inquiries.filter(i => i.status === 'new')[0]?.subject}</td>
                          <td><span className="status-badge success">New</span></td>
                        </tr>
                      )}
                      {wsInquiries.filter(i => i.status === 'new').length > 0 && (
                        <tr style={{ backgroundColor: 'rgba(73, 202, 125, 0.05)' }}>
                          <td>{new Date().toISOString().slice(0, 16).replace('T', ' ')}</td>
                          <td>New Wholesale Request</td>
                          <td>{wsInquiries.filter(i => i.status === 'new')[0]?.company} - {wsInquiries.filter(i => i.status === 'new')[0]?.name}</td>
                          <td><span className="status-badge success">New</span></td>
                        </tr>
                      )}
                      <tr>
                        <td>{new Date().toISOString().slice(0, 16).replace('T', ' ')}</td>
                        <td>Dashboard Sync</td>
                        <td>Real-time monitoring active - Updating every 5 seconds</td>
                        <td><span className="status-badge success">Active</span></td>
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
              <div className="section-header-top">
                <h1 className="section-title">Wholesale Products</h1>
                <button className="btn btn-add-product" onClick={openAddWholesaleModal}>
                  <i className="fa-solid fa-plus"></i> Add Wholesale Product
                </button>
              </div>

              <div className="products-grid">
                {wholesaleProducts.map((product) => (
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
                        <div className="product-price-admin">
                          Retail: Rs. {Number(product.price || 0).toFixed(2)}<br />
                          Wholesale: Rs. {Number(product.wholesalePrice ?? product.price ?? 0).toFixed(2)}
                        </div>
                        <div className="product-stock-admin">Stock: {product.stock} units</div>
                      </div>
                      <div className="product-actions-admin">
                        <button
                          className="btn-icon-admin btn-edit"
                          onClick={() => openEditWholesaleModal(product)}
                          title="Edit"
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button
                          className="btn-icon-admin btn-delete"
                          onClick={() => deleteWholesaleProduct(product.id)}
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
                            <button
                              className="btn btn-primary"
                              onClick={() => replyToInquiry(i.email, i.subject, i.name)}
                              style={{ marginRight: '8px' }}
                            >
                              <i className="fa-solid fa-reply"></i> Reply
                            </button>
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
                            <button
                              className="btn btn-primary"
                              onClick={() => replyToWholesaleInquiry(i.email, i.name, i.company)}
                              style={{ marginRight: '8px' }}
                            >
                              <i className="fa-solid fa-reply"></i> Reply
                            </button>
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
              <h3 id="modal-title">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="close-modal" onClick={() => setShowProductModal(false)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text-light)', fontSize: '1.5rem' }}>
                &times;
              </button>
            </div>
            <form onSubmit={handleProductSubmit} className="product-form">
              <div className="form-group">
                <label htmlFor="product-name">Product Name</label>
                <input
                  type="text"
                  id="product-name"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="product-description">Description</label>
                <textarea
                  id="product-description"
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="product-price">Price (Rs.)</label>
                <input
                  type="number"
                  id="product-price"
                  step="0.01"
                  required
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="product-image">Packet Image</label>
                <div
                  className="upload-drop"
                  id="product-image-drop"
                  onDragOver={handleProductDragOver}
                  onDragLeave={handleProductDragLeave}
                  onDrop={handleProductDrop}
                  style={{
                    border: '2px dashed var(--border-color)',
                    padding: '16px',
                    borderRadius: '8px',
                    background: 'var(--card-bg)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.3s'
                  }}
                >
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: 'var(--text-light)' }}>Drag & drop image here or</p>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    id="product-image-browse"
                    onClick={() => document.getElementById('product-image-file')?.click()}
                    style={{ marginBottom: '8px' }}
                  >
                    Select File
                  </button>
                  <input
                    type="file"
                    id="product-image-file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleProductImageChange}
                  />
                  <div id="product-image-status" style={{ fontSize: '0.85rem', color: 'var(--text-medium)', marginTop: '4px' }}>
                    {imageStatus}
                  </div>
                </div>

              </div>

              <div className="form-group">
                <label htmlFor="product-image2">Tea Image</label>
                <div
                  className="upload-drop"
                  id="product-image-drop-2"
                  onDragOver={handleProductDragOver2}
                  onDragLeave={handleProductDragLeave2}
                  onDrop={handleProductDrop2}
                  style={{
                    border: '2px dashed var(--border-color)',
                    padding: '16px',
                    borderRadius: '8px',
                    background: 'var(--card-bg)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.3s'
                  }}
                >
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: 'var(--text-light)' }}>Drag & drop image here or</p>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    id="product-image-browse-2"
                    onClick={() => document.getElementById('product-image-file-2')?.click()}
                    style={{ marginBottom: '8px' }}
                  >
                    Select File
                  </button>
                  <input
                    type="file"
                    id="product-image-file-2"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleProductImageChange2}
                  />
                  <div id="product-image-status-2" style={{ fontSize: '0.85rem', color: 'var(--text-medium)', marginTop: '4px' }}>
                    {imageStatus2}
                  </div>
                </div>

              </div>

              <div className="form-group">
                <label htmlFor="product-id-slug">Product ID (URL slug)</label>
                <input
                  type="text"
                  id="product-id-slug"
                  placeholder="e.g., black-tea"
                  required
                  value={productForm.slug}
                  onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                />
                <small>Used in product URLs - lowercase with hyphens</small>
              </div>

              <div className="form-group">
                <label htmlFor="product-origin">Origin</label>
                <textarea
                  id="product-origin"
                  rows={2}
                  placeholder="e.g., Harvested from Sri Lankan highland gardens..."
                  value={productForm.origin}
                  onChange={(e) => setProductForm({ ...productForm, origin: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="product-notes">Notes</label>
                <textarea
                  id="product-notes"
                  rows={2}
                  placeholder="e.g., Malty and bold with a clean finish..."
                  value={productForm.notes}
                  onChange={(e) => setProductForm({ ...productForm, notes: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="product-brew">Brewing Guide</label>
                <textarea
                  id="product-brew"
                  rows={4}
                  placeholder="Enter each brewing step on a new line, e.g.:
2–3 g per 250 ml
95°C water
Steep 3–4 minutes
Enjoy plain or with milk"
                  value={productForm.brew}
                  onChange={(e) => setProductForm({ ...productForm, brew: e.target.value })}
                />
                <small>Enter each brewing step on a new line</small>
              </div>

              <div className="form-group">
                <label htmlFor="product-long-desc">About this Tea</label>
                <textarea
                  id="product-long-desc"
                  rows={4}
                  placeholder="Detailed description about the tea..."
                  value={productForm.longDesc}
                  onChange={(e) => setProductForm({ ...productForm, longDesc: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="product-stock">Stock Quantity</label>
                <input
                  type="number"
                  id="product-stock"
                  min="0"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <i className="fa-solid fa-save"></i> {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowProductModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Wholesale Product Modal */}
      {showWholesaleModal && (
        <div className="modal-overlay" onClick={() => setShowWholesaleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingWholesaleProduct ? 'Edit Wholesale Product' : 'Add Wholesale Product'}</h3>
              <button className="close-modal" onClick={() => setShowWholesaleModal(false)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text-light)', fontSize: '1.5rem' }}>
                &times;
              </button>
            </div>
            <form onSubmit={handleWholesaleSubmit} className="product-form">
              <div className="form-group">
                <label htmlFor="ws-product-name">Product Name</label>
                <input
                  type="text"
                  id="ws-product-name"
                  required
                  value={wholesaleForm.name}
                  onChange={(e) => setWholesaleForm({ ...wholesaleForm, name: e.target.value })}
                />
              </div>

              {/* Description removed for wholesale add form */}

              <div className="form-group">
                <label htmlFor="ws-product-price">Retail Price (Rs.)</label>
                <input
                  type="number"
                  id="ws-product-price"
                  step="0.01"
                  required
                  value={wholesaleForm.price}
                  onChange={(e) => setWholesaleForm({ ...wholesaleForm, price: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="ws-product-wholesale-price">Wholesale Price (Rs.)</label>
                <input
                  type="number"
                  id="ws-product-wholesale-price"
                  step="0.01"
                  required
                  value={wholesaleForm.wholesalePrice}
                  onChange={(e) => setWholesaleForm({ ...wholesaleForm, wholesalePrice: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="ws-product-minqty">Minimum Quantity</label>
                <input
                  type="number"
                  id="ws-product-minqty"
                  min="1"
                  required
                  value={wholesaleForm.minQuantity}
                  onChange={(e) => setWholesaleForm({ ...wholesaleForm, minQuantity: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="ws-product-stock">Current Stock/Quantity</label>
                <input
                  type="number"
                  id="ws-product-stock"
                  min="0"
                  required
                  value={wholesaleForm.stock}
                  onChange={(e) => setWholesaleForm({ ...wholesaleForm, stock: e.target.value })}
                />
                <small>Available quantity in inventory</small>
              </div>

              <div className="form-group">
                <label htmlFor="ws-product-image">Product Image</label>
                <div
                  className="upload-drop"
                  id="ws-product-image-drop"
                  onDragOver={handleWholesaleDragOver}
                  onDragLeave={handleWholesaleDragLeave}
                  onDrop={handleWholesaleDrop}
                  style={{
                    border: '2px dashed var(--border-color)',
                    padding: '16px',
                    borderRadius: '8px',
                    background: 'var(--card-bg)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.3s'
                  }}
                >
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: 'var(--text-light)' }}>
                    Drag & drop image here or
                  </p>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    id="ws-product-image-browse"
                    onClick={() => document.getElementById('ws-product-image-file')?.click()}
                    style={{ marginBottom: '8px' }}
                  >
                    Select File
                  </button>
                  <input
                    type="file"
                    id="ws-product-image-file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleWholesaleImageChange}
                  />
                  <div id="ws-product-image-status" style={{ fontSize: '0.85rem', color: 'var(--text-medium)', marginTop: '4px' }}>
                    {wholesaleImageStatus}
                  </div>
                </div>

              </div>

              <div className="form-group">
                <label htmlFor="ws-product-id-slug">Product ID (URL slug)</label>
                <input
                  type="text"
                  id="ws-product-id-slug"
                  placeholder="e.g., black-tea"
                  required
                  value={wholesaleForm.slug}
                  onChange={(e) => setWholesaleForm({ ...wholesaleForm, slug: e.target.value })}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <i className="fa-solid fa-save"></i> Save Wholesale Product
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowWholesaleModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </body>
  )
}

