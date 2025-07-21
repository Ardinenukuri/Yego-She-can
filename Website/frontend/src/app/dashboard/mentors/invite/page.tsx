'use client'

import { useState, FormEvent, ChangeEvent, useEffect } from 'react'
import '../mentors.css' 
import { FiSend } from 'react-icons/fi'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import useDebounce from '@/hooks/useDebounce'


interface Course {
  id: number;
  name: string;
}

interface UserSuggestion {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

export default function InviteMentorPage() {
  const [email, setEmail] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedSearchTerm = useDebounce(email, 300);

  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/courses');
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


  useEffect(() => {
    if (debouncedSearchTerm.length > 2) {
      const fetchSuggestions = async () => {
        try {
          const response = await api.get(`/api/users/eligible-mentors?q=${debouncedSearchTerm}`);
          setSuggestions(response.data);
          setShowSuggestions(true); 
        } catch (error) {
          console.error("Failed to fetch mentor suggestions:", error);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setShowSuggestions(false); 
    }
  }, [debouncedSearchTerm]);

  
  const handleSuggestionClick = (selectedEmail: string) => {
    setEmail(selectedEmail);
    setShowSuggestions(false); 
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) {
      toast.error("Please select a course to assign the mentor to.");
      return;
    }
    setIsLoading(true);
    const toastId = toast.loading('Sending invitation...');
    try {
      await api.post('/api/auth/invite-mentor', {
        email: email,
        courseId: parseInt(selectedCourseId, 10),
      });
      toast.success(`Invite sent successfully to ${email}`, { id: toastId });
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
        
        <div className="email-input-container">
          <label>
            Mentor's Email Address or Name:
            <input
              type="text"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              onFocus={() => {
                  if (suggestions.length > 0) {
                      setShowSuggestions(true);
                  }
              }}

              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              required
              placeholder="Start typing a name or email..."
              disabled={isLoading}
              autoComplete="off"
            />
          </label>
          
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map(user => (
                <li key={user.id} onMouseDown={() => handleSuggestionClick(user.email)}>
                  <strong>{user.first_name} {user.last_name}</strong>
                  <span>{user.email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="invite-btn" disabled={isLoading}>
          <FiSend /> {isLoading ? 'Sending...' : 'Send Invite'}
        </button>
      </form>
    </div>
  )
}