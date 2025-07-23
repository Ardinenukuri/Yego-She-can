'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiEdit,
  FiTrash2,
  FiBookOpen,
  FiUsers,
  FiLayers,
  FiCheckCircle,
} from 'react-icons/fi';
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

  const [quizzes] = useState([
    {
      title: 'Quiz 1: Soil Fertility',
      course: 'Smart Farming Basics',
      expectedStudents: 15,
      totalStudents: 10,
      passed: 7,
      failed: 3,
    },
    {
      title: 'Quiz 2: IoT Applications',
      course: 'Advanced IoT in Agriculture',
      expectedStudents: 12,
      totalStudents: 8,
      passed: 6,
      failed: 2,
    },
  ]);

  const [bookings] = useState([
    {
      studentName: 'John Doe',
      courseTitle: 'Smart Farming Basics',
      timeSlot: 'Monday, 10:00 AM - 10:30 AM',
      meetingTopic: 'Understanding Soil Fertility',
    },
    {
      studentName: 'Jane Smith',
      courseTitle: 'Advanced IoT in Agriculture',
      timeSlot: 'Tuesday, 2:00 PM - 2:30 PM',
      meetingTopic: 'Sensor Setup Walkthrough',
    },
  ]);

  const router = useRouter();

  const totalCourses = courses.length;
  const totalStudents = courses.reduce((acc, course) => acc + course.studentsEnrolled, 0);
  const totalChapters = courses.reduce((acc, course) => acc + course.chapters, 0);

  return (
    <div className="mentor-dashboard">
      <h1 className="page-title">Mentor Dashboard</h1>

      {/* Overview Cards */}
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

      {/* Courses Table */}
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

      {/* Student Quiz Overview */}
      <div className="course-table-section">
        <h2 style={{ marginTop: "2rem" }}><FiUsers /> Student Quiz Overview</h2>
        <table className="course-table">
          <thead>
            <tr>
              <th>Quiz Title</th>
              <th>Course Title</th>
              <th>Expected</th>
              <th>Attempted</th>
              <th>Passed</th>
              <th>Failed</th>
              <th>Missed</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz, index) => {
              const missed = quiz.expectedStudents - quiz.totalStudents;
              return (
                <tr key={index}>
                  <td>{quiz.title}</td>
                  <td>{quiz.course}</td>
                  <td>{quiz.expectedStudents}</td>
                  <td>{quiz.totalStudents}</td>
                  <td className="passed">{quiz.passed}</td>
                  <td className="failed">{quiz.failed}</td>
                  <td className="missed">{missed}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Student Booking Overview */}
      <div className="course-table-section">
        <h2 style={{ marginTop: "2rem" }}><FiUsers /> Booked Meetings Overview</h2>
        <table className="course-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Course Title</th>
              <th>Time Slot</th>
              <th>Meeting Topic</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.studentName}</td>
                <td>{booking.courseTitle}</td>
                <td>{booking.timeSlot}</td>
                <td>{booking.meetingTopic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
