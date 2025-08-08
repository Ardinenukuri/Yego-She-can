'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './footer'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideLayout = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/dashboard')|| pathname.startsWith('/forgot-password') || pathname.startsWith('/auth/reset-password/') || pathname.startsWith('/auth/complete-registration/')  || pathname.startsWith('/user-dashboard') || pathname.startsWith('/dashboard')|| pathname.startsWith('/forgot-password') || pathname.startsWith('/auth/reset-password/') || pathname.startsWith('/auth/complete-registration/')  || pathname.startsWith('/mentor_dashboard') || pathname.startsWith('/mentor_dashboard') || pathname.startsWith('/user-dashboard/components/${encodeURIComponent(learnerFullName)}?courseName=${encodeURIComponent(courseName)}') || pathname.startsWith('/user-dashboard/components/')

  return (
    <>
      {!hideLayout && <Navbar />}
      <main style={{ minHeight: '80vh' }}>{children}</main>
      {!hideLayout && <Footer />}
    </>
  )
}
