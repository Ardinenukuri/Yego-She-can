'use client'

import React, { useState, useEffect } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import './mentorapplication.css'

interface Application {
  id: number
  name: string
  email: string
  education: string
  experience: string
  expertise: string
  message: string
  cv_path: string
}

const MentorApplicationPage = () => {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  const fetchApplications = async () => {
    try {
      const response = await api.get('/api/pm/applications')
      setApplications(response.data)
    } catch (error) {
      toast.error('Could not load mentor applications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleDecision = async (
    applicationId: number,
    applicantName: string,
    decision: 'approved' | 'declined'
  ) => {
    if (
      !window.confirm(
        `Are you sure you want to ${decision} the application for ${applicantName}?`
      )
    ) {
      return
    }

    const toastId = toast.loading('Processing application...')
    try {
      await api.put(`/api/pm/applications/${applicationId}/process`, {
        decision,
      })
      toast.success(`Application for ${applicantName} has been ${decision}.`, {
        id: toastId,
      })
      setApplications(prev => prev.filter(app => app.id !== applicationId))
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to process application.'
      toast.error(message, { id: toastId })
    }
  }

  if (loading) {
    return (
      <div className="mentor-app-container">
        <h1 className="page-title">Mentor Applications</h1>
        <div className="loading-state">Loading applications...</div>
      </div>
    )
  }

  return (
    <div className="mentor-app-container">
      <h1 className="page-title">Mentor Applications</h1>
      <div className="session-cards">
        {applications.length > 0 ? (
          applications.map(app => (
            <div key={app.id} className="session-card">
              <h2 className="student-name">{app.name}</h2>
              <p className="session-detail">
                <strong>Email:</strong> {app.email}
              </p>
              <p className="session-detail">
                <strong>Educational Background:</strong> {app.education}
              </p>
              <p className="session-detail">
                <strong>Work Experience:</strong> {app.experience}
              </p>
              <p className="session-detail">
                <strong>Expertise:</strong> {app.expertise}
              </p>
              <p className="session-message">
                <strong>Motivation:</strong> "{app.message}"
              </p>
              <div className="action-buttons">
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}${app.cv_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cv-btn"
                >
                  View CV
                </a>
                <button
                  className="approve-btn"
                  onClick={() => handleDecision(app.id, app.name, 'approved')}
                >
                  Approve
                </button>
                <button
                  className="decline-btn"
                  onClick={() => handleDecision(app.id, app.name, 'declined')}
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>There are no pending mentor applications.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MentorApplicationPage
