'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function WholesalePage() {
  const [wholesaleLoggedIn, setWholesaleLoggedIn] = useState(false)
  const [wholesaleProducts, setWholesaleProducts] = useState<any[]>([])
  const [wholesaleLoading, setWholesaleLoading] = useState(false)

  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    company: '',
    email: '',
    details: '',
  })
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('wholesaleLoggedIn') === 'true'
    setWholesaleLoggedIn(isLoggedIn)
    if (isLoggedIn) {
      loadWholesaleProducts()
    }
  }, [])

  const loadWholesaleProducts = async () => {
    setWholesaleLoading(true)
    try {
      const res = await fetch('/api/wholesale-products')
      if (!res.ok) throw new Error('Failed to load wholesale products')
      const data = await res.json()
      setWholesaleProducts(Array.isArray(data) ? data : [])
    } catch (e) {
      setWholesaleProducts([])
    } finally {
      setWholesaleLoading(false)
    }
  }

  const handleWholesaleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('wholesaleLoggedIn', 'true')
    setWholesaleLoggedIn(true)
    loadWholesaleProducts()
  }

  const handleWholesaleLogout = () => {
    localStorage.removeItem('wholesaleLoggedIn')
    setWholesaleLoggedIn(false)
  }

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const res = await fetch('/api/wholesale/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryForm),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus({ type: 'success', message: data.message || 'Inquiry submitted successfully!' })
        setInquiryForm({ name: '', company: '', email: '', details: '' })
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to submit inquiry' })
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container" style={{ paddingTop: '8rem' }}>
      <section className="page-header">
        <h1>Wholesale Portal</h1>
        <p>Access exclusive pricing and bulk ordering.</p>
      </section>

      {!wholesaleLoggedIn ? (
        <section id="login-section" className="wholesale-grid">
          <div className="form-container">
            <h2>Login to your Account</h2>
            <form id="wholesale-login-form" onSubmit={handleWholesaleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="you@example.com" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Login
              </button>
            </form>
          </div>
          <div style={{ paddingTop: '3rem' }}>
            <h2>New Wholesale Partner?</h2>
            <p style={{ color: 'var(--text-medium)', lineHeight: 1.8, margin: '1rem 0 2rem 0' }}>
              Register for a wholesale account to unlock benefits like tiered pricing, dedicated support, and early access
              to new tea collections.
            </p>
            <Link href="/wholesale-signup" className="btn btn-primary">
              Create an Account
            </Link>
          </div>
        </section>
      ) : (
        <section id="wholesale-products-section" style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Wholesale Products</h2>
            <button id="logout-btn" className="btn btn-secondary" onClick={handleWholesaleLogout}>
              Logout
            </button>
          </div>
          <div className="product-controls">
            <a href="#" className="btn active">Wholesale</a>
            <Link href="/products" className="btn">Retail</Link>
          </div>

          {wholesaleLoading ? (
            <div id="wholesale-loading" style={{ padding: '20px', textAlign: 'center', color: '#555' }}>
              Loading wholesale products...
            </div>
          ) : wholesaleProducts.length === 0 ? (
            <div id="wholesale-no-results" style={{ padding: '20px', textAlign: 'center', color: '#555' }}>
              No wholesale products available.
            </div>
          ) : (
            <div className="product-grid" id="wholesale-products-grid">
              {wholesaleProducts.map((p) => (
                <div className="product-card" key={p.id}>
                  <Image
                    src={(p.image && (p.image.startsWith('http') ? p.image : `/${String(p.image).replace(/^\//, '')}`)) || '/images/image.png'}
                    alt={p.name || 'Tea'}
                    width={240}
                    height={180}
                    style={{ objectFit: 'cover' }}
                  />
                  <h3>{p.name || 'Tea'}</h3>
                  <p>{p.description || ''}</p>
                  <div className="price">
                    Retail: Rs. {Number(p.price || 0).toFixed(2)} | Wholesale: Rs. {Number(p.wholesalePrice ?? p.price ?? 0).toFixed(2)}
                  </div>
                  <p style={{ color: 'var(--text-medium)', fontSize: '0.85rem' }}>Stock: {p.stock || 0} units</p>
                  <Link href={`/wholesale-product?id=${encodeURIComponent(p.slug)}`}>View More</Link>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="form-container" style={{ marginTop: '4rem', maxWidth: 'none' }}>
        <h2 style={{ textAlign: 'center' }}>Specific Wholesale Inquiry</h2>

        {status && (
          <div
            style={{
              background: status.type === 'success' ? '#e6ffed' : '#ffebeb',
              color: status.type === 'success' ? '#03543f' : '#8a1f1f',
              border: `1px solid ${status.type === 'success' ? '#84e1bc' : '#f5a9a9'}`,
              padding: '12px',
              borderRadius: '8px',
              margin: '16px 0',
            }}
          >
            {status.message}
          </div>
        )}

        <form id="wholesale-inquiry-form" onSubmit={handleSubmitInquiry} noValidate>
          <div className="form-group">
            <label htmlFor="ws-name">Your Name</label>
            <input
              type="text"
              name="ws-name"
              required
              value={inquiryForm.name}
              onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ws-company">Company Name</label>
            <input
              type="text"
              name="ws-company"
              required
              value={inquiryForm.company}
              onChange={(e) => setInquiryForm({ ...inquiryForm, company: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ws-email">Your Email</label>
            <input
              type="email"
              name="ws-email"
              required
              value={inquiryForm.email}
              onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ws-details">Inquiry Details</label>
            <textarea
              name="ws-details"
              rows={5}
              required
              value={inquiryForm.details}
              onChange={(e) => setInquiryForm({ ...inquiryForm, details: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Inquiry'}
          </button>
        </form>
      </section>
    </main>
  )
}
