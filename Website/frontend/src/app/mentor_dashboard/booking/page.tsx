'use client'

import React, { useState, useEffect } from 'react';
import { Calendar, Video, MessageCircle, XCircle } from 'lucide-react';
import './booking.css';
import api from '@/lib/api';
import toast from 'react-hot-toast';


type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'scheduled';

interface Booking {
  id: number;
  menteeName: string; 
  date: string;
  time: string;
  status: BookingStatus;
  topic: string;
  notes?: string;
}

const GOOGLE_MEET_LINK = 'https://meet.google.com/mqt-yygo-jeo';

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);


  const fetchBookings = async () => {
    try {
        const response = await api.get('/api/bookings');
        setBookings(response.data);
    } catch (error) {
        console.error("Failed to fetch bookings:", error);
        toast.error("Could not load your bookings.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = async (bookingId: number, newStatus: 'cancelled' | 'completed') => {
    const originalBookings = [...bookings];

    setBookings(prev =>
      prev.map(booking =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );

    try {
        await api.put(`/api/bookings/${bookingId}/status`, { status: newStatus });
        toast.success(`Session marked as ${newStatus}.`);
    } catch (error) {
        toast.error(`Failed to update session status.`);
        
        setBookings(originalBookings);
    }
  };

  const getStatusClass = (status: BookingStatus): string => {
    switch (status) {
      case 'confirmed':
      case 'scheduled':
        return 'badge badge-green';
      case 'pending':
        return 'badge badge-blue';
      case 'completed':
        return 'badge badge-gray';
      case 'cancelled':
        return 'badge badge-red';
      default:
        return 'badge';
    }
  };

  if (loading) {
    return (
        <div className="container">
            <h1>Bookings</h1>
            <div className="loading-state">Loading your booked sessions...</div>
        </div>
    );
  }

  return (
    <div className="container">
      <h1>Bookings</h1>

      <div className="slot-list">
        {bookings.length > 0 ? bookings.map((booking) => (
          <div key={booking.id} className="slot-card">
            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="mentee-avatar">

                <span>{booking.menteeName?.split(' ').map(n => n[0]).join('') || '?'}</span>
              </div>

              <div>
                <h4>{booking.menteeName}</h4>
                <span className={getStatusClass(booking.status)}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
                <p className="small">
                  <Calendar size={14} /> {booking.date} at {booking.time}
                </p>
                <p className="small">
                  <Video size={14} /> {booking.topic}
                </p>
                {booking.notes && (
                  <p className="small">
                    <MessageCircle size={14} /> {booking.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="slot-actions">
              {(booking.status === 'confirmed' || booking.status === 'scheduled') && (
                <>
                  <a href={GOOGLE_MEET_LINK} target="_blank" rel="noopener noreferrer" className="primary-btn">
                    Join Session
                  </a>
                  <button
                    className="danger-btn"
                    onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                  >
                    <XCircle size={14} /> Cancel
                  </button>
                </>
              )}

              {booking.status === 'cancelled' && (
                <span className="badge badge-red">Session Cancelled</span>
              )}
               {booking.status === 'completed' && (
                <span className="badge badge-gray">Session Completed</span>
              )}
            </div>
          </div>
        )) : (
            <div className="empty-state">
                <p>You have no scheduled bookings.</p>
            </div>
        )}
      </div>
    </div>
  );
};

