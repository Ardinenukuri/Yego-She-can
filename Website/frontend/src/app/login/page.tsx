'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import './login.css'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }

    setError(null)

    // Placeholder logic - Replace with actual API call
    console.log('Logging in:', form)
    alert('Login successful! (placeholder)')

    setForm({ email: '', password: '' })
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login to your Yego SheCan account</p>

        {error && <p className="login-error">{error}</p>}

        <label htmlFor="email" className="login-label">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          className="login-input"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password" className="login-label">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          className="login-input"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="login-button">Login</button>

        <p className="login-footer">
          Don’t have an account?{' '}
          <a href="/register" className="login-link">Sign up</a>
        </p>
      </form>
    </div>
  )
}
