'use client'

import Link from 'next/link'
import './courses.css'
import { FiEye, FiClock, FiBookOpen, FiAward } from 'react-icons/fi'

export default function CoursesPage() {
  const courses = [
    {
      id: 1,
      title: "Accounting & Finance Fundamentals",
      description: "Master the basics of accounting, budgeting, and financial planning for women entrepreneurs.",
      duration: "4 weeks",
      lessons: 12,
      level: "Beginner",
      price: "Free",
      features: [
        "Bookkeeping principles",
        "Managing budgets",
        "Understanding financial statements",
        "Small business taxes",
        "Cash flow management",
      ],
      category: "Most Taken",
    },
    {
      id: 2,
      title: "Sales & Customer Relations",
      description: "Learn effective sales strategies and build lasting customer relationships.",
      duration: "3 weeks",
      lessons: 10,
      level: "Beginner",
      price: "Free",
      features: [
        "Sales psychology",
        "Customer service excellence",
        "Building loyalty",
        "Handling objections",
        "Digital sales techniques",
      ],
      category: "Recent",
    },
    {
      id: 3,
      title: "Marketing & Brand Building",
      description: "Build your brand and master marketing for small businesses.",
      duration: "4 weeks",
      lessons: 14,
      level: "Intermediate",
      price: "Free",
      features: [
        "Brand development",
        "Social media marketing",
        "Content creation",
        "Email marketing",
        "Local marketing",
      ],
      category: "Most Taken",
    },
    {
      id: 4,
      title: "Design Thinking & Innovation",
      description: "Apply design thinking to solve business problems creatively.",
      duration: "3 weeks",
      lessons: 9,
      level: "Intermediate",
      price: "Free",
      features: [
        "Design thinking process",
        "Problem analysis",
        "Creative solutions",
        "Prototyping",
        "Small business innovation",
      ],
      category: "Recent",
    },
  ]

  return (
    <div className="courses-page-admin">
      <div className="admin-header">
        <h1>Manage Courses</h1>
        <Link href="/dashboard/courses/add">
          <button className="add-course-button">
            + Add Course
          </button>
        </Link>
      </div>

      <table className="courses-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Duration</th>
            <th>Lessons</th>
            <th>Level</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course.id}>
              <td>{course.title}</td>
              <td><FiClock /> {course.duration}</td>
              <td><FiBookOpen /> {course.lessons}</td>
              <td><FiAward /> {course.level}</td>
              <td>{course.category}</td>
              <td>
                <Link href={`/dashboard/courses/${course.id}`}>
                  <button className="view-btn">
                    <FiEye /> View Details
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}