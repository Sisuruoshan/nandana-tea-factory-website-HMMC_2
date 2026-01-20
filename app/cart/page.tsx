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
    background: '#f8f6f3',
    minHeight: '100vh',
    color: '#1a1a1a',
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
    background: 'linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%)',
    padding: '3rem 1rem',
    borderRadius: '18px',
    boxShadow: '0 4px 20px rgba(45, 80, 22, 0.15)',
    zIndex: 1,
  },
  heroTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '2.7rem',
    marginBottom: '6px',
    color: '#ffffff',
  },
  heroSub: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '1.02rem',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
    gap: '24px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '18px',
    padding: '18px',
    border: '1px solid #d4c5b0',
    boxShadow: '0 4px 20px rgba(45, 80, 22, 0.08)',
  },
  item: {
    display: 'grid',
    gridTemplateColumns: '90px 1fr auto auto auto',
    gap: '16px',
    alignItems: 'center',
    padding: '14px',
    borderRadius: '14px',
    background: '#ebe8e3',
    border: '1px solid #d4c5b0',
    marginBottom: '14px',
    position: 'relative' as const,
  },
  qtyBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#ffffff',
    border: '1px solid #d4c5b0',
    borderRadius: '10px',
    padding: '8px 10px',
  },
  qtyButton: {
    width: '30px',
    height: '30px',
    borderRadius: '8px',
    border: '1px solid #d4c5b0',
    background: '#f8f6f3',
    color: '#2d5016',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  price: {
    color: '#2d5016',
    fontWeight: 700,
  },
  trashBtn: {
    background: 'none',
    border: 'none',
    color: '#dc2626',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'color 0.3s ease',
    position: 'absolute' as const,
    bottom: '14px',
    right: '14px',
  },
  summary: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '18px',
    padding: '20px',
    border: '1px solid #d4c5b0',
    boxShadow: '0 4px 20px rgba(45, 80, 22, 0.08)',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    color: '#4a4a4a',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    paddingTop: '14px',
    borderTop: '1px solid #d4c5b0',
    fontWeight: 800,
    color: '#2d5016',
    fontSize: '1.2rem',
  },
  primaryBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: '#2d5016',
    color: '#f8f6f3',
    fontWeight: 800,
    cursor: 'pointer',
    marginTop: '12px',
    transition: 'all 0.3s ease',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
  },
  secondaryBtn: {
    width: '100%',
    padding: '13px',
    borderRadius: '12px',
    border: '1px solid #2d5016',
    background: 'transparent',
    color: '#2d5016',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'all 0.3s ease',
  },
}

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' })

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }))
    }, 3000)
  }

  useEffect(() => {
    loadCart()
  }, [])

  // ... (rest of methods)
  const loadCart = async () => {
    try {
      const res = await fetch('/api/cart', { cache: 'no-store' })
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
    const itemToRemove = cartItems.find(item => item.id === itemId)
    setCartItems(prev => prev.filter(item => item.id !== itemId))
    if (itemToRemove) {
      setTotal(prev => prev - itemToRemove.subtotal)
    }

    try {
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await loadCart()
        showToast('Item removed', 'success')
      } else {
        await loadCart()
        showToast('Failed to remove item', 'error')
      }
    } catch (error) {
      console.error('Failed to remove item:', error)
      await loadCart()
      showToast('An error occurred', 'error')
    }
  }

  const clearCart = () => {
    setShowClearConfirm(true)
  }

  const confirmClearCart = async () => {
    setShowClearConfirm(false)
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
      })

      if (res.ok) {
        await loadCart()
        showToast('Cart cleared successfully', 'success')
      } else {
        showToast('Failed to clear cart', 'error')
      }
    } catch (error) {
      console.error('Failed to clear cart:', error)
      showToast('An error occurred', 'error')
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
          <div style={styles.heroTitle}>
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
                  <div style={{ width: '90px', height: '90px', flexShrink: 0 }}>
                    <Image
                      src={resolveImage(item.product_image)}
                      alt={item.product_name}
                      width={90}
                      height={90}
                      unoptimized
                      style={{ borderRadius: '12px', objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
                    />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#2d5016' }}>{item.product_name}</div>
                    <div style={{ color: '#6b6b6b', fontSize: '0.95rem', marginTop: '4px' }}>Premium Tea</div>
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
              <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '14px', color: '#2d5016' }}>Order Summary</h2>
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

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
            background: 'white', padding: '24px', borderRadius: '12px', maxWidth: '400px', width: '90%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)', textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '16px', color: '#2d5016' }}>Clear Cart?</h3>
            <p style={{ marginBottom: '24px', color: '#666' }}>Are you sure you want to remove all items from your cart? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowClearConfirm(false)}
                style={{
                  padding: '10px 20px', borderRadius: '8px', border: '1px solid #ccc', background: 'white', cursor: 'pointer', fontWeight: 600
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmClearCart}
                style={{
                  padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', cursor: 'pointer', fontWeight: 600
                }}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          padding: '16px 24px',
          background: toast.type === 'success' ? '#2d5016' : '#ef4444',
          color: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          transform: toast.show ? 'translateY(0)' : 'translateY(100px)',
          opacity: toast.show ? 1 : 0,
          transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
          zIndex: 10000,
          pointerEvents: toast.show ? 'auto' : 'none',
        }}
      >
        <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
        <span style={{ fontWeight: 500 }}>{toast.message}</span>
      </div>
    </main>
  )
}
