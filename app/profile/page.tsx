'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

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
  const pathname = usePathname()
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
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <main style={{ paddingTop: '8rem', minHeight: '100vh' }}>
        <div className="container">
          <p>Loading profile...</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main style={{ paddingTop: '8rem', minHeight: '100vh' }}>
        <div className="container">
          <div className="profile-card">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>
                Please{' '}
                <Link href="/login" style={{ color: 'var(--accent-mint-green)', textDecoration: 'none', fontWeight: '600' }}>
                  login
                </Link>
                {' '}to view your profile.
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={{ paddingTop: '8rem', minHeight: '100vh' }}>
      <div className="container">
        <div className="profile-card">
          <div className="profile-header">
            <h2>My Profile</h2>
            <div className="profile-actions">
              <Link href="/edit-profile" className="btn-edit">
                <i className="fa-solid fa-edit"></i> Edit Profile
              </Link>
              <button type="submit" className="btn-logout" onClick={handleLogout}>
                <i className="fa-solid fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </div>

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
                <Image
                  src={user.avatar}
                  alt="avatar"
                  width={120}
                  height={120}
                  style={{ borderRadius: '50%', objectFit: 'cover', display: 'block', margin: '0 auto' }}
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
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-card {
          background: var(--secondary-dark-green);
          padding: 2rem;
          border-radius: 12px;
          max-width: 800px;
          margin: 2rem auto;
          border: 1px solid var(--border-color);
        }

        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .profile-header h2 {
          margin: 0;
        }

        .profile-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .profile-actions a,
        .profile-actions button {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-edit {
          background: var(--accent-mint-green);
          color: var(--text-dark);
        }

        .btn-edit:hover {
          background: var(--accent-soft);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(73, 202, 125, 0.2);
        }

        .btn-logout {
          background: transparent;
          color: var(--text-light);
          border: 1.5px solid var(--accent-mint-green);
        }

        .btn-logout:hover {
          background: var(--accent-mint-green);
          color: var(--text-dark);
        }

        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 1.5rem;
        }

        .avatar {
          width: 100%;
          max-width: 260px;
          border-radius: 12px;
          background: var(--card-bg);
          padding: 1rem;
          text-align: center;
        }

        .avatar img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .info-group {
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 1rem;
        }

        .info-group:last-child {
          border-bottom: none;
        }

        .info-label {
          font-size: 0.85rem;
          color: var(--text-medium);
          text-transform: uppercase;
        }

        .info-value {
          font-size: 1rem;
          color: var(--text-light);
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .profile-grid {
            grid-template-columns: 1fr;
          }

          .avatar {
            max-width: 100%;
          }

          .profile-card {
            padding: 1.5rem;
          }

          .profile-actions {
            width: 100%;
          }

          .profile-actions a,
          .profile-actions button {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </main>
  )
}
