'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function WholesaleSignupPage() {
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    passwordConfirm: '',
  })
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)

    if (formData.password !== formData.passwordConfirm) {
      setStatus({ type: 'error', message: 'Passwords do not match.' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/wholesale/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
          company: formData.company,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
          // Note: backend stores this as an inquiry, not a real auth account
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setStatus({ type: 'success', message: data.message || 'Signup submitted! An admin will review your application.' })
        setFormData({
          company: '',
          name: '',
          email: '',
          phone: '',
          address: '',
          password: '',
          passwordConfirm: '',
        })
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to submit signup' })
      }
    } catch (e) {
      setStatus({ type: 'error', message: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container" style={{ paddingTop: '8rem' }}>
      <section className="page-header">
        <h1>Create Wholesale Account</h1>
        <p>Register as a wholesale partner to access bulk pricing and special offers.</p>
      </section>

      <section className="form-container" style={{ maxWidth: 640, margin: '2rem auto' }}>
        {status && (
          <div
            style={{
              background: status.type === 'success' ? '#e6ffed' : '#ffebeb',
              color: status.type === 'success' ? '#03543f' : '#8a1f1f',
              border: `1px solid ${status.type === 'success' ? '#84e1bc' : '#f5a9a9'}`,
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
            }}
          >
            {status.message}
          </div>
        )}

        <form id="wholesale-signup-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="ws-signup-company">Company Name</label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ws-signup-name">Contact Person</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ws-signup-email">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ws-signup-phone">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ws-signup-address">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ws-signup-password">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ws-signup-password-confirm">Confirm Password</label>
            <input
              type="password"
              required
              value={formData.passwordConfirm}
              onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Submitting...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account? <Link href="/wholesale">Login here</Link>.
        </p>
      </section>
    </main>
  )
}

