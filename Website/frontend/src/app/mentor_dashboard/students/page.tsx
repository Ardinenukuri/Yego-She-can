"use client"




import { Search, Filter } from 'lucide-react';
import './students.css';

const students = [
    { id: 1, name: 'Afua Hamissi', progress: 78, enrolled: '2024-01-15', lastActive: '2 hours ago' },
    { id: 2, name: 'Diane Ingabire', progress: 95, enrolled: '2024-01-10', lastActive: '1 day ago' },
    { id: 3, name: 'Ardine Niyokuri', progress: 34, enrolled: '2024-01-20', lastActive: '3 days ago' },
    { id: 4, name: 'Moreen Iraba', progress: 67, enrolled: '2024-01-12', lastActive: '5 hours ago' }
  ];

export default function StudentsPage() {
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
                {/* <th>Course</th> */}
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
                  {/* <td>{student.course}</td> */}
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
                    <button className="action-btn">View Profile</button>
                    <button className="action-btn">Message</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
