'use client'

import { FaUserCircle } from 'react-icons/fa'
import './dashboardNavbar.css'

const DashboardNavbar = () => {
  const user = { name: 'Afua Hamissi' }

  return (
    <header className="dashboard-navbar">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="dashboard-user">
        <FaUserCircle className="user-icon" />
        <span className="username">{user.name}</span>
      </div>
    </header>
  )
}

export default DashboardNavbar
