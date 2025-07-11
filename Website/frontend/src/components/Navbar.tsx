'use client'

import Link from 'next/link'
import Image from 'next/image'
import logo from '../../public/yego-shecan-logo.png'
import { useState, useEffect, ReactNode } from 'react'

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showDropdown) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showDropdown])

  return (
    <nav style={{ 
      backgroundColor: 'white', 
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
      height: '64px', 
      position: 'sticky', 
      top: 0, 
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      width: '100%'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Image 
            src={logo} 
            alt="Yego SheCan Logo" 
            width={120} 
            height={40}
            style={{ height: '32px', width: 'auto' }}
          />
        </Link>

        {/* Navigation Links */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '32px' 
        }}>
          <NavLink href="/">Home</NavLink>
          <NavLink href="#about">About</NavLink>

          {/* Services Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#374151',
                fontSize: '14px',
                fontWeight: '500',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 0'
              }}
              onClick={(e) => {
                e.stopPropagation()
                setShowDropdown(!showDropdown)
              }}
              onMouseEnter={() => setShowDropdown(true)}
            >
              Services
              <svg 
                style={{
                  marginLeft: '4px',
                  height: '16px',
                  width: '16px',
                  transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {hydrated && showDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                marginTop: '8px',
                zIndex: 20,
                width: '280px',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                padding: '16px'
              }}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ 
                  fontSize: '12px', 
                  color: '#6b7280', 
                  textTransform: 'uppercase', 
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Entrepreneurship Courses
                </h3>
                <DropdownLink href="#online-courses">Online Courses</DropdownLink>
                <DropdownLink href="#certification">Timeline & Certification</DropdownLink>
                <DropdownLink href="#register">Register / Learn More</DropdownLink>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ 
                  fontSize: '12px', 
                  color: '#6b7280', 
                  textTransform: 'uppercase', 
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Physical Programs
                </h3>
                <DropdownLink href="#soap-training">Soap & Coffee Training</DropdownLink>
                <DropdownLink href="#program-details">Program Details</DropdownLink>
              </div>
              
              <div>
                <h3 style={{ 
                  fontSize: '12px', 
                  color: '#6b7280', 
                  textTransform: 'uppercase', 
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  E-commerce
                </h3>
                <DropdownLink href="#buy-products">Buy Soaps & Coffee</DropdownLink>
                <DropdownLink href="#product-list">Product List</DropdownLink>
              </div>
            </div>
            )}
          </div>

          <NavLink href="/mentorship">Mentorship</NavLink>
          <NavLink href="/contact">Contact</NavLink>
          
          {/* Login Button */}
          <Link href="/login">
            <span style={{
              backgroundColor: 'purple',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'inline-block',
              textDecoration: 'none'
            }}>
              Login
            </span>
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
  return (
    <Link href={href}>
      <span style={{
        color: '#374151',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        textDecoration: 'none',
        padding: '8px 0'
      }}>
        {children}
      </span>
    </Link>
  )
}

function DropdownLink({ href, children }: NavLinkProps) {
  return (
    <Link href={href}>
      <span style={{
        display: 'block',
        color: '#374151',
        fontSize: '14px',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        textDecoration: 'none',
        marginBottom: '4px'
      }}>
        {children}
      </span>
    </Link>
  )
}