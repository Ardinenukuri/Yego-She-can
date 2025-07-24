'use client';

import React, { useState, useMemo, useEffect } from 'react';
import './availability.css';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Slot {
  id: number;
  date: string;
  time: string;
  status: 'Available' | 'Booked' | 'Cancelled';
}

const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  let start = new Date();
  start.setHours(9, 0, 0, 0);
  const end = new Date(start);
  end.setHours(17, 30);
  while (start <= end) {
    const timeString = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    slots.push(timeString);
    start.setMinutes(start.getMinutes() + 30);
  }
  return slots;
};

export default function AvailabilityManager() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [allSlots, setAllSlots] = useState<Slot[]>([]);
  const [filterDate, setFilterDate] = useState('All');
  const [loading, setLoading] = useState(true);

  const timeSlots = useMemo(() => generateTimeSlots(), []);

  const fetchAvailability = async () => {
    try {
      const response = await api.get('/api/mentor/availability');
      setAllSlots(response.data);
    } catch (error) {
      toast.error('Could not load your availability.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const handleSlotClick = (time: string) => {
    setSelectedSlots(prev => prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]);
  };

  const saveSlots = async () => {
    if (!selectedDate || selectedSlots.length === 0) return;
    const toastId = toast.loading('Saving slots...');
    try {
      await api.post('/api/mentor/availability', { date: selectedDate, times: selectedSlots });
      toast.success('Availability saved!', { id: toastId });
      fetchAvailability();
      setSelectedSlots([]);
    } catch (error) {
      toast.error('Failed to save slots.', { id: toastId });
    }
  };

  const cancelSlot = async (id: number) => {
    const toastId = toast.loading('Cancelling slot...');
    try {
      await api.put(`/api/mentor/availability/${id}`, { status: 'cancelled' });
      toast.success('Slot cancelled.', { id: toastId });
      fetchAvailability();
    } catch (error) {
      toast.error('Failed to cancel slot.', { id: toastId });
    }
  };

  const deleteSlot = async (id: number) => {
    if (window.confirm('Are you sure you want to permanently delete this slot?')) {
      const toastId = toast.loading('Deleting slot...');
      try {
        await api.delete(`/api/mentor/availability/${id}`);
        toast.success('Slot deleted.', { id: toastId });
        fetchAvailability();
      } catch (error) {
        toast.error('Failed to delete slot.', { id: toastId });
      }
    }
  };

  const filteredSlots = useMemo(() => {
    return filterDate === 'All'
      ? allSlots
      : allSlots.filter(slot => slot.date === filterDate);
  }, [filterDate, allSlots]);

  return (
    <div className="availability-container">
      <h2>Set Your Weekly Availability</h2>
      <div className="date-picker-container">
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="date-picker" />
      </div>
      {selectedDate && (
        <div className="slots-container">
          {timeSlots.map(time => (
            <button key={time} className={`slot-button ${selectedSlots.includes(time) ? 'selected' : ''}`} onClick={() => handleSlotClick(time)}>
              {time}
            </button>
          ))}
        </div>
      )}
      <button onClick={saveSlots} className="save-button" disabled={!selectedDate || selectedSlots.length === 0}>
        Save Slots for {selectedDate}
      </button>

      <div className="filter-bar">
        <h3>Your Scheduled Slots</h3>
        <select value={filterDate} onChange={e => setFilterDate(e.target.value)} className="filter-dropdown">
          <option value="All">Show All Dates</option>
          {[...new Set(allSlots.map(slot => slot.date))].sort().map(date => (
            <option key={date} value={date}>{new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</option>
          ))}
        </select>
      </div>

      <table className="slots-table">
        <thead><tr><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={4}>Loading slots...</td></tr>
          ) : filteredSlots.length > 0 ? (
            filteredSlots.map(slot => (
              <tr key={slot.id}>
                <td>{new Date(slot.date).toLocaleDateString()}</td>
                <td>{slot.time}</td>
                <td><span className={`status-badge ${slot.status.toLowerCase()}`}>{slot.status}</span></td>
                <td>
                  <button className="cancel-button" onClick={() => cancelSlot(slot.id)} disabled={slot.status !== 'Available'}>Cancel</button>
                  <button className="delete-button" onClick={() => deleteSlot(slot.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={4}>No slots found for the selected date.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

