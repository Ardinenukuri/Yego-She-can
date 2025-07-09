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

  return (
    <nav className="bg-white shadow-md h-20 flex items-center sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image src={logo} alt="Yego SheCan Logo" width={130} height={45} />
        </Link>

        <div className="hidden md:flex space-x-6 items-center text-sm font-medium">
          <NavLink href="/">Home</NavLink>
          <NavLink href="#about">About Us</NavLink>

          <div className="relative">
            <button
              className="text-purple-yego hover:text-purple-700 transition-colors"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Services ⬇️
            </button>

            {hydrated && showDropdown && (
              <div className="absolute top-full mt-2 left-0 z-20 w-[270px] bg-white border border-gray-200 rounded-md shadow-xl p-4 space-y-3">
                <div>
                  <span className="text-xs text-gray-400 uppercase font-bold">Entrepreneurship Courses</span>
                  <NavLink href="#online-courses">Online Courses</NavLink>
                  <NavLink href="#certification">Timeline & Certification</NavLink>
                  <NavLink href="#register">Register / Learn More</NavLink>
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase font-bold">Physical Programs</span>
                  <NavLink href="#soap-training">Soap & Coffee Training</NavLink>
                  <NavLink href="#program-details">Program Details</NavLink>
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase font-bold">E-commerce</span>
                  <NavLink href="#buy-products">Buy Soaps & Coffee</NavLink>
                  <NavLink href="#product-list">Product List</NavLink>
                </div>
                <div>

                </div>
              </div>
            )}
          </div>
          <NavLink href="/mentorship">Mentorship</NavLink>
          <NavLink href="/contact">Contact</NavLink>
          <NavLink href="/login">Login</NavLink>
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
    <Link href={href} passHref>
      <span className="block text-purple-yego hover:text-purple-800 transition-colors cursor-pointer py-1">
        {children}
      </span>
    </Link>
  )
}
