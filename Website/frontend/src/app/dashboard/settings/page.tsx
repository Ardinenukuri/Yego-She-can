"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import './settings.css'; 


interface SettingsFormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string; 
  location: string;
  bio: string;
  profile_picture_url?: string;
}

export default function SettingsPage() {
  const { user } = useAuth(); 
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


  useEffect(() => {
    if (user) {
      api.get('/api/auth/profile')
        .then(response => {
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
        .catch(err => {
          console.error("Failed to fetch profile", err);
          toast.error("Could not load your profile data.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

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
      toast.success('Settings updated successfully!');
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
      console.error("Failed to update profile", error);
      toast.error('Failed to update settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="settings-container"><p>Loading your settings...</p></div>;
  }

  return (
    <div className="settings-page-container">
      <div className="settings-card">
        <div className="settings-header">
          {formData.profile_picture_url && (
            <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${formData.profile_picture_url}`}
                alt="Profile Picture"
                width={80}
                height={80}
                className="profile-avatar"
            />
          )}
          <div>
            <h1 className="settings-title">My Profile & Settings</h1>
            <p className="settings-subtitle">Update your personal information, profile, and password.</p>
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
            <input id="profilePicture" type="file" name="profilePicture" accept="image/*" onChange={handleFileChange} className="file-input"/>
          </div>

          <div className="form-actions">
            <Link href="/dashboard/change-password">
              <button type="button" className="secondary-btn">Change Password</button>
            </Link>
            <button type="submit" className="primary-btn" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}