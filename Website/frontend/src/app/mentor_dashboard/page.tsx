'use client';

import { useState } from 'react';
import { FiEdit, FiTrash2, FiBookOpen, FiUsers, FiLayers, FiCheckCircle } from 'react-icons/fi';
import './mentor_dashboard.css';

export default function MentorOverviewPage() {
  const [courses] = useState([
    {
      id: 1,
      title: 'Smart Farming Basics',
      level: 'Beginner',
      duration: '4 weeks',
      chapters: 5,
      studentsEnrolled: 24,
    },
    {
      id: 2,
      title: 'Advanced IoT in Agriculture',
      level: 'Advanced',
      duration: '6 weeks',
      chapters: 8,
      studentsEnrolled: 18,
    },
    {
      id: 3,
      title: 'Sustainable Farming Techniques',
      level: 'Intermediate',
      duration: '5 weeks',
      chapters: 6,
      studentsEnrolled: 30,
    },
  ]);

  const totalCourses = courses.length;
  const totalStudents = courses.reduce((acc, course) => acc + course.studentsEnrolled, 0);
  const totalChapters = courses.reduce((acc, course) => acc + course.chapters, 0);

  return (
    <div className="mentor-dashboard">
      <h1 className="page-title">Mentor Dashboard</h1>

      <div className="stats-cards">
        <div className="card">
          <FiBookOpen className="card-icon" />
          <div>
            <h3>Total Courses</h3>
            <p>{totalCourses}</p>
          </div>
        </div>
        <div className="card">
          <FiUsers className="card-icon" />
          <div>
            <h3>Total Students</h3>
            <p>{totalStudents}</p>
          </div>
        </div>
        <div className="card">
          <FiLayers className="card-icon" />
          <div>
            <h3>Total Chapters</h3>
            <p>{totalChapters}</p>
          </div>
        </div>
        <div className="card">
          <FiCheckCircle className="card-icon" />
          <div>
            <h3>Completed Courses</h3>
            <p>2</p>
          </div>
        </div>
      </div>

      

      <div className="course-table-section">
        <h2><FiBookOpen /> Your Courses</h2>
        <table className="course-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Level</th>
              <th>Duration</th>
              <th>Chapters</th>
              <th>Enrolled Students</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>{course.level}</td>
                <td>{course.duration}</td>
                <td>{course.chapters}</td>
                <td><FiUsers /> {course.studentsEnrolled}</td>
                <td>
                  <button className="action-btn edit"><FiEdit /></button>
                  <button className="action-btn delete"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
