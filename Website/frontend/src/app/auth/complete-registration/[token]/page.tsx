// src/app/auth/complete-registration/[token]/page.tsx
"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Link from 'next/link';
import '../complete-registration.css'; // Import CSS from the parent directory

export default function CompleteRegistrationPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const token = params.token as string; // Get the token from the URL

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      await api.put(`/api/auth/complete-registration/${token}`, formData);
      
      toast.success('Registration completed successfully! You can now log in.');
      router.push('/login');

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. The link may be invalid or expired.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complete-registration-container">
      <form className="complete-registration-form" onSubmit={handleSubmit}>
        <h2 className="complete-registration-title">Complete Your Account</h2>
        <p className="complete-registration-subtitle">
          Welcome to Yego SheCan! Set up your mentor profile.
        </p>

        <div className="complete-registration-input-group">
          <label htmlFor="firstName" className="complete-registration-label">First Name</label>
          <input id="firstName" name="firstName" type="text" className="complete-registration-input" required value={formData.firstName} onChange={handleChange} />
        </div>
        
        <div className="complete-registration-input-group">
          <label htmlFor="lastName" className="complete-registration-label">Last Name</label>
          <input id="lastName" name="lastName" type="text" className="complete-registration-input" required value={formData.lastName} onChange={handleChange} />
        </div>

        <div className="complete-registration-input-group">
          <label htmlFor="username" className="complete-registration-label">Username</label>
          <input id="username" name="username" type="text" className="complete-registration-input" required value={formData.username} onChange={handleChange} />
        </div>
        
        <div className="complete-registration-input-group">
          <label htmlFor="password" className="complete-registration-label">Password</label>
          <input id="password" name="password" type="password" className="complete-registration-input" required value={formData.password} onChange={handleChange} />
        </div>
        
        <div className="complete-registration-input-group">
          <label htmlFor="confirmPassword" className="complete-registration-label">Confirm Password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" className="complete-registration-input" required value={formData.confirmPassword} onChange={handleChange} />
        </div>

        <button type="submit" className="complete-registration-button" disabled={loading}>
          {loading ? 'Completing...' : 'Complete Registration'}
        </button>
        
        <p className="complete-registration-footer">
          Received this in error?{' '}
          <Link href="/login" className="complete-registration-link">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}