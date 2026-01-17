'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: number
  name: string
  email: string
  phone: string | null
  address: string | null
  avatar: string | null
}

interface Alert {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export default function EditProfilePage() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    current_password: '',
    password: '',
    password_confirmation: '',
  })
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const avatarPreviewRef = useRef<HTMLImageElement>(null)
  const avatarFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/profile')
      if (res.ok) {
        const data = await res.json()
        setUser(data)
        setFormData((prev) => ({
          ...prev,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
        }))
        if (avatarPreviewRef.current && data.avatar) {
          avatarPreviewRef.current.src = data.avatar
        }
      } else if (res.status === 401) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
      showAlert('Failed to load profile data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const alertId = 'alert-' + Date.now()
    const newAlert: Alert = { id: alertId, message, type }
    setAlerts((prev) => [...prev, newAlert])

    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== alertId))
    }, 5000)
  }

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength('')
      return
    }

    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++

    if (strength === 1) setPasswordStrength('weak')
    else if (strength === 2 || strength === 3) setPasswordStrength('medium')
    else if (strength >= 4) setPasswordStrength('strong')
  }

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFormData((prev) => ({ ...prev, password: value }))
    checkPasswordStrength(value)
    validatePasswordMatch(value, formData.password_confirmation)
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFormData((prev) => ({ ...prev, password_confirmation: value }))
    validatePasswordMatch(formData.password, value)
  }

  const validatePasswordMatch = (newPass: string, confirmPass: string) => {
    if (newPass && confirmPass) {
      setPasswordsMatch(newPass === confirmPass)
    } else {
      setPasswordsMatch(true)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      showAlert('Image size must be less than 5MB', 'error')
      return
    }

    const reader = new FileReader()
    reader.onload = function (event) {
      if (avatarPreviewRef.current) {
        avatarPreviewRef.current.src = event.target?.result as string
      }
    }
    reader.readAsDataURL(file)

    const uploadFormData = new FormData()
    uploadFormData.append('avatar', file)

    try {
      showAlert('Uploading profile picture...', 'info')

      const response = await fetch('/api/profile/upload-avatar', {
        method: 'POST',
        body: uploadFormData,
      })

      const data = await response.json()

      if (response.ok) {
        showAlert('Profile picture updated successfully!', 'success')
        if (data.avatar_url && avatarPreviewRef.current) {
          avatarPreviewRef.current.src = data.avatar_url
        }
      } else {
        showAlert(data.message || 'Failed to upload profile picture', 'error')
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      showAlert('Failed to upload profile picture. Please try again.', 'error')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { password, password_confirmation, current_password } = formData

    if (password || password_confirmation) {
      if (!current_password) {
        showAlert('Current password is required to change your password', 'error')
        return
      }
      if (password !== password_confirmation) {
        showAlert('Passwords do not match', 'error')
        return
      }
      if (password.length < 8) {
        showAlert('Password must be at least 8 characters long', 'error')
        return
      }
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        showAlert('Profile updated successfully!', 'success')
        setTimeout(() => {
          router.push('/profile')
        }, 1500)
      } else {
        showAlert(data.message || 'An error occurred while updating profile', 'error')
      }
    } catch (error) {
      console.error('Error:', error)
      showAlert('Failed to update profile. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main style={{ paddingTop: '8rem', minHeight: '100vh' }}>
        <div className="container">
          <div className="edit-profile-container">
            <p>Loading profile...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main style={{ paddingTop: '8rem', minHeight: '100vh' }}>
        <div className="container">
          <div className="edit-profile-container">
            <div className="access-denied-container">
              <div className="access-denied-card">
                <div className="access-denied-icon">
                  <i className="fa-solid fa-lock"></i>
                </div>
                <h2>Access Restricted</h2>
                <p>You need to be logged in to edit your profile.</p>
                <Link href="/login" className="btn-login">
                  <i className="fa-solid fa-sign-in-alt"></i>
                  Login to Continue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="edit-profile-page">
      <div className="edit-profile-container">
        <div className="alert-container">
          {alerts.map((alert) => (
            <div key={alert.id} className={`alert alert-${alert.type}`}>
              <i
                className={`fa-solid ${
                  alert.type === 'success'
                    ? 'fa-check-circle'
                    : alert.type === 'error'
                      ? 'fa-exclamation-circle'
                      : 'fa-info-circle'
                } alert-icon`}
              ></i>
              <div className="alert-content">{alert.message}</div>
              <button
                type="button"
                className="alert-close"
                onClick={() => removeAlert(alert.id)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
          ))}
        </div>

        <div className="page-header">
          <h1>
            <i className="fa-solid fa-user-edit" style={{ marginRight: '0.5rem', color: 'var(--accent-mint-green)' }}></i>
            Edit Your Profile
          </h1>
          <p>Update your personal information and account settings</p>
        </div>

        <div className="edit-profile-card">
          <div className="profile-header-section">
            <div className="profile-avatar-container">
              <img
                ref={avatarPreviewRef}
                className="profile-avatar"
                src={user.avatar || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%2249ca7d%22%3E%3Cpath d=%22M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z%22/%3E%3C/svg%3E'}
                alt="Profile Picture"
              />
              <button
                type="button"
                className="avatar-upload-overlay"
                onClick={() => avatarFileRef.current?.click()}
                title="Change profile picture"
              >
                <i className="fa-solid fa-camera"></i>
              </button>
              <input
                ref={avatarFileRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>
            <div className="profile-header-info">
              <h2>{user.name || 'Your Name'}</h2>
              <p>{user.email || 'your.email@example.com'}</p>
              <span className="profile-status-badge">
                <i className="fa-solid fa-check-circle"></i>
                Active Account
              </span>
            </div>
          </div>

          <form id="edit-profile-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-icon">
                  <i className="fa-solid fa-user"></i>
                </div>
                <h3 className="form-section-title">Personal Information</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <span className="form-hint">
                    <i className="fa-solid fa-info-circle"></i>
                    Your display name on the platform
                  </span>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    required
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <span className="form-hint">
                    <i className="fa-solid fa-envelope"></i>
                    Used for login and notifications
                  </span>
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  <span className="form-hint">
                    <i className="fa-solid fa-phone"></i>
                    Optional - For order updates
                  </span>
                </div>
                <div className="form-group">
                  <label className="form-label">Member Since</label>
                  <input type="text" className="form-input" value="January 2026" disabled />
                  <span className="form-hint">
                    <i className="fa-solid fa-calendar"></i>
                    Account creation date
                  </span>
                </div>
              </div>
              <div className="form-grid single">
                <div className="form-group">
                  <label className="form-label">Delivery Address</label>
                  <textarea
                    name="address"
                    className="form-input form-textarea"
                    placeholder="Enter your complete delivery address"
                    value={formData.address}
                    onChange={handleInputChange}
                  ></textarea>
                  <span className="form-hint">
                    <i className="fa-solid fa-location-dot"></i>
                    Default address for deliveries
                  </span>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-icon">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <h3 className="form-section-title">Security & Password</h3>
              </div>
              <div className="form-grid single">
                <div className="form-group password-field">
                  <label className="form-label">Current Password</label>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="current_password"
                    className="form-input"
                    placeholder="Enter your current password"
                    value={formData.current_password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    <i className={`fa-solid ${showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                  <span className="form-hint">
                    <i className="fa-solid fa-lock"></i>
                    Required only if changing your password
                  </span>
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group password-field">
                  <label className="form-label">New Password</label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="password"
                    className="form-input"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleNewPasswordChange}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    <i className={`fa-solid ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                  <div className="password-strength">
                    <div className={`password-strength-bar ${passwordStrength}`}></div>
                  </div>
                  <span className="form-hint">
                    <i className="fa-solid fa-lock"></i>
                    Leave blank to keep current password
                  </span>
                </div>
                <div className="form-group password-field">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="password_confirmation"
                    className="form-input"
                    placeholder="Confirm new password"
                    value={formData.password_confirmation}
                    onChange={handleConfirmPasswordChange}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                  <span
                    className="form-hint"
                    style={{
                      color:
                        formData.password && formData.password_confirmation
                          ? passwordsMatch
                            ? 'var(--accent-mint-green)'
                            : '#ff6b6b'
                          : 'var(--text-medium)',
                    }}
                  >
                    <i className={`fa-solid ${passwordsMatch ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                    {formData.password && formData.password_confirmation
                      ? passwordsMatch
                        ? 'Passwords match!'
                        : 'Passwords do not match'
                      : 'Re-enter your new password'}
                  </span>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <div className="spinner"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-save"></i>
                    <span>Save Changes</span>
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => router.push('/')}
              >
                <i className="fa-solid fa-times"></i>
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .edit-profile-page {
          padding-top: 7rem;
          padding-bottom: 4rem;
          min-height: 100vh;
          background: linear-gradient(135deg, var(--primary-dark-green) 0%, #051d0d 100%);
        }

        .edit-profile-container {
          max-width: 950px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
          animation: fadeInDown 0.6s ease;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .page-header h1 {
          font-family: var(--font-heading);
          font-size: 2.75rem;
          color: var(--text-light);
          margin-bottom: 0.75rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }

        .page-header p {
          color: var(--text-medium);
          font-size: 1.15rem;
          font-weight: 400;
        }

        .edit-profile-card {
          background: rgba(21, 50, 30, 0.95);
          backdrop-filter: blur(20px);
          padding: 3.5rem;
          border-radius: 20px;
          border: 1px solid rgba(73, 202, 125, 0.25);
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.5);
          animation: fadeInUp 0.7s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .profile-header-section {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          margin-bottom: 3.5rem;
          padding: 2.5rem;
          background: linear-gradient(
            135deg,
            rgba(73, 202, 125, 0.12) 0%,
            rgba(73, 202, 125, 0.06) 100%
          );
          border-radius: 16px;
          border: 1px solid rgba(73, 202, 125, 0.25);
          position: relative;
          overflow: hidden;
        }

        .profile-header-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--accent-mint-green) 0%, #3ab366 100%);
        }

        .profile-avatar-container {
          position: relative;
          flex-shrink: 0;
        }

        .profile-avatar {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          object-fit: cover;
          border: 5px solid var(--accent-mint-green);
          box-shadow: 0 10px 30px rgba(73, 202, 125, 0.4);
          transition: all 0.3s ease;
          background: rgba(21, 50, 30, 0.8);
        }

        .profile-avatar:hover {
          transform: scale(1.05);
          box-shadow: 0 15px 40px rgba(73, 202, 125, 0.5);
        }

        .avatar-upload-overlay {
          position: absolute;
          bottom: 5px;
          right: 5px;
          background: var(--accent-mint-green);
          color: var(--primary-dark-green);
          border: 4px solid rgba(21, 50, 30, 0.95);
          border-radius: 50%;
          width: 45px;
          height: 45px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        }

        .avatar-upload-overlay:hover {
          background: #3ab366;
          transform: scale(1.15);
          box-shadow: 0 6px 20px rgba(73, 202, 125, 0.6);
        }

        .avatar-upload-overlay:active {
          transform: scale(1.05);
        }

        .profile-header-info {
          flex: 1;
        }

        .profile-header-info h2 {
          font-family: var(--font-heading);
          font-size: 2rem;
          color: var(--text-light);
          margin: 0 0 0.75rem 0;
          font-weight: 700;
          letter-spacing: -0.3px;
        }

        .profile-header-info p {
          color: var(--text-medium);
          font-size: 1.05rem;
          margin: 0 0 1rem 0;
          font-weight: 400;
        }

        .profile-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(73, 202, 125, 0.25);
          color: var(--accent-mint-green);
          padding: 0.65rem 1.25rem;
          border-radius: 25px;
          font-size: 0.95rem;
          font-weight: 700;
          border: 1px solid rgba(73, 202, 125, 0.3);
        }

        .form-section {
          margin-bottom: 3rem;
        }

        .form-section:last-of-type {
          margin-bottom: 0;
        }

        .form-section-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1.25rem;
          border-bottom: 2px solid rgba(73, 202, 125, 0.25);
        }

        .form-section-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--accent-mint-green) 0%, #3ab366 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-dark-green);
          font-size: 1.3rem;
          box-shadow: 0 4px 12px rgba(73, 202, 125, 0.3);
        }

        .form-section-title {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-light);
          margin: 0;
          letter-spacing: -0.3px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }

        .form-grid.single {
          grid-template-columns: 1fr;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-light);
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-label .required {
          color: #ff6b6b;
          font-size: 1rem;
          font-weight: 700;
        }

        .form-input {
          padding: 1rem 1.25rem;
          border: 2px solid rgba(73, 202, 125, 0.3);
          border-radius: 12px;
          font-size: 1rem;
          background: rgba(21, 50, 30, 0.6);
          color: var(--text-light);
          font-family: inherit;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.35);
          font-weight: 400;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--accent-mint-green);
          background: rgba(21, 50, 30, 0.8);
          box-shadow: 0 0 0 5px rgba(73, 202, 125, 0.15);
          transform: translateY(-1px);
        }

        .form-input:disabled {
          background: rgba(21, 50, 30, 0.3);
          cursor: not-allowed;
          opacity: 0.6;
          border-color: rgba(73, 202, 125, 0.15);
        }

        .form-textarea {
          min-height: 130px;
          resize: vertical;
          font-family: inherit;
          line-height: 1.6;
        }

        .form-hint {
          font-size: 0.875rem;
          color: var(--text-medium);
          margin-top: 0.65rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 400;
        }

        .form-hint i {
          font-size: 0.85rem;
          opacity: 0.8;
        }

        .password-field {
          position: relative;
        }

        .password-toggle-btn {
          position: absolute;
          right: 1rem;
          top: 2.5rem;
          background: none;
          border: none;
          color: var(--text-medium);
          cursor: pointer;
          padding: 0.5rem;
          font-size: 1rem;
          transition: color 0.3s ease;
        }

        .password-toggle-btn:hover {
          color: var(--accent-mint-green);
        }

        .password-strength {
          margin-top: 0.5rem;
          height: 4px;
          background: rgba(73, 202, 125, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }

        .password-strength-bar {
          height: 100%;
          width: 0%;
          transition: all 0.3s ease;
          border-radius: 2px;
        }

        .password-strength-bar.weak {
          width: 33%;
          background: #ff6b6b;
        }

        .password-strength-bar.medium {
          width: 66%;
          background: #ffd93d;
        }

        .password-strength-bar.strong {
          width: 100%;
          background: var(--accent-mint-green);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 2px solid rgba(73, 202, 125, 0.2);
        }

        .btn {
          padding: 1rem 2.5rem;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: var(--font-body);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          flex: 1;
        }

        .btn:disabled {
          opacity: 0.7;
          pointer-events: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--accent-mint-green) 0%, #3ab366 100%);
          color: var(--primary-dark-green);
          box-shadow: 0 4px 12px rgba(73, 202, 125, 0.3);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(73, 202, 125, 0.4);
        }

        .btn-primary:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-secondary {
          background: transparent;
          color: var(--text-light);
          border: 2px solid rgba(73, 202, 125, 0.3);
        }

        .btn-secondary:hover {
          background: rgba(73, 202, 125, 0.1);
          border-color: var(--accent-mint-green);
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: currentColor;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .alert-container {
          position: fixed;
          top: 6rem;
          right: 2rem;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 400px;
        }

        .alert {
          padding: 1.25rem 1.5rem;
          border-radius: 12px;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          animation: slideIn 0.3s ease;
          backdrop-filter: blur(10px);
        }

        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .alert-success {
          background: rgba(40, 167, 69, 0.95);
          border: 1px solid #28a745;
          color: white;
        }

        .alert-error {
          background: rgba(220, 53, 69, 0.95);
          border: 1px solid #dc3545;
          color: white;
        }

        .alert-info {
          background: rgba(23, 162, 184, 0.95);
          border: 1px solid #17a2b8;
          color: white;
        }

        .alert-icon {
          font-size: 1.3rem;
          min-width: 24px;
        }

        .alert-content {
          flex: 1;
        }

        .alert-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 1.2rem;
          opacity: 0.8;
          padding: 0;
          transition: opacity 0.3s ease;
        }

        .alert-close:hover {
          opacity: 1;
        }

        .access-denied-container {
          text-align: center;
          padding: 4rem 2rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .access-denied-card {
          background: rgba(21, 50, 30, 0.95);
          backdrop-filter: blur(20px);
          padding: 3rem;
          border-radius: 16px;
          border: 1px solid rgba(73, 202, 125, 0.2);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }

        .access-denied-icon {
          font-size: 4rem;
          color: var(--accent-mint-green);
          margin-bottom: 1.5rem;
          opacity: 0.8;
        }

        .access-denied-card h2 {
          font-family: var(--font-heading);
          font-size: 2rem;
          color: var(--text-light);
          margin: 0 0 1rem 0;
        }

        .access-denied-card p {
          color: var(--text-medium);
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }

        .btn-login {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: linear-gradient(135deg, var(--accent-mint-green) 0%, #3ab366 100%);
          color: var(--primary-dark-green);
          padding: 1rem 2.5rem;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(73, 202, 125, 0.3);
        }

        .btn-login:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(73, 202, 125, 0.4);
        }

        @media (max-width: 768px) {
          .edit-profile-page {
            padding-top: 5rem;
          }

          .page-header h1 {
            font-size: 2rem;
          }

          .edit-profile-card {
            padding: 2rem 1.5rem;
          }

          .profile-header-section {
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }

          .alert-container {
            right: 1rem;
            left: 1rem;
            max-width: none;
          }
        }
      `}</style>
    </main>
  )
}
