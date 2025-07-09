import './globals.css'
import Navbar from '../components/Navbar'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Yego SheCan',
  description: 'Empowering underserved women through entrepreneurship and e-learning.',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
