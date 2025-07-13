"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input label="First Name" name="firstName" type="text" required value={formData.firstName} onChange={handleChange} />
            <Input label="Last Name" name="lastName" type="text" required value={formData.lastName} onChange={handleChange} />
            <Input label="Username" name="username" type="text" required value={formData.username} onChange={handleChange} />
            <Input label="Email" name="email" type="email" required value={formData.email} onChange={handleChange} />
            <Input label="Password" name="password" type="password" required value={formData.password} onChange={handleChange} />
            <Input label="Confirm Password" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} />
            <Input label="Age" name="age" type="number" required value={formData.age} onChange={handleChange} />
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
            <Button type="submit" isLoading={loading}>Register</Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}