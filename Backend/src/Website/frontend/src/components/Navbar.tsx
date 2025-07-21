'use client'

import Link from 'next/link'
import Image from 'next/image'
import logo from '../../public/yego-shecan-logo.png'
import { useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import '../styles/navbar.css'

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
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>

          <div className="dropdown-wrapper">
            <button
              className="dropdown-button"
              onClick={(e) => {
                e.stopPropagation()
                setShowDropdown(!showDropdown)
              }}
              onMouseEnter={() => setShowDropdown(true)}
            >
              Services
              <svg
                className="dropdown-icon"
                style={{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',color:'black' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {hydrated && showDropdown && (
              <div className="dropdown-content" onMouseLeave={() => setShowDropdown(false)}>
                <Link href="/services/courses" className="dropdown-item">
                  <strong className="dropdown-title">Online Courses</strong>
                  <p className="dropdown-desc">Accounting, Sales, Marketing, Design Thinking</p>
                </Link>
                <Link href="/services/physical" className="dropdown-item">
                  <strong className="dropdown-title">Physical Programs</strong>
                  <p className="dropdown-desc">Soap & Coffee making workshops</p>
                </Link>
              </div>
            )}
          </div>

          <NavLink href="/products">Products</NavLink>
          <NavLink href="/mentorship">Mentorship</NavLink>
          <NavLink href="/contact">Contact</NavLink>

          <Link href="/login">
            <span className="login-button">Login</span>
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
