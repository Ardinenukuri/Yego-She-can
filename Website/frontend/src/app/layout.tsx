import './globals.css';
import type { ReactNode } from 'react';


import ClientLayout from '@/components/ClientLayout';      
import { AuthProvider } from '@/contexts/AuthContext';    
import { Toaster } from 'react-hot-toast';                  


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
        
        <AuthProvider>

          <Toaster position="top-right" />
          <main>
            <ClientLayout>{children}</ClientLayout>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}