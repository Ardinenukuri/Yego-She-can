'use client';

import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiBookOpen, FiUsers, FiLayers, FiCheckCircle } from 'react-icons/fi';
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

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
        <div className="mentor-dashboard">
            <h1 className="page-title">Mentor Dashboard</h1>
            <div className="loading-state">Loading your dashboard...</div>
        </div>
    );
  }

  return (
    <div className="mentor-dashboard">
      <h1 className="page-title">Mentor Dashboard</h1>

      {/* --- Dynamic Stats Cards --- */}
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
    </div>
  );
}