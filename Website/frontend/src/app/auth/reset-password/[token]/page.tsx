"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

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
     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset Your Password</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input label="New Password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <Input label="Confirm New Password" name="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <Button type="submit" isLoading={loading}>Reset Password</Button>
          </form>
        </div>
      </div>
    </div>
  );
}