"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';


interface ProfileFormData {
  username: string;
  firstName: string;
  lastName: string;
  location: string;
  bio: string;
  profile_picture_url?: string; 
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    username: '',
    firstName: '',
    lastName: '',
    location: '',
    bio: '',
    profile_picture_url: '',
  });
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (user) {
      setLoading(true);
      api.get('/api/auth/profile')
        .then(response => {
          const { username, first_name, last_name, location, bio, profile_picture_url } = response.data;
          setFormData({
              username: username || '',
              firstName: first_name || '',
              lastName: last_name || '',
              location: location || '',
              bio: bio || '',
              profile_picture_url: profile_picture_url || '',
          });
        })
        .catch(err => {
            console.error("Failed to fetch profile", err);
            toast.error("Could not load your profile data.");
        })
        .finally(() => {
            setLoading(false);
        });
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePictureFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updateData = new FormData();
    
    
    updateData.append('username', formData.username);
    updateData.append('firstName', formData.firstName);
    updateData.append('lastName', formData.lastName);
    updateData.append('location', formData.location);
    updateData.append('bio', formData.bio);

    if (profilePictureFile) {
      updateData.append('profilePicture', profilePictureFile);
    }
    
    try {
      const response = await api.put('/api/auth/profile', updateData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      toast.success('Profile updated successfully!');
      const { username, first_name, last_name, location, bio, profile_picture_url } = response.data.user;
        setFormData({
            username,
            firstName: first_name,
            lastName: last_name,
            location,
            bio,
            profile_picture_url,
        });
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (loading && !formData.username)) {
      return (
        <div className="flex justify-center items-center p-10">
            <p>Loading profile...</p>
        </div>
      );
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center space-x-4">
          {formData.profile_picture_url && (
            <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${formData.profile_picture_url}`}
                alt="Profile Picture"
                width={80}
                height={80}
                className="rounded-full object-cover"
            />
          )}
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Your Profile</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Update your personal information and preferences.</p>
          </div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input label="Username" name="username" value={formData.username} onChange={handleChange} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
            <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
          </div>
          <Input label="Location" name="location" value={formData.location} onChange={handleChange} />
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
          </div>
          <div>
            <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Update Profile Picture</label>
            <input id="profilePicture" type="file" name="profilePicture" accept="image/*" onChange={handleFileChange} className="mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"/>
          </div>

          <div className="pt-5 border-t border-gray-200">
            <div className="flex justify-end items-center space-x-3">
              <Link href="/dashboard/change-password">
                <span className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                  Change Password
                </span>
              </Link>
              <Button type="submit" isLoading={loading}>Save Changes</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}