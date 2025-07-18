'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import '@/styles/courses.css'

interface Course {
  id: string
  title: string
  description: string
  slug: string
  category: string
  duration: string
  lessons: number
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  price: string
  image: string
  features: string[]
}

interface CourseWithProgress extends Course {
  lessonsCompleted: number
}

const dummyCourses: CourseWithProgress[] = [
  {
    id: '1',
    title: 'Entrepreneurship Basics',
    description: 'Learn how to start and manage your own business.',
    slug: 'entrepreneurship-basics',
    category: 'Business',
    duration: '4 weeks',
    lessons: 10,
    level: 'Beginner',
    price: 'Free',
    image: '/business.jpg',
    features: ['Startup mindset', 'Pitch development'],
    lessonsCompleted: 3,
  },
  {
    id: '2',
    title: 'Soap Making Masterclass',
    description: 'Craft your own natural soap products from scratch.',
    slug: 'soap-making-masterclass',
    category: 'Skills',
    duration: '2 weeks',
    lessons: 5,
    level: 'Beginner',
    price: 'Free',
    image: '/soap.jpg',
    features: ['Natural ingredients', 'Scent customization'],
    lessonsCompleted: 5,
  },
  {
    id: '3',
    title: 'Marketing Fundamentals',
    description: 'Explore core marketing strategies and customer insights.',
    slug: 'marketing-fundamentals',
    category: 'Marketing',
    duration: '3 weeks',
    lessons: 8,
    level: 'Intermediate',
    price: 'Free',
    image: '/marketing.jpg',
    features: ['Digital Ads', 'Customer Funnels'],
    lessonsCompleted: 2,
  },
  {
    id: '4',
    title: 'Financial Literacy Basics',
    description: 'Understand personal finance and budgeting techniques.',
    slug: 'financial-literacy',
    category: 'Business',
    duration: '1 week',
    lessons: 4,
    level: 'Beginner',
    price: 'Free',
    image: '/finance.jpg',
    features: ['Budgeting', 'Saving'],
    lessonsCompleted: 1,
  },
]

export default function YourCoursesPage() {
  const [courses, setCourses] = useState<CourseWithProgress[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDuration, setSelectedDuration] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const coursesPerPage = 3

  useEffect(() => {
    setCourses(dummyCourses)
  }, [])

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory
    const matchesDuration =
      selectedDuration === 'All' || course.duration.startsWith(selectedDuration)
    return matchesSearch && matchesCategory && matchesDuration
  })

  const indexOfLastCourse = currentPage * coursesPerPage
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse)
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage)

  return (
    <div className="courses-page" style={{ marginTop: '0rem', padding: '1.5rem' }}>
      <section id="courses" className="courses">
        <h2>Your Enrolled Courses</h2>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Business">Business</option>
            <option value="Skills">Skills</option>
            <option value="Marketing">Marketing</option>
          </select>
          <select value={selectedDuration} onChange={(e) => setSelectedDuration(e.target.value)}>
            <option value="All">All Durations</option>
            <option value="1">1 week</option>
            <option value="2">2 weeks</option>
            <option value="3">3 weeks</option>
            <option value="4">4 weeks</option>
          </select>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="loading-state">No matching enrolled courses found.</div>
        ) : (
          <>
            <div className="courses-grid">
              {currentCourses.map((course) => {
                const progressPercent = Math.round((course.lessonsCompleted / course.lessons) * 100)
                return (
                  <div key={course.id} className="course-card fade-in">
                    <img
                      src={
                        course.image.startsWith('http')
                          ? course.image
                          : `${process.env.NEXT_PUBLIC_API_URL || ''}${course.image}`
                      }
                      alt={course.title}
                      className="course-image"
                    />
                    <div className="course-info">
                      <h3>{course.title}</h3>
                      <p>{course.description}</p>
                      <div className="course-meta">
                        <span>{course.duration}</span> |{' '}
                        <span>
                          {course.lessonsCompleted} / {course.lessons} lessons completed
                        </span>{' '}
                        | <span>{course.level}</span>
                      </div>

                      <div
                        className="progress-bar-container"
                        style={{ margin: '0.5rem 0', position: 'relative', height: '10px', backgroundColor: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}
                      >
                        <div
                          className="progress-bar"
                          style={{
                            width: `${progressPercent}%`,
                            height: '100%',
                            backgroundColor: 'black',
                            borderRadius: '10px',
                            transition: 'width 0.5s ease-in-out',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: progressPercent > 10 ? 'center' : 'flex-end',
                            color: 'white',
                            fontWeight: 'bold',
                            paddingRight: progressPercent > 10 ? '0' : '5px',
                            whiteSpace: 'nowrap',
                            fontSize: '0.85rem',
                          }}
                        >
                          {progressPercent}%
                        </div>
                      </div>

                      <ul style={{marginTop:'2rem'}}>
                        {course.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                      <Link href={`/user-dashboard/courses/${course.slug}`}>
                        <button className="course-btn">Go to Course</button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={currentPage === i + 1 ? 'active' : ''}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
