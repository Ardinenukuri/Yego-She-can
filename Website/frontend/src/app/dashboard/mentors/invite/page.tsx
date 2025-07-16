'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import '../mentors.css'
import { FiSend } from 'react-icons/fi'

export default function InviteMentorPage() {
  const [email, setEmail] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [message, setMessage] = useState('')

  // Example course list – replace or fetch from your API if needed
  const courses = [
    'Accounting & Finance',
    'Agricultural Technology',
    'Entrepreneurship Basics',
    'Digital Marketing',
    'Sustainable Farming'
  ]

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleCourseChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(e.target.value)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Simulate sending an email invite
    console.log('Sending invite to:', email, 'for course:', selectedCourse)
    setMessage(`✅ Invite sent to ${email} for the course "${selectedCourse}"`)
    setEmail('')
    setSelectedCourse('')
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
            onChange={handleEmailChange}
            required
            placeholder="Enter mentor's email"
          />
        </label>

        <label>
          Select Course:
          <select value={selectedCourse} onChange={handleCourseChange} required>
            <option value="">-- Choose a course --</option>
            {courses.map((course, idx) => (
              <option key={idx} value={course}>
                {course}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="invite-btn">
          <FiSend /> Send Invite
        </button>
      </form>
    </div>
  )
}
