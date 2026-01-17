'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface CartItem {
  id: number
  product_id: number
  product_name: string
  product_image: string
  quantity: number
  price: number
  subtotal: number
}

const styles = {
  page: {
    background: 'radial-gradient(circle at 18% 20%, rgba(26, 91, 52, 0.16), transparent 36%), radial-gradient(circle at 82% 8%, rgba(32, 110, 62, 0.18), transparent 32%), #0c2416',
    minHeight: '100vh',
    color: '#e7f4eb',
  },
  container: {
    maxWidth: '1220px',
    margin: '0 auto',
    padding: '120px 28px 80px',
  },
  hero: {
    textAlign: 'center' as const,
    marginBottom: '36px',
    position: 'relative' as const,
  },
  heroTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '2.7rem',
    marginBottom: '6px',
  },
  heroSub: {
    color: '#bed7c8',
    fontSize: '1.02rem',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
    gap: '24px',
  },
  card: {
    background: 'linear-gradient(145deg, rgba(12, 36, 22, 0.92), rgba(12, 36, 22, 0.78))',
    borderRadius: '18px',
    padding: '18px',
    border: '1px solid rgba(255,255,255,0.06)',
    boxShadow: '0 18px 45px rgba(0,0,0,0.32)',
  },
  item: {
    display: 'grid',
    gridTemplateColumns: '90px 1fr auto auto auto',
    gap: '16px',
    alignItems: 'center',
    padding: '14px',
    borderRadius: '14px',
    background: 'rgba(15, 43, 25, 0.72)',
    border: '1px solid rgba(255,255,255,0.05)',
    marginBottom: '14px',
  },
  qtyBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#0f2b19',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '8px 10px',
  },
  qtyButton: {
    width: '30px',
    height: '30px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: '#123820',
    color: '#e7f4eb',
    cursor: 'pointer',
  },
  price: {
    color: '#4ade80',
    fontWeight: 700,
  },
  trashBtn: {
    background: 'none',
    border: 'none',
    color: '#f87171',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  summary: {
    background: 'linear-gradient(135deg, rgba(12, 36, 22, 0.9), rgba(10, 30, 18, 0.92))',
    borderRadius: '18px',
    padding: '20px',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 18px 45px rgba(0,0,0,0.32)',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    color: '#d5e7dc',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    paddingTop: '14px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    fontWeight: 800,
    color: '#4ade80',
    fontSize: '1.2rem',
  },
  primaryBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: '#22c55e',
    color: '#0c2416',
    fontWeight: 800,
    cursor: 'pointer',
    marginTop: '12px',
  },
  secondaryBtn: {
    width: '100%',
    padding: '13px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'transparent',
    color: '#e7f4eb',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '10px',
  },
}

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      const res = await fetch('/api/cart')
      if (res.ok) {
        const data = await res.json()
        setCartItems(data.items || [])
        setTotal(data.total || 0)
      } else if (res.status === 401) {
        router.push('/login?redirect=/cart')
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity < 1) return

    try {
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      })

      if (res.ok) {
        await loadCart()
      }
    } catch (error) {
      console.error('Failed to update quantity:', error)
    }
  }

  const removeItem = async (itemId: number) => {
    try {
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await loadCart()
      }
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  const clearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return

    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
      })

      if (res.ok) {
        await loadCart()
      }
    } catch (error) {
      console.error('Failed to clear cart:', error)
    }
  }

  const formatPrice = (value: number) => {
    return `Rs. ${value.toFixed(2)}`
  }

  const resolveImage = (path: string) => {
    if (!path) return '/images/image.png'
    if (path.startsWith('http')) return path
    return `/${path.replace(/^\//, '')}`
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <p>Loading cart...</p>
        </div>
      </main>
    )
  }

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.hero}>
          <div style={{ fontSize: '2.6rem' }}>
            Your Shopping Cart
          </div>
          <div style={styles.heroSub}>{itemCount} {itemCount === 1 ? 'item' : 'items'} in cart</div>
        </header>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Your cart is empty</p>
            <Link href="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div style={styles.layout}>
            <section style={styles.card}>
              {cartItems.map((item) => (
                <div key={item.id} style={styles.item}>
                  <div>
                    <Image
                      src={resolveImage(item.product_image)}
                      alt={item.product_name}
                      width={90}
                      height={90}
                      style={{ borderRadius: '12px', objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{item.product_name}</div>
                    <div style={{ color: '#9fc3ae', fontSize: '0.95rem', marginTop: '4px' }}>Premium Tea</div>
                  </div>
                  <div style={styles.price}>{formatPrice(item.price)}</div>
                  <div>
                    <div style={styles.qtyBox}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={styles.qtyButton}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span style={{ minWidth: '12px', textAlign: 'center' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={styles.qtyButton}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div style={{ ...styles.price, minWidth: '82px', textAlign: 'right' }}>
                    {formatPrice(item.subtotal)}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    style={styles.trashBtn}
                    title="Remove item"
                    aria-label={`Remove ${item.product_name}`}
                  >
                    <i className="fa-solid fa-trash" aria-hidden="true"></i>
                  </button>
                </div>
              ))}
              <button onClick={clearCart} style={styles.secondaryBtn}>
                Clear Cart
              </button>
            </section>

            <aside style={styles.summary}>
              <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '14px' }}>Order Summary</h2>
              <div style={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Taxes</span>
                <span>Calculated at checkout</span>
              </div>
              <div style={styles.summaryTotal}>
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Link href="/payment" style={{ textDecoration: 'none' }}>
                <button style={styles.primaryBtn}>
                  <i className="fa-solid fa-lock" aria-hidden="true"></i>
                  Proceed to Checkout
                </button>
              </Link>
              <button onClick={clearCart} style={styles.secondaryBtn}>
                <i className="fa-solid fa-trash" aria-hidden="true"></i>
                Clear Cart
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
