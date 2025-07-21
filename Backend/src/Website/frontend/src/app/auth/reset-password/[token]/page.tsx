"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Link from 'next/link';
import '../reset-password.css';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      await api.put(`/api/auth/reset-password/${token}`, { 
          newPassword: password,
          confirmNewPassword: confirmPassword 
      });
      toast.success('Password reset successfully! You can now log in.');
      router.push('/auth/login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.errors?.[0]?.message || 'Password reset failed.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <h2 className="reset-password-title">Set a New Password</h2>
        <p className="reset-password-subtitle">
          Please enter and confirm your new password below.
        </p>

        <div className="reset-password-input-group">
          <label htmlFor="password" className="reset-password-label">New Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="reset-password-input"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="reset-password-input-group">
          <label htmlFor="confirmPassword" className="reset-password-label">Confirm New Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="reset-password-input"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="reset-password-button" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
        
        <p className="reset-password-footer">
          <Link href="/login" className="reset-password-link">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}