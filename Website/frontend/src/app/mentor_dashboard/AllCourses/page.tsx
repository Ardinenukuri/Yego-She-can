'use client'
import React, { useState } from 'react'
import './mentorCourses.css'
import { Plus, Eye, Edit, Trash2 } from 'lucide-react'

const courses = [
  { 
    id: 1, 
    title: 'Entrepreneurship Basics', 
    description: 'Learn how to start and manage your own business.',
    duration: '6 weeks',
    mentor: 'Jane',
    lessons: '5 Lessons',
    level: 'Advanced',
    students: 342,
    rating: 4.9,
    revenue: 15420,
    status: 'active',
    image: 'https://via.placeholder.com/400x250/3B82F6/ffffff?text=React+Development',
    learningOutcomes: ['Advanced React patterns', 'State management', 'Performance optimization']
  },
  { 
    id: 2,
    title: 'Soap Making Masterclass',
    description: 'Craft your own natural soap products from scratch.',
    duration: '4 weeks',
    mentor: 'Jane',
    lessons: 12,
    level: 'Beginner',
    students: 578,
    rating: 4.7,
    revenue: 20340,
    status: 'active',
    image: 'https://via.placeholder.com/400x250/F59E0B/ffffff?text=JavaScript+Fundamentals',
    learningOutcomes: ['JavaScript syntax', 'DOM manipulation', 'Async programming']
  },
  {
    id: 3,
    title: 'Marketing Fundamentals',
    description: 'Explore core marketing strategies and customer insights.',
    duration: '8 weeks',
    mentor: 'Jane',
    lessons: 24,
    level: 'Intermediate',
    students: 234,
    rating: 4.8,
    revenue: 9520,
    status: 'draft',
    image: 'https://via.placeholder.com/400x250/10B981/ffffff?text=Node.js+Backend',
    learningOutcomes: ['Server architecture', 'API development', 'Database integration']
  }
]

export default function MentorCoursesPage() {
  const [showCourseForm, setShowCourseForm] = useState(false)

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h2>My Courses</h2>
        {/* <button onClick={() => setShowCourseForm(true)} className="add-course-button">
          <Plus className="icon-sm" />
          Add New Course
        </button> */}
      </div>

      <div className="courses-table-wrapper">
        <table className="courses-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Mentor</th>
              <th>Duration</th>
              <th>Lessons</th>
              <th>Level</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>{course.mentor || 'Unassigned'}</td>
                <td>{course.duration}</td>
                <td>{course.lessons}</td>
                <td>{course.level}</td>
                <td>
                  <span className={`status-badge ${course.status}`}>
                    {course.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button title="View"><Eye className="icon-sm" /></button>
                    <button title="Edit"><Edit className="icon-sm" /></button>
                    {/* <button title="Delete" className="delete"><Trash2 className="icon-sm" /></button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
