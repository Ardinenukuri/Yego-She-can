'use client'

import Link from 'next/link'
import { FiClock, FiBookOpen, FiAward } from 'react-icons/fi'
import './courses.css'

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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
          <button className="add-course-button">+ Add Course</button>
        </Link>
      </div>

      <section className="courses-grid">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </section>
    </div>
  )
}

type Course = {
  id: number;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  level: string;
  price: string;
  image: string;
  features: string[];
  category: string;
}

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="admin-course-card">
      <div className="admin-course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">{course.description}</p>
        <div className="admin-meta">
          <span><FiClock /> {course.duration}</span>
          <span><FiBookOpen /> {course.lessons} lessons</span>
          <span><FiAward /> {course.level}</span>
        </div>
        <ul className="admin-features">
          {course.features.map((feature, idx) => (
            <li key={idx}>✔ {feature}</li>
          ))}
        </ul>
        <Link href={`/dashboard/courses/${course.id}`}>
          <button className="course-btn">View Details</button>
        </Link>
      </div>
    </div>
  )
}
