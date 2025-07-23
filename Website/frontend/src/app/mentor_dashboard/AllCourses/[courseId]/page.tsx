'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import '../students.css'; // Your existing CSS file
import api from '@/lib/api';
import toast from 'react-hot-toast';

// --- Type Definitions (Updated to include progress) ---
interface Learner {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  enrolled_at: string;
  progress: number; // Progress is now included
}

// Derived type for easier use in the component
interface ProcessedLearner extends Learner {
    name: string;
}

export default function CourseStudentsPage() {
  const [learners, setLearners] = useState<ProcessedLearner[]>([]);
  const [courseName, setCourseName] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- State for the Message Modal ---
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<ProcessedLearner | null>(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  useEffect(() => {
    if (!courseId) return;
    const fetchEnrolledLearners = async () => {
      try {
        const [courseResponse, learnersResponse] = await Promise.all([
            api.get(`/api/mentor/courses/${courseId}/details`),
            api.get(`/api/users/my-learners?courseId=${courseId}`)
        ]);
        
        setCourseName(courseResponse.data.name);

        const processedLearners = learnersResponse.data.map((learner: Learner) => ({
            ...learner,
            name: `${learner.first_name || ''} ${learner.last_name || ''}`.trim() || learner.email
        }));
        setLearners(processedLearners);

      } catch (error) {
        toast.error("Could not load enrolled learners.");
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledLearners();
  }, [courseId]);

  const openModal = (student: ProcessedLearner) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setMessage('');
  };

  const handleSendMessage = async () => {
    if (!selectedStudent || !message) {
        toast.error("Please write a message before sending.");
        return;
    }
    setIsSending(true);
    const toastId = toast.loading("Sending message...");
    try {
        await api.post('/api/mentor/message-learner', {
            learnerId: selectedStudent.id,
            courseId: parseInt(courseId),
            message: message,
        });
        toast.success(`Message sent to ${selectedStudent.name}`, { id: toastId });
        closeModal(); // Close modal on success
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to send message.";
        toast.error(errorMessage, { id: toastId });
    } finally {
        setIsSending(false);
    }
  };

  const filteredLearners = learners.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return (
        <div className="container">
            <div className="header"><h2 className="title">Loading Students...</h2></div>
        </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <button onClick={() => router.back()} className="back-button">← Back</button>
        <h2 className="title">Students for <strong>{courseName}</strong></h2>
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input type="text" placeholder="Search students..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="table-container">
        <div className="table-scroll">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Progress</th>
                <th>Enrolled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLearners.map((student) => {
                const initials = student.name.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
                return (
                    <tr key={student.id}>
                      <td>
                        <div className="student-cell">
                          <div className="student-avatar"><span>{initials}</span></div>
                          <div className="student-name">{student.name}</div>
                        </div>
                      </td>
                      <td>
                        <div className="progress-bar-wrapper">
                          <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${student.progress}%` }}></div>
                          </div>
                          <span>{student.progress}%</span>
                        </div>
                      </td>
                      <td>{new Date(student.enrolled_at).toLocaleDateString()}</td>
                      <td>
                        <button className="action-btn" onClick={() => openModal(student)}>Message</button>
                      </td>
                    </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* ... empty state JSX ... */}
      </div>

      {/* --- CORRECTED MODAL --- */}
      {showModal && selectedStudent && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Message {selectedStudent.name}</h3>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              disabled={isSending}
            ></textarea>
            <div className="modal-buttons">
              {/* These buttons now have the correct onClick handlers */}
              <button onClick={closeModal} className="cancel-btn">Cancel</button>
              <button onClick={handleSendMessage} className="send-btn" disabled={isSending}>
                {isSending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}