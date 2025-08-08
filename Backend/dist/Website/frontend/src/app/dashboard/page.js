"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardHome;
const react_1 = __importStar(require("react"));
const fi_1 = require("react-icons/fi");
require("./dashboard.css");
const recharts_1 = require("recharts");
function DashboardHome() {
    const [courses, setCourses] = (0, react_1.useState)([
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
    const [students] = (0, react_1.useState)([
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
    const [studentSearchTerm, setStudentSearchTerm] = (0, react_1.useState)("");
    const [studentFilter, setStudentFilter] = (0, react_1.useState)("all");
    const [studentSort, setStudentSort] = (0, react_1.useState)("name");
    const filteredStudents = (0, react_1.useMemo)(() => {
        let result = [...students];
        // Filter
        if (studentFilter === "above50") {
            result = result.filter((s) => s.progress > 50);
        }
        // Search
        result = result.filter((student) => student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()));
        // Sort
        result.sort((a, b) => {
            if (studentSort === "name")
                return a.name.localeCompare(b.name);
            if (studentSort === "progress")
                return b.progress - a.progress;
            return 0;
        });
        return result;
    }, [students, studentSearchTerm, studentFilter, studentSort]);
    const [currentStudentPage, setCurrentStudentPage] = (0, react_1.useState)(1);
    const studentItemsPerPage = 5;
    const totalStudentPages = Math.ceil(filteredStudents.length / studentItemsPerPage);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const [courseToDelete, setCourseToDelete] = (0, react_1.useState)(null);
    const itemsPerPage = 5;
    const [courseFilter, setCourseFilter] = (0, react_1.useState)("all");
    const [courseSort, setCourseSort] = (0, react_1.useState)("az");
    const filteredCourses = (0, react_1.useMemo)(() => {
        let result = [...courses];
        // Filter
        if (courseFilter !== "all") {
            result = result.filter((course) => course.mentorStatus === courseFilter);
        }
        // Search
        result = result.filter((course) => course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.mentorName.toLowerCase().includes(searchTerm.toLowerCase()));
        // Sort
        result.sort((a, b) => {
            if (courseSort === "az")
                return a.title.localeCompare(b.title);
            if (courseSort === "za")
                return b.title.localeCompare(a.title);
            return 0;
        });
        return result;
    }, [courses, searchTerm, courseFilter, courseSort]);
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
    const paginatedCourses = filteredCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const confirmDelete = (id) => setCourseToDelete(id);
    const handleConfirmDelete = () => {
        if (courseToDelete !== null) {
            setCourses((prev) => prev.filter((course) => course.id !== courseToDelete));
            setCourseToDelete(null);
        }
    };
    const handleCancelDelete = () => setCourseToDelete(null);
    const [mentors, setMentors] = (0, react_1.useState)([
        { name: "Alice Uwimana", status: "Active", assignedCourses: 2 },
        { name: "Jean Bosco", status: "pending", assignedCourses: 2 },
        { name: "Clare Niyonsaba", status: "Active", assignedCourses: 1 },
        { name: "Eric Mugisha", status: "Inactive", assignedCourses: 0 },
        { name: "Olivia Iradukunda", status: "pending", assignedCourses: 1 },
        { name: "Sam Dusabe", status: "Active", assignedCourses: 3 },
    ]);
    const [mentorSearchTerm, setMentorSearchTerm] = (0, react_1.useState)("");
    const [currentMentorPage, setCurrentMentorPage] = (0, react_1.useState)(1);
    const [mentorToDelete, setMentorToDelete] = (0, react_1.useState)(null);
    const [toast, setToast] = (0, react_1.useState)("");
    const mentorItemsPerPage = 5;
    const filteredMentors = (0, react_1.useMemo)(() => {
        return mentors.filter((mentor) => mentor.name.toLowerCase().includes(mentorSearchTerm.toLowerCase()));
    }, [mentors, mentorSearchTerm]);
    const totalMentorPages = Math.ceil(filteredMentors.length / mentorItemsPerPage);
    const paginatedMentors = filteredMentors.slice((currentMentorPage - 1) * mentorItemsPerPage, currentMentorPage * mentorItemsPerPage);
    const handleMentorDelete = (name) => setMentorToDelete(name);
    const handleConfirmMentorDelete = () => {
        if (mentorToDelete) {
            setMentors((prev) => prev.filter((m) => m.name !== mentorToDelete));
            setToast(`Mentor "${mentorToDelete}" deleted.`);
            setMentorToDelete(null);
            setTimeout(() => setToast(""), 3000);
        }
    };
    const handleCancelMentorDelete = () => setMentorToDelete(null);
    const toggleMentorStatus = (name) => {
        setMentors((prev) => prev.map((m) => m.name === name
            ? Object.assign(Object.assign({}, m), { status: m.status === "Active" ? "Inactive" : "Active" }) : m));
        setToast(`Mentor "${name}" status updated.`);
        setTimeout(() => setToast(""), 3000);
    };
    const mentorStatusData = [
        {
            name: "Active",
            value: mentors.filter((m) => m.status === "Active").length,
            color: "#cfc4efff",
        },
        {
            name: "Inactive",
            value: mentors.filter((m) => m.status === "Inactive").length,
            color: "gray",
        },
        {
            name: "Pending",
            value: mentors.filter((m) => m.status === "pending").length,
            color: "#e025f9ff",
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
    const totalCourses = courses.length;
    const activeMentors = mentors.filter((m) => m.status === "Active").length;
    const enrolledStudents = students.length;
    const percentAssigned = (0, react_1.useMemo)(() => {
        const assigned = courses.filter((c) => c.mentorStatus === "assigned").length;
        return totalCourses > 0 ? ((assigned / totalCourses) * 100).toFixed(1) : "0.0";
    }, [courses]);
    const avgProgress = (0, react_1.useMemo)(() => {
        if (students.length === 0)
            return "0";
        const total = students.reduce((sum, s) => sum + s.progress, 0);
        return (total / students.length).toFixed(1);
    }, [students]);
    return (<div className="dashboard-container">
      {toast && <div className="toast-message">{toast}</div>}
      <h1 className="dashboard-title">
        Welcome to your dashboard, Yego SheCan!
      </h1>

      <div className="dashboard-kpi-wrapper">
  <div className="kpi-card">
    <fi_1.FiBook className="kpi-icon"/>
    <div className="kpi-label">Total Courses</div>
    <div className="kpi-value">{totalCourses}</div>
  </div>

  <div className="kpi-card">
    <fi_1.FiUsers className="kpi-icon"/>
    <div className="kpi-label">Active Mentors</div>
    <div className="kpi-value">{activeMentors}</div>
  </div>

  <div className="kpi-card">
    <fi_1.FiUsers className="kpi-icon"/>
    <div className="kpi-label">Enrolled Students</div>
    <div className="kpi-value">{enrolledStudents}</div>
  </div>

  <div className="kpi-card">
    <fi_1.FiBook className="kpi-icon"/>
    <div className="kpi-label">% Assigned Courses</div>
    <div className="kpi-value">{percentAssigned}%</div>
  </div>

  <div className="kpi-card">
    <fi_1.FiUsers className="kpi-icon"/>
    <div className="kpi-label">Avg. Student Progress</div>
    <div className="kpi-value">{avgProgress}%</div>
  </div>
    </div>


      <div className="dashboard-analytics-row">
        {/* Mentor Status Pie Chart */}
        <div className="dashboard-chart-box">
          <h3 className="dashboard-graph-title">Mentor Status Distribution</h3>
          <recharts_1.ResponsiveContainer width="100%" height={250}>
            <recharts_1.PieChart>
              <recharts_1.Pie data={mentorStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {mentorStatusData.map((entry, index) => (<recharts_1.Cell key={`cell-${index}`} fill={entry.color}/>))}
              </recharts_1.Pie>
              <recharts_1.Tooltip />
            </recharts_1.PieChart>
          </recharts_1.ResponsiveContainer>
        </div>

        {/* Course Assignment Bar Chart */}
        <div className="dashboard-chart-box">
          <h3 className="dashboard-graph-title">Course Mentor Assignment</h3>
          <recharts_1.ResponsiveContainer width="100%" height={250}>
            <recharts_1.BarChart data={courseMentorStatusData}>
              <recharts_1.CartesianGrid strokeDasharray="3 3"/>
              <recharts_1.XAxis dataKey="name" style={{ fontSize: "0.75rem" }}/>
              <recharts_1.YAxis allowDecimals={false}/>
              <recharts_1.Tooltip />
              <recharts_1.Legend />
              <recharts_1.Bar dataKey="value" fill="#7c34ab" radius={[4, 4, 0, 0]}/>
            </recharts_1.BarChart>
          </recharts_1.ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-controls">
  <input type="text" placeholder="Search courses..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
  <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
    <option value="all">All Statuses</option>
    <option value="assigned">Assigned</option>
    <option value="pending">Pending</option>
    <option value="not-assigned">Not Assigned</option>
  </select>
  <select value={courseSort} onChange={(e) => setCourseSort(e.target.value)}>
    <option value="az">Sort A–Z</option>
    <option value="za">Sort Z–A</option>
  </select>
    </div>

      <table className="course-table">
        <thead>
          <tr>
            <th>
              <div className="table-header">
                <fi_1.FiBook className="table-icon"/>
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
          {paginatedCourses.map((course) => (<tr key={course.id}>
              <td>
                <div className="course-name">
                  <fi_1.FiBook className="table-icon"/>
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
                  <button className="action-icon delete-icon" title="Delete" onClick={() => confirmDelete(course.id)}>
                    <fi_1.FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      {courseToDelete !== null && (<div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this course?</p>
            <div className="modal-actions">
              <button className="modal-button cancel" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="modal-button confirm" onClick={handleConfirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>)}

      <h2 className="dashboard-subtitle">Mentors Overview</h2>

      <div className="dashboard-controls">
        <input type="text" placeholder="Search mentors..." className="search-input" value={mentorSearchTerm} onChange={(e) => setMentorSearchTerm(e.target.value)}/>
      </div>

      <table className="course-table">
        <thead>
          <tr>
            <th>
              <div className="table-header">
                <fi_1.FiBook className="table-icon"/>
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
          {paginatedMentors.map((mentor, index) => (<tr key={index}>
              <td>{mentor.name}</td>
              <td>{mentor.assignedCourses}</td>
              <td>
                <span className={`mentor-status ${mentor.status}`}>
                  {mentor.status}
                </span>
              </td>
              <td>
                <div className="course-actions">
                  <button className="action-icon" title={mentor.status === "Active"
                ? "Disable Mentor"
                : "Enable Mentor"} onClick={() => toggleMentorStatus(mentor.name)}>
                    {mentor.status === "Active" ? (<fi_1.FiToggleLeft />) : (<fi_1.FiToggleRight />)}
                  </button>
                  <button className="action-icon delete-icon" title="Delete Mentor" onClick={() => handleMentorDelete(mentor.name)}>
                    <fi_1.FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setCurrentMentorPage((p) => Math.max(p - 1, 1))} disabled={currentMentorPage === 1}>
          Previous
        </button>
        <span>
          Page {currentMentorPage} of {totalMentorPages}
        </span>
        <button onClick={() => setCurrentMentorPage((p) => Math.min(p + 1, totalMentorPages))} disabled={currentMentorPage === totalMentorPages}>
          Next
        </button>
      </div>

      {mentorToDelete !== null && (<div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to delete mentor{" "}
              <strong>{mentorToDelete}</strong>?
            </p>
            <div className="modal-actions">
              <button className="modal-button cancel" onClick={handleCancelMentorDelete}>
                Cancel
              </button>
              <button className="modal-button confirm" onClick={handleConfirmMentorDelete}>
                Yes, Delete
              </button>
            </div>
          </div>

        </div>)}

      <div className="dashboard-controls">
  <input type="text" placeholder="Search students..." className="search-input" value={studentSearchTerm} onChange={(e) => setStudentSearchTerm(e.target.value)}/>
  <select value={studentFilter} onChange={(e) => setStudentFilter(e.target.value)}>
    <option value="all">All Progress</option>
    <option value="above50">Progress  50%</option>
  </select>
  <select value={studentSort} onChange={(e) => setStudentSort(e.target.value)}>
    <option value="name">Sort by Name</option>
    <option value="progress">Sort by Progress</option>
  </select>
    </div>

       

     <h2 className="dashboard-subtitle">Student Overview</h2>

    <div className="dashboard-controls">
  <input type="text" placeholder="Search students..." className="search-input" value={studentSearchTerm} onChange={(e) => setStudentSearchTerm(e.target.value)}/>
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
    {filteredStudents
            .slice((currentStudentPage - 1) * studentItemsPerPage, currentStudentPage * studentItemsPerPage)
            .map((student) => (<tr key={student.id}>
          <td>{student.name}</td>
          <td>{student.enrolledCourse}</td>
          <td>{student.mentor || "Not Assigned"}</td>
          <td>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${student.progress}%` }}></div>
              <span className="progress-text">{student.progress}%</span>
            </div>
          </td>
        </tr>))}
  </tbody>
    </table>

    <div className="pagination">
  <button onClick={() => setCurrentStudentPage((p) => Math.max(p - 1, 1))} disabled={currentStudentPage === 1}>
    Previous
  </button>
  <span>
    Page {currentStudentPage} of {totalStudentPages}
  </span>
  <button onClick={() => setCurrentStudentPage((p) => Math.min(p + 1, totalStudentPages))} disabled={currentStudentPage === totalStudentPages}>
    Next
  </button>
    </div>


    </div>);
}
