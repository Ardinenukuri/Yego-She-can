"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AddCoursePage;
const react_1 = require("react");
require("./add.css"); // adjust the path based on your project
function AddCoursePage() {
    const [courseTitle, setCourseTitle] = (0, react_1.useState)('');
    const [mentorEmail, setMentorEmail] = (0, react_1.useState)('');
    const [courseAdded, setCourseAdded] = (0, react_1.useState)(false);
    const [mentorInvited, setMentorInvited] = (0, react_1.useState)(false);
    const handleCourseSubmit = (e) => {
        e.preventDefault();
        console.log('Course added:', courseTitle);
        setCourseTitle('');
        setCourseAdded(true);
        setTimeout(() => setCourseAdded(false), 3000);
    };
    const handleInvite = () => {
        if (!mentorEmail)
            return;
        console.log(`Sending invite to mentor: ${mentorEmail}`);
        setMentorInvited(true);
        setMentorEmail('');
        setTimeout(() => setMentorInvited(false), 3000);
    };
    return (<div className="add-course-container">
      <div className="add-course-card">
        <h1 className="add-course-title">Add New Course</h1>

        {courseAdded && <p className="success-message">✅ Course added successfully!</p>}

        <form onSubmit={handleCourseSubmit} className="add-course-form">
          <label>
            Course Name
            <input name="title" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} required placeholder="e.g. Agribusiness 101"/>
          </label>
          <button type="submit" className="submit-btn">Add Course</button>
        </form>

        <hr className="divider"/>

        <h2 className="section-title">Invite a Mentor</h2>

        {mentorInvited && <p className="success-message">✅ Invitation sent!</p>}

        <div className="mentor-invite">
          <input type="email" placeholder="Mentor email" value={mentorEmail} onChange={(e) => setMentorEmail(e.target.value)} required/>
          <button onClick={handleInvite} className="invite-btn">Invite Mentor</button>
        </div>
      </div>
    </div>);
}
