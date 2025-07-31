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
  expectedStudents: number;
  totalStudents: number;
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

  useEffect(() => {
    const fetchQuizOverview = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/mentor/quizzes/overview');
            setQuizzes(response.data);
        } catch (error) {
            console.error("Failed to fetch quiz overview:", error);
            toast.error("Could not load quiz overview data.");
        } finally {
            setLoading(false);
        }
    };
    fetchQuizOverview();
  }, []);

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


  const exportToPDF = () => {
    const timestamp = new Date().toLocaleDateString();
    
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Mentor Dashboard Report</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              color: #333; 
              line-height: 1.4;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #7c34ab; 
              padding-bottom: 15px;
            }
            .header h1 { 
              color: #4b1c88; 
              margin: 0; 
              font-size: 24px;
            }
            .date { 
              color: #666; 
              font-size: 14px; 
              margin-top: 5px;
            }
            .stats-section { 
              display: grid; 
              grid-template-columns: repeat(4, 1fr); 
              gap: 15px; 
              margin: 20px 0; 
            }
            .stat-card { 
              background: #f6f2fb; 
              padding: 15px; 
              border-radius: 8px; 
              text-align: center;
              border: 1px solid #e4d7f5;
            }
            .stat-card h3 { 
              margin: 0 0 5px 0; 
              font-size: 12px; 
              color: #666; 
              text-transform: uppercase;
            }
            .stat-card p { 
              margin: 0; 
              font-size: 20px; 
              font-weight: bold; 
              color: #4b1c88;
            }
            .section { 
              margin: 30px 0; 
            }
            .section h2 { 
              color: #4b1c88; 
              font-size: 18px; 
              margin-bottom: 15px; 
              padding-bottom: 5px; 
              border-bottom: 1px solid #e4d7f5;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 20px;
              font-size: 12px;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left; 
            }
            th { 
              background-color: #f6effd; 
              color: #4b1c88; 
              font-weight: bold;
            }
            tr:nth-child(even) { 
              background-color: #faf6ff; 
            }
            .passed { color: #059669; font-weight: bold; }
            .failed { color: #dc2626; font-weight: bold; }
            .missed { color: #d97706; font-weight: bold; }
            .empty-message { 
              text-align: center; 
              color: #666; 
              font-style: italic; 
              padding: 20px;
            }
            @media print {
              body { margin: 0; }
              .stats-section { grid-template-columns: repeat(2, 1fr); }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Mentor Dashboard Report</h1>
            <div class="date">Generated on ${timestamp}</div>
          </div>

          <div class="stats-section">
            <div class="stat-card">
              <h3>Total Courses</h3>
              <p>${kpis?.totalCourses || 0}</p>
            </div>
            <div class="stat-card">
              <h3>Total Students</h3>
              <p>${kpis?.totalStudents || 0}</p>
            </div>
            <div class="stat-card">
              <h3>Total Chapters</h3>
              <p>${kpis?.totalChapters || 0}</p>
            </div>
            <div class="stat-card">
              <h3>Completed Courses</h3>
              <p>${kpis?.completedCourses || 0}</p>
            </div>
          </div>

          <div class="section">
            <h2>Your Courses (${filteredCourses.length})</h2>
            ${filteredCourses.length > 0 ? `
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Level</th>
                    <th>Duration</th>
                    <th>Chapters</th>
                    <th>Students Enrolled</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredCourses.map(course => `
                    <tr>
                      <td>${course.title}</td>
                      <td>${course.level}</td>
                      <td>${course.duration}</td>
                      <td>${course.chapters}</td>
                      <td>${course.studentsEnrolled}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : '<div class="empty-message">No courses to display</div>'}
          </div>

          <div class="section">
            <h2>Student Quiz Overview (${filteredQuizzes.length})</h2>
            ${filteredQuizzes.length > 0 ? `
              <table>
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
                  ${filteredQuizzes.map(quiz => {
                    const missed = quiz.expectedStudents - quiz.totalStudents > 0 ? quiz.expectedStudents - quiz.totalStudents : 0;
                    return `
                      <tr>
                        <td>${quiz.title}</td>
                        <td>${quiz.course}</td>
                        <td>${quiz.expectedStudents}</td>
                        <td>${quiz.totalStudents}</td>
                        <td class="passed">${quiz.passed}</td>
                        <td class="failed">${quiz.failed}</td>
                        <td class="missed">${missed}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            ` : '<div class="empty-message">No quizzes to display</div>'}
          </div>

          <div class="section">
            <h2>Booked Meetings Overview (${filteredBookings.length})</h2>
            ${filteredBookings.length > 0 ? `
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Time Slot</th>
                    <th>Meeting Topic</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredBookings.map(booking => `
                    <tr>
                      <td>${booking.student}</td>
                      <td>${booking.course}</td>
                      <td>${booking.time}</td>
                      <td>${booking.topic}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : '<div class="empty-message">No bookings to display</div>'}
          </div>
        </body>
      </html>
    `;

    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };
      
      toast.success('PDF report is being generated...');
    } else {
      toast.error('Unable to open print dialog. Please check popup settings.');
    }
  };

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
          onClick={exportToPDF}
          className="export-btn"
          disabled={!kpis}
        >
          <FiFileText />
          Export PDF Report
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
                <td>{q.expectedStudents}</td>
                <td>{q.totalStudents}</td>
                <td className="passed">{q.passed}</td>
                <td className="failed">{q.failed}</td>
                <td className="missed">
                  {q.expectedStudents - q.totalStudents > 0 ? q.expectedStudents - q.totalStudents : 0}
                </td>
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
              <tr key={b.id || i}>
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