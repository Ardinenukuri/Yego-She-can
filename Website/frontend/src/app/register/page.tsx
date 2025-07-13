'use client'

import { useState } from 'react'
import './register.css'

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // You can add validation and submit logic here
    console.log(form)
  }

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">Join the Yego SheCan community</p>

        <label htmlFor="name" className="register-label">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          className="register-input"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email" className="register-label">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          className="register-input"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password" className="register-label">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          className="register-input"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="confirmPassword" className="register-label">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="register-input"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className="register-button">Register</button>

        <p className="register-footer">
          Already have an account? <a href="/login" className="register-link">Login</a>
        </p>
      </form>
    </div>
  )
}
