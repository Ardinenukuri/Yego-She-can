"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminSettingsPage;
const react_1 = require("react");
require("./settings.css");
function AdminSettingsPage() {
    const [form, setForm] = (0, react_1.useState)({
        name: 'Afua Hamissi',
        email: 'lyhamissi@gmail.com',
        password: '',
        confirmPassword: '',
    });
    const [message, setMessage] = (0, react_1.useState)('');
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.password && form.password !== form.confirmPassword) {
            setMessage('❌ Passwords do not match.');
            return;
        }
        // Simulate saving settings
        console.log('Saving settings:', form);
        setMessage('✅ Settings updated successfully!');
    };
    return (<div className="settings-page">
      <h1 className="form-title">Admin Settings</h1>

      {message && <p className="success-message">{message}</p>}

      <form className="settings-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={form.name} onChange={handleChange} required/>
        </label>

        <label>
          Email:
          <input type="email" name="email" value={form.email} onChange={handleChange} required/>
        </label>

        <label>
          New Password:
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Leave empty to keep current password"/>
        </label>

        <label>
          Confirm New Password:
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat new password"/>
        </label>

        <button type="submit" className="settings-btn">Save Changes</button>
      </form>
    </div>);
}
