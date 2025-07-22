'use client'

import Link from 'next/link'
import Image from 'next/image'
import logo from '../../../../public/yego-shecan-logo.png'
import { ReactNode } from 'react' 
import { usePathname } from 'next/navigation'
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa'
import '../../../styles/navbar.css'
import '../../../app/dashboard/components/dashboardNavbar.css'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
    const { user, loading } = useAuth();

    return (
        <nav className="navbar">
            <div className="nav-content">
                <Link href="/" className="logo-link">
                    <Image
                        src={logo}
                        alt="Yego SheCan Logo"
                        width={120}
                        height={60}
                        style={{ height: '60px', width: 'auto', borderRadius: '50px' }}
                    />
                </Link>

                <div className="nav-links">
                    <NavLink href="/user-dashboard">All Courses</NavLink>
                    <NavLink href="/user-dashboard/your-courses">Your Courses</NavLink>
                    <NavLink href="/user-dashboard/physical-programs">Physical Programs</NavLink>
                    <NavLink href="/user-dashboard/mentorship">Mentorship</NavLink>
                    
                
                    <div className="dashboard-user">
                        {loading ? (
                            <div className="skeleton-user">
                                <div className="skeleton-avatar"></div>
                                <div className="skeleton-name"></div>
                            </div>
                        ) : user ? (
                            <Link href="/user-dashboard/learner-profile" className="profile-link">
                                {user.profile_picture_url ? (
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_URL}${user.profile_picture_url}`}
                                        alt="User profile picture"
                                        width={36}
                                        height={36}
                                        className="user-avatar" 
                                    />
                                ) : (
                                    <FaUserCircle className="user-icon" />
                                )}
                                <span className="username">{user.username}</span>
                            </Link>
                        ) : (
                            <div className="auth-buttons">
                                <Link href="/auth/login" className="nav-button login">Login</Link>
                                <Link href="/auth/register" className="nav-button register">Register</Link>
                            </div>
                        )}
                    </div>
                    <Link href="/" className="nav-item logout" style={{color:"red"}}>
                    <FaSignOutAlt /> Logout
                </Link>
                </div>
            </div>
        </nav>
    )
}


interface NavLinkProps {
    href: string
    children: ReactNode
}

function NavLink({ href, children }: NavLinkProps) {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
        <Link href={href}>
            <span className={`nav-link ${isActive ? 'active' : ''}`}>{children}</span>
        </Link>
    )
}