// "use client";

// import { useState, ChangeEvent, FormEvent } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import './settings.css'; 

// interface SettingsFormData {
//   username: string;
//   firstName: string;
//   lastName: string;
//   email: string; 
//   location: string;
//   bio: string;
//   profile_picture_url?: string;
// }

// export default function SettingsPage() {
//   const [formData, setFormData] = useState<SettingsFormData>({
//     username: 'johndoe',
//     firstName: 'John',
//     lastName: 'Doe',
//     email: 'john.doe@example.com',
//     location: 'Kigali, Rwanda',
//     bio: 'Software developer passionate about technology and innovation.',
//     profile_picture_url: '',
//   });
//   const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
//   const [isSaving, setIsSaving] = useState(false);

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setProfilePictureFile(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setIsSaving(true);

//     // Simulate saving
//     setTimeout(() => {
//       setIsSaving(false);
//       alert('Settings updated successfully!');
//     }, 1000);
//   };

//   return (
//     <div className="settings-page-container">
//       <div className="settings-card">
//         <div className="settings-header">
//           {formData.profile_picture_url && (
//             <Image
//                 src={formData.profile_picture_url}
//                 alt="Profile Picture"
//                 width={80}
//                 height={80}
//                 className="profile-avatar"
//             />
//           )}
//           <div>
//             <h1 className="settings-title">My Profile & Settings</h1>
//             <p className="settings-subtitle">Update your personal information, profile, and password.</p>
//           </div>
//         </div>
        
//         <form className="settings-form" onSubmit={handleSubmit}>
//           <div className="form-row">
//             <div className="input-group">
//               <label htmlFor="firstName">First Name</label>
//               <input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
//             </div>
//             <div className="input-group">
//               <label htmlFor="lastName">Last Name</label>
//               <input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
//             </div>
//           </div>
//           <div className="form-row">
//             <div className="input-group">
//               <label htmlFor="username">Username</label>
//               <input id="username" name="username" value={formData.username} onChange={handleChange} />
//             </div>
//             <div className="input-group">
//               <label htmlFor="email">Email Address</label>
//               <input id="email" name="email" value={formData.email} onChange={handleChange} disabled />
//               <small>Email address cannot be changed.</small>
//             </div>
//           </div>
//           <div className="input-group">
//             <label htmlFor="location">Location</label>
//             <input id="location" name="location" placeholder="e.g., Kigali, Rwanda" value={formData.location} onChange={handleChange} />
//           </div>
//           <div className="input-group">
//             <label htmlFor="bio">Bio / Expertise</label>
//             <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} placeholder="Tell us a little about yourself..."></textarea>
//           </div>
//           <div className="input-group">
//             <label htmlFor="profilePicture">Update Profile Picture</label>
//             <input id="profilePicture" type="file" name="profilePicture" accept="image/*" onChange={handleFileChange} className="file-input"/>
//           </div>

//           <div className="form-actions">
//             <Link href="/dashboard/change-password">
//               <button type="button" className="secondary-btn">Change Password</button>
//             </Link>
//             <button type="submit" className="primary-btn" disabled={isSaving}>
//               {isSaving ? 'Saving...' : 'Save Changes'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }





'use client'
import React from 'react'
import './settings.css'

export default function Settingspage ()  {
  return (
    <div className="settings-container">
    <h2 className="settings-title">Settings</h2>
    
    <div className="settings-grid">
      <section className="card">
        <h3 className="card-title">Profile Information</h3>
        <div className="profile-grid">
          <div>
            <label className="input-label">First Name</label>
            <input type="text" className="input" defaultValue="Miss" />
          </div>
          <div>
            <label className="input-label">Last Name</label>
            <input type="text" className="input" defaultValue="Jane" />
          </div>
          <div>
            <label className="input-label">User Name</label>
            <input type="text" className="input" defaultValue="Miss Jane" />
          </div>
          
          <div>
            <label className="input-label">Email</label>
            <input type="email" className="input" defaultValue="janek@example.com" />
          </div>
          {/* <div className="full-width">
            <label className="input-label">Bio</label>
            <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} placeholder="Tell us a little about yourself..."></textarea>
            <textarea className="textarea" rows="3" defaultValue="Experienced software developer and mentor with 10+ years in the industry."></textarea>
          </div> */}
        </div>
      </section>
      

      
      <section className="card">
        <h3 className="card-title">Notification Preferences</h3>
        <div className="notification-list">
          {[
            { title: "Email Notifications", desc: "Receive notifications via email", active: true },
            { title: "Student Messages", desc: "Get notified when students send messages", active: true },
            { title: "Course Updates", desc: "Updates about your courses", active: false },
          ].map(({ title, desc, active }, i) => (
            <div className="notification-item" key={i}>
              <div>
                <h4 className="notification-title">{title}</h4>
                <p className="notification-desc">{desc}</p>
              </div>
              <button className={`toggle-button ${active ? 'active' : ''}`}>
                <div className="toggle-knob"></div>
              </button>
            </div>
          ))}
        </div>
      </section>
      
      <div className="actions">
        <button className="save-button">
          Save Changes
        </button>
      </div>
    </div>
  </div>
  )
}
