'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import '@/styles/mentorship.css'

const dummyAvailability = [
  { id: 1, date: '2025-07-18', time: '10:00 AM' },
  { id: 2, date: '2025-07-19', time: '2:00 PM' },
]

export default function MentorAvailabilityPage() {
  const { mentorId } = useParams()
  const [bookedSlot, setBookedSlot] = useState<number | null>(null)

  const handleBook = (slotId: number) => {
    setBookedSlot(slotId)
    alert('Session booked successfully!')
  }

  return (
    <div className="mentor-availability-container">
      <h1 className="availability-title">Available Sessions</h1>
      <ul className="availability-list">
        {dummyAvailability.map((slot) => (
          <li key={slot.id} className="availability-item">
            <span>{slot.date} at {slot.time}</span>
            <button
              className="book-button"
              onClick={() => handleBook(slot.id)}
              disabled={bookedSlot === slot.id}
            >
              {bookedSlot === slot.id ? 'Booked' : 'Book Session'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
