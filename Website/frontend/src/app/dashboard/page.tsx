"use client";

import React, { useState, useMemo } from "react";
import {
  FiBook,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiUsers,
} from "react-icons/fi";
import "./dashboard.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

export default function DashboardHome() {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Accounting & Finance Fundamentals",
      mentorName: "Alice Uwimana",
      mentorStatus: "assigned",
    },
    {
      id: 2,
      title: "Sales & Customer Relations",
      mentorName: "",
      mentorStatus: "not-assigned",
    },
    {
      id: 3,
      title: "Marketing & Brand Building",
      mentorName: "Jean Bosco",
      mentorStatus: "pending",
    },
    {
      id: 4,
      title: "Design Thinking & Innovation",
      mentorName: "",
      mentorStatus: "not-assigned",
    },
    {
      id: 5,
      title: "Entrepreneurship Basics",
      mentorName: "Clare Niyonsaba",
      mentorStatus: "assigned",
    },
    {
      id: 6,
      title: "Team Leadership",
      mentorName: "Jean Bosco",
      mentorStatus: "assigned",
    },
    {
      id: 7,
      title: "Time Management",
      mentorName: "",
      mentorStatus: "not-assigned",
    },
    {
      id: 8,
      title: "Digital Marketing",
      mentorName: "Alice Uwimana",
      mentorStatus: "pending",
    },
  ]);
  const [students] = useState([
    {
      id: 1,
      name: "Diane Ingabire",
      enrolledCourse: "Digital Marketing",
      mentor: "Alice Uwimana",
      progress: 60,
    },
    {
      id: 2,
      name: "Eric Nzeyimana",
      enrolledCourse: "Entrepreneurship Basics",
      mentor: "Clare Niyonsaba",
      progress: 100,
    },
  ]);

  const [studentSearchTerm, setStudentSearchTerm] = useState("");

  const filteredStudents = useMemo(() => {
    return students.filter((student) =>
      student.name.toLowerCase().includes(studentSearchTerm.toLowerCase())
    );
  }, [students, studentSearchTerm]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const itemsPerPage = 5;

  const filteredCourses = useMemo(() => {
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.mentorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const confirmDelete = (id: number) => setCourseToDelete(id);

  const handleConfirmDelete = () => {
    if (courseToDelete !== null) {
      setCourses((prev) =>
        prev.filter((course) => course.id !== courseToDelete)
      );
      setCourseToDelete(null);
    }
  };

  const handleCancelDelete = () => setCourseToDelete(null);

  const [mentors, setMentors] = useState([
    { name: "Alice Uwimana", status: "Active", assignedCourses: 2 },
    { name: "Jean Bosco", status: "pending", assignedCourses: 2 },
    { name: "Clare Niyonsaba", status: "Active", assignedCourses: 1 },
    { name: "Eric Mugisha", status: "Inactive", assignedCourses: 0 },
    { name: "Olivia Iradukunda", status: "pending", assignedCourses: 1 },
    { name: "Sam Dusabe", status: "Active", assignedCourses: 3 },
  ]);
  const [mentorSearchTerm, setMentorSearchTerm] = useState("");
  const [currentMentorPage, setCurrentMentorPage] = useState(1);
  const [mentorToDelete, setMentorToDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<string>("");
  const mentorItemsPerPage = 5;

  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor) =>
      mentor.name.toLowerCase().includes(mentorSearchTerm.toLowerCase())
    );
  }, [mentors, mentorSearchTerm]);

  const totalMentorPages = Math.ceil(
    filteredMentors.length / mentorItemsPerPage
  );
  const paginatedMentors = filteredMentors.slice(
    (currentMentorPage - 1) * mentorItemsPerPage,
    currentMentorPage * mentorItemsPerPage
  );

  const handleMentorDelete = (name: string) => setMentorToDelete(name);

  const handleConfirmMentorDelete = () => {
    if (mentorToDelete) {
      setMentors((prev) => prev.filter((m) => m.name !== mentorToDelete));
      setToast(`Mentor "${mentorToDelete}" deleted.`);
      setMentorToDelete(null);
      setTimeout(() => setToast(""), 3000);
    }
  };

  const handleCancelMentorDelete = () => setMentorToDelete(null);

  const toggleMentorStatus = (name: string) => {
    setMentors((prev) =>
      prev.map((m) =>
        m.name === name
          ? {
              ...m,
              status: m.status === "Active" ? "Inactive" : "Active",
            }
          : m
      )
    );
    setToast(`Mentor "${name}" status updated.`);
    setTimeout(() => setToast(""), 3000);
  };

  const mentorStatusData = [
    {
      name: "Active",
      value: mentors.filter((m) => m.status === "Active").length,
      color: "#219653",
    },
    {
      name: "Inactive",
      value: mentors.filter((m) => m.status === "Inactive").length,
      color: "#c62828",
    },
    {
      name: "Pending",
      value: mentors.filter((m) => m.status === "pending").length,
      color: "#f9a825",
    },
  ];
  const courseMentorStatusData = [
    {
      name: "Assigned",
      value: courses.filter((course) => course.mentorStatus === "assigned")
        .length,
    },
    {
      name: "Pending",
      value: courses.filter((course) => course.mentorStatus === "pending")
        .length,
    },
    {
      name: "Not Assigned",
      value: courses.filter((course) => course.mentorStatus === "not-assigned")
        .length,
    },
  ];

  return (
    <div className="dashboard-container">
      {toast && <div className="toast-message">{toast}</div>}
      <h1 className="dashboard-title">
        Welcome to your dashboard, Yego SheCan!
      </h1>

      <div className="dashboard-count-wrapper">
        <div className="course-count-card">
          <FiBook className="card-icon" />
          <span>Number of Courses: {courses.length}</span>
        </div>

        <div className="course-count-card">
          <FiUsers className="card-icon" />
          <span>Number of Mentors: {mentors.length}</span>
        </div>
      </div>

      <div className="dashboard-analytics-row">
        {/* Mentor Status Pie Chart */}
        <div className="dashboard-chart-box">
          <h3 className="dashboard-graph-title">Mentor Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={mentorStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {mentorStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Course Assignment Bar Chart */}
        <div className="dashboard-chart-box">
          <h3 className="dashboard-graph-title">Course Mentor Assignment</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={courseMentorStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" style={{ fontSize: "0.75rem" }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#7c34ab" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <table className="course-table">
        <thead>
          <tr>
            <th>
              <div className="table-header">
                <FiBook className="table-icon" />
                Course
              </div>
            </th>
            <th>
              <span className="table-header">Assigned Mentor</span>
            </th>
            <th>
              <span className="table-header">Mentor Status</span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCourses.map((course) => (
            <tr key={course.id}>
              <td>
                <div className="course-name">
                  <FiBook className="table-icon" />
                  <span>{course.title}</span>
                </div>
              </td>
              <td>{course.mentorName || "—"}</td>
              <td>
                <span className={`mentor-status ${course.mentorStatus}`}>
                  {course.mentorStatus.replace("-", " ")}
                </span>
              </td>
              <td>
                <div className="course-actions">
                  <button
                    className="action-icon delete-icon"
                    title="Delete"
                    onClick={() => confirmDelete(course.id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {courseToDelete !== null && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this course?</p>
            <div className="modal-actions">
              <button
                className="modal-button cancel"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="modal-button confirm"
                onClick={handleConfirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="dashboard-subtitle">Mentors Overview</h2>

      <div className="dashboard-controls">
        <input
          type="text"
          placeholder="Search mentors..."
          className="search-input"
          value={mentorSearchTerm}
          onChange={(e) => setMentorSearchTerm(e.target.value)}
        />
      </div>

      <table className="course-table">
        <thead>
          <tr>
            <th>
              <div className="table-header">
                <FiBook className="table-icon" />
                Mentor Name
              </div>
            </th>
            <th>
              <span className="table-header">Assigned Courses</span>
            </th>
            <th>
              <span className="table-header">Status</span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedMentors.map((mentor, index) => (
            <tr key={index}>
              <td>{mentor.name}</td>
              <td>{mentor.assignedCourses}</td>
              <td>
                <span className={`mentor-status ${mentor.status}`}>
                  {mentor.status}
                </span>
              </td>
              <td>
                <div className="course-actions">
                  <button
                    className="action-icon"
                    title={
                      mentor.status === "Active"
                        ? "Disable Mentor"
                        : "Enable Mentor"
                    }
                    onClick={() => toggleMentorStatus(mentor.name)}
                  >
                    {mentor.status === "Active" ? (
                      <FiToggleLeft />
                    ) : (
                      <FiToggleRight />
                    )}
                  </button>
                  <button
                    className="action-icon delete-icon"
                    title="Delete Mentor"
                    onClick={() => handleMentorDelete(mentor.name)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentMentorPage((p) => Math.max(p - 1, 1))}
          disabled={currentMentorPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentMentorPage} of {totalMentorPages}
        </span>
        <button
          onClick={() =>
            setCurrentMentorPage((p) => Math.min(p + 1, totalMentorPages))
          }
          disabled={currentMentorPage === totalMentorPages}
        >
          Next
        </button>
      </div>

      {mentorToDelete !== null && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to delete mentor{" "}
              <strong>{mentorToDelete}</strong>?
            </p>
            <div className="modal-actions">
              <button
                className="modal-button cancel"
                onClick={handleCancelMentorDelete}
              >
                Cancel
              </button>
              <button
                className="modal-button confirm"
                onClick={handleConfirmMentorDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>

        </div>
      )}
       <h2 className="dashboard-subtitle">Student Overview</h2>

     <table className="course-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Enrolled Course</th>
            <th>Mentor</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.enrolledCourse}</td>
              <td>{student.mentor || "Not Assigned"}</td>
              <td>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${student.progress}%` }}
                  ></div>
                  <span className="progress-text">{student.progress}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


    </div>
  );
}
