'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import '../courses.css'

export default function AddCoursePage() {
  const [courseTitle, setCourseTitle] = useState('')
  const [mentorEmail, setMentorEmail] = useState('')
  const [courseAdded, setCourseAdded] = useState(false)
  const [mentorInvited, setMentorInvited] = useState(false)

  const handleCourseSubmit = (e: FormEvent) => {
    e.preventDefault()

    console.log('Course added:', courseTitle)
    setCourseTitle('')
    setCourseAdded(true)
    setTimeout(() => setCourseAdded(false), 3000)
  }

  const handleInvite = () => {
    if (!mentorEmail) return

    console.log(`Sending invite to mentor: ${mentorEmail}`)

    // 🔗 Connect to your backend API to actually send the invite
    setMentorInvited(true)
    setMentorEmail('')
    setTimeout(() => setMentorInvited(false), 3000)
  }

  return (
    <div className="add-course-page">

      {courseAdded && <p className="success-message">✅ Course added successfully!</p>}
      <form className="add-course-form" onSubmit={handleCourseSubmit}>
        <label>
          Course Name:
          <input
            name="title"
            value={courseTitle}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCourseTitle(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="course-btn">Add Course</button>
      </form>

      {/* <hr style={{ margin: '2rem 0' }} />    */}

      {/* <h2 className="form-title">Invite Mentor</h2>/ */}
      {mentorInvited && <p className="success-message">✅ Invitation sent!</p>}
      <div className="mentor-invite">
        <input
          type="email"
          placeholder="Mentor email"
          value={mentorEmail}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setMentorEmail(e.target.value)}
          required
        />
        <button onClick={handleInvite} className="invite-btn">Invite Mentor</button>
      </div>
    </div>
  )
}
