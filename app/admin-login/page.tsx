'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const ADMIN_USERNAME = 'admin'
  const ADMIN_PASS = 'nandana2025'

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASS) {
      localStorage.setItem('adminLoggedIn', 'true')
      router.push('/admin')
    } else {
      alert('Invalid admin credentials')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <i className="fa-solid fa-leaf" style={{ color: 'var(--accent-mint-green)', fontSize: '3rem' }}></i>
        <h2 style={{ margin: '1rem 0' }}>Admin Sign In</h2>
        <form id="admin-login-form" onSubmit={submit}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>Username</label>
            <input type="text" id="admin-email" required value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>Password</label>
            <input type="password" id="admin-pass" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Sign In</button>
        </form>
        <div style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-medium)' }}>
          <Link href="/" className="btn btn-secondary">Back</Link>
        </div>
      </div>
    </div>
  )
}

