"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function LoginPage() {
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
      login(response.data.token, response.data.user);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input label="Username" name="username" type="text" required value={formData.username} onChange={handleChange} />
            <Input label="Password" name="password" type="password" required value={formData.password} onChange={handleChange} />
            <div className="text-sm">
                <Link href="/auth/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                </Link>
            </div>
            <Button type="submit" isLoading={loading}>Sign in</Button>
          </form>
        </div>
      </div>
    </div>
  );
}