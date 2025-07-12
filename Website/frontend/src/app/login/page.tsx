'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import './login.css'

type AuthMode = 'login' | 'signup'

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login')
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

    if (mode === 'login') {
      console.log('Logging in:', form)
      alert('Login successful! (placeholder)')
    } else {
      console.log('Signing up:', form)
      alert('Signup successful! (placeholder)')
    }

    setForm({ email: '', password: '' })
  }

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'))
    setError(null)
    setForm({ email: '', password: '' })
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="login-subtitle">
          {mode === 'login'
            ? 'Login to your Yego SheCan account'
            : 'Join the Yego SheCan community'}
        </p>

        {error && <p className="login-error">{error}</p>}

        <label htmlFor="email" className="login-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="login-input"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password" className="login-label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="login-input"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="login-button">
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </button>

        <p className="login-footer">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button type="button" onClick={toggleMode} className="login-link">
            {mode === 'login' ? 'Sign up' : 'Login'}
          </button>
        </p>
      </form>
    </div>
  )
}
