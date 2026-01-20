'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [redirect, setRedirect] = useState<string>('/')

  // Determine redirect URL: use query param, or fall back to referrer, or default to /
  useEffect(() => {
    const queryRedirect = searchParams.get('redirect')
    if (queryRedirect) {
      setRedirect(queryRedirect)
    } else if (typeof window !== 'undefined' && document.referrer) {
      // Extract path from referrer URL
      try {
        const referrerUrl = new URL(document.referrer)
        const referrerPath = referrerUrl.pathname + referrerUrl.search
        // Only redirect to non-login/signup pages
        if (!referrerPath.includes('/login') && !referrerPath.includes('/signup')) {
          setRedirect(referrerPath)
        }
      } catch (e) {
        // If referrer parsing fails, keep default '/'
      }
    }
  }, [searchParams])

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, redirect }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push(redirect)
        router.refresh()
      } else {
        setError(data.error || 'Invalid email or password')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container" style={{ marginTop: '2rem' }}>
      <div className="login-card">
        <i className="fa-solid fa-leaf"></i>
        <h2>Welcome Back</h2>

        {error && (
          <div className="alert error" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form id="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <Link href="/signup" className="signup-link">
          Create an account
        </Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="login-container" style={{ marginTop: '2rem' }}>
        <div className="login-card">
          <p>Loading login...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
