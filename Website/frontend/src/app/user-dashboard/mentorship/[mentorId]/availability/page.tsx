'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import '@/styles/mentorship.css'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import BookingModal from '@/components/modals/BookingModal'; 


interface Slot {
  id: number;
  date: string;
  time: string;
  status: 'Available' | 'Booked' | 'Cancelled'; 
}
interface Mentor {
    id: number;
    name: string;
}

export default function MentorAvailabilityPage() {
  const [availability, setAvailability] = useState<Slot[]>([]);
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  
  
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const params = useParams();
  const router = useRouter();
  const mentorId = params.mentorId as string;

  
  useEffect(() => {
    
    if (!mentorId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [mentorsRes, availabilityRes] = await Promise.all([
            api.get('/api/public/mentors'),
            api.get(`/api/public/mentors/${mentorId}/availability`)
        ]);

        const currentMentor = mentorsRes.data.find((m: Mentor) => m.id === parseInt(mentorId));
        if (currentMentor) {
            setMentor(currentMentor);
        } else {
            throw new Error("Mentor not found");
        }
        
        setAvailability(availabilityRes.data);

      } catch (error) {
        console.error("Failed to load mentor data:", error);
        toast.error("Could not load this mentor's information.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mentorId]); 
  const handleBookingSuccess = (bookedSlotId: number) => {
    setAvailability(prev => prev.filter(slot => slot.id !== bookedSlotId));
  };

  if (loading) {
    return <div className="mentor-availability-container"><h1>Loading Availability...</h1></div>;
  }

  return (
    <>
      <div className="mentor-availability-container">
        <button onClick={() => router.back()} className="back-button">← Back to Mentors</button>
        <h1 className="availability-title">Available Sessions with {mentor?.name || 'Mentor'}</h1>
        
        {availability.length > 0 ? (
            <ul className="availability-list">
              {availability.map((slot) => (
                <li key={slot.id} className="availability-item">
                  <span>{new Date(slot.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric'})} at {slot.time}</span>
                  <button
                    className="book-button"
                    onClick={() => setSelectedSlot(slot)}
                  >
                    Book Session
                  </button>
                </li>
              ))}
            </ul>
        ) : (
            <p className="empty-state">This mentor has no available sessions right now. Please check back later.</p>
        )}
      </div>

      {selectedSlot && mentor && (
        <BookingModal
          slot={selectedSlot}
          mentor={mentor}
          onClose={() => setSelectedSlot(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </>
  );
}