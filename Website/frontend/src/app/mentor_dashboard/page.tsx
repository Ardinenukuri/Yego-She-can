'use client';

import { useState } from 'react';
import {
  FiEdit,
  FiTrash2,
  FiBookOpen,
  FiUsers,
  FiLayers,
  FiCheckCircle,
} from 'react-icons/fi';
import './mentor_dashboard.css';

const courses = [
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
];

const quizzes = [
  {
    title: 'Quiz 1: Soil Fertility',
    course: 'Smart Farming Basics',
    expected: 15,
    attempted: 10,
    passed: 7,
    failed: 3,
  },
  {
    title: 'Quiz 2: IoT Applications',
    course: 'Advanced IoT in Agriculture',
    expected: 12,
    attempted: 8,
    passed: 6,
    failed: 2,
  },
];

const bookings = [
  {
    student: 'John Doe',
    course: 'Smart Farming Basics',
    time: 'Monday, 10:00 AM - 10:30 AM',
    topic: 'Understanding Soil Fertility',
  },
  {
    student: 'Jane Smith',
    course: 'Advanced IoT in Agriculture',
    time: 'Tuesday, 2:00 PM - 2:30 PM',
    topic: 'Sensor Setup Walkthrough',
  },
];

export default function MentorOverviewPage() {
  const [courseSearch, setCourseSearch] = useState('');
  const [courseLevel, setCourseLevel] = useState('');
  const [quizSearch, setQuizSearch] = useState('');
  const [quizFilter, setQuizFilter] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingFilter, setBookingFilter] = useState('');

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(courseSearch.toLowerCase()) &&
      (!courseLevel || c.level === courseLevel)
  );

  const filteredQuizzes = quizzes.filter(
    (q) =>
      q.title.toLowerCase().includes(quizSearch.toLowerCase()) &&
      (!quizFilter || q.course === quizFilter)
  );

  const filteredBookings = bookings.filter(
    (b) =>
      b.student.toLowerCase().includes(bookingSearch.toLowerCase()) &&
      (!bookingFilter || b.course === bookingFilter)
  );

  const totalCourses = courses.length;
  const totalStudents = courses.reduce((sum, c) => sum + c.studentsEnrolled, 0);
  const totalChapters = courses.reduce((sum, c) => sum + c.chapters, 0);

  return (
    <div className="mentor-dashboard">
      <h1 className="page-title">Mentor Dashboard</h1>

      {/* Overview Cards */}
      <div className="stats-cards">
        <StatCard icon={<FiBookOpen />} title="Total Courses" value={totalCourses} />
        <StatCard icon={<FiUsers />} title="Total Students" value={totalStudents} />
        <StatCard icon={<FiLayers />} title="Total Chapters" value={totalChapters} />
        <StatCard icon={<FiCheckCircle />} title="Completed Courses" value={2} />
      </div>

      {/* Courses Table */}
      <Section
        icon={<FiBookOpen />}
        title="Your Courses"
        filters={
          <>
            <input
              type="text"
              placeholder="Search by title..."
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
            />
            <select value={courseLevel} onChange={(e) => setCourseLevel(e.target.value)}>
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </>
        }
      >
        <table className="course-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Level</th>
              <th>Duration</th>
              <th>Chapters</th>
              <th>Students</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => (
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
      </Section>

      {/* Quiz Table */}
      <Section
        icon={<FiUsers />}
        title="Student Quiz Overview"
        filters={
          <>
            <input
              type="text"
              placeholder="Search by quiz title..."
              value={quizSearch}
              onChange={(e) => setQuizSearch(e.target.value)}
            />
            <select value={quizFilter} onChange={(e) => setQuizFilter(e.target.value)}>
              <option value="">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.title}>{c.title}</option>
              ))}
            </select>
          </>
        }
      >
        <table className="course-table">
          <thead>
            <tr>
              <th>Quiz Title</th>
              <th>Course</th>
              <th>Expected</th>
              <th>Attempted</th>
              <th>Passed</th>
              <th>Failed</th>
              <th>Missed</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuizzes.map((q, i) => (
              <tr key={i}>
                <td>{q.title}</td>
                <td>{q.course}</td>
                <td>{q.expected}</td>
                <td>{q.attempted}</td>
                <td className="passed">{q.passed}</td>
                <td className="failed">{q.failed}</td>
                <td className="missed">{q.expected - q.attempted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {/* Booking Table */}
      <Section
        icon={<FiUsers />}
        title="Booked Meetings Overview"
        filters={
          <>
            <input
              type="text"
              placeholder="Search by student name..."
              value={bookingSearch}
              onChange={(e) => setBookingSearch(e.target.value)}
            />
            <select value={bookingFilter} onChange={(e) => setBookingFilter(e.target.value)}>
              <option value="">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.title}>{c.title}</option>
              ))}
            </select>
          </>
        }
      >
        <table className="course-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Time Slot</th>
              <th>Meeting Topic</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b, i) => (
              <tr key={i}>
                <td>{b.student}</td>
                <td>{b.course}</td>
                <td>{b.time}</td>
                <td>{b.topic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}

// Reusable Components

type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: number | string;
};

function StatCard({ icon, title, value }: StatCardProps) {
  return (
    <div className="card">
      <div className="card-icon">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
}

type SectionProps = {
  icon: React.ReactNode;
  title: string;
  filters: React.ReactNode;
  children: React.ReactNode;
};

function Section({ icon, title, filters, children }: SectionProps) {
  return (
    <div className="course-table-section">
      <div className="section-header">
        <h2>{icon} {title}</h2>
        <div className="table-controls right-aligned">
          {filters}
        </div>
      </div>
      {children}
    </div>
  );
}
