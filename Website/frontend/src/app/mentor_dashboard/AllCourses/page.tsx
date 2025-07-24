'use client'


import React, { useState, useEffect } from 'react'
import './mentorCourses.css' // Ensure you have this CSS file
import { Plus, Eye, Edit, Trash2 } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'


// Define a type for the data we expect from the backend
interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  mentor: string;
  lessons: number;
  level: string;
  status: 'active' | 'draft';
  image: string | null;
}


export default function MentorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);


  // Fetch data from the new backend endpoint when the component mounts
  useEffect(() => {
    const fetchMentorCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/mentor/courses');
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch mentor courses:", error);
        toast.error("Could not load your assigned courses.");
      } finally {
        setLoading(false);
      }
    };


    fetchMentorCourses();
  }, []); // Empty array ensures this runs only once on mount


  if (loading) {
    return (
        <div className="courses-container">
            <div className="courses-header">
                <h2>My Courses</h2>
            </div>
            <div className="loading-state">Loading your courses...</div>
        </div>
    );
  }


  return (
    <div className="courses-container">
      <div className="courses-header">
        <h2>My Courses</h2>
        {/* You can re-enable this button when you build the "Add Course" page for mentors */}
        {/* <button className="add-course-button"><Plus className="icon-sm" /> Add New Course</button> */}
      </div>


      <div className="courses-table-wrapper">
        <table className="courses-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Mentor</th>
              <th>Duration</th>
              <th>Lessons</th>
              <th>Level</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>{course.mentor || 'Unassigned'}</td>
                <td>{course.duration || 'N/A'}</td>
                <td>{course.lessons || 0}</td>
                <td>{course.level || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${course.status}`}>
                    {course.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <Link href={`/mentor_dashboard/AllCourses/${course.id}`} className="action-btn-link" title="View Students">
                      <Eye className="icon-sm" />
                    </Link>
                    <button title="Edit"><Edit className="icon-sm" /></button>
                    {/* The delete button can be added here when the logic is ready */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {courses.length === 0 && !loading && (
        <div className="empty-state">
            <p>You have not been assigned to any courses yet.</p>
        </div>
      )}
    </div>
  )
}

