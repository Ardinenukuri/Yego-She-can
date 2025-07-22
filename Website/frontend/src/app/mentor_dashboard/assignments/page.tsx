'use client'
import React from 'react'
import './assignments.css'
// If using react-icons (Feather set)
import { FiUpload as Upload, FiPlus as Plus, FiFileText as FileText, FiBookOpen as BookOpen, FiClock as Clock, FiEye as Eye, FiEdit as Edit, FiTrash2 as Trash2 } from 'react-icons/fi';


const assignments = [
    { id: 1, title: 'Intro to Accounting', course: 'Entrepreneurship Basics', submissions: 234, dueDate: '2024-02-15', status: 'active' },
    { id: 2, title: 'Steps of Making Soaps', course: 'Soap Making Masterclass', submissions: 456, dueDate: '2024-02-10', status: 'completed' },
    { id: 3, title: 'Marketing Strategy', course: 'Marketing Fundamentals', submissions: 89, dueDate: '2024-02-20', status: 'active' },
    { id: 4, title: 'Balance Sheet', course: 'Entrepreneurship Basics', submissions: 67, dueDate: '2024-02-18', status: 'draft' }
  ];

export default function AssignmentsPage () {
  return (
    
    
        <div className="assignments-container">
          <div className="assignments-header">
            <h2>Assignments & Lessons</h2>
            <div className="action-buttons">
              <button className="upload-btn">
                <Upload className="icon" />
                Upload Material
              </button>
              <button className="create-btn">
                <Plus className="icon" />
                Create Assignment
              </button>
            </div>
          </div>
      
          <div className="assignment-list">
            {assignments.map(assignment => (
              <div key={assignment.id} className="assignment-card">
                <div className="assignment-top">
                  <div className="assignment-info">
                    <div className="assignment-icon">
                      <FileText className="icon-lg purple" />
                    </div>
                    <div>
                      <h3>{assignment.title}</h3>
                      <div className="assignment-meta">
                        <span>
                          <BookOpen className="icon-sm" /> {assignment.course}
                        </span>
                        <span>
                          <FileText className="icon-sm" /> {assignment.submissions} submissions
                        </span>
                        <span>
                          <Clock className="icon-sm" /> Due: {assignment.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="assignment-actions">
                    <span className={`status ${assignment.status}`}>
                      {assignment.status}
                    </span>
                    <button className="icon-btn">
                      <Eye className="icon-sm" />
                    </button>
                    <button className="icon-btn">
                      <Edit className="icon-sm" />
                    </button>
                    <button className="icon-btn delete">
                      <Trash2 className="icon-sm" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
      
          <div className="upload-section">
            <h3>Quick Upload</h3>
            <div className="upload-box">
              <Upload className="icon-xl" />
              <p className="upload-title">Upload course materials</p>
              <p className="upload-subtitle">Drag and drop files here, or click to browse</p>
              <button className="choose-btn">Choose Files</button>
            </div>
          </div>
        </div>
      
      
  )
}
