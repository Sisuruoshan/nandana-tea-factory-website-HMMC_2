'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: number
  name: string
  description: string
  slug: string
  price: number
  wholesalePrice?: number | null
  image: string | null
}

export default function WholesalePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const LIMIT = 9

  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    company: '',
    email: '',
    details: '',
  })
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  // Listen to header search events
  useEffect(() => {
    const handleHeaderSearch = (event: CustomEvent) => {
      setSearchQuery(event.detail)
    }
    window.addEventListener('headerSearch', handleHeaderSearch as EventListener)
    return () => {
      window.removeEventListener('headerSearch', handleHeaderSearch as EventListener)
    }
  }, [])

  // Debounce search and load products
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      loadProducts(1, searchQuery)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const loadProducts = async (pageNum: number, search: string) => {
    if (pageNum === 1) setProductsLoading(true)
    else setLoadingMore(true)

    try {
      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        limit: LIMIT.toString(),
      })
      if (search) queryParams.set('search', search)

      const res = await fetch(`/api/wholesale-products?${queryParams.toString()}`, {
        next: { revalidate: 60 },
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      })
      if (res.ok) {
        const data = await res.json()
        const newProducts = data.products || []

        if (pageNum === 1) {
          setProducts(newProducts)
        } else {
          setProducts(prev => [...prev, ...newProducts])
        }

        setHasMore(newProducts.length === LIMIT)
      }
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setProductsLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadProducts(nextPage, searchQuery)
  }

  const formatPrice = (value: number) => {
    return `Rs. ${value.toFixed(2)}`
  }

  const resolveImage = (path: string | null) => {
    if (!path) return '/images/image.png'
    if (path.startsWith('data:')) return path
    if (path.startsWith('http')) return path
    return `/${path.replace(/^\//, '')}`
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

      <div className="product-controls">
        <Link href="/products" className="btn">Retail</Link>
        <Link href="/wholesale" className="btn active">Wholesale</Link>
      </div>

      {productsLoading && page === 1 ? (
        <div id="product-loading" style={{ padding: '40px', textAlign: 'center', color: '#555' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--accent-medium-green)' }}></i>
          <p style={{ marginTop: '10px' }}>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div id="no-results" style={{ padding: '40px', textAlign: 'center', color: '#555' }}>
          No matching products found.
        </div>
      ) : (
        <>
          <div className="product-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <Image
                  src={resolveImage(product.image)}
                  alt={product.name}
                  width={240}
                  height={180}
                  style={{ objectFit: 'cover' }}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="price">{formatPrice(product.wholesalePrice || product.price)}</div>
                <Link href={`/wholesale-product?id=${encodeURIComponent(product.slug)}`}>View More</Link>
              </div>
            ))}
          </div>

          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                onClick={handleLoadMore}
                className="btn btn-secondary"
                disabled={loadingMore}
                style={{ minWidth: '150px' }}
              >
                {loadingMore ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </>
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
        <br ></br>
    </main>
  )
}
