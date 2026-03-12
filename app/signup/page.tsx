'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Collect the details needed to create a customer account.
export default function SignupPage() {
  const router = useRouter()
  const passwordRequirementPattern = '^(?=.*[A-Z])(?=.*\\d).{8,}$'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(data.message || 'Account created successfully!')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setError(data.error || `Failed to create account (Status: ${res.status})`)
      }
    } catch (error) {
      console.error('Signup request error:', error)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-container" style={{ marginTop: '6rem' }}>
      <div className="signup-card">
        <h2>Create Your Account</h2>

        {success && (
          <div className="alert success" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
            {success}
          </div>
        )}
        {error && (
          <div className="alert error" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form id="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
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
              minLength={8}
              pattern={passwordRequirementPattern}
              title="Password must be at least 8 characters with one uppercase letter and one number"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Phone (optional)</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Address (optional)</label>
            <textarea
              name="address"
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>


          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <Link href="/login" className="signup-link">
          Already have an account
        </Link>
      </div>
    </div>
  )
}
