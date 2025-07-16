'use client'

import { useState, FormEvent, ChangeEvent, useEffect } from 'react'
import '../mentors.css' // Assuming your styles are here
import { FiSend } from 'react-icons/fi'
import api from '@/lib/api'
import toast from 'react-hot-toast'

// Define a type for the courses we fetch for the dropdown
interface Course {
  id: number;
  name: string;
}

export default function InviteMentorPage() {
  const [email, setEmail] = useState('')

  const [selectedCourseId, setSelectedCourseId] = useState<string>('')
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)

  // Fetch all available courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/courses'); // Uses the existing program manager route
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        toast.error("Could not load the list of courses.");
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedCourseId) {
      toast.error("Please select a course to assign the mentor to.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Sending invitation...');

    try {
      // The backend expects an object with 'email' and 'courseId'
      await api.post('/api/auth/invite-mentor', {
        email: email,
        courseId: parseInt(selectedCourseId, 10),
      });

      toast.success(`Invite sent successfully to ${email}`, { id: toastId });
      
      // Reset the form fields after success
      setEmail('');
      setSelectedCourseId('');

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send invitation.';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="invite-page">
      <h1 className="form-title">Invite a New Mentor</h1>

      <form className="invite-form" onSubmit={handleSubmit}>
        <label>
          Assign to Course:
          <select
            value={selectedCourseId}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedCourseId(e.target.value)}
            required
            disabled={isLoadingCourses || isLoading}
          >
            <option value="" disabled>
              {isLoadingCourses ? 'Loading courses...' : 'Select a course...'}
            </option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </label>
        
        <label>
          Mentor's Email Address:
          <input
            type="email"
            value={email}

            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}

            required
            placeholder="Enter mentor's email"
            disabled={isLoading}
          />
        </label>


        <button type="submit" className="invite-btn" disabled={isLoading}>
          <FiSend /> {isLoading ? 'Sending...' : 'Send Invite'}

        </button>
      </form>
    </div>
  )
}