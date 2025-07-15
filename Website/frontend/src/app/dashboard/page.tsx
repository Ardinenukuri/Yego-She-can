'use client'

import React, {  useState, useMemo  } from 'react'
import { FiBook, FiTrash2 } from 'react-icons/fi'
import './dashboard.css'

const initialCourses = [
  {
    id: 1,
    title: 'Accounting & Finance Fundamentals',
    mentorName: 'Alice Uwimana',
    mentorStatus: 'Active',
  },
  {
    id: 2,
    title: 'Sales & Customer Relations',
    mentorName: '',
    mentorStatus: 'Inactive',
  },
  {
    id: 3,
    title: 'Marketing & Brand Building',
    mentorName: 'Jean Bosco',
    mentorStatus: 'pending',
  },
  {
    id: 4,
    title: 'Design Thinking & Innovation',
    mentorName: '',
    mentorStatus: 'Inactive',
  },
]

export default function DashboardHome() {
  const initialCourses = [
    { id: 1, title: 'Accounting & Finance Fundamentals', mentorName: 'Alice Uwimana', mentorStatus: 'assigned' },
    { id: 2, title: 'Sales & Customer Relations', mentorName: '', mentorStatus: 'not-assigned' },
    { id: 3, title: 'Marketing & Brand Building', mentorName: 'Jean Bosco', mentorStatus: 'pending' },
    { id: 4, title: 'Design Thinking & Innovation', mentorName: '', mentorStatus: 'not-assigned' },
    { id: 5, title: 'Entrepreneurship Basics', mentorName: 'Clare Niyonsaba', mentorStatus: 'assigned' },
    { id: 6, title: 'Team Leadership', mentorName: 'Jean Bosco', mentorStatus: 'assigned' },
    { id: 7, title: 'Time Management', mentorName: '', mentorStatus: 'not-assigned' },
    { id: 8, title: 'Digital Marketing', mentorName: 'Alice Uwimana', mentorStatus: 'pending' },
  ]

  const [courses, setCourses] = useState(initialCourses)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null)

  const itemsPerPage = 5

  const filteredCourses = useMemo(() => {
    return courses.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.mentorName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [courses, searchTerm])

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage)
  const paginatedCourses = filteredCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const confirmDelete = (id: number) => {
    setCourseToDelete(id)
  }

  const handleConfirmDelete = () => {
    if (courseToDelete !== null) {
      const updated = courses.filter(course => course.id !== courseToDelete)
      setCourses(updated)
      setCourseToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setCourseToDelete(null)
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome to your dashboard, Yego SheCan!</h1>

      <div className="course-count-card">
        <FiBook className="card-icon" />
        <span>Number of Courses: {courses.length}</span>
      </div>

      <div className="dashboard-controls">
        <input
          type="text"
          placeholder="Search by course or mentor..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="course-table">
        <thead>
          <tr>
            <th>
              <div className="table-header">
                <FiBook className="table-icon" />
                <span>Course</span>
              </div>
            </th>
            <th><span className="table-header">Assigned Mentor</span></th>
            <th><span className="table-header">Mentor Status</span></th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCourses.map((course) => (
            <tr key={course.id}>
              <td>
                <div className="course-name">
                  <FiBook className="table-icon" />
                  <span>{course.title}</span>
                </div>
              </td>
              <td>{course.mentorName || '—'}</td>
              <td>
                <span className={`mentor-status ${course.mentorStatus}`}>
                  {course.mentorStatus.replace('-', ' ')}
                </span>
              </td>
              <td>
                <div className="course-actions">
                  <button
                    className="action-icon delete-icon"
                    title="Delete"
                    onClick={() => confirmDelete(course.id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {courseToDelete !== null && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this course?</p>
            <div className="modal-actions">
              <button className="modal-button cancel" onClick={handleCancelDelete}>Cancel</button>
              <button className="modal-button confirm" onClick={handleConfirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
