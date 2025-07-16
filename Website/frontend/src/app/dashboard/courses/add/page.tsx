'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import './add.css'; 
import api from '@/lib/api';
import toast from 'react-hot-toast';


interface Course {
  id: number;
  name: string;
}

export default function AddCoursePage() {
  const [courseTitle, setCourseTitle] = useState('');
  const [isAddingCourse, setIsAddingCourse] = useState(false);


  const [mentorEmail, setMentorEmail] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [isInvitingMentor, setIsInvitingMentor] = useState(false);
  

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);


  const fetchCourses = async () => {
    try {
      const response = await api.get('/api/courses'); 
      setCourses(response.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      toast.error("Could not load course list.");
    } finally {
      setIsLoadingCourses(false);
    }
  };


  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCourseSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsAddingCourse(true);
    const toastId = toast.loading('Adding new course...');
    
    try {
      await api.post('/api/courses', { name: courseTitle });
      
      toast.success('Course added successfully!', { id: toastId });
      setCourseTitle('');
      

      fetchCourses(); 

    } catch (error: any) {
      const errorMessage = error.response?.data?.errors?.[0]?.message || 'Failed to add course.';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsAddingCourse(false);
    }
  };

  const handleInviteSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!mentorEmail || !selectedCourseId) {
        toast.error("Please select a course and enter a mentor's email.");
        return;
    }
    setIsInvitingMentor(true);
    const toastId = toast.loading('Sending invitation...');

    try {
      await api.post('/api/auth/invite-mentor', {
        email: mentorEmail,
        courseId: parseInt(selectedCourseId, 10),
      });

      toast.success('Invitation sent successfully!', { id: toastId });
      setMentorEmail('');
      setSelectedCourseId(''); 

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send invitation.';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsInvitingMentor(false);
    }
  };

  return (
    <div className="add-course-container">
      <div className="add-course-card">
        <h1 className="add-course-title">Add New Course</h1>

        <form onSubmit={handleCourseSubmit} className="add-course-form">
          <label>
            Course Name
            <input
              name="title"
              value={courseTitle}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCourseTitle(e.target.value)}
              required
              placeholder="e.g. Agribusiness 101"
              disabled={isAddingCourse}
            />
          </label>
          <button type="submit" className="submit-btn" disabled={isAddingCourse}>
            {isAddingCourse ? 'Adding...' : 'Add Course'}
          </button>
        </form>

        <hr className="divider" />

        <h2 className="section-title">Invite a Mentor to a Course</h2>

        <form onSubmit={handleInviteSubmit} className="add-course-form">
          <label>
            Select Course
            <select
              value={selectedCourseId}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedCourseId(e.target.value)}
              required
              disabled={isLoadingCourses || isInvitingMentor}
            >
              <option value="" disabled>
                {isLoadingCourses ? 'Loading courses...' : 'Choose a course...'}
              </option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Mentor's Email Address
            <input
              type="email"
              placeholder="mentor@example.com"
              value={mentorEmail}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setMentorEmail(e.target.value)}
              required
              disabled={isInvitingMentor}
            />
          </label>
          <button type="submit" className="invite-btn" disabled={isInvitingMentor}>
            {isInvitingMentor ? 'Sending Invite...' : 'Invite Mentor'}
          </button>
        </form>
      </div>
    </div>
  );
}