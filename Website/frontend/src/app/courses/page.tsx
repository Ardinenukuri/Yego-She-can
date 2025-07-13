'use client'

import React from 'react'
import Link from 'next/link'
import './course.css'

const CoursePage = () => {
  const courses = [
    { id: 1, title: 'Web Development', description: 'Learn HTML, CSS, JavaScript' },
    { id: 2, title: 'React.js Basics', description: 'Understand React fundamentals' },
    { id: 3, title: 'Next.js Mastery', description: 'Build fullstack apps with Next.js' },
  ]

  return (
    <main className="course-page-wrapper">
      <h1 className="course-heading">Available Courses</h1>
      <div className="course-grid">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <h2 className="course-title">{course.title}</h2>
            <p className="course-desc">{course.description}</p>
            <Link href={`/course/${course.id}`} className="course-link">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </main>
  )
}

export default CoursePage
