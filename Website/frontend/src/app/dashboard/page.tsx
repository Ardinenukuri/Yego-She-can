'use client'

import React from 'react'
import { FiBook, FiEdit2, FiTrash2 } from 'react-icons/fi'
import './dashboard.css'
const mockCourses = [
  { id: 1, title: 'Accounting & Finance Fundamentals' },
  { id: 2, title: 'Sales & Customer Relations' },
  { id: 3, title: 'Marketing & Brand Building' },
  { id: 4, title: 'Design Thinking & Innovation' },
]

export default function DashboardHome() {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome to your dashboard, Yego SheCan!</h1>

      <div className="course-count-card">
        <FiBook className="card-icon" />
        <span>Number of Courses: {mockCourses.length}</span>
      </div>

      <table className="course-table">
  <thead>
    <tr>
      <th scope="col">
        <div className="table-header">
          <FiBook className="table-icon" />
          <span>Course</span>
        </div>
      </th>
      <th scope="col">Actions</th>
    </tr>
  </thead>
  <tbody>
    {mockCourses.map((course) => (
      <tr key={course.id}>
        <td>
          <div className="course-name">
            <FiBook className="table-icon" />
            <span>{course.title}</span>
          </div>
        </td>
        <td>
          <div className="course-actions">
            {/* <button className="action-icon edit-icon" title="Edit">
              <FiEdit2 />
            </button> */}
            <button className="action-icon delete-icon" title="Delete">
              <FiTrash2 />
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  )
}
