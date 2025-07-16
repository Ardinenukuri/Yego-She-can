'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiUserPlus, FiMail, FiEye, FiTrash2 } from 'react-icons/fi'
import './mentors.css'
import api from '@/lib/api'
import toast from 'react-hot-toast'


const ITEMS_PER_PAGE = 5

type Mentor = {
  id: number
  name: string
  email: string
  expertise: string | null
  status: 'Active' | 'Pending'
  image: string | null
}

export default function MentorsPage() {

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);


  const [mentorToDelete, setMentorToDelete] = useState<Mentor | null>(null);


  const fetchMentors = async () => {
    try {
      const response = await api.get('/api/users/mentors');
      setMentors(response.data);
    } catch (error) {
      console.error("Failed to fetch mentors:", error);
      toast.error("Could not load mentor data.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchMentors();
  }, []);


  const handleDelete = async () => {
    if (!mentorToDelete) return;

    const toastId = toast.loading(`Removing mentor ${mentorToDelete.name}...`);
    try {

      await api.delete(`/api/users/${mentorToDelete.id}`);
      toast.success("Mentor removed successfully.", { id: toastId });
      

      setMentorToDelete(null);
      fetchMentors();

    } catch (error) {
      console.error("Failed to remove mentor:", error);
      toast.error("Failed to remove mentor.", { id: toastId });
      setMentorToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="mentors-page">
        <div className="mentors-header">
          <h1>Manage Mentors</h1>
        </div>
        <div className="loading-state">Loading mentors...</div>
      </div>
    );
  }

  return (
    <>
      <div className="mentors-page">
        <div className="mentors-header">
          <h1>Manage Mentors</h1>
          <Link href="/dashboard/mentors/invite">
            <button className="invite-mentor-btn">
              <FiUserPlus /> Invite Mentor
            </button>
          </Link>
        </div>


        <table className="mentors-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Name</th>
              <th>Email</th>
              <th>Expertise</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mentors.map((mentor) => (
              <tr key={mentor.id}>
                <td>
                  <img
                    src={mentor.image ? `${process.env.NEXT_PUBLIC_API_URL}${mentor.image}` : '/default-avatar.png'}
                    alt={mentor.name}
                    className="mentor-img"
                  />
                </td>
                <td>{mentor.name}</td>
                <td>
                  <FiMail className="table-icon" /> {mentor.email}
                </td>
                <td>{mentor.expertise || 'Not specified'}</td>
                <td>
                  <span className={`mentor-status ${mentor.status.toLowerCase()}`}>
                    {mentor.status}
                  </span>
                </td>
                <td>
                  <div className="mentor-actions">
                    <button className="view-btn">
                      <FiEye className="table-icon" /> View
                    </button>

                    <button className="delete-btn" onClick={() => setMentorToDelete(mentor)}>
                      <FiTrash2 className="table-icon" /> Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>


        <div className="mentors-cards">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="mentor-card">
              <img
                src={mentor.image ? `${process.env.NEXT_PUBLIC_API_URL}${mentor.image}` : '/default-avatar.png'}
                alt={mentor.name}
                className="mentor-img"
              />
              <div className="mentor-info">
                <h3>{mentor.name}</h3>
                <p><FiMail /> {mentor.email}</p>
                <p>Expertise: {mentor.expertise || 'Not specified'}</p>
                <span className={`mentor-status ${mentor.status.toLowerCase()}`}>
                  {mentor.status}
                </span>
              </div>
              <div className="mentor-actions">
                <button className="view-btn"><FiEye /> View</button>
                <button className="delete-btn" onClick={() => setMentorToDelete(mentor)}><FiTrash2 /> Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {mentorToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Removal</h2>
            <p>Are you sure you want to remove the mentor "<strong>{mentorToDelete.name}</strong>"? This action is permanent.</p>
            <div className="modal-actions">
              <button className="modal-btn-cancel" onClick={() => setMentorToDelete(null)}>Cancel</button>
              <button className="modal-btn-confirm" onClick={handleDelete}>Yes, Remove</button>
            </div>
          </div>
        </div>
      )}
    </>

  )
}