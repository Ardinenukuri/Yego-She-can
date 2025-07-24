'use client';
import React, { useState, ChangeEvent } from 'react';
import './availability.css';

interface Slot {
  id: number;
  day: string;
  time: string;
}

const AvailabilityPage: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [newSlot, setNewSlot] = useState({ day: '', time: '' });

  const addSlot = () => {
    if (newSlot.day && newSlot.time) {
      setSlots([...slots, { id: Date.now(), ...newSlot }]);
      setNewSlot({ day: '', time: '' });
    }
  };

  const removeSlot = (id: number) => {
    setSlots(slots.filter(slot => slot.id !== id));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSlot(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="availability-container">
      <div className="availability-card">
        <h2 className="availability-title">Set Your Availability</h2>
        <div className="input-row">
          <input
            type="text"
            name="day"
            placeholder="Day (e.g., Monday)"
            value={newSlot.day}
            onChange={handleInputChange}
            className="input-field"
          />
          <input
            type="time"
            name="time"
            value={newSlot.time}
            onChange={handleInputChange}
            className="input-field"
          />
          <button onClick={addSlot} className="add-button">Add</button>
        </div>
        <ul className="slots-list">
          {slots.map(slot => (
            <li key={slot.id} className="slot-item">
              <span>{slot.day} - {slot.time}</span>
              <button onClick={() => removeSlot(slot.id)} className="remove-button">Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AvailabilityPage;
