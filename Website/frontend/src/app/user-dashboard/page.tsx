'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/lib/api"; 
import toast from "react-hot-toast";
import "@/styles/courses.css"; 


interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: string;
  image: string | null;
  features: string[];
  isEnrolled: boolean;
}

export default function CoursesPage() {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6; 

  const handleEnroll = async (courseId: number) => {
    const toastId = toast.loading("Enrolling...");
    try {
        await api.post('/api/courses/enroll', { courseId });
        toast.success("Successfully enrolled!", { id: toastId });
        
        
        setAllCourses(prevCourses => 
            prevCourses.map(course => 
                course.id === courseId ? { ...course, isEnrolled: true } : course
            )
        );

    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Enrollment failed.";
        toast.error(errorMessage, { id: toastId });
    }
  };


  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/courses/available');
        setAllCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        toast.error("Could not load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = allCourses
    .filter(course =>
      course.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aWeeks = parseInt(a.duration?.split(' ')[0]) || 0;
      const bWeeks = parseInt(b.duration?.split(' ')[0]) || 0;
      return sortOrder === "asc" ? aWeeks - bWeeks : bWeeks - aWeeks;
    });

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <div className="courses-page" style={{ marginTop: '0rem', padding: '1.5rem' }}>
      <section id="courses" className="courses">
        <h2>Our Courses</h2>


        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Duration: Short to Long</option>
            <option value="desc">Duration: Long to Short</option>
          </select>
        </div>

        {loading ? (
          <div className="loading-state">Loading courses...</div>
        ) : (
          <>
            <div className="courses-grid">
              {currentCourses.map((course) => (
                <div key={course.id} className="course-card fade-in">
                  <img
                    src={course.image ? `${process.env.NEXT_PUBLIC_API_URL}${course.image}` : '/placeholder-image.png'}
                    alt={course.title}
                    className="course-image"
                  />
                  <div className="course-info">
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <div className="course-meta">
                      <span>{course.duration}</span> | <span>{course.lessons} lessons</span> | <span>{course.level}</span>
                    </div>
                    
              
                    {course.isEnrolled ? (
                        <Link href={`/user-dashboard/your-courses/${course.id}`}>
                            <button className="course-btn">Continue Learning</button>
                        </Link>
                    ) : (
                        <button className="course-btn" onClick={() => handleEnroll(course.id)}>
                            Enroll Now
                        </button>
                    )}

                  </div>
                </div>
              ))}
            </div>

            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={currentPage === i + 1 ? "active" : ""}
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
  );
}