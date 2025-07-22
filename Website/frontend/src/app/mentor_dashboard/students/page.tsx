'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import './students.css';


type Student = {
  id: number;
  name: string;
  progress: number;
  enrolled: string;
  lastActive: string;
};


const students = [
  { id: 1, name: 'Afua Hamissi', progress: 78, enrolled: '2024-01-15', lastActive: '2 hours ago' },
  { id: 2, name: 'Diane Ingabire', progress: 95, enrolled: '2024-01-10', lastActive: '1 day ago' },
  { id: 3, name: 'Ardine Niyokuri', progress: 34, enrolled: '2024-01-20', lastActive: '3 days ago' },
  { id: 4, name: 'Moreen Iraba', progress: 67, enrolled: '2024-01-12', lastActive: '5 hours ago' },
];

export default function StudentsPage() {
  const [showModal, setShowModal] = useState(false);
  // const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

const openModal = (student: Student) => {
  setSelectedStudent(student);
  setShowModal(true);
};

 

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setMessage('');
  };

  const handleSendMessage = () => {
    alert(`Message sent to ${selectedStudent!.name}: ${message}`);
    closeModal();
  };
  

  return (
    <div className="container">
      <div className="header">
        <h2 className="title">Students</h2>
        <div className="search-filter">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input type="text" placeholder="Search students..." className="search-input" />
          </div>
          <button className="filter-button">
            <Filter className="filter-icon" />
            Filter
          </button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-scroll">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Progress</th>
                <th>Enrolled</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="student-cell">
                      <div className="student-avatar">
                        <span>{student.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div className="student-name">{student.name}</div>
                    </div>
                  </td>
                  <td>
                    <div className="progress-bar-wrapper">
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${student.progress}%` }}></div>
                      </div>
                      <span>{student.progress}%</span>
                    </div>
                  </td>
                  <td>{student.enrolled}</td>
                  <td>{student.lastActive}</td>
                  <td>
                    <button className="action-btn" onClick={() => openModal(student)}>Message</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedStudent && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Message {selectedStudent.name}</h3>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
            ></textarea>
            <div className="modal-buttons">
              <button onClick={handleSendMessage} className="send-btn">Send</button>
              <button onClick={closeModal} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
