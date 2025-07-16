"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  FiBook,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiUsers,
} from "react-icons/fi";
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
import toast from 'react-hot-toast';
import api from "@/lib/api";
import "./dashboard.css";


interface Course {
  id: number;
  title: string;
  mentorId: number | null;
  mentorName: string;
  mentorStatus: 'assigned' | 'pending' | 'not-assigned';
}
interface Mentor {
  id: number;
  name: string;
  status: 'Active' | 'Inactive' | 'pending';
  assignedCourses: number;
}
interface Student {
  id: number;
  name: string;
  enrolledCourse: string;
  mentor: string;
  progress: number;
}
interface Kpis {
  totalCourses: string;
  activeMentors: string;
  enrolledStudents: string;
}

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [kpis, setKpis] = useState<Kpis>({ totalCourses: '0', activeMentors: '0', enrolledStudents: '0' });


  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [mentorToModify, setMentorToModify] = useState<Mentor | null>(null);
  const [modificationType, setModificationType] = useState<'delete' | 'toggle' | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [courseFilter, setCourseFilter] = useState("all");
  const [courseSort, setCourseSort] = useState("az");
  const itemsPerPage = 5;
  const [mentorSearchTerm, setMentorSearchTerm] = useState("");
  const [currentMentorPage, setCurrentMentorPage] = useState(1);
  const mentorItemsPerPage = 5;
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [studentFilter, setStudentFilter] = useState("all");
  const [studentSort, setStudentSort] = useState("name");
  const [currentStudentPage, setCurrentStudentPage] = useState(1);
  const studentItemsPerPage = 5;


  const fetchData = async () => {
    try {
      const response = await api.get('/api/dashboard');
      const data = response.data;
      setKpis(data.kpis);
      setCourses(data.courses);
      setMentors(data.mentors);
      setStudents(data.students);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
      toast.error("Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleConfirmCourseDelete = async () => {
    if (!courseToDelete) return;
    const toastId = toast.loading("Deleting course...");
    try {
      await api.delete(`/api/courses/${courseToDelete.id}`);
      toast.success(`Course "${courseToDelete.title}" deleted.`, { id: toastId });
      fetchData();
    } catch (error) {
      toast.error("Failed to delete course.", { id: toastId });
    } finally {
      setCourseToDelete(null);
    }
  };

  const handleConfirmMentorModification = async () => {
    if (!mentorToModify) return;
    const action = modificationType === 'delete' ? 'Deleting' : 'Updating';
    const toastId = toast.loading(`${action} mentor...`);
    try {
      if (modificationType === 'delete') {
        await api.delete(`/api/users/${mentorToModify.id}`);
        toast.success(`Mentor "${mentorToModify.name}" deleted.`, { id: toastId });
      } else if (modificationType === 'toggle') {
        const newStatus = mentorToModify.status === 'Active' ? 'disabled' : 'active';
        await api.put(`/api/users/${mentorToModify.id}`, { status: newStatus });
        toast.success(`Mentor "${mentorToModify.name}" status updated.`, { id: toastId });
      }
      fetchData();
    } catch (error) {
      toast.error(`Failed to ${modificationType} mentor.`, { id: toastId });
    } finally {
      setMentorToModify(null);
      setModificationType(null);
    }
  };


  const filteredCourses = useMemo(() => {
    let result = [...courses];
    if (courseFilter !== "all") result = result.filter(course => course.mentorStatus === courseFilter);
    if (searchTerm) result = result.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.mentorName.toLowerCase().includes(searchTerm.toLowerCase()));
    result.sort((a, b) => courseSort === "az" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
    return result;
  }, [courses, searchTerm, courseFilter, courseSort]);

  const filteredMentors = useMemo(() => {
    return mentors.filter(mentor => mentor.name.toLowerCase().includes(mentorSearchTerm.toLowerCase()));
  }, [mentors, mentorSearchTerm]);

  const filteredStudents = useMemo(() => {
    let result = [...students];
    if (studentFilter === "above50") result = result.filter(s => s.progress > 50);
    if (studentSearchTerm) result = result.filter(student => student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()));
    result.sort((a, b) => {
      if (studentSort === "name") return a.name.localeCompare(b.name);
      if (studentSort === "progress") return b.progress - a.progress;
      return 0;
    });
    return result;
  }, [students, studentSearchTerm, studentFilter, studentSort]);


  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalMentorPages = Math.ceil(filteredMentors.length / mentorItemsPerPage);
  const paginatedMentors = filteredMentors.slice((currentMentorPage - 1) * mentorItemsPerPage, currentMentorPage * mentorItemsPerPage);
  const totalStudentPages = Math.ceil(filteredStudents.length / studentItemsPerPage);

  const mentorStatusData = useMemo(() => [
    { name: "Active", value: mentors.filter(m => m.status === 'Active').length, color: "#cfc4efff" },
    { name: "Inactive", value: mentors.filter(m => m.status === 'Inactive').length, color: "gray" },
    { name: "Pending", value: mentors.filter(m => m.status === 'pending').length, color: "#e025f9ff" }
  ], [mentors]);

  const courseMentorStatusData = useMemo(() => [
    { name: "Assigned", value: courses.filter(c => c.mentorStatus === 'assigned').length },
    { name: "Pending", value: courses.filter(c => c.mentorStatus === 'pending').length },
    { name: "Not Assigned", value: courses.filter(c => c.mentorStatus === 'not-assigned').length }
  ], [courses]);

  const percentAssigned = useMemo(() => {
    const total = courses.length;
    if (total === 0) return "0.0";
    const assigned = courses.filter(c => c.mentorStatus === "assigned").length;
    return ((assigned / total) * 100).toFixed(1);
  }, [courses]);

  const avgProgress = useMemo(() => {
    if (students.length === 0) return "0";
    const total = students.reduce((sum, s) => sum + s.progress, 0);
    return (total / students.length).toFixed(1);
  }, [students]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <h1 className="dashboard-title">Loading Dashboard...</h1>
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Fetching the latest data for you.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome to your dashboard, Yego SheCan!</h1>

      <div className="dashboard-kpi-wrapper">
        <div className="kpi-card"><FiBook className="kpi-icon" /><div className="kpi-label">Total Courses</div><div className="kpi-value">{kpis.totalCourses}</div></div>
        <div className="kpi-card"><FiUsers className="kpi-icon" /><div className="kpi-label">Active Mentors</div><div className="kpi-value">{kpis.activeMentors}</div></div>
        <div className="kpi-card"><FiUsers className="kpi-icon" /><div className="kpi-label">Enrolled Students</div><div className="kpi-value">{kpis.enrolledStudents}</div></div>
        <div className="kpi-card"><FiBook className="kpi-icon" /><div className="kpi-label">% Assigned Courses</div><div className="kpi-value">{percentAssigned}%</div></div>
        <div className="kpi-card"><FiUsers className="kpi-icon" /><div className="kpi-label">Avg. Student Progress</div><div className="kpi-value">{avgProgress}%</div></div>
      </div>

      <div className="dashboard-analytics-row">
        <div className="dashboard-chart-box">
          <h3 className="dashboard-graph-title">Mentor Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={mentorStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {mentorStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
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

      <div className="dashboard-controls">
        <h2 className="heading-name">Courses</h2>
        <div className="controls">
        <input type="text" placeholder="Search courses..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="select-filter"><option value="all">All Statuses</option><option value="assigned">Assigned</option><option value="pending">Pending</option><option value="not-assigned">Not Assigned</option></select>
        <select value={courseSort} onChange={(e) => setCourseSort(e.target.value)} className="select-filter"><option value="az">Sort A–Z</option><option value="za">Sort Z–A</option></select>
      </div>
</div>
      <table className="course-table">
        <thead>
          <tr>
            <th><FiBook className="table-icon" />Course</th>
            <th>Assigned Mentor</th>
            <th>Mentor Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCourses.map((course) => (
            <tr key={course.id}>
              <td><div className="course-name"><span>{course.title}</span></div></td>
              <td>{course.mentorName || "—"}</td>
              <td><span className={`mentor-status ${course.mentorStatus}`}>{course.mentorStatus.replace("-", " ")}</span></td>
              <td><div className="course-actions"><button className="action-icon delete-icon" title="Delete" onClick={() => setCourseToDelete(course)}><FiTrash2 /></button></div></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
      </div>

      <div className="dashboard-controls">
          <h2 className="heading-name">Mentors Overview</h2>
          <div className="controls">
        <input type="text" placeholder="Search mentors..." className="search-input" value={mentorSearchTerm} onChange={(e) => setMentorSearchTerm(e.target.value)} />
      </div>
</div>
      <table className="course-table">
        <thead>
          <tr>
            <th>Mentor Name</th>
            <th>Assigned Courses</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedMentors.map((mentor) => (
            <tr key={mentor.id}>
              <td>{mentor.name}</td>
              <td>{mentor.assignedCourses}</td>
              <td><span className={`mentor-status ${mentor.status.toLowerCase()}`}>{mentor.status}</span></td>
              <td>
                <div className="course-actions">
                  <button className="action-icon" title={mentor.status === "Active" ? "Disable Mentor" : "Enable Mentor"} onClick={() => { setMentorToModify(mentor); setModificationType('toggle'); }}>
                    {mentor.status === "Active" ? <FiToggleLeft /> : <FiToggleRight  style={{color:'#7c34ab'}}/>}
                  </button>
                  <button className="action-icon delete-icon" title="Delete Mentor" onClick={() => { setMentorToModify(mentor); setModificationType('delete'); }}>
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setCurrentMentorPage((p) => Math.max(p - 1, 1))} disabled={currentMentorPage === 1}>Previous</button>
        <span>Page {currentMentorPage} of {totalMentorPages}</span>
        <button onClick={() => setCurrentMentorPage((p) => Math.min(p + 1, totalMentorPages))} disabled={currentMentorPage === totalMentorPages}>Next</button>
      </div>


      <div className="dashboard-controls">
      <h2 className="headig-name">Student Overview</h2>
      <div className="controls">
        <input type="text" placeholder="Search students..." className="search-input" value={studentSearchTerm} onChange={(e) => setStudentSearchTerm(e.target.value)} />
        <select value={studentFilter} onChange={(e) => setStudentFilter(e.target.value)} className="select-filter"><option value="all">All Progress</option><option value="above50">Progress > 50%</option></select>
        <select value={studentSort} onChange={(e) => setStudentSort(e.target.value)} className="select-filter"><option value="name">Sort by Name</option><option value="progress">Sort by Progress</option></select>
      </div>
</div>
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
          {filteredStudents.slice((currentStudentPage - 1) * studentItemsPerPage, currentStudentPage * studentItemsPerPage).map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.enrolledCourse}</td>
              <td>{student.mentor || "Not Assigned"}</td>
              <td>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${student.progress}%` }}></div>
                  <span className="progress-text">{student.progress}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setCurrentStudentPage((p) => Math.max(p - 1, 1))} disabled={currentStudentPage === 1}>Previous</button>
        <span>Page {currentStudentPage} of {totalStudentPages}</span>
        <button onClick={() => setCurrentStudentPage((p) => Math.min(p + 1, totalStudentPages))} disabled={currentStudentPage === totalStudentPages}>Next</button>
      </div>


      {courseToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete the course "<strong>{courseToDelete.title}</strong>"?</p>
            <div className="modal-actions">
              <button className="modal-button cancel" onClick={() => setCourseToDelete(null)}>Cancel</button>
              <button className="modal-button confirm" onClick={handleConfirmCourseDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
      {mentorToModify && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Action</h2>
            <p>Are you sure you want to {modificationType} mentor <strong>{mentorToModify.name}</strong>?</p>
            <div className="modal-actions">
              <button className="modal-button cancel" onClick={() => { setMentorToModify(null); setModificationType(null); }}>Cancel</button>
              <button className="modal-button confirm" onClick={handleConfirmMentorModification}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
