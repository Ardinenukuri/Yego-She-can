"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InviteMentorPage;
const react_1 = require("react");
require("../mentors.css");
const fi_1 = require("react-icons/fi");
function InviteMentorPage() {
    const [email, setEmail] = (0, react_1.useState)('');
    const [message, setMessage] = (0, react_1.useState)('');
    const handleChange = (e) => {
        setEmail(e.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate sending an email invite
        console.log('Sending invite to:', email);
        setMessage(`✅ Invite sent to ${email}`);
        setEmail('');
    };
    return (<div className="invite-page">
      <h1 className="form-title">Invite Mentor</h1>

      {message && <p className="success-message">{message}</p>}

      <form className="invite-form" onSubmit={handleSubmit}>
        <label>
          Mentor Email:
          <input type="email" value={email} onChange={handleChange} required placeholder="Enter mentor's email"/>
        </label>

        <button type="submit" className="invite-btn">
          <fi_1.FiSend /> Send Invite
        </button>
      </form>
    </div>);
}
