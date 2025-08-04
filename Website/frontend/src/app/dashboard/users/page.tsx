'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMail, FiTrash2, FiCalendar } from 'react-icons/fi';
import './learners.css'; 
import api from '@/lib/api';
import toast from 'react-hot-toast';

type Learner = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: 'Active' | 'Inactive' | 'Pending';
  image: string | null;
  created_at: string;
}

export default function LearnersPage() {
  const [learners, setLearners] = useState<Learner[]>([]);
  const [loading, setLoading] = useState(true);
  const [learnerToDelete, setLearnerToDelete] = useState<Learner | null>(null);


  const fetchLearners = async () => {
    try {
      const response = await api.get('/api/users/learners');
      setLearners(response.data);
    } catch (error) {
      console.error("Failed to fetch learners:", error);
      toast.error("Could not load learner data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearners();
  }, []);

  const handleDelete = async () => {
    if (!learnerToDelete) return;
    const toastId = toast.loading(`Deleting learner...`);
    try {
      await api.delete(`/api/users/${learnerToDelete.id}`);
      toast.success("Learner deleted successfully.", { id: toastId });
      setLearnerToDelete(null);
      fetchLearners(); 
    } catch (error) {
      toast.error("Failed to delete learner.", { id: toastId });
      setLearnerToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="learners-page">
        <div className="learners-header"><h1>Manage Learners</h1></div>
        <div className="loading-state">Loading learners...</div>
      </div>
    );
  }

  return (
    <>
      <div className="learners-page">
        <div className="learners-header">
          <h1>Manage Learners</h1>

        </div>

        <table className="learners-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {learners.map((learner) => (
              <tr key={learner.id}>
                <td>
                  {learner.image ? (
  <img
    src={`${process.env.NEXT_PUBLIC_API_URL}${learner.image}`}
    alt={`${learner.first_name || ''} ${learner.last_name || ''}`.trim()}
    className="learner-img"
  />
) : (

  <div className="learner-img initials-avatar">
    <span>      {`${learner.first_name ? learner.first_name[0] : ''}${learner.last_name ? learner.last_name[0] : ''}`}
    </span>
  </div>
)}
                </td>
                <td>{learner.first_name} {learner.last_name}</td>
                <td><FiMail className="table-icon" /> {learner.email}</td>
                <td>
                  <span className={`status-badge ${learner.status.toLowerCase()}`}>
                    {learner.status}
                  </span>
                </td>
                <td>
                  <FiCalendar className="table-icon" />
                  {new Date(learner.created_at).toLocaleDateString()}
                </td>
                <td>
                  <div className="learner-actions">
                    <button className="delete-btn" onClick={() => setLearnerToDelete(learner)}>
                      <FiTrash2 className="table-icon" /> Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      {learnerToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to remove the learner "<strong>{learnerToDelete.first_name} {learnerToDelete.last_name}</strong>"? This action is permanent.</p>
            <div className="modal-actions">
              <button className="modal-btn-cancel" onClick={() => setLearnerToDelete(null)}>Cancel</button>
              <button className="modal-btn-confirm" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}