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
import api from '@/lib/api';
import toast from 'react-hot-toast';

// --- Type Definitions ---
interface Course {
  id: number;
  title: string;
  level: string;
  duration: string;
  chapters: number;
  studentsEnrolled: number;
  status: string;
}
interface Kpis {
  totalCourses: number;
  totalStudents: number;
  totalChapters: number;
  completedCourses: number;
}

export default function MentorOverviewPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all dashboard data from the new backend endpoint
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/mentor/dashboard');
        setCourses(response.data.courses);
        setKpis(response.data.kpis);
      } catch (error) {
        console.error("Failed to fetch mentor dashboard data:", error);
        toast.error("Could not load your dashboard data.");
      } finally {
        setLoading(false);
      }
    };

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
            <p>{kpis?.totalCourses ?? 0}</p>
          </div>
        </div>
        <div className="card">
          <FiUsers className="card-icon" />
          <div>
            <h3>Total Students</h3>
            <p>{kpis?.totalStudents ?? 0}</p>
          </div>
        </div>
        <div className="card">
          <FiLayers className="card-icon" />
          <div>
            <h3>Total Chapters</h3>
            <p>{kpis?.totalChapters ?? 0}</p>
          </div>
        </div>
        <div className="card">
          <FiCheckCircle className="card-icon" />
          <div>
            <h3>Completed Courses</h3>
            <p>{kpis?.completedCourses ?? 0}</p>
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
                <td>{course.level || 'N/A'}</td>
                <td>{course.duration || 'N/A'}</td>
                <td>{course.chapters || 0}</td>
                <td><FiUsers /> {course.studentsEnrolled}</td>
                <td>
                  <div className="action-buttons">
                    <button title="Edit"><FiEdit /></button>
                    {/* Add delete functionality here later */}
                    <button title="Delete" className="delete"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {courses.length === 0 && !loading && (
            <div className="empty-state">
                <p>You are not assigned to any courses yet.</p>
            </div>
        )}
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