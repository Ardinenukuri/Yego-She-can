"use client";

import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    previousPassword: '',
    newPassword: '',
    confirmNewPassword: '', 
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error("New passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.put('/api/auth/change-password', {
        previousPassword: formData.previousPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword, 
      });

      toast.success(response.data.message || 'Password changed successfully!');
      
      router.push('/dashboard/profile');

    } catch (error: any) {
      console.error("Change password failed. Full error:", error.response);

      const errorMessage =
        error.response?.data?.errors?.[0]?.message || 
        error.response?.data?.message ||              
        'An unknown error occurred.';

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Change Your Password</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Enter your old password and a new password to update your account.
        </p>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Current Password"
            name="previousPassword"
            type="password"
            required
            value={formData.previousPassword}
            onChange={handleChange}
          />
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            required
            value={formData.newPassword}
            onChange={handleChange}
          />
          <Input
            label="Confirm New Password"
            name="confirmNewPassword"
            type="password"
            required
            value={formData.confirmNewPassword}
            onChange={handleChange}
          />
          <div className="pt-5 border-t border-gray-200">
            <div className="flex justify-end">
              <Button type="submit" isLoading={loading}>
                Update Password
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}