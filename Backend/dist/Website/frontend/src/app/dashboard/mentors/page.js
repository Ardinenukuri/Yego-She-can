"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MentorsPage;
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const fi_1 = require("react-icons/fi");
require("./mentors.css");
const ITEMS_PER_PAGE = 5;
function MentorsPage() {
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const [mentors, setMentors] = (0, react_1.useState)([
        {
            id: 1,
            name: 'Diane Ingabire',
            email: 'dianeingabire@gmail.com',
            expertise: 'Accounting',
            status: 'Pending',
            image: '/2148761757.jpg',
        },
        {
            id: 2,
            name: 'Grace Mbabazi',
            email: 'grace@example.com',
            expertise: 'Sales & Marketing',
            status: 'Pending',
            image: '/2148761757.jpg',
        },
        {
            id: 3,
            name: 'Janet Mukamana',
            email: 'janet@example.com',
            expertise: 'Design Thinking',
            status: 'Active',
            image: '/2148761757.jpg',
        },
    ]);
    const filteredMentors = mentors.filter((mentor) => mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.expertise.toLowerCase().includes(searchQuery.toLowerCase()));
    const totalPages = Math.ceil(filteredMentors.length / ITEMS_PER_PAGE);
    const paginatedMentors = filteredMentors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    return (<div className="mentors-page">
      <div className="mentors-header">
        <h1>Manage Mentors</h1>
        <link_1.default href="/dashboard/mentors/invite">
          <button className="invite-mentor-btn">
            <fi_1.FiUserPlus /> Invite Mentor
          </button>
        </link_1.default>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search by name, email, or expertise..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
      </div>

      <table className="mentors-table">
        <thead>
          <tr>
            <th>Profile</th>
            <th>Name</th>
            <th>Email</th>
            <th>Expertise</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedMentors.map((mentor) => (<tr key={mentor.id}>
              <td>
                <img src={mentor.image} alt={mentor.name} className="mentor-img"/>
              </td>
              <td>{mentor.name}</td>
              <td>
                <fi_1.FiMail className="table-icon"/> {mentor.email}
              </td>
              <td>{mentor.expertise}</td>
              <td>
                <span className={`mentor-status ${mentor.status.toLowerCase()}`}>
                  {mentor.status}
                </span>
              </td>
              <td>
                <div className="mentor-actions">
                  <button className="view-btn">
                    <fi_1.FiEye className="table-icon"/> View
                  </button>
                  <button className="delete-btn">
                    <fi_1.FiTrash2 className="table-icon"/> Remove
                  </button>
                </div>
              </td>
            </tr>))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (<div className="pagination-controls">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>)}
    </div>);
}
