// app/course/page.tsx
'use client'

import React from 'react'
import Link from 'next/link'

const CoursePage = () => {
  const courses = [
    { id: 1, title: 'Web Development', description: 'Learn HTML, CSS, JavaScript' },
    { id: 2, title: 'React.js Basics', description: 'Understand React fundamentals' },
    { id: 3, title: 'Next.js Mastery', description: 'Build fullstack apps with Next.js' },
  ]

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Available Courses</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {courses.map(course => (
          <div key={course.id} className="border p-4 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="text-gray-600 mb-2">{course.description}</p>
            <Link href={`/course/${course.id}`} className="text-blue-600 hover:underline">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </main>
  )
}

export default CoursePage
