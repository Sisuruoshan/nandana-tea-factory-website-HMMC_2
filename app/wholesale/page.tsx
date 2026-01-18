'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function WholesalePage() {

  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    company: '',
    email: '',
    details: '',
  })
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const res = await fetch('/api/wholesale/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryForm),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus({ type: 'success', message: data.message || 'Inquiry submitted successfully!' })
        setInquiryForm({ name: '', company: '', email: '', details: '' })
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to submit inquiry' })
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container" style={{ paddingTop: '8rem' }}>
      <section className="page-header">
        <h1>Wholesale Portal</h1>
        <p>Access exclusive pricing and bulk ordering.</p>
      </section>
      <section className="form-container" style={{ marginTop: '4rem', maxWidth: 'none' }}>
        <h2 style={{ textAlign: 'center' }}>Specific Wholesale Inquiry</h2>

        {status && (
          <div
            style={{
              background: status.type === 'success' ? '#e6ffed' : '#ffebeb',
              color: status.type === 'success' ? '#03543f' : '#8a1f1f',
              border: `1px solid ${status.type === 'success' ? '#84e1bc' : '#f5a9a9'}`,
              padding: '12px',
              borderRadius: '8px',
              margin: '16px 0',
            }}
          >
            {status.message}
          </div>
        )}

        <form id="wholesale-inquiry-form" onSubmit={handleSubmitInquiry} noValidate>
          <div className="form-group">
            <label htmlFor="ws-name">Your Name</label>
            <input
              type="text"
              name="ws-name"
              required
              value={inquiryForm.name}
              onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ws-company">Company Name</label>
            <input
              type="text"
              name="ws-company"
              required
              value={inquiryForm.company}
              onChange={(e) => setInquiryForm({ ...inquiryForm, company: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ws-email">Your Email</label>
            <input
              type="email"
              name="ws-email"
              required
              value={inquiryForm.email}
              onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ws-details">Inquiry Details</label>
            <textarea
              name="ws-details"
              rows={5}
              required
              value={inquiryForm.details}
              onChange={(e) => setInquiryForm({ ...inquiryForm, details: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Inquiry'}
          </button>
        </form>
    
      </section>
        <br ></br>
    </main>
  )
}
