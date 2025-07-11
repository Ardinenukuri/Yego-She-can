// src/app/layout.tsx (Corrected Version)

import './globals.css';
import Navbar from '../components/Navbar'; // Your Navbar can stay
import type { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext'; // 1. Import AuthProvider
import { Toaster } from 'react-hot-toast'; // 2. Import Toaster for notifications

export const metadata = {
  title: 'Yego SheCan',
  description: 'Empowering underserved women through entrepreneurship and e-learning.',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        {/* 3. Wrap everything inside the body with AuthProvider */}
        <AuthProvider>
          <Navbar /> 
          <Toaster position="top-right" /> {/* Place Toaster here */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}