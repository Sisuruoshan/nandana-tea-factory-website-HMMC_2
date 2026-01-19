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
  image2?: string | null
  origin: string | null
  notes: string | null
  brewingGuide: string | null
  stock: number
}

const styles = {
  page: {
    background: 'linear-gradient(135deg, var(--primary-bg) 0%, var(--secondary-bg) 50%, var(--primary-bg) 100%)',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    color: 'var(--text-primary)',
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
    color: 'var(--primary-green)',
  },
  heroSub: {
    color: 'var(--accent-green)',
    textAlign: 'center' as const,
    marginBottom: '48px',
    fontSize: '1.05rem',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.08fr) minmax(0, 0.92fr)',
    gap: '38px',
    alignItems: 'center',
    background: 'var(--card-bg)',
    backdropFilter: 'blur(10px)',
    borderRadius: '22px',
    padding: '26px',
    boxShadow: '0 24px 70px var(--shadow-green)',
    border: `2px solid var(--border-light)`,
  },
  imageWrap: {
    background: 'transparent',
    borderRadius: '18px',
    padding: '0',
    border: 'none',
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
    color: 'var(--primary-green)',
  },
  productSub: {
    color: 'var(--text-secondary)',
    marginBottom: '16px',
    fontSize: '1.02rem',
  },
  price: {
    fontSize: '2rem',
    fontWeight: 800,
    color: 'var(--accent-green)',
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
    border: `2px solid var(--border-light)`,
    background: 'rgba(255, 255, 255, 0.95)',
    color: 'var(--text-primary)',
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
    background: `linear-gradient(135deg, var(--primary-green) 0%, var(--accent-green) 100%)`,
    color: 'var(--text-on-dark)',
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
    boxShadow: '0 4px 15px var(--shadow-green)',
  },
  ghostBtn: {
    background: 'transparent',
    color: 'var(--primary-green)',
    border: `2px solid var(--primary-green)`,
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
    background: 'var(--card-bg)',
    backdropFilter: 'blur(10px)',
    borderRadius: '14px',
    padding: '18px',
    border: `2px solid var(--border-light)`,
    boxShadow: '0 4px 16px var(--shadow-green)',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginTop: '26px',
  },
  detailCard: {
    background: 'var(--card-bg)',
    backdropFilter: 'blur(10px)',
    border: `2px solid var(--border-light)`,
    borderRadius: '16px',
    padding: '22px',
    boxShadow: '0 4px 16px var(--shadow-green)',
  },
  detailTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.35rem',
    marginBottom: '12px',
    color: 'var(--primary-green)',
  },
  list: {
    margin: 0,
    paddingLeft: '20px',
    lineHeight: 1.8,
    color: 'var(--text-secondary)',
    fontWeight: 500,
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
                  <span style={{ color: 'var(--text-secondary)', minWidth: '78px', fontWeight: 600 }}>Quantity</span>
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
                {message && <div style={{ color: 'var(--success-color)', marginBottom: '12px' }}>{message}</div>}
              </>
            ) : (
              <p style={{ color: 'var(--error-color)', marginBottom: '18px' }}>Out of Stock</p>
            )}


          </div>
        </div>

        <section style={styles.detailsGrid}>
          <div style={styles.detailCard}>
            <h3 style={styles.detailTitle}>Origin & Notes</h3>
            <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
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
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontWeight: 500 }}>
              {product.longDescription || 'High quality green tea'}
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
