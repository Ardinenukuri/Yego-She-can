'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import '../mentors.css'
import { FiSend } from 'react-icons/fi'

export default function InviteMentorPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Simulate sending an email invite
    console.log('Sending invite to:', email)
    setMessage(`✅ Invite sent to ${email}`)
    setEmail('')
  }

  return (
    <div className="invite-page">
      <h1 className="form-title">Invite Mentor</h1>

      {message && <p className="success-message">{message}</p>}

      <form className="invite-form" onSubmit={handleSubmit}>
        <label>
          Mentor Email:
          <input
            type="email"
            value={email}
            onChange={handleChange}
            required
            placeholder="Enter mentor's email"
          />
        </label>

        <button type="submit" className="invite-btn">
          <FiSend /> Send Invite
        </button>
      </form>
    </div>
  )
}
