import './user-dashboard.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div >
      <Navbar />  
      <main style={{ minHeight: '80vh' }}>{children}</main>
        <Footer />
      
    </div>
  )
}