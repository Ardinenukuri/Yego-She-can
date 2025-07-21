'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import './settings.css'

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    name: 'Afua Hamissi',
    email: 'lyhamissi@gmail.com',
    password: '',
    confirmPassword: '',
  })

  const [message, setMessage] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (form.password && form.password !== form.confirmPassword) {
      setMessage('❌ Passwords do not match.')
      return
    }

    // Simulate saving settings
    console.log('Saving settings:', form)
    setMessage('✅ Settings updated successfully!')
  }

  return (
    <div className="settings-page">
      <h1 className="form-title">Admin Settings</h1>

      {message && <p className="success-message">{message}</p>}

      <form className="settings-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          New Password:
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Leave empty to keep current password"
          />
        </label>

        <label>
          Confirm New Password:
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Repeat new password"
          />
        </label>

        <button type="submit" className="settings-btn">Save Changes</button>
      </form>
    </div>
  )
}
