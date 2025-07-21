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

import '../styles/dashboard.css'
import Sidebar from './components/Sidebar'
import DashboardNavbar from './components/DashboardNavbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardNavbar />
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  )
}

