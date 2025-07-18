'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './login.css'; 

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', formData);
      toast.success('Login successful!');

      const user = response.data.user;
      login(response.data.token, user);

      if (user.role === 'program manager') {
        router.push('/dashboard');
      }
      else if(user.role === 'learner'){
        router.push('/user-dashboard');
      }
         else {
        router.push('/about'); 
      }

    } catch (error: any) {
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
            <Link href="/forgot-password" className="login-link">
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
