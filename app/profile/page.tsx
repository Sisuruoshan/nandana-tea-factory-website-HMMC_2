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

          <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Contact Information</h3>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Phone:</strong> {user.phone || 'Not provided'}
            </p>
            <p>
              <strong>Address:</strong> {user.address || 'Not provided'}
            </p>
          </div>

          <Link href="/edit-profile" className="btn btn-primary" style={{ width: '100%' }}>
            Edit Profile
          </Link>
        </div>
      </div>
    </main>
  )
}
