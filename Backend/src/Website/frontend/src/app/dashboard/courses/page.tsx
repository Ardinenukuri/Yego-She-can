'use client'

import Link from 'next/link'
import './courses.css'
import {  FiClock, FiBookOpen, FiAward } from 'react-icons/fi'
import { useState } from 'react'

export default function CoursesPage() {
  const courses = [
    {
      id: 1,
      title: "Accounting & Finance Fundamentals",
      image: "/2148761757.jpg",
      description: "...",
      duration: "4 weeks",
      lessons: 12,
      level: "Beginner",
      price: "Free",
      mentor: "Alice Uwimana",
      enrolledCount: 34,
    },
    {
      id: 2,
      title: "Sales & Customer Relations",
      image: "/2148761757.jpg",
      description: "...",
      duration: "3 weeks",
      lessons: 10,
      level: "Beginner",
      price: "Free",
      mentor: "Eric Mugisha",
      enrolledCount: 22,
    },
    {
      id: 3,
      title: "Digital Marketing Essentials",
      image: "/2148761757.jpg",
      description: "...",
      duration: "5 weeks",
      lessons: 15,
      level: "Intermediate",
      price: "Free",
      mentor: "Clara Niyonsaba",
      enrolledCount: 18,
    },
    {
      id: 4,
      title: "Web Development Basics",
      image: "/2148761757.jpg",
      description: "...",
      duration: "6 weeks",
      lessons: 20,
      level: "Advanced",
      price: "Free",
      mentor: "Jean Claude Habimana",
      enrolledCount: 40,
    },
  ];

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
            <th>Image</th>
            <th>Title</th>
            <th>Mentor</th>
            <th>Enrolled</th>
            <th>Duration</th>
            <th>Lessons</th>
            <th>Level</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>
                <img src={course.image} alt={course.title} className="course-img" />
              </td>
              <td>{course.title}</td>
              <td>{course.mentor || <span className="text-muted">—</span>}</td>
              <td>{course.enrolledCount ?? 0}</td>
              <td>
                <FiClock className="table-icon" /> {course.duration}
              </td>
              <td>
                <FiBookOpen className="table-icon" /> {course.lessons}
              </td>
              <td>
                <FiAward className="table-icon" /> {course.level}
              </td>
              <td>
                <Link href={`/dashboard/courses/${course.id}`}>
                  <button className="view-btn">
                     View Details
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
