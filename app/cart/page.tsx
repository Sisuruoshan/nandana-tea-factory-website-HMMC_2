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
      <main style={{ paddingTop: '8rem', minHeight: '60vh' }}>
        <div className="container">
          <p>Loading cart...</p>
        </div>
      </main>
    )
  }

  return (
    <main style={{ paddingTop: '8rem', minHeight: '60vh' }}>
      <div className="container">
        <div className="page-header">
          <h1>Shopping Cart</h1>
          <p>Review your items before checkout</p>
        </div>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Your cart is empty</p>
            <Link href="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-wrapper">
            <div className="cart-items-section">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <div className="cart-item-image">
                    <Image
                      src={resolveImage(item.product_image)}
                      alt={item.product_name}
                      width={100}
                      height={100}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="cart-item-details">
                    <h3>{item.product_name}</h3>
                    <p>{formatPrice(item.price)} each</p>
                  </div>
                  <div className="cart-item-quantity">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="qty-btn"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item-subtotal">
                    {formatPrice(item.subtotal)}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="remove-btn"
                    title="Remove item"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
              <button onClick={clearCart} className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
                Clear Cart
              </button>
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Link href="/payment" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
