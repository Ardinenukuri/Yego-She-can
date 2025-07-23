"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Search, Award } from 'lucide-react';
import '../details.css';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

// --- UPDATED: Simplified Type Definitions ---
interface Learner {
  id: number;
  name: string;
  image: string | null;
  progress: number;
  enrolled: string;
  lessonsCompleted: number;
  totalLessons: number;
  certificateEligible: boolean; // Based on 100% chapter progress
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
  const [issuedLearnerIds, setIssuedLearnerIds] = useState<number[]>([]);

  const params = useParams();
  const courseId = params.courseId as string;
  
  useEffect(() => {
    if (!courseId) {
        setLoading(false);
        return;
    }
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/courses/${courseId}`);
        setCourse(response.data);
      } catch (error) {
        console.error("Failed to fetch course details:", error);
        if (error instanceof AxiosError && error.response?.status === 404) {
            toast.error("This course was not found.");
        } else {
            toast.error("Could not load course details.");
        }
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [courseId]);

  const handleIssueCertificate = async (learnerId: number, courseId: number) => {
    const toastId = toast.loading(`Issuing certificate for learner ${learnerId}...`);
    try {
      await api.post('/api/certificates/issue', { 
          learnerId, 
          courseId: Number(courseId)
      });
      
      toast.success(`Certificate issued successfully!`, { id: toastId });
      setIssuedLearnerIds(prevIds => [...prevIds, learnerId]);

    } catch (error: any) {
       console.error("Failed to issue certificate:", error);
       const message = error.response?.data?.message || "Failed to issue certificate.";
       toast.error(message, { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="details-container">
        <div className="details-header">
            <h2 className="details-title">Enrolled Learners</h2>
        </div>
        <div className="loading-state">Loading course details...</div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="details-container">
        <div className="details-header">
            <h2 className="details-title">Error</h2>
        </div>
        <div className="empty-state">Course data could not be found.</div>
      </div>
    );
  }

  const filteredLearners = course.learners.filter(learner =>
    learner.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="details-container">
      <div className="details-header">
        <h2 className="details-title">Enrolled Learners for: <strong>{course.name}</strong></h2>
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
                <th>Enrolled On</th>
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
                      <span className="progress-text">{learner.progress}%</span>
                    </div>
                  </td>
                  <td>{learner.lessonsCompleted} / {learner.totalLessons}</td>
                  <td>{new Date(learner.enrolled).toLocaleDateString()}</td>
                  <td>

                    {learner.certificateEligible ? (

                      issuedLearnerIds.includes(learner.id) ? (
                        <button className="action-btn" disabled>Issued ✓</button>
                      ) : (
                        <button 
                          className="action-btn issue-cert" 
                          onClick={() => handleIssueCertificate(learner.id, course.id)}
                        >
                          <Award className="icon-sm" /> Issue Certificate
                        </button>
                      )
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