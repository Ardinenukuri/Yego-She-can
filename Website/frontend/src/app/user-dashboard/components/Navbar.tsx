'use client'

import Link from 'next/link'
import Image from 'next/image'
import logo from '../../../../public/yego-shecan-logo.png'
import { useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa'
import '../../../styles/navbar.css'
import '../../../app/dashboard/components/dashboardNavbar.css'


export default function Navbar() {
    const [showDropdown, setShowDropdown] = useState(false)
    const [hydrated, setHydrated] = useState(false)

    useEffect(() => {
        setHydrated(true)
    }, [])

    useEffect(() => {
        const handleClickOutside = () => {
            if (showDropdown) setShowDropdown(false)
        }

        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [showDropdown])

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
                        <Link href="/user-dashboard/learner-profile" className="profile-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '2rem' }}>
                            <Image
                                src={logo}
                                alt="User profile picture"
                                width={36}
                                height={36}
                                className="user-avatar"
                            />
                            <span className="username">Learner</span>
                        </Link>
                    </div>
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
