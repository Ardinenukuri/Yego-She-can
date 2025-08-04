'use client';

import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import {
  FiEdit,
  FiTrash2,
  FiBookOpen,
  FiUsers,
  FiLayers,
  FiCheckCircle,
  FiFileText,
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


export default function MentorOverviewPage() {
 
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);


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


  const handleExportPDF = async () => {
    setIsExporting(true);
    const toastId = toast.loading("Generating your PDF report...");
    try {
        const response = await api.get('/api/mentor/dashboard/export-pdf', {
            responseType: 'blob', 
          });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const filename = `YegoSheCan-Mentor-Report-${new Date().toISOString().split('T')[0]}.pdf`;
        link.setAttribute('download', filename);
        
        document.body.appendChild(link);
        link.click();
        
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success("Report downloaded successfully!", { id: toastId });
    } catch (error) {
        console.error("Failed to export PDF:", error);
        toast.error("Could not generate your report.", { id: toastId });
    } finally {
        setIsExporting(false);
    }
  };


  const filteredCourses = useMemo(() => courses.filter(
    (c) =>
      c.title.toLowerCase().includes(courseSearch.toLowerCase()) &&
      (!courseLevel || c.level === courseLevel)
  ), [courses, courseSearch, courseLevel]);
  
  const filteredQuizzes = useMemo(() => (quizzes || []).filter(
    (q) =>
      q.title.toLowerCase().includes(quizSearch.toLowerCase()) &&
      (!quizFilter || q.course === quizFilter)
  ), [quizzes, quizSearch, quizFilter]);

  const filteredBookings = useMemo(() => (bookings || []).filter(
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
      <div className="dashboard-header">
        <h1 className="page-title">Mentor Dashboard</h1>
        <button 
          onClick={handleExportPDF}
          className="export-btn"
          disabled={isExporting}
        >
          <FiFileText />
          {isExporting ? "Generating..." : "Export PDF Report"}
        </button>
      </div>

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
            <input type="text" placeholder="Search by title..." value={courseSearch} onChange={(e) => setCourseSearch(e.target.value)} />
            <select value={courseLevel} onChange={(e) => setCourseLevel(e.target.value)}>
              <option value="">All Levels</option><option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option>
            </select>
          </>
        }>
        <table className="course-table">
          <thead><tr><th>Title</th><th>Level</th><th>Duration</th><th>Chapters</th><th>Students</th><th>Actions</th></tr></thead>
          <tbody>
            {filteredCourses.map((course) => (
              <tr key={course.id}><td>{course.title}</td><td>{course.level}</td><td>{course.duration}</td><td>{course.chapters}</td><td><FiUsers /> {course.studentsEnrolled}</td>
                <td><div className="action-buttons"><button className="action-btn edit"><FiEdit /></button><button className="action-btn delete"><FiTrash2 /></button></div></td>
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
            <input type="text" placeholder="Search by quiz title..." value={quizSearch} onChange={(e) => setQuizSearch(e.target.value)} />
            <select value={quizFilter} onChange={(e) => setQuizFilter(e.target.value)}>
              <option value="">All Courses</option>{courses.map((c) => (<option key={c.id} value={c.title}>{c.title}</option>))}
            </select>
          </>
        }>
        <table className="course-table">
          <thead><tr><th>Quiz Title</th><th>Course</th><th>Expected</th><th>Attempted</th><th>Passed</th><th>Failed</th><th>Missed</th></tr></thead>
          <tbody>
            {filteredQuizzes.map((q) => (
              <tr key={q.id}><td>{q.title}</td><td>{q.course}</td><td>{q.expected}</td><td>{q.attempted}</td><td className="passed">{q.passed}</td><td className="failed">{q.failed}</td><td className="missed">{q.expected - q.attempted > 0 ? q.expected - q.attempted : 0}</td></tr>
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
            <input type="text" placeholder="Search by student name..." value={bookingSearch} onChange={(e) => setBookingSearch(e.target.value)} />
            <select value={bookingFilter} onChange={(e) => setBookingFilter(e.target.value)}>
              <option value="">All Courses</option>{courses.map((c) => (<option key={c.id} value={c.title}>{c.title}</option>))}
            </select>
          </>
        }>
        <table className="course-table">
          <thead><tr><th>Student</th><th>Course</th><th>Time Slot</th><th>Meeting Topic</th></tr></thead>
          <tbody>
            {filteredBookings.map((b) => (
              <tr key={b.id}><td>{b.student}</td><td>{b.course}</td><td>{b.time}</td><td>{b.topic}</td></tr>
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