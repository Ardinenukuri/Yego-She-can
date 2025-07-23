'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { FiAward, FiDownload } from 'react-icons/fi';
import './learner.css';


interface SettingsFormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  bio: string;
  profile_picture_url?: string;
}


interface Certificate {
  id: number;
  courseName: string;
  issuedDate: string;
}

export default function SettingsPage() {
  const { user } = useAuth();
  
  // --- State management for the form ---
  const [formData, setFormData] = useState<SettingsFormData>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    bio: '',
    profile_picture_url: '',
  });

  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // --- State for certificates ---
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [certsLoading, setCertsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState<number | null>(null); // Track which cert ID is downloading

  // --- Data fetching effect ---
  useEffect(() => {
    if (user) {
      // 1. Fetch Profile Data
      setLoading(true);
      api.get('/api/auth/profile')
        .then((response) => {
          const { username, first_name, last_name, email, location, bio, profile_picture_url } = response.data;
          setFormData({
            username: username || '',
            firstName: first_name || '',
            lastName: last_name || '',
            email: email || '',
            location: location || '',
            bio: bio || '',
            profile_picture_url: profile_picture_url || '',
          });
        })
        .catch((err) => {
          console.error('Failed to fetch profile', err);
          toast.error('Could not load your profile data.');
        })
        .finally(() => setLoading(false));

      // 2. Fetch Certificates Data
      setCertsLoading(true);
      api.get('/api/certificates/my-certificates')
        .then(response => {
            setCertificates(response.data);
        })
        .catch(err => {
            console.error("Failed to fetch certificates", err);
            toast.error("Could not load your certificates.");
        })
        .finally(() => {
            setCertsLoading(false);
        });
    }
  }, [user]);

  // --- Event Handlers for the form ---
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePictureFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading('Saving changes...');

    const updateData = new FormData();
    updateData.append('username', formData.username);
    updateData.append('firstName', formData.firstName);
    updateData.append('lastName', formData.lastName);
    updateData.append('location', formData.location);
    updateData.append('bio', formData.bio);

    if (profilePictureFile) {
      updateData.append('profilePicture', profilePictureFile);
    }

    try {
      const response = await api.put('/api/auth/profile', updateData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Settings updated successfully!', { id: toastId });

      const updatedUser = response.data.user;
      setFormData({
        username: updatedUser.username || '',
        firstName: updatedUser.first_name || '',
        lastName: updatedUser.last_name || '',
        email: updatedUser.email || '',
        location: updatedUser.location || '',
        bio: updatedUser.bio || '',
        profile_picture_url: updatedUser.profile_picture_url || '',
      });
      setProfilePictureFile(null);
    } catch (error) {
      console.error('Failed to update profile', error);
      toast.error('Failed to update settings.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  // --- On-Demand PDF Download Handler ---
  const handleDownloadCertificate = async (cert: Certificate) => {
    setIsDownloading(cert.id);
    try {
        const response = await api.post('/api/certificates/download', {
            learnerName: `${formData.firstName} ${formData.lastName}`,
            courseName: cert.courseName,
            issuedDate: cert.issuedDate,
        }, {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Certificate-${cert.courseName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
        document.body.appendChild(link);
        link.click();

        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Failed to download certificate", error);
        toast.error("Could not download certificate. Please try again.");
    } finally {
        setIsDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="settings-page-container">
        <p className="loading-message">Loading your settings...</p>
      </div>
    );
  }

  return (
    <div className="settings-page-container">
      {/* Profile Settings */}
      <div className="settings-card">
        <div className="settings-header">
          {formData.profile_picture_url ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}${formData.profile_picture_url}`}
              alt="Profile Picture"
              width={80}
              height={80}
              className="profile-avatar"
            />
          ) : (
            <div className="profile-avatar-placeholder">
              <span>{formData.firstName.charAt(0)}{formData.lastName.charAt(0)}</span>
            </div>
          )}
          <div>
            <h1 className="settings-title">My Profile & Settings</h1>
            <p className="settings-subtitle">Update your personal information and profile.</p>
          </div>
        </div>

        <form className="settings-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="firstName">First Name</label>
              <input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label htmlFor="lastName">Last Name</label>
              <input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input id="username" name="username" value={formData.username} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input id="email" name="email" value={formData.email} onChange={handleChange} disabled />
              <small>Email address cannot be changed.</small>
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="location">Location</label>
            <input id="location" name="location" placeholder="e.g., Kigali, Rwanda" value={formData.location} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label htmlFor="bio">Bio / Expertise</label>
            <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} placeholder="Tell us a little about yourself..."></textarea>
          </div>
          <div className="input-group">
            <label htmlFor="profilePicture">Update Profile Picture</label>
            <input id="profilePicture" type="file" name="profilePicture" accept="image/*" onChange={handleFileChange} className="file-input" />
          </div>

          <div className="form-actions">
            <Link href="/user-dashboard/change-password">
              <button type="button" className="secondary-btn">Change Password</button>
            </Link>
            <button type="submit" className="primary-btn" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Certificates */}
      <div className="settings-card">
        <div className="settings-header">
          <FiAward className="header-icon" />
          <div>
            <h1 className="settings-title">My Certificates</h1>
            <p className="settings-subtitle">View and download certificates for your completed courses.</p>
          </div>
        </div>

        <div className="certificates-list">
          {certsLoading ? (
            <p className="loading-message">Loading certificates...</p>
          ) : certificates.length > 0 ? (
            certificates.map((cert) => (
              <div key={cert.id} className="certificate-item">
                <div className="cert-info">
                  <h3 className="cert-course-name">{cert.courseName}</h3>
                  <p className="cert-details">
                    Issued on: {new Date(cert.issuedDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="cert-actions">
                  <Link href={`/user-dashboard/components/${encodeURIComponent(formData.firstName + ' ' + formData.lastName)}?courseName=${encodeURIComponent(cert.courseName)}&issuedDate=${cert.issuedDate}`}>
                    <button className="cert-btn view-btn">
                      View Certificate
                    </button>
                  </Link>

                  <button 
                    onClick={() => handleDownloadCertificate(cert)} 
                    className="cert-btn download-btn"
                    disabled={isDownloading === cert.id}
                  >
                    <FiDownload /> {isDownloading === cert.id ? 'Preparing...' : 'Download'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-certificates-message">
              You have not earned any certificates yet. Complete a course and pass the final quiz to earn one!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}