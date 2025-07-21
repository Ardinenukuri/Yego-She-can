"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Link from 'next/link';
import '@/app/register/register.css'; 

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'Female',
    age: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      await api.post('/api/auth/register', {
        ...formData,
        age: parseInt(formData.age), 
      });
      toast.success('Registration successful! Please check your email to verify.');
      router.push('/auth/login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.errors?.[0]?.message || 'Registration failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">Join the Yego SheCan community</p>

        <div className="register-name-fields">
          <div className="register-input-group">
            <label htmlFor="firstName" className="register-label">First Name</label>
            <input id="firstName" name="firstName" type="text" className="register-input" required value={formData.firstName} onChange={handleChange} />
          </div>
          <div className="register-input-group">
            <label htmlFor="lastName" className="register-label">Last Name</label>
            <input id="lastName" name="lastName" type="text" className="register-input" required value={formData.lastName} onChange={handleChange} />
          </div>
        </div>
        
        <div className="register-input-group">
            <label htmlFor="username" className="register-label">Username</label>
            <input id="username" name="username" type="text" className="register-input" required value={formData.username} onChange={handleChange} />
        </div>

        <div className="register-input-group">
            <label htmlFor="email" className="register-label">Email Address</label>
            <input id="email" name="email" type="email" className="register-input" required value={formData.email} onChange={handleChange} />
        </div>

        <div className="register-input-group">
            <label htmlFor="password" className="register-label">Password</label>
            <input id="password" name="password" type="password" className="register-input" required value={formData.password} onChange={handleChange} />
        </div>

        <div className="register-input-group">
            <label htmlFor="confirmPassword" className="register-label">Confirm Password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" className="register-input" required value={formData.confirmPassword} onChange={handleChange} />
        </div>
        
        <div className="register-name-fields">
            <div className="register-input-group">
                <label htmlFor="age" className="register-label">Age</label>
                <input id="age" name="age" type="number" className="register-input" required value={formData.age} onChange={handleChange} />
            </div>
            <div className="register-input-group">
                <label htmlFor="gender" className="register-label">Gender</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="register-input">
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                </select>
            </div>
        </div>

        <button type="submit" className="register-button" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="register-footer">
          Already have an account?{' '}
          <Link href="/login" className="register-link">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}