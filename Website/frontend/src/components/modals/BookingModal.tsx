'use client'

import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import './BookingModal.css';


interface Slot {
  id: number;
  date: string;
  time: string;
}
interface Mentor {
  name: string;
}


interface BookingModalProps {
  slot: Slot;
  mentor: Mentor;
  onClose: () => void;
  onBookingSuccess: (slotId: number) => void;
}

export default function BookingModal({ slot, mentor, onClose, onBookingSuccess }: BookingModalProps) {
  const [topic, setTopic] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const handleBook = async () => {
    if (!topic.trim()) {
      toast.error("Please provide a topic for the meeting.");
      return;
    }
    setIsBooking(true);
    const toastId = toast.loading("Booking your session...");
    try {
      const response = await api.post('/api/learner/book-session', {
        slotId: slot.id,
        topic: topic,
      });
      toast.success(response.data.message, { id: toastId, duration: 5000 });
      onBookingSuccess(slot.id);
      onClose();
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to book session.";
      toast.error(message, { id: toastId });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* UPDATE the className here to match the new CSS */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Book Session with {mentor.name}</h3>
        <p className="slot-details">
          <strong>Date:</strong> {new Date(slot.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})} <br />
          <strong>Time:</strong> {slot.time}
        </p>
        <label>What would you like to discuss?</label>
        <textarea
          rows={4}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., How to improve my business plan..."
          disabled={isBooking}
        />
        <div className="modal-buttons">
          <button onClick={onClose} className="cancel-btn" disabled={isBooking}>Cancel</button>
          <button onClick={handleBook} className="send-btn" disabled={isBooking || !topic.trim()}>
            {isBooking ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}