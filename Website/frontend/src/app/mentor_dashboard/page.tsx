'use client';


import React, { useState, useEffect, useMemo, ReactNode } from 'react';

import {
  FiEdit,
  FiTrash2,
  FiBookOpen,
  FiUsers,
  FiLayers,
  FiCheckCircle,
} from 'react-icons/fi';
import './mentor_dashboard.css';
import api from '@/lib/api';
import toast from 'react-hot-toast';


interface Course {
  id: number;
  title: string;
  level: string;
  duration: string;
  chapters: number;
  studentsEnrolled: number;
}
interface Quiz {
  id: number;
  title: string;
  course: string;
  expected: number;
  attempted: number;
  passed: number;
  failed: number;
}
interface Booking {
  id: number;
  student: string;
  course: string;
  time: string;
  topic: string;
}
interface Kpis {
  totalCourses: number;
  totalStudents: number;
  totalChapters: number;
  completedCourses: number;
}

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/api/mentor/dashboard');
        const data = response.data;
        setKpis(data.kpis);
        setCourses(data.courses);
        setQuizzes(data.quizzes);
        setBookings(data.bookings);
      } catch (error) {
        console.error("Failed to fetch mentor dashboard data:", error);
        toast.error("Could not load your dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); 


  const filteredCourses = useMemo(() => courses.filter(
    (c) =>
      c.title.toLowerCase().includes(courseSearch.toLowerCase()) &&
      (!courseLevel || c.level === courseLevel)
  ), [courses, courseSearch, courseLevel]);

  const filteredQuizzes = useMemo(() => quizzes.filter(
    (q) =>
      q.title.toLowerCase().includes(quizSearch.toLowerCase()) &&
      (!quizFilter || q.course === quizFilter)
  ), [quizzes, quizSearch, quizFilter]);

  const filteredBookings = useMemo(() => bookings.filter(
    (b) =>
      b.student.toLowerCase().includes(bookingSearch.toLowerCase()) &&
      (!bookingFilter || b.course === bookingFilter)
  ), [bookings, bookingSearch, bookingFilter]);

  if (loading) {
    return (
      <div className="mentor-dashboard">
        <h1 className="page-title">Mentor Dashboard</h1>
        <div className="loading-state">Loading your dashboard data...</div>
      </div>
    );
  }


  return (
    <div className="mentor-dashboard">
      <h1 className="page-title">Mentor Dashboard</h1>


      <div className="stats-cards">

        <StatCard icon={<FiBookOpen />} title="Total Courses" value={kpis?.totalCourses ?? 0} />
        <StatCard icon={<FiUsers />} title="Total Students" value={kpis?.totalStudents ?? 0} />
        <StatCard icon={<FiLayers />} title="Total Chapters" value={kpis?.totalChapters ?? 0} />
        <StatCard icon={<FiCheckCircle />} title="Completed Courses" value={kpis?.completedCourses ?? 0} />
      </div>


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
                  <div className="action-buttons">
                    <button className="action-btn edit"><FiEdit /></button>
                    <button className="action-btn delete"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCourses.length === 0 && <p className="empty-state">No courses match your filters.</p>}
      </Section>

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

              <tr key={q.id || i}>

                <td>{q.title}</td>
                <td>{q.course}</td>
                <td>{q.expected}</td>
                <td>{q.attempted}</td>
                <td className="passed">{q.passed}</td>
                <td className="failed">{q.failed}</td>

                <td className="missed">{q.expected - q.attempted > 0 ? q.expected - q.attempted : 0}</td>

              </tr>
            ))}
          </tbody>
        </table>


        {filteredQuizzes.length === 0 && <p className="empty-state">No quizzes match your filters.</p>}
      </Section>


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


                <td>{b.student}</td>
                <td>{b.course}</td>
                <td>{b.time}</td>
                <td>{b.topic}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBookings.length === 0 && <p className="empty-state">No bookings match your filters.</p>}

      </Section>
    </div>
  );
}

type StatCardProps = {
  icon: ReactNode;

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
      {children}
    </div>
  );
}

type SectionProps = {
  icon: ReactNode;
  title: string;
  filters: ReactNode;
  children: ReactNode;
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