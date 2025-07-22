// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast'; // Import toast for better feedback

// --- 1. CORRECTED USER INTERFACE ---
interface User {
  id: number;
  username: string;
  email: string;
  firstName: string; // Corrected separator
  lastName: string;  // Corrected separator
  profile_picture_url?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: any) => void; // Accept 'any' for userData from API
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/api/auth/profile');
          const profileData = response.data;
          // --- 2. MAP BACKEND snake_case TO FRONTEND camelCase ---
          setUser({
              ...profileData,
              firstName: profileData.first_name,
              lastName: profileData.last_name,
              profile_picture_url: profileData.profile_picture_url,
          });
        } catch (error) {
          console.error("Session expired or token is invalid");
          // Clear invalid token
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = (token: string, userData: any) => {
    localStorage.setItem('token', token);
    // --- 3. MAP BACKEND snake_case TO FRONTEND camelCase ON LOGIN ---
    setUser({
        ...userData,
        firstName: userData.first_name,
        lastName: userData.last_name,
        profile_picture_url: userData.profile_picture_url,
    });
    
    // Redirect based on role after login
    if (userData.role === 'program manager' || userData.role === 'mentor') {
        router.push('/dashboard');
    } else {
        router.push('/user-dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success("You have been logged out.");
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};