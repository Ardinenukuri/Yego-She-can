'use client'

import Link from 'next/link'
import './courses.css'
import { FiEye, FiClock, FiBookOpen, FiAward } from 'react-icons/fi'

import { useState, useMemo } from 'react';




export default function CoursesPage() {

  const [sortOrder, setSortOrder] = useState("newest");

  function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}


 const courses = [
  {
    id: 1,
    title: "Accounting & Finance Fundamentals",
    description: "...",
    duration: "4 weeks",
    lessons: 12,
    level: "Beginner",
    price: "Free",
    mentor: "Alice Uwimana",
    enrolledCount: 34,
    createdAt: "2025-07-10T10:00:00Z", // ✅ NEW
   
  },
  {
    id: 2,
    title: "Sales & Customer Relations",
    description: "...",
    duration: "3 weeks",
    lessons: 10,
    level: "Beginner",
    price: "Free",
    mentor: "Eric Mugisha",
    enrolledCount: 22,
    createdAt: "2025-07-12T14:30:00Z", // ✅ NEW
   
  },
  {
    id: 3,
    title: "Digital Marketing Essentials",
    description: "...",
    duration: "5 weeks",
    lessons: 15,
    level: "Intermediate",
    price: "Free",
    mentor: "Clara Niyonsaba",
    enrolledCount: 18,
    createdAt: "2025-07-15T09:00:00Z", // ✅ NEW
  },
  {
    id: 4,
    title: "Web Development Basics",
    description: "...",
    duration: "6 weeks",
    lessons: 20,
    level: "Advanced",
    price: "Free",
    mentor: "Jean Claude Habimana",
    enrolledCount: 40,
    createdAt: "2025-07-20T11:45:00Z", // ✅ NEW
  },
];
const sortedCourses = useMemo(() => {
  const sorted = [...courses];
  sorted.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });
  return sorted;
}, [courses, sortOrder]);


  return (
    <div className="courses-page-admin">
      <div className="admin-header">
        <h1>Manage Courses</h1>
        <div className="sort-controls">
  <label htmlFor="sortOrder">Sort by:</label>
  <select
    id="sortOrder"
    className="sort-dropdown"
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
  >
    <option value="newest">Newest First</option>
    <option value="oldest">Oldest First</option>
  </select>
</div>

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
    <th>Mentor</th>
    <th>Enrolled</th>
    <th>Created At</th>     {/* ✅ NEW */}
    <th>Duration</th>
    <th>Lessons</th>
    <th>Level</th>
    <th>Actions</th>
  </tr>
</thead>

<tbody>
  {sortedCourses.map((course) => (
    <tr key={course.id}>
      <td>{course.title}</td>
      <td>{course.mentor || <span className="text-muted">—</span>}</td>
      <td>{course.enrolledCount ?? 0}</td>
      <td>{formatDate(course.createdAt)}</td>
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
            <FiEye className="table-icon" /> View Details
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