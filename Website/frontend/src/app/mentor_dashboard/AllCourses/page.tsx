// AllCourses.tsx
'use client';

import Link from 'next/link';
import { FiBookOpen, FiEdit, FiUploadCloud, FiEye } from 'react-icons/fi';
import Image from 'next/image';
import './allcourses.css';

const courses = [
  {
    id: 1,
    title: 'Introduction to Agribusiness',
    description: 'Covers fundamentals of agribusiness and value chains.',
    bookUrl: 'https://example.com/book1.pdf',
    createdAt: '2025-07-01',
    duration: '4 weeks',
    lessons: 12,
    level: 'Beginner',
    imageUrl: '/2148761757.jpg',
  },
  {
    id: 2,
    title: 'Smart Farming with IoT',
    description: null,
    bookUrl: null,
    createdAt: '2025-06-15',
    duration: '6 weeks',
    lessons: 15,
    level: 'Intermediate',
    imageUrl: '/2148761757.jpg',
  },
  {
    id: 3,
    title: 'Exporting Agricultural Products',
    description: 'Focus on international regulations and packaging.',
    bookUrl: null,
    createdAt: '2025-07-10',
    duration: '5 weeks',
    lessons: 10,
    level: 'Advanced',
    imageUrl: '/2148761757.jpg',
  },
];

export default function MentorCoursesPage() {
  return (
    <main className="mentor-courses-page">
      <h1 className="mentor-title">📘 My Assigned Courses</h1>

      {courses.length === 0 ? (
        <p className="no-results">No courses assigned yet.</p>
      ) : (
        <section className="courses-grid" aria-label="Assigned courses">
          {courses.map((course) => (
            <article key={course.id} className="course-card">
              <Image
                src={course.imageUrl}
                alt={course.title}
                width={270}
                height={180}
                className="course-image"
              />
              <header className="course-card-header">
                <h2>{course.title}</h2>
                <span className="course-meta" aria-label={`Level ${course.level}`}>
                  Level: {course.level}
                </span>
              </header>

              <p className="course-description">
                {course.description ?? <em>No description yet.</em>}
              </p>

              <div className="course-meta-info">
                <span>
                  <FiBookOpen aria-hidden="true" /> {course.lessons} Lessons
                </span>
                <span>Duration: {course.duration}</span>
                <time dateTime={course.createdAt} className="course-created-at">
                  Created on: {new Date(course.createdAt).toLocaleDateString()}
                </time>
              </div>

              <nav className="mentor-actions" aria-label={`Actions for ${course.title}`}>
                <Link href={`/mentor_dashboard/AllCourses/editcourse`} passHref>
                  <button type="button" className="edit-btn">
                    <FiEdit aria-hidden="true" /> Edit Course
                  </button>
                </Link>

                <Link href={`/mentor-dashboard/courses/${course.id}/upload-book`} passHref>
                  <button type="button" className="upload-btn">
                    <FiUploadCloud aria-hidden="true" /> Upload Book
                  </button>
                </Link>

                {course.bookUrl && (
                  <a
                    href={course.bookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-book-btn"
                    aria-label={`View book for ${course.title}`}
                  >
                    <FiEye aria-hidden="true" /> View Book
                  </a>
                )}
              </nav>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}