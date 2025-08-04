'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import '@/styles/mentorship.css' 
import api from '@/lib/api'
import toast from 'react-hot-toast'
import Avatar from '@/components/ui/Avatar';


interface Mentor {
    id: string;
    name: string;
    expertise: string;
    bio: string;
    image: string | null;
}

const generateColor = (name: string = ''): string => {
  if (!name) return '#cccccc';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = ['#678978ff', '#7d6867ff', '#727c8eff', '#857766ff'];
  return colors[Math.abs(hash) % colors.length];
};

export default function MentorshipPage() {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        const fetchMentors = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/users/mentor');
                setMentors(response.data);
            } catch (error) {
                console.error("Failed to fetch mentors:", error);
                toast.error("Could not load the list of mentors.");
            } finally {
                setLoading(false);
            }
        };
        fetchMentors();
    }, []);

    if (loading) {
        return (
            <div className="mentorship-container">
                <h1 className="mentorship-title">Available Mentors</h1>
                <div className="loading-state">Loading mentors...</div>
            </div>
        );
    }

    return (
        <div className="mentorship-container">
            <h1 className="mentorship-title">Available Mentors</h1>
            {mentors.length > 0 ? (
                <div className="mentor-list">
                    {mentors.map((mentor) => (
                        <div key={mentor.id} className="mentor-card">
                            {mentor.image ? (
  <img
    src={`${process.env.NEXT_PUBLIC_API_URL}${mentor.image}`}
    alt={mentor.name}
    className="mentor-avatar"
  />
) : (
  <div
    className="mentor-avatar initials-avatar"
    style={{ backgroundColor: generateColor(mentor.name) }}
  >
    <span>
      {mentor.name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')}
    </span>
  </div>
)}
                            <div className="mentor-details">
                                <h2>{mentor.name}</h2>
                                <p><strong>Expertise:</strong> {mentor.expertise}</p>
                                <p>{mentor.bio || "This mentor has not provided a bio yet."}</p>
                                <Link 
                                    href={`/user-dashboard/mentorship/${mentor.id}/availability`} 
                                    className="mentor-button"
                                >
                                    View Availability
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <p>There are currently no available mentors. Please check back later!</p>
                </div>
            )}
        </div>
    )
}