'use client';

import Link from "next/link";
import Image from "next/image";
import "@/styles/courses.css"; 
import { useState, useEffect } from "react";
import api from "@/lib/api"; 

interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: string;
  image: string;
  features: string[];
}

const dummyCourse: Course = {
  id: 1,
  title: "Intro to Accounting",
  description: "A beginner course to help you understand the Accounting world.",
  duration: "4 weeks",
  lessons: 12,
  level: "Beginner",
  price: "Free",
  image: "/accounting.jpg", // make sure this exists in your public folder
  features: [
    "Basic Accounting skills",
  ]
};

export default function CoursesPage() {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 3;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/courses/');
        const data = response.data;

        if (!Array.isArray(data) || data.length === 0) {
          setAllCourses([dummyCourse]);
        } else {
          setAllCourses(data);
        }
      } catch (error) {
        console.error("Failed to fetch courses. Using fallback.", error);
        setAllCourses([dummyCourse]);
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
      const aWeeks = parseInt(a.duration.split(' ')[0]) || 0;
      const bWeeks = parseInt(b.duration.split(' ')[0]) || 0;
      return sortOrder === "asc" ? aWeeks - bWeeks : bWeeks - aWeeks;
    });

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <div className="courses-page" style={{ marginTop: '0rem', padding: '1.5rem' }}>
      <section id="courses" className="courses">
        <h2>Courses</h2>

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
                    src={course.image.startsWith("http") ? course.image : `${process.env.NEXT_PUBLIC_API_URL || ""}${course.image}`}
                    alt={course.title}
                    className="course-image"
                  />
                  <div className="course-info">
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <div className="course-meta">
                      <span>{course.duration}</span> | <span>{course.lessons} lessons</span> | <span>{course.level}</span>
                    </div>
                    <ul>
                      {course.features.map((feature, index) => (
                        <li key={index}> {feature}</li>
                      ))}
                    </ul>
                    <Link href="/login">
                      <button className="course-btn">Start Course</button>
                    </Link>
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
