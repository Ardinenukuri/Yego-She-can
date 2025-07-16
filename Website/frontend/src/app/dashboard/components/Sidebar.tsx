'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome, FaBook, FaUserFriends, FaCog, FaSignOutAlt } from 'react-icons/fa'
import './sidebar.css'
import Image from 'next/image'
import logo from '../../../../public/yego-shecan-logo.png'


const Sidebar = () => {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <Image
                    src={logo}
                    alt="Yego SheCan Logo"
                    width={140}
                    height={70}
                    style={{ borderRadius: '50px', objectFit: 'contain', marginTop:'-3rem', marginBottom:'-1.5rem' }}
                />
            </div>
            <nav className="sidebar-nav">
                <Link href="/dashboard" className={isActive('/dashboard') ? 'nav-item active' : 'nav-item'}>
                    <FaHome /> Dashboard
                </Link>
                <Link href="/dashboard/courses" className={isActive('/dashboard/courses') ? 'nav-item active' : 'nav-item'}>
                    <FaBook /> Courses
                </Link>
                <Link href="/dashboard/mentors" className={isActive('/dashboard/mentors') ? 'nav-item active' : 'nav-item'}>
                    <FaUserFriends /> Mentors
                </Link>
                <Link href="/dashboard/settings" className={isActive('/dashboard/settings') ? 'nav-item active' : 'nav-item'}>
                    <FaCog /> Settings
                </Link>
                <Link href="/" className="nav-item logout">
                    <FaSignOutAlt /> Logout
                </Link>
            </nav>
        </aside>
    )
}

export default Sidebar
