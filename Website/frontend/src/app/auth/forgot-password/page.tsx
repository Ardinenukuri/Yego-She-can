"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading('Sending reset link...');
    try {
      await api.post('/api/auth/forgot-password', { email });
      toast.dismiss();
      toast.success('If an account with that email exists, a reset link has been sent.');
    } catch (error: any) {
      toast.dismiss();
      toast.error('An error occurred.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot Password</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Enter your email and we'll send you a link to reset your password.</p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input label="Email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button type="submit" isLoading={loading}>Send Reset Link</Button>
          </form>
        </div>
      </div>
    </div>
  );
}