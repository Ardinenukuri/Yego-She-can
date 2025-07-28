'use client'

import React, { useState } from 'react'
import './mentorapplication.css'

const dummyApplications = [
  {
    mentorName: 'Diana K.',
    email: 'diana.k@example.com',
    education: 'BSc in Business Administration, University of Rwanda',
    experience: '5 years running a soap-making business and conducting local training workshops.',
    expertise: 'Soap Making & Marketing',
    motivation: 'I believe I can help young entrepreneurs avoid common pitfalls and grow confidently.',
    cvLink: '/cvs/diana-k.pdf',
  },
  {
    mentorName: 'Beatrice A.',
    email: 'beatrice.a@example.com',
    education: 'MBA in Agribusiness, Makerere University',
    experience: '7 years in cooperative management and global coffee export projects.',
    expertise: 'Coffee Processing & Export',
    motivation: 'I want to give back by mentoring young women in sustainable coffee businesses.',
    cvLink: '/cvs/beatrice-a.pdf',
  },
  {
    mentorName: 'Nancy B.',
    email: 'nancy.b@example.com',
    education: 'BA in Marketing, University of Nairobi',
    experience: '6+ years in local and international digital marketing campaigns.',
    expertise: 'Digital Marketing',
    motivation: 'I want to help women scale their products using affordable online tools.',
    cvLink: '/cvs/nancy-b.pdf',
  },
]

const MentorApplicationPage = () => {
  const [applications, setApplications] = useState(dummyApplications)

  const handleDecision = (index: number, action: 'approve' | 'decline') => {
    const mentor = applications[index].mentorName
    alert(`You have ${action}d ${mentor}'s application.`)
    setApplications(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="mentor-app-container">
      <h1 className="page-title">Mentor Applications</h1>
      <div className="session-cards">
        {applications.map((app, index) => (
          <div key={index} className="session-card">
            <h2 className="student-name">{app.mentorName}</h2>
            <p className="session-detail"><strong>Email:</strong> {app.email}</p>
            <p className="session-detail"><strong>Educational Background:</strong> {app.education}</p>
            <p className="session-detail"><strong>Work Experience:</strong> {app.experience}</p>
            <p className="session-detail"><strong>Expertise:</strong> {app.expertise}</p>
            <p className="session-message"><strong>Motivation:</strong> "{app.motivation}"</p>

            <div className="action-buttons">
              <a
                href={app.cvLink}
                target="_blank"
                rel="noopener noreferrer"
                className="cv-btn"
              >
                View CV
              </a>
              <button
                className="approve-btn"
                onClick={() => handleDecision(index, 'approve')}
              >
                Approve
              </button>
              <button
                className="decline-btn"
                onClick={() => handleDecision(index, 'decline')}
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MentorApplicationPage
