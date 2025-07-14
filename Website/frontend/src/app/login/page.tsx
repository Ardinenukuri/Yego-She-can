// src/app/auth/login/page.tsx
"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import './login.css'; // Import the custom CSS file

export default function LoginPage() {
  // We use 'username' to match your backend logic
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', formData);
      toast.success('Login successful!');
      // The login function from AuthContext handles token storage and redirection
      login(response.data.token, response.data.user);
    } catch (error: any) {
      // Show the specific error message from the backend
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Sign in to your Yego SheCan account</p>

        <div className="login-input-group">
            <label htmlFor="username" className="login-label">Username</label>
            <input
                id="username"
                name="username"
                type="text"
                className="login-input"
                required
                value={formData.username}
                onChange={handleChange}
            />
        </div>

        <div className="login-input-group">
            <label htmlFor="password" className="login-label">Password</label>
            <input
                id="password"
                name="password"
                type="password"
                className="login-input"
                required
                value={formData.password}
                onChange={handleChange}
            />
        </div>

        <div className="login-options">
            <Link href="/auth/forgot-password" className="login-link">
                Forgot password?
            </Link>
        </div>

        <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="login-footer">
          Don’t have an account?{' '}
          <Link href="/register" className="login-link">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}