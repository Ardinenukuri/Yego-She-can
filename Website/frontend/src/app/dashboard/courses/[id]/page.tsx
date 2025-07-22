"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Search, Award } from 'lucide-react';
import '../details.css';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios'; // Import AxiosError for better type checking

// --- Type Definitions for the data from our backend ---
interface Learner {
  id: number;
  name: string;
  image: string | null;
  progress: number;
  enrolled: string;
  lessonsCompleted: number;
  totalLessons: number;
  certificateEligible: boolean;
}
interface CourseDetails {
  id: number;
  name: string;
  learners: Learner[];
}

export default function CourseDetailsPage() {
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const params = useParams();
  const courseId = params.courseId as string;
  
  useEffect(() => {
    if (!courseId) {
        setLoading(false);
        return;
    }

    const fetchCourseDetails = async () => {
      // --- NEW: Log the ID being used for the API call for easy debugging ---
      console.log(`Attempting to fetch details for courseId: ${courseId}`);

      try {
        setLoading(true);
        const response = await api.get(`/api/courses/${courseId}`);
        setCourse(response.data);
      } catch (error) {
        // --- UPDATED: Enhanced error logging to pinpoint the problem ---
        console.error("Failed to fetch course details:", error);
        
        // Check if the error is an Axios error with a response from the server
        if (error instanceof AxiosError && error.response) {
          console.error("API Error Response Status:", error.response.status);
          console.error("API Error Response Data:", error.response.data);
          
          if (error.response.status === 403) {
            toast.error("You do not have permission to view these details.");
          } else if (error.response.status === 404) {
            toast.error("This course could not be found.");
          } else {
            toast.error("An unexpected error occurred while loading the course.");
          }
        } else {
          // Generic error for network issues, etc.
          toast.error("Could not load course details.");
        }
        
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleIssueCertificate = (learnerId: number) => {
    toast.success(`Issuing certificate for learner ID: ${learnerId}...`);
    // Future API call:
    // await api.post(`/api/certificates/issue`, { learnerId, courseId });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="header">
            <h2 className="title">Enrolled Learners</h2>
        </div>
        <div className="loading-state">Loading course details...</div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="container">
        <div className="header">
            <h2 className="title">Error</h2>
        </div>
        <div className="empty-state">Course data could not be found. It may have been deleted or you may not have permission to view it.</div>
      </div>
    );
  }

  const filteredLearners = course.learners.filter(learner =>
    learner.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="header">
        <h2 className="title">Enrolled Learners for: <strong>{course.name}</strong></h2>
        <div className="search-filter">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder="Search learners..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-scroll">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Progress</th>
                <th>Lessons Completed</th>
                <th>Enrolled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLearners.map((learner) => (
                <tr key={learner.id}>
                  <td>
                    <div className="student-cell">
                      <div className="student-avatar">
                        {learner.image ? (
                           <img src={`${process.env.NEXT_PUBLIC_API_URL}${learner.image}`} alt={learner.name} />
                        ) : (
                           <span>{learner.name.split(' ').map(n => n[0]).join('')}</span>
                        )}
                      </div>
                      <div className="student-name">{learner.name}</div>
                    </div>
                  </td>
                  <td>
                    <div className="progress-bar-wrapper">
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${learner.progress}%` }}></div>
                      </div>
                      <span>{learner.progress}%</span>
                    </div>
                  </td>
                  <td>{learner.lessonsCompleted} / {learner.totalLessons}</td>
                  <td>{learner.enrolled}</td>
                  <td>
                    {learner.certificateEligible ? (
                      <button className="action-btn issue-cert" onClick={() => handleIssueCertificate(learner.id)}>
                        <Award className="icon-sm" /> Issue Certificate
                      </button>
                    ) : (
                      <button className="action-btn" disabled>
                        In Progress
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLearners.length === 0 && (
          <p className="empty-state">
            {course.learners.length > 0 ? "No learners match your search." : "No learners are enrolled in this course yet."}
          </p>
        )}
      </div>
    </div>
  );
}