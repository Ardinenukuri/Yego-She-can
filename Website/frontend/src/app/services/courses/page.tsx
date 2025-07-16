'use client';

import Link from "next/link";
import Image from "next/image";
import "../../../styles/courses.css"; 
import { useState, useEffect } from "react";
import api from "@/lib/api"; 
import serviceImage from "../../../../public/services.jpg"


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

export default function CoursesPage() {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All"); 
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 3;


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/courses/public');
        setAllCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []); 


  const filteredCourses = allCourses
    .filter(course => {
      return course.title.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      // A more robust sort for durations like "4 weeks"
      const aWeeks = parseInt(a.duration.split(' ')[0]) || 0;
      const bWeeks = parseInt(b.duration.split(' ')[0]) || 0;
      return sortOrder === "asc" ? aWeeks - bWeeks : bWeeks - aWeeks;
    });

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <div className="courses-page">
      {/* Hero Section (remains the same) */}
      <section
        className="hero long-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${serviceImage.src})`,
        }}
      >
        <div className="hero-content backdrop">
          <div className="hero-text">
            <h1>Empowering Women Entrepreneurs</h1>
            <p>
              Master the fundamentals of entrepreneurship with our comprehensive
              online curriculum.
            </p>
            <div className="hero-buttons">
              <Link href="/auth/register">
                <button className="btn-primary">Enroll now</button>
              </Link>
              <a href="#courses" className="btn-secondary">Browse Courses</a>
            </div>
          </div>
        </div>
      </section>

      {/* Course List Section */}
      <section id="courses" className="courses">
        <h2>Courses</h2>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* Category filter is removed for now */}
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
                  <img src={`${process.env.NEXT_PUBLIC_API_URL}${course.image}`} alt={course.title} className="course-image" />
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