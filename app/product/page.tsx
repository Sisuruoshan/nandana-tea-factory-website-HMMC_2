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

export default function ProductPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const productSlug = searchParams.get('id')
  
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    if (productSlug) {
      loadProduct(productSlug)
    }
  }, [productSlug])

  const loadProduct = async (slug: string) => {
    try {
      const res = await fetch(`/api/products/${slug}`)
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

  const addToCart = async () => {
    if (!product) return

    setAddingToCart(true)
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
        alert('Product added to cart!')
        router.push('/cart')
      } else if (res.status === 401) {
        router.push('/login?redirect=' + encodeURIComponent(`/product?id=${product.slug}`))
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to add to cart')
      }
    } catch (error) {
      alert('An error occurred. Please try again.')
    } finally {
      setAddingToCart(false)
    }
  }

  const formatPrice = (value: number) => {
    return `Rs. ${value.toFixed(2)}`
  }

  const resolveImage = (path: string | null) => {
    if (!path) return '/images/image.png'
    if (path.startsWith('http')) return path
    return `/${path.replace(/^\//, '')}`
  }

  if (loading) {
    return (
      <main style={{ paddingTop: '8rem', minHeight: '60vh' }}>
        <div className="container">
          <p>Loading product...</p>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main style={{ paddingTop: '8rem', minHeight: '60vh' }}>
        <div className="container">
          <p>Product not found</p>
          <Link href="/products">Back to Products</Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ paddingTop: '8rem', minHeight: '60vh' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <Image
              src={resolveImage(product.image)}
              alt={product.name}
              width={500}
              height={400}
              style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
            />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '1rem' }}>
              {product.name}
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-medium)', marginBottom: '1.5rem' }}>
              {product.description}
            </p>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-mint-green)', marginBottom: '2rem' }}>
              {formatPrice(product.price)}
            </div>
            {product.stock > 0 ? (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Quantity:</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="qty-btn"
                    >
                      -
                    </button>
                    <span style={{ fontSize: '1.2rem' }}>{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={addToCart}
                  className="btn btn-primary"
                  disabled={addingToCart}
                  style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                >
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
              </>
            ) : (
              <p style={{ color: 'var(--error-color)' }}>Out of Stock</p>
            )}
          </div>
        </div>

        {product.longDescription && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Description</h2>
            <p style={{ lineHeight: '1.8' }}>{product.longDescription}</p>
          </div>
        )}

        {product.origin && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Origin</h2>
            <p>{product.origin}</p>
          </div>
        )}

        {product.brewingGuide && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Brewing Guide</h2>
            <p style={{ whiteSpace: 'pre-line' }}>{product.brewingGuide}</p>
          </div>
        )}

        {product.notes && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Notes</h2>
            <p>{product.notes}</p>
          </div>
        )}
      </div>
    </main>
  )
}
