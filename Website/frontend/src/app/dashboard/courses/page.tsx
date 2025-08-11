'use client';

import Link from 'next/link';
import './courses.css'; 
import { FiClock, FiBookOpen, FiAward, FiTrash2 } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import api from '@/lib/api'; 
import toast from 'react-hot-toast';

interface Course {
  id: number;
  title: string;
  image: string | null;
  description: string;
  duration: string;
  lessons: number;
  level: string;
  price: string;
  mentor: string;
  enrolledCount: number;
}

export default function CoursesPage() {

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  

  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const fetchAdminCourses = async () => {
    try {
      const response = await api.get('/api/courses/admin-list');
      setCourses(response.data);
    } catch (error) {
      console.error("Failed to fetch courses for admin:", error);
      toast.error("Could not load course data. Please try again.");
    } finally {
      setLoading(false); 
    }
  };


  useEffect(() => {
    fetchAdminCourses();
  }, []);


  const handleDeleteCourse = async () => {
    if (!courseToDelete) return; 

    const toastId = toast.loading('Deleting course...');
    try {

      await api.delete(`/api/courses/${courseToDelete.id}`);
      
      toast.success(`Course "${courseToDelete.title}" deleted successfully.`, { id: toastId });
      

      setCourseToDelete(null);

      setTimeout(() => fetchAdminCourses(), 200);
      
    } catch (error) {
      console.error("Failed to delete course:", error);
      toast.error("Failed to delete the course.", { id: toastId });
      setCourseToDelete(null); 
    }
  };

  const openDeleteModal = (course: Course) => {
    setCourseToDelete(course);
  };


  const closeDeleteModal = () => {
    setCourseToDelete(null);
  };

  if (loading) {
    return (
      <div className="courses-page-admin">
        <div className="admin-header">
          <h1>Manage Courses</h1>
        </div>
        <div className="loading-state">Loading courses...</div>
      </div>
    );
  }

  return (
    <>
      <div className="courses-page-admin">
        <div className="admin-header">
          <h1>Manage Courses</h1>
          <Link href="/dashboard/courses/add">
            <button className="add-course-button">
              + Add Course
            </button>
          </Link>
        </div>

        <table className="courses-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Mentor</th>
              <th>Enrolled</th>
              <th>Duration</th>
              <th>Lessons</th>
              <th>Level</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>
                  <img
                    src={course.image ? `${process.env.NEXT_PUBLIC_API_URL}${course.image}` : "/placeholder-image.png"}
                    alt={course.title}
                    className="course-img"
                  />
                </td>
                <td>{course.title}</td>
                <td>{course.mentor === 'Not Assigned' ? <span className="text-muted">—</span> : course.mentor}</td>
                <td>{course.enrolledCount ?? 0}</td>
                <td>
                  <FiClock className="table-icon" /> {course.duration || 'N/A'}
                </td>
                <td>
                  <FiBookOpen className="table-icon" /> {course.lessons || 0}
                </td>
                <td>
                  <FiAward className="table-icon" /> {course.level || 'N/A'}
                </td>
                <td className="actions-cell">
                  <Link href={`/dashboard/courses/${course.id}`}>
                    <button className="view-btn">
                       View Details
                    </button>
                  </Link>
                  <button 
                    className="delete-btn" 
                    title="Delete Course"
                    onClick={() => openDeleteModal(course)} 
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {courseToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to permanently delete the course "<strong>{courseToDelete.title}</strong>"? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="modal-btn-cancel"
                onClick={closeDeleteModal} 
              >
                Cancel
              </button>
              <button 
                className="modal-btn-confirm"
                onClick={handleDeleteCourse} 
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}