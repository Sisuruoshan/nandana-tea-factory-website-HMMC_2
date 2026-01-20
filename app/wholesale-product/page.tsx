'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function WholesaleProductPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = searchParams.get('id')

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(10)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('wholesaleLoggedIn') === 'true'
    if (!isLoggedIn) {
      router.push('/wholesale')
      return
    }
    if (slug) load(slug)
    else router.push('/wholesale')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const load = async (s: string) => {
    try {
      // Add caching to wholesale product fetch
      const res = await fetch(`/api/wholesale-products/${encodeURIComponent(s)}`, {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      })
      if (!res.ok) throw new Error('Not found')
      const data = await res.json()
      setProduct(data)
    } catch (e) {
      router.push('/wholesale')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (value: any) => {
    const num = Number(value) || 0
    return `Rs. ${num.toFixed(2)}`
  }

  const resolveImage = (path: string | null | undefined) => {
    if (!path) return '/images/image.png'
    if (path.startsWith('http')) return path
    return `/${path.replace(/^\//, '')}`
  }

  const addToCart = async () => {
    if (!product) return

    // Check if user is actually logged in (has auth session)
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/session')
        return res.ok
      } catch {
        return false
      }
    }

    const isAuthenticated = await checkSession()

    if (!isAuthenticated) {
      if (confirm('You need to be logged in to add items to cart. Would you like to login now?')) {
        router.push('/login?redirect=/wholesale-product?id=' + encodeURIComponent(slug || ''))
      }
      return
    }

    setAdding(true)
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, quantity: qty }),
      })
      if (res.ok) {
        alert('Added to cart')
        // Refresh product data to update stock
        if (slug) await load(slug)
        window.dispatchEvent(new Event('cartUpdated'))
        router.push('/cart')
      } else {
        const data = await res.json().catch(() => ({}))
        if (data.error === 'Unauthorized') {
          if (confirm('Your session has expired. Would you like to login again?')) {
            router.push('/login?redirect=/wholesale-product?id=' + encodeURIComponent(slug || ''))
          }
        } else {
          alert(data.error || 'Failed to add to cart')
        }
      }
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <main className="container" style={{ paddingTop: '8rem' }}>
        <p>Loading...</p>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="container" style={{ paddingTop: '8rem' }}>
        <p>Product not found</p>
      </main>
    )
  }

  return (
    <main className="container" style={{ paddingTop: '8rem' }}>
      <section className="page-header">
        <h1>Wholesale Product Details</h1>
        <p>Exclusive wholesale pricing.</p>
      </section>

      <section className="product-detail">
        <div className="pd-image-wrap">
          <Image
            id="pd-image"
            src={resolveImage(product.image)}
            alt="Product image"
            width={400}
            height={320}
            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            loading="lazy"
            priority={false}
          />
        </div>
        <div className="pd-info">
          <h2 id="pd-title">{product.name}</h2>
          <p id="pd-desc" className="pd-desc">{product.description}</p>
          <div className="pd-price">
            <span style={{ color: 'var(--text-medium)' }}>
              Retail: <span id="pd-price-retail">{formatPrice(product.price)}</span>
            </span>
            <br />
            <span style={{ fontSize: '1.5rem', color: 'var(--accent-mint-green)', fontWeight: 700 }}>
              Wholesale: <span id="pd-price-wholesale">{formatPrice(product.wholesalePrice ?? product.price)}</span>
            </span>
          </div>
          <p style={{ color: 'var(--text-medium)', marginTop: '0.5rem' }}>
            Stock: <span id="pd-stock">{product.stock || 0}</span> units
          </p>

          <div className="pd-actions">
            <label htmlFor="pd-qty">Quantity</label>
            <div className="quantity-selector" style={{ marginBottom: '1rem' }}>
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="qty-btn"
                disabled={qty <= 1}
              >
                <i className="fa-solid fa-minus"></i>
              </button>
              <input
                id="pd-qty"
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                className="qty-input"
              />
              <button
                onClick={() => setQty(qty + 1)}
                className="qty-btn"
                disabled={product.stock !== undefined && qty >= product.stock}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
            <button id="pd-add" className="btn btn-primary" onClick={addToCart} disabled={adding} style={{ width: '100%' }}>
              <i className="fa-solid fa-cart-plus"></i> {adding ? 'Adding...' : 'Add to Cart'}
            </button>
            <Link id="pd-inquiry" className="btn btn-secondary" href="/contact" style={{ width: '100%', textAlign: 'center' }}>
              <i className="fa-solid fa-envelope"></i> Send Inquiry
            </Link>
          </div>
        </div>
      </section>

      <section className="product-explainer">
        <div className="pd-meta">
          <h3>Origin &amp; Notes</h3>
          <p id="pd-origin">{product.origin || ''}</p>
          <p id="pd-notes">{product.notes || ''}</p>
        </div>
        <div className="pd-brew">
          <h3>Brewing Guide</h3>
          <ul id="pd-brew">
            {(String(product.brewingGuide || '').split('\n').map((l: string) => l.trim()).filter(Boolean)).map((l: string, idx: number) => (
              <li key={idx}>{l}</li>
            ))}
          </ul>
        </div>
        <div className="pd-long">
          <h3>About this Tea</h3>
          <p id="pd-long">{product.longDescription || ''}</p>
        </div>
      </section>
    </main>
  )
}

