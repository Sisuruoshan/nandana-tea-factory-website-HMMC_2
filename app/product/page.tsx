'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: number
  name: string
  description: string
  longDescription: string | null
  slug: string
  price: number
  image: string | null
  origin: string | null
  notes: string | null
  brewingGuide: string | null
  stock: number
}

const styles = {
  page: {
    background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #e8f5e9 100%)',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    color: '#1b5e20',
  },
  container: {
    maxWidth: '1250px',
    margin: '0 auto',
    padding: '120px 32px 90px',
  },
  heroHeading: {
    fontFamily: 'var(--font-heading)',
    fontSize: '3rem',
    fontWeight: 700,
    marginBottom: '8px',
    textAlign: 'center' as const,
  },
  heroSub: {
    color: '#2e7d32',
    textAlign: 'center' as const,
    marginBottom: '48px',
    fontSize: '1.05rem',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.08fr) minmax(0, 0.92fr)',
    gap: '38px',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '22px',
    padding: '26px',
    boxShadow: '0 24px 70px rgba(46, 125, 50, 0.25)',
    border: '2px solid #a5d6a7',
  },
  imageWrap: {
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '18px',
    padding: '18px',
    border: '2px solid #a5d6a7',
    overflow: 'hidden',
    aspectRatio: '16 / 10',
    maxHeight: '420px',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '14px',
    objectFit: 'cover' as const,
  },
  productTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '2.4rem',
    marginBottom: '10px',
  },
  productSub: {
    color: '#2e7d32',
    marginBottom: '16px',
    fontSize: '1.02rem',
  },
  price: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#43a047',
    marginBottom: '20px',
  },
  qtyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '18px',
  },
  qtyInput: {
    width: '80px',
    height: '44px',
    borderRadius: '12px',
    border: '2px solid #a5d6a7',
    background: 'rgba(255, 255, 255, 0.9)',
    color: '#1b5e20',
    textAlign: 'center' as const,
    fontSize: '1.05rem',
  },
  ctaRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    marginBottom: '18px',
  },
  primaryBtn: {
    background: 'linear-gradient(135deg, #43a047 0%, #66bb6a 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 18px',
    fontWeight: 800,
    cursor: 'pointer',
    minWidth: '180px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 12px 35px rgba(67, 160, 71, 0.35)',
  },
  ghostBtn: {
    background: 'transparent',
    color: '#1b5e20',
    border: '2px solid #43a047',
    borderRadius: '12px',
    padding: '14px 18px',
    fontWeight: 700,
    cursor: 'pointer',
    minWidth: '180px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  metaCard: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '14px',
    padding: '18px',
    border: '2px solid #a5d6a7',
    boxShadow: '0 4px 16px rgba(46, 125, 50, 0.2)',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginTop: '26px',
  },
  detailCard: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '2px solid #a5d6a7',
    borderRadius: '16px',
    padding: '22px',
    boxShadow: '0 4px 16px rgba(46, 125, 50, 0.2)',
  },
  detailTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.35rem',
    marginBottom: '12px',
    color: '#1b5e20',
  },
  list: {
    margin: 0,
    paddingLeft: '20px',
    lineHeight: 1.8,
    color: '#2e7d32',
  },
}

export default function ProductPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const productSlug = searchParams.get('id')

  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (productSlug) {
      loadProduct(productSlug)
    }
  }, [productSlug])

  const loadProduct = async (slug: string) => {
    try {
      // Add caching to product fetch
      const res = await fetch(`/api/products/${slug}`, {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      })
      if (res.ok) {
        const data = await res.json()
        setProduct(data)
      } else {
        router.push('/products')
      }
    } catch (error) {
      console.error('Failed to load product:', error)
      router.push('/products')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (redirectToCart: boolean) => {
    if (!product) return

    setAddingToCart(true)
    setMessage(null)
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          quantity,
        }),
      })

      if (res.ok) {
        if (redirectToCart) {
          router.push('/cart')
        } else {
          setMessage('Added to cart.')
        }
      } else if (res.status === 401) {
        router.push('/login?redirect=' + encodeURIComponent(`/product?id=${product.slug}`))
      } else {
        const data = await res.json()
        setMessage(data.error || 'Failed to add to cart')
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
    } finally {
      setAddingToCart(false)
    }
  }

  const formatPrice = (value: number) => {
    return `Rs. ${value.toFixed(2)}`
  }

  const resolveImage = (path: string | null) => {
    if (!path) return '/images/image.png'
    if (path.startsWith('data:')) return path
    if (path.startsWith('http')) return path
    const cleaned = path.replace(/^public\//, '').replace(/^\//, '')
    return `/${cleaned}`
  }

  const parseBrewingGuide = (text: string | null): string[] => {
    if (!text) {
      return ['Steep 2-3 min', '94 c boiling water', 'drink']
    }
    const parts = text
      .split(/\r?\n|•|;|\u2022|\.|,/)
      .map((s) => s.trim())
      .filter(Boolean)
    return parts.length ? parts : ['Steep 2-3 min', '94 c boiling water', 'drink']
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <p>Loading product...</p>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <p>Product not found</p>
          <Link href="/products">Back to Products</Link>
        </div>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.heroHeading}>{product.name}</div>
        <div style={styles.heroSub}>Explore the flavors of Nandana Tea.</div>

        <div style={styles.layout}>
          <div style={styles.imageWrap}>
            <Image
              src={resolveImage(product.image)}
              alt={product.name}
              width={680}
              height={520}
              style={styles.image}
              priority
            />
          </div>

          <div>
            <h1 style={styles.productTitle}>{product.name}</h1>
            <p style={styles.productSub}>{product.description || 'Premium quality green tea - updated version'}</p>
            <div style={styles.price}>{formatPrice(product.price)}</div>

            {product.stock > 0 ? (
              <>
                <div style={styles.qtyRow}>
                  <span style={{ color: '#cde5d5', minWidth: '78px' }}>Quantity</span>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                    style={styles.qtyInput}
                  />
                </div>

                <div style={styles.ctaRow}>
                  <button
                    onClick={() => addToCart(true)}
                    style={{ ...styles.primaryBtn, opacity: addingToCart ? 0.7 : 1 }}
                    disabled={addingToCart}
                  >
                    <i className="fa-solid fa-cart-shopping" aria-hidden="true"></i>
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => addToCart(true)}
                    style={styles.ghostBtn}
                    disabled={addingToCart}
                  >
                    <i className="fa-solid fa-lock" aria-hidden="true"></i>
                    Place Order
                  </button>
                </div>
                {message && <div style={{ color: '#9de6b4', marginBottom: '12px' }}>{message}</div>}
              </>
            ) : (
              <p style={{ color: '#fca5a5', marginBottom: '18px' }}>Out of Stock</p>
            )}

            <div style={styles.metaCard}>
              {product.longDescription && (
                <p style={{ lineHeight: 1.7, color: '#c9dfd1' }}>{product.longDescription}</p>
              )}
              {!product.longDescription && (
                <p style={{ color: '#c9dfd1' }}>Sourced from lush highlands, crafted for a smooth and aromatic cup every time.</p>
              )}
            </div>
          </div>
        </div>

        <section style={styles.detailsGrid}>
          <div style={styles.detailCard}>
            <h3 style={styles.detailTitle}>Origin & Notes</h3>
            <div style={{ color: '#c9dfd1' }}>
              <p>{product.origin || '—'}</p>
              {product.notes && <p>{product.notes}</p>}
            </div>
          </div>

          <div style={styles.detailCard}>
            <h3 style={styles.detailTitle}>Brewing Guide</h3>
            <ul style={styles.list}>
              {parseBrewingGuide(product.brewingGuide).map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>

          <div style={{ ...styles.detailCard, gridColumn: '1 / -1' }}>
            <h3 style={styles.detailTitle}>About this Tea</h3>
            <p style={{ color: '#c9dfd1' }}>
              {product.longDescription || 'High quality green tea'}
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
