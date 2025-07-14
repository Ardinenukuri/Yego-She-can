// src/app/auth/forgot-password/page.tsx
"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Link from 'next/link';
import './forgot-password.css'; // Import the new custom CSS file

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Use a loading toast for better user feedback
    const toastId = toast.loading('Sending reset link...');
    try {
      await api.post('/api/auth/forgot-password', { email });
      toast.success('If an account with that email exists, a reset link has been sent.', {
        id: toastId, // Use the same toastId to replace the loading one
      });
    } catch (error: any) {
      toast.error('An error occurred. Please try again.', {
        id: toastId, // Use the same toastId to replace the loading one
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="forgot-password-container">
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <h2 className="forgot-password-title">Forgot Your Password?</h2>
        <p className="forgot-password-subtitle">
          No worries! Enter your email below and we'll send you a link to reset it.
        </p>

        <div className="forgot-password-input-group">
            <label htmlFor="email" className="forgot-password-label">Email Address</label>
            <input
                id="email"
                name="email"
                type="email"
                className="forgot-password-input"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </div>

        <button type="submit" className="forgot-password-button" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <p className="forgot-password-footer">
          Remembered your password?{' '}
          <Link href="/auth/login" className="forgot-password-link">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}