"use client";

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Link from 'next/link';
import './change-password.css'; 

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    previousPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error("New passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.put('/api/auth/change-password', {
        previousPassword: formData.previousPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword,
      });

      toast.success(response.data.message || 'Password changed successfully!');
      
      router.push('/dashboard/settings');

    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.message ||
        error.response?.data?.message ||
        'An unknown error occurred.';

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <h1 className="change-password-title">Change Your Password</h1>
        <p className="change-password-subtitle">
          Enter your current password and a new password to secure your account.
        </p>

        <form className="change-password-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="previousPassword">Current Password</label>
            <input
              id="previousPassword"
              name="previousPassword"
              type="password"
              required
              value={formData.previousPassword}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              value={formData.newPassword}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmNewPassword">Confirm New Password</label>
            <input
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              required
              value={formData.confirmNewPassword}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <Link href="/dashboard/settings">
              <button type="button" className="secondary-btn">Cancel</button>
            </Link>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}