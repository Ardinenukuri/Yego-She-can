'use client';

import Link from "next/link";
import Image from "next/image";
import "../../../styles/courses.css";
import { useState } from "react";
import serviceImage from "../../../../public/services.jpg";
import accountingImg from "../../../../public/accounting.jpg";
import marketingImg from "../../../../public/marketing.jpg";
import { FiClock, FiBookOpen, FiAward, FiUsers } from "react-icons/fi";

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 3;

  const courses = [
    {
      id: 1,
      title: "Accounting & Finance Fundamentals",
      description:
        "Master the basics of accounting, budgeting, and financial planning for women entrepreneurs.",
      duration: "4 weeks",
      lessons: 12,
      level: "Beginner",
      price: "Free",
      image: accountingImg.src,
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
      description:
        "Learn effective sales strategies and build lasting customer relationships.",
      duration: "3 weeks",
      lessons: 10,
      level: "Beginner",
      price: "Free",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS68NyGBjP_Y1gkPuQos3PlvXBICj6t2PTdUQ&s",
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
      description:
        "Build your brand and master marketing for small businesses.",
      duration: "4 weeks",
      lessons: 14,
      level: "Intermediate",
      price: "Free",
      image: marketingImg.src,
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
      description:
        "Apply design thinking to solve business problems creatively.",
      duration: "3 weeks",
      lessons: 9,
      level: "Intermediate",
      price: "Free",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=60",
      features: [
        "Design thinking process",
        "Problem analysis",
        "Creative solutions",
        "Prototyping",
        "Small business innovation",
      ],
      category: "Recent",
    },
  ];

  const filteredCourses = courses
    .filter(course => {
      const matchesCategory = filter === "All" || course.category === filter;
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const aWeeks = parseInt(a.duration);
      const bWeeks = parseInt(b.duration);
      return sortOrder === "asc" ? aWeeks - bWeeks : bWeeks - aWeeks;
    });

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <div className="courses-page">
      {/* Hero Section */}
      <section
        className="hero long-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${serviceImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="hero-content backdrop">
          <div className="hero-text">
            <h1>Empowering Women Entrepreneurs</h1>
            <p>
              Master the fundamentals of entrepreneurship with our comprehensive
              online curriculum.
              Learn at your own pace with expert-designed courses and earn
              certificates upon completion.
            </p>
            <div className="hero-buttons">
              <Link href="/register">
                <button className="btn-primary">Enroll now</button>
              </Link>
              <Link href="#courses">
                <button className="btn-secondary">Browse Courses</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Course Filters */}
      <section id="courses" className="courses">
        <h2>Courses</h2>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Most Taken">Most Taken</option>
            <option value="Recent">Recent</option>
          </select>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Duration: Short to Long</option>
            <option value="desc">Duration: Long to Short</option>
          </select>
        </div>

        <div className="courses-grid">
          {currentCourses.map((course) => (
            <div key={course.id} className="course-card fade-in">
              <img src={course.image} alt={course.title} className="course-image" />
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
                <Link href="/register">
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
      </section>
    </div>
  );
}
