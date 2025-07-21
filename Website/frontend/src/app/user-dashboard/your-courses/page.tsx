'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import '@/styles/courses.css' 
import api from '@/lib/api'
import toast from 'react-hot-toast'


interface CourseWithProgress {
  id: string;
  title: string;
  description: string;
  slug: string;
  duration: string;
  lessons: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: string;
  image: string | null;
  features: string[];
  lessonsCompleted: number;
}

export default function YourCoursesPage() {
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 3;


  useEffect(() => {
    const fetchEnrolledCourses = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/courses/my-courses');
            setCourses(response.data);
        } catch (error) {
            console.error("Failed to fetch enrolled courses:", error);
            toast.error("Could not load your enrolled courses.");
        } finally {
            setLoading(false);
        }
    };
    fetchEnrolledCourses();
  }, []);


  const filteredCourses = courses.filter((course) => {
    return course.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  if (loading) {
    return (
        <div className="courses-page" style={{ marginTop: '0rem', padding: '1.5rem' }}>
            <section id="courses" className="courses">
                <h2>Your Enrolled Courses</h2>
                <div className="loading-state">Loading your courses...</div>
            </section>
        </div>
    );
  }

  return (
    <div className="courses-page" style={{ marginTop: '0rem', padding: '1.5rem' }}>
      <section id="courses" className="courses">
        <h2>Your Enrolled Courses</h2>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search your courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

        </div>

        {filteredCourses.length === 0 ? (
          <div className="loading-state">
            <p>You are not enrolled in any courses yet.</p>
            <Link href="/user-dashboard">
                <button className="course-btn" style={{marginTop: '1rem', maxWidth: '200px'}}>Browse Courses</button>
            </Link>
          </div>
        ) : (
          <>
            <div className="courses-grid">
              {currentCourses.map((course) => {
                const progressPercent = course.lessons > 0 
                    ? Math.round((course.lessonsCompleted / course.lessons) * 100) 
                    : 0;
                return (
                  <div key={course.id} className="course-card fade-in">
                    <img
                      src={
                        course.image ? `${process.env.NEXT_PUBLIC_API_URL}${course.image}` : '/placeholder-image.png'
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

                      <div className="progress-bar-container">
                        <div
                          className="progress-bar"
                          style={{ width: `${progressPercent}%` }}
                        >
                          {progressPercent}%
                        </div>
                      </div>
                      

                      <Link href={`/user-dashboard/your-courses/${course.id}`}>
                        <button className="course-btn enrolled">Go to Course</button>
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