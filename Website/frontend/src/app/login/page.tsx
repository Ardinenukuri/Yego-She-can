'use client'

import { useState } from 'react'
import './login.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ email, password })
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login to your Yego SheCan account</p>

        <label htmlFor="email" className="login-label">Email</label>
        <input
          id="email"
          type="email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password" className="login-label">Password</label>
        <input
          id="password"
          type="password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-button">Login</button>

        <p className="login-footer">
          Don’t have an account? <a href="/register" className="login-link">Sign up</a>
        </p>
      </form>
    </div>
  )
}
