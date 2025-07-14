'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiUserPlus, FiMail, FiTrash2, FiEye } from 'react-icons/fi'
import './mentors.css'

type Mentor = {
  id: number
  name: string
  email: string
  expertise: string
  status: 'Active' | 'Pending'
}

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([
    {
      id: 1,
      name: 'Diane Ingabire',
      email: 'dianeingabire@gmail.com',
      expertise: 'Accounting',
      status: 'Pending',
    },
    // {
    //   id: 2,
    //   name: 'Grace Mbabazi',
    //   email: 'grace@example.com',
    //   expertise: 'Sales & Marketing',
    //   status: 'Pending',
    // },
    // {
    //   id: 3,
    //   name: 'Janet Mukamana',
    //   email: 'janet@example.com',
    //   expertise: 'Design Thinking',
    //   status: 'Active',
    // },
  ])

  return (
    <div className="mentors-page">
      <div className="mentors-header">
        <h1>Manage Mentors</h1>
        <Link href="/dashboard/mentors/invite">
          <button className="invite-mentor-btn">
            <FiUserPlus /> Invite Mentor
          </button>
        </Link>
      </div>

      <div className="mentors-grid">
        {mentors.map((mentor) => (
          <div key={mentor.id} className="mentor-card">
            <div className="mentor-info">
              <h3>{mentor.name}</h3>
              <p><FiMail /> {mentor.email}</p>
              <p>Expertise: {mentor.expertise}</p>
              <span className={`status ${mentor.status.toLowerCase()}`}>
                {mentor.status}
              </span>
            </div>
            <div className="mentor-actions">
              <button className="view-btn"><FiEye /> View</button>
              <button className="delete-btn"><FiTrash2 /> Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
