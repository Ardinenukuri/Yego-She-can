'use client'

import Link from 'next/link'
import Image from 'next/image'
import logo from '../../public/yego-shecan-logo.png'
import { useState, useEffect, ReactNode } from 'react'
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
      <div className="navbar-container">
        <Link href="/" className="logo-link">
          <Image src={logo} alt="Yego SheCan Logo" width={120} height={40} className="logo-img" />
        </Link>

        <div className="nav-links">
          <NavLink href="/" className="nav-link">Home</NavLink>
          <NavLink href="#about" className="nav-link">About</NavLink>

          <div className="dropdown-wrapper">
            <button
              className="dropdown-toggle"
              onClick={(e) => {
                e.stopPropagation()
                setShowDropdown(!showDropdown)
              }}
              onMouseEnter={() => setShowDropdown(true)}
            >
              Services
              <svg
                className={`arrow-icon ${showDropdown ? 'rotate' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {hydrated && showDropdown && (
              <div className="dropdown" onMouseLeave={() => setShowDropdown(false)}>
                <div className="dropdown-section">
                  <h3 className="dropdown-title">Entrepreneurship Courses</h3>
                  <DropdownLink href="#online-courses">Online Courses</DropdownLink>
                  <DropdownLink href="#certification">Timeline & Certification</DropdownLink>
                  <DropdownLink href="#register">Register / Learn More</DropdownLink>
                </div>

                <div className="dropdown-section">
                  <h3 className="dropdown-title">Physical Programs</h3>
                  <DropdownLink href="#soap-training">Soap & Coffee Training</DropdownLink>
                  <DropdownLink href="#program-details">Program Details</DropdownLink>
                </div>

                <div className="dropdown-section">
                  <h3 className="dropdown-title">E-commerce</h3>
                  <DropdownLink href="#buy-products">Buy Soaps & Coffee</DropdownLink>
                  <DropdownLink href="#product-list">Product List</DropdownLink>
                </div>
              </div>
            )}
          </div>

          <NavLink href="/mentorship" className="nav-link">Mentorship</NavLink>
          <NavLink href="/contact" className="nav-link">Contact</NavLink>

          <Link href="/login" className="login-btn">Login</Link>
        </div>
      </div>
    </nav>
  )
}

interface NavLinkProps {
  href: string
  children: ReactNode
  className?: string
}

function NavLink({ href, children, className }: NavLinkProps) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

function DropdownLink({ href, children }: NavLinkProps) {
  return (
    <Link href={href} className="dropdown-link">
      {children}
    </Link>
  )
}
