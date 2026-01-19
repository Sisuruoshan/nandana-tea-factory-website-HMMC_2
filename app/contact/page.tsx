'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus({ type: 'success', message: data.message || 'Inquiry submitted successfully!' })
        setFormData({ name: '', email: '', subject: '', message: '' })
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
    <main className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
      <div className="contact-grid">
        <div className="contact-form">
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '1rem' }}>
            Get in Touch
          </h1>
          <p style={{ color: 'var(--text-dark)', marginBottom: '2rem', fontWeight: 500 }}>
            We&apos;re here to assist you with any inquiries or feedback. Please reach out to us through the form or our contact details.
          </p>

          {status && (
            <div
              style={{
                background: status.type === 'success' ? 'rgba(74, 124, 44, 0.1)' : 'rgba(193, 80, 61, 0.1)',
                color: status.type === 'success' ? 'var(--success-color)' : 'var(--error-color)',
                border: `1px solid ${status.type === 'success' ? 'var(--success-color)' : 'var(--error-color)'}`,
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              {status.message}
            </div>
          )}

          <form id="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="subject"
                placeholder="Enter the subject"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                rows={5}
                placeholder="Enter your message"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Message'}
            </button>
          </form>
        </div>

        <div className="contact-info">
          <h2>Contact Information</h2>
          <div className="info-item">
            <i className="fa-solid fa-phone"></i>
            <span>+94 71 637 8331</span>
          </div>
          <div className="info-item">
            <i className="fa-solid fa-envelope"></i>
            <span>info@nandanatea.com</span>
          </div>
          <div className="info-item">
            <i className="fa-solid fa-location-dot"></i>
            <span>123 Tea Estate Road, Akuressa, Sri Lanka</span>
          </div>
          <div className="social-info" style={{ marginTop: '4rem' }}>
            <h2>Follow Us</h2>
            <div className="social-icons">
              <a href="https://www.facebook.com/share/1Ay4bEF4K6/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/nandanatea?igsh=MTJsd3h5ZXpyaGFmbQ==" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.youtube.com/@nandanatea735" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
