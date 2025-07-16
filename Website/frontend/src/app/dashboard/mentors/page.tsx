'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiUserPlus, FiMail, FiEye, FiTrash2 } from 'react-icons/fi'
import './mentors.css'

type Mentor = {
  id: number
  name: string
  email: string
  expertise: string
  status: 'Active' | 'Pending'
  image: string
}

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([
    {
      id: 1,
      name: 'Diane Ingabire',
      email: 'dianeingabire@gmail.com',
      expertise: 'Accounting',
      status: 'Pending',
      image: '/2148761757.jpg',
    },
    {
      id: 2,
      name: 'Grace Mbabazi',
      email: 'grace@example.com',
      expertise: 'Sales & Marketing',
      status: 'Pending',
      image: '/2148761757.jpg',
    },
    {
      id: 3,
      name: 'Janet Mukamana',
      email: 'janet@example.com',
      expertise: 'Design Thinking',
      status: 'Active',
      image: '/2148761757.jpg',
    },
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

      {/* TABLE VIEW - desktop */}
      <table className="mentors-table">
        <thead>
          <tr>
            <th>Profile</th>
            <th>Name</th>
            <th>Email</th>
            <th>Expertise</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mentors.map((mentor) => (
            <tr key={mentor.id}>
              <td>
                <img src={mentor.image} alt={mentor.name} className="mentor-img" />
              </td>
              <td>{mentor.name}</td>
              <td>
                <FiMail className="table-icon" /> {mentor.email}
              </td>
              <td>{mentor.expertise}</td>
              <td>
                <span className={`mentor-status ${mentor.status.toLowerCase()}`}>
                  {mentor.status}
                </span>
              </td>
              <td>
                <div className="mentor-actions">
                  <button className="view-btn">
                    <FiEye className="table-icon" /> View
                  </button>
                  <button className="delete-btn">
                    <FiTrash2 className="table-icon" /> Remove
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* CARD VIEW - mobile */}
      <div className="mentors-cards">
        {mentors.map((mentor) => (
          <div key={mentor.id} className="mentor-card">
            <img src={mentor.image} alt={mentor.name} className="mentor-img" />
            <div className="mentor-info">
              <h3>{mentor.name}</h3>
              <p><FiMail /> {mentor.email}</p>
              <p>Expertise: {mentor.expertise}</p>
              <span className={`mentor-status ${mentor.status.toLowerCase()}`}>
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
