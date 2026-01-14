'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface User {
  id: number
  name: string
  email: string
  phone: string | null
  address: string | null
  avatar: string | null
}

export default function EditProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/profile')
      if (res.ok) {
        const data = await res.json()
        setUser(data)
        setFormData({
          name: data.name,
          phone: data.phone || '',
          address: data.address || '',
        })
        setAvatarPreview(data.avatar)
      } else if (res.status === 401) {
        router.push('/login?redirect=/edit-profile')
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setStatus(null)

    try {
      // Upload avatar if changed
      if (avatarFile) {
        const avatarFormData = new FormData()
        avatarFormData.append('avatar', avatarFile)

        const avatarRes = await fetch('/api/profile/upload-avatar', {
          method: 'POST',
          body: avatarFormData,
        })

        if (!avatarRes.ok) {
          throw new Error('Failed to upload avatar')
        }
      }

      // Update profile
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setStatus({ type: 'success', message: 'Profile updated successfully!' })
        setTimeout(() => {
          router.push('/profile')
        }, 1500)
      } else {
        const data = await res.json()
        setStatus({ type: 'error', message: data.error || 'Failed to update profile' })
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'An error occurred. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main style={{ paddingTop: '8rem', minHeight: '60vh' }}>
        <div className="container">
          <p>Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main style={{ paddingTop: '8rem', minHeight: '60vh' }}>
      <div className="container">
        <div className="page-header">
          <h1>Edit Profile</h1>
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {status && (
            <div
              style={{
                background: status.type === 'success' ? '#e6ffed' : '#ffebeb',
                color: status.type === 'success' ? '#03543f' : '#8a1f1f',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
              }}
            >
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '12px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '1rem', cursor: 'pointer' }}>
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="Avatar Preview"
                    width={120}
                    height={120}
                    style={{ borderRadius: '50%', objectFit: 'cover', cursor: 'pointer' }}
                  />
                ) : (
                  <div style={{ fontSize: '5rem', color: 'var(--accent-mint-green)' }}>
                    <i className="fa-solid fa-user-circle"></i>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-medium)' }}>
                  Click to change avatar
                </div>
              </label>
            </div>

            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
