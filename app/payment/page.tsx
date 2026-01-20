'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [cartTotal, setCartTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthAndLoad()
  }, [searchParams])

  const checkAuthAndLoad = async () => {
    try {
      const authRes = await fetch('/api/auth/session')
      const authData = await authRes.json()

      if (!authRes.ok || !authData.user) {
        router.push(`/login?redirect=${encodeURIComponent('/payment?' + searchParams.toString())}`)
        return
      }

      const slug = searchParams.get('slug')
      const qty = Number(searchParams.get('quantity'))

      if (slug && qty > 0) {
        loadDirectOrder(slug, qty)
      } else {
        loadCart()
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/login')
    }
  }

  const loadDirectOrder = async (slug: string, qty: number) => {
    try {
      const res = await fetch(`/api/products/${slug}`)
      if (res.ok) {
        const product = await res.json()
        const price = (product.isWholesale && product.wholesalePrice)
          ? Number(product.wholesalePrice)
          : Number(product.price)
        setCartTotal(price * qty)
      } else {
        console.error('Product not found')
        // Fallback to cart or error? For now, just stop loading
      }
    } catch (error) {
      console.error('Failed to load product:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCart = async () => {
    try {
      const res = await fetch('/api/cart', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setCartTotal(data.total || 0)
      } else if (res.status === 401) {
        router.push(`/login?redirect=${encodeURIComponent('/payment')}`)
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (value: number) => {
    return `Rs. ${value.toFixed(2)}`
  }

  if (loading) {
    return (
      <main style={{ paddingTop: '8rem', minHeight: '60vh' }}>
        <div className="container">
          <p>Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main style={{ paddingTop: '8rem', paddingBottom: '6rem', minHeight: '60vh' }}>
      <div className="container">
        <div className="page-header">
          <h1>Payment</h1>
          <p>Complete your order</p>
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Order Summary</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>Subtotal:</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>Shipping:</span>
              <span>Calculated at checkout</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <span>Total:</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
          </div>

          <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '12px' }}>
            <h2 style={{ marginBottom: '1rem' }}>Payment Information</h2>
            <p style={{ color: 'var(--text-medium)', marginBottom: '2rem' }}>
              Payment integration will be implemented here. For now, this is a placeholder.
            </p>
            <button className="btn btn-primary" style={{ width: '100%' }} disabled>
              Complete Payment (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <main style={{ paddingTop: '8rem', minHeight: '60vh' }}>
        <div className="container">
          <p>Loading...</p>
        </div>
      </main>
    }>
      <PaymentContent />
    </Suspense>
  )
}
