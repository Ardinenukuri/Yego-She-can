"use client";

import React, { useState } from 'react';
import {
  Calendar,
  Video,
  MessageCircle,
  XCircle,
} from 'lucide-react';
import './booking.css';

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface Booking {
  id: number;
  menteeId: string;
  menteeName: string;
  date: string;
  time: string;
  status: BookingStatus;
  topic: string;
  notes?: string;
}

const BookingPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      menteeId: 'Afua-Hamissi',
      menteeName: 'Afua Hamissi',
      date: '2025-07-28',
      time: '02:00 PM - 03:00 PM',
      status: 'confirmed',
      topic: 'Soap Making',
      notes: 'Looking for help with how to make soaps',
    },
    {
      id: 2,
      menteeId: 'Diane-Ingabire',
      menteeName: 'Ingabire Diane',
      date: '2025-07-25',
      time: '03:00 PM - 04:00 PM',
      status: 'confirmed',
      topic: 'Entrepreneur Skills',
      notes: 'My Balance Sheet review and feedback',
    },
    {
      id: 3,
      menteeId: 'Ardine-Nukuri',
      menteeName: 'Ardine Nukuri',
      date: '2025-07-23',
      time: '09:00 AM - 10:00 AM',
      status: 'completed',
      topic: 'Marketing Strategy',
      notes: 'Transitioning from Entrepreneur Skills to Marketing Strategy',
    },
  ]);

  const updateBookingStatus = (bookingId: number, newStatus: BookingStatus): void => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );
  };

  const getStatusClass = (status: BookingStatus): string => {
    switch (status) {
      case 'confirmed':
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

  return (
    <div className="container">
      <h1>Bookings</h1>

      <div className="slot-list">
        {bookings.map((booking) => (
          <div key={booking.id} className="slot-card">
            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="mentee-avatar">
                <span>{booking.menteeName.split(' ').map(n => n[0]).join('')}</span>
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
              {booking.status === 'confirmed' && (
                <>
                  <button className="primary-btn">Join Session</button>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingPage;
