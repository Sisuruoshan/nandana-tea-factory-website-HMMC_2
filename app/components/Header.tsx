'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const headerRef = useRef<HTMLElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkSession()
    updateCartCount()

    // Match original "header.scrolled" behavior
    const onScroll = () => {
      const headerEl = headerRef.current
      if (!headerEl) return
      if (window.scrollY > 50) headerEl.classList.add('scrolled')
      else headerEl.classList.remove('scrolled')
    }

    onScroll()
    window.addEventListener('scroll', onScroll)

    // Close user menu when clicking outside (like main.js)
    const onDocClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return
      if (!target.closest('.user-profile-dropdown')) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)

    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('click', onDocClick)
    }
  }, [])

  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/session')
      const data = await res.json()
      if (data.user) {
        setUser(data.user)
      }
    } catch (error) {
      console.error('Session check error:', error)
    }
  }

  const updateCartCount = async () => {
    try {
      const res = await fetch('/api/cart')
      if (res.ok) {
        const data = await res.json()
        const totalQuantity = data.items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0
        setCartCount(totalQuantity)
      }
    } catch (error) {
      console.error('Cart count error:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      setUserMenuOpen(false)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header ref={(el) => { headerRef.current = el }}>
      <Link href="/" className="logo">
        <i className="fa-solid fa-leaf"></i> Nandana Tea
      </Link>
      <nav className={mobileNavOpen ? 'nav-active' : ''}>
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
        <Link href="/about">About Us</Link>
        <Link href="/contact">Contact</Link>
      </nav>
      <div className="header-icons" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user ? (
          <>
            <Link href="/cart" className="cart-icon" style={{ marginRight: '12px' }}>
              <i className="fa-solid fa-shopping-cart"></i>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
            <div className="user-profile-dropdown">
              <button
                className="avatar-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  setUserMenuOpen((v) => !v)
                }}
                aria-label="Profile menu"
              >
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt="Profile Avatar"
                    className="avatar-image"
                    width={32}
                    height={32}
                  />
                ) : (
                  <i className="fa-solid fa-user-circle"></i>
                )}
              </button>
              <div className={`user-menu ${userMenuOpen ? 'active' : ''}`} id="userMenu">
                  <Link href="/edit-profile" className="user-menu-item">
                    <i className="fa-solid fa-edit"></i> Edit Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="user-menu-item logout-btn"
                  >
                    <i className="fa-solid fa-sign-out-alt"></i> Logout
                  </button>
                </div>
            </div>
          </>
        ) : (
          <Link href="/login" title="Login">
            <i className="fa-solid fa-user"></i>
          </Link>
        )}
      </div>
      <div
        className={`hamburger-menu ${mobileNavOpen ? 'is-active' : ''}`}
        onClick={() => setMobileNavOpen((v) => !v)}
        role="button"
        tabIndex={0}
        aria-label="Toggle navigation"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </header>
  )
}
