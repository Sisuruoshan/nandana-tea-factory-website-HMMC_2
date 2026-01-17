'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface User {
  id: number
  name: string
  email: string
  phone: string | null
  address: string | null
  avatar: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/profile')
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      } else if (res.status === 401) {
        router.push('/login?redirect=/profile')
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main style={{ paddingTop: '8rem', minHeight: '60vh' }}>
        <div className="container">
          <p>Loading profile...</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main style={{ paddingTop: '8rem', minHeight: '60vh' }}>
      <div className="container">
        <div className="page-header">
          <h1>My Profile</h1>
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt="Profile Avatar"
                width={120}
                height={120}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ fontSize: '5rem', color: 'var(--accent-mint-green)' }}>
                <i className="fa-solid fa-user-circle"></i>
              </div>
            )}
            <h2 style={{ marginTop: '1rem' }}>{user.name}</h2>
            <p style={{ color: 'var(--text-medium)' }}>{user.email}</p>
          </div>

<<<<<<< Updated upstream
          <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Contact Information</h3>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Phone:</strong> {user.phone || 'Not provided'}
            </p>
            <p>
              <strong>Address:</strong> {user.address || 'Not provided'}
            </p>
=======
          <div className="profile-grid">
            <div className="profile-info">
              <div className="info-group">
                <div className="info-label">Full Name</div>
                <div className="info-value">{user.name}</div>
              </div>
              <div className="info-group">
                <div className="info-label">Email Address</div>
                <div className="info-value">{user.email}</div>
              </div>
              <div className="info-group">
                <div className="info-label">Phone</div>
                <div className="info-value">{user.phone || 'Not provided'}</div>
              </div>
              <div className="info-group">
                <div className="info-label">Address</div>
                <div className="info-value">{user.address || 'Not provided'}</div>
              </div>
            </div>

            <div className="avatar">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', display: 'block', margin: '0 auto' }}
                  onError={(e) => {
                    const img = e.target as HTMLImageElement
                    img.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%2249ca7d%22%3E%3Cpath d=%22M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z%22/%3E%3C/svg%3E'
                  }}
                />
              ) : (
                <img
                  src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%2249ca7d%22%3E%3Cpath d=%22M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z%22/%3E%3C/svg%3E"
                  alt="default avatar"
                  style={{ width: '120px', height: '120px', borderRadius: '50%', display: 'block', margin: '0 auto' }}
                />
              )}
              <h3 style={{ marginTop: '0.75rem' }}>{user.name}</h3>
              <p style={{ color: 'var(--text-medium)', margin: '0' }}>{user.email}</p>
            </div>
>>>>>>> Stashed changes
          </div>

          <Link href="/edit-profile" className="btn btn-primary" style={{ width: '100%' }}>
            Edit Profile
          </Link>
        </div>
      </div>
    </main>
  )
}
