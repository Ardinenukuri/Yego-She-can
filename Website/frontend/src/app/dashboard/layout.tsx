// // src/app/dashboard/layout.tsx
// "use client";

// import { useAuth } from "@/contexts/AuthContext";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { user, loading, logout } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push("/auth/login");
//     }
//   }, [user, loading, router]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   if (!user) {
//     return null; 
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//         <nav className="bg-white shadow-sm">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-between h-16">
//                     <div className="flex">
//                         <div className="flex-shrink-0 flex items-center">
//                             <h1 className="text-xl font-bold">Dashboard</h1>
//                         </div>
//                     </div>
//                     <div className="flex items-center">
//                         <button 
//                             onClick={logout}
//                             className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
//                         >
//                             Logout
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </nav>
//       <main className="py-10">
//         <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
//             {children}
//         </div>
//       </main>
//     </div>
//   );
// }

// src/app/dashboard/layout.tsx
'use client'; // This is now a client component because it uses hooks

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Your existing presentational components
import '../styles/dashboard.css';
import Sidebar from './components/Sidebar';
import DashboardNavbar from './components/DashboardNavbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // --- AUTHENTICATION GATEKEEPER LOGIC ---
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This effect runs whenever the auth state changes
    if (!loading && !user) {
      // If loading is finished and there is still no user, the session is invalid.
      toast.error("Your session has expired. Please log in again.");
      logout(); // The logout function will handle redirecting to the login page
    }
  }, [user, loading, router, logout]); // Dependencies for the effect

  // --- LOADING STATE ---
  // While the AuthContext is checking the token, show a full-screen loading message.
  // This prevents child pages from rendering and making API calls prematurely.
  if (loading || !user) {
    return (
      <div className="fullscreen-loader">
        <h2>Authenticating Session...</h2>
        {/* You can add a spinner or animation here */}
      </div>
    );
  }

  // --- AUTHENTICATED VIEW ---
  // If loading is complete AND a user exists, render the actual dashboard layout.
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardNavbar />
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}