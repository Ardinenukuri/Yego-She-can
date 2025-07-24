// components/AvailabilityManager.tsx
'use client';

import React, { useState, useMemo } from 'react';
import './availability.css';
import { v4 as uuidv4 } from 'uuid';

interface Slot {
  id: string;
  date: string;
  time: string;
  status: 'Available' | 'Booked' | 'Cancelled';
}

const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  let start = new Date();
  start.setHours(9, 0, 0, 0); // Start at 9:00 AM
  const end = new Date(start);
  end.setHours(17, 30); // End at 5:30 PM

  while (start <= end) {
    const timeString = start.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    slots.push(timeString);
    start.setMinutes(start.getMinutes() + 30);
  }

  return slots;
};

const AvailabilityManager: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [allSlots, setAllSlots] = useState<Slot[]>([]);
  const [filterDate, setFilterDate] = useState('All');

  const timeSlots = useMemo(() => generateTimeSlots(), []);

  const handleSlotClick = (time: string) => {
    setSelectedSlots(prev =>
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  const saveSlots = () => {
    if (!selectedDate) return; // Avoid saving without date
    const newSlots: Slot[] = selectedSlots.map(time => ({
      id: uuidv4(),
      date: selectedDate,
      time,
      status: 'Available',
    }));
    setAllSlots(prev => [...prev, ...newSlots]);
    setSelectedSlots([]);
  };

  const cancelSlot = (id: string) => {
    setAllSlots(prev =>
      prev.map(slot =>
        slot.id === id ? { ...slot, status: 'Cancelled' as const } : slot
      )
    );
  };

  const deleteSlot = (id: string) => {
    setAllSlots(prev => prev.filter(slot => slot.id !== id));
  };

  const filteredSlots = useMemo(() => {
    return filterDate === 'All'
      ? allSlots
      : allSlots.filter(slot => slot.date === filterDate);
  }, [filterDate, allSlots]);

  return (
    <div className="availability-container">
      <h2>Select Availability</h2>

      <div className="date-picker-container">
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="date-picker"
        />
      </div>

      {selectedDate && (
        <div className="slots-container">
          {timeSlots.map(time => (
            <button
              key={time}
              className={`slot-button ${selectedSlots.includes(time) ? 'selected' : ''}`}
              onClick={() => handleSlotClick(time)}
            >
              {time}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={saveSlots}
        className="save-button"
        disabled={!selectedDate || selectedSlots.length === 0}
      >
        Save Slots
      </button>

      <div className="filter-bar">
        <h3>Available Slots</h3>
        <select
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          className="filter-dropdown"
        >
          <option value="All">All</option>
          {[...new Set(allSlots.map(slot => slot.date))].map(date => (
            <option key={date} value={date}>{date}</option>
          ))}
        </select>
      </div>

      <table className="slots-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSlots.length > 0 ? (
            filteredSlots.map(slot => (
              <tr key={slot.id}>
                <td>{slot.date}</td>
                <td>{slot.time}</td>
                <td>{slot.status}</td>
                <td>
                  <button
                    className="cancel-button"
                    onClick={() => cancelSlot(slot.id)}
                    disabled={slot.status !== 'Available'}
                  >
                    Cancel
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => deleteSlot(slot.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>
                No slots available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AvailabilityManager;
