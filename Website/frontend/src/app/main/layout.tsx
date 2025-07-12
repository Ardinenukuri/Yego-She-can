'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/footer'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh' }}>{children}</main>
      <Footer />
    </>
  )
}
