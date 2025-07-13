'use client'

import Link from 'next/link'
import Image from 'next/image'
import logo from '../../public/yego-shecan-logo.png'
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
} from 'react-icons/fa'
import '../styles/footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-about">
          <div className="footer-logo-wrapper">
            <Image src={logo} alt="Yego SheCan Logo" height={100} />
          </div>
          <p className="footer-description">
            Transforming lives through education and entrepreneurship. <br />
            Empowering underserved women to build sustainable businesses.
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="Facebook" className="footer-social-link">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter" className="footer-social-link">
              <FaTwitter />
            </a>
            <a href="#" aria-label="Instagram" className="footer-social-link">
              <FaInstagram />
            </a>
            <a href="#" aria-label="LinkedIn" className="footer-social-link">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Quick Links</h4>
          <Link href="/about" className="footer-link">
            About Us
          </Link>
          <Link href="#services" className="footer-link">
            Services
          </Link>
          <Link href="/mentorship" className="footer-link">
            Mentorship
          </Link>
          <Link href="/shop" className="footer-link">
            Shop
          </Link>
          <Link href="/contact" className="footer-link">
            Contact
          </Link>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Services</h4>
          <Link href="#online-courses" className="footer-link">
            Online Courses
          </Link>
          <Link href="#physical-programs" className="footer-link">
            Physical Programs
          </Link>
          <Link href="#book-mentorship" className="footer-link">
            Book Mentorship
          </Link>
          <Link href="#become-mentor" className="footer-link">
            Become a Mentor
          </Link>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Contact Info</h4>
          <p className="footer-contact-item">
            <span className="footer-icon">
              <FaEnvelope />
            </span>{' '}
            info@yegoshecan.org
          </p>
          <p className="footer-contact-item">
            <span className="footer-icon">
              <FaPhone />
            </span>{' '}
            +250 782 742 723
          </p>
          <p className="footer-contact-item">
            <span className="footer-icon">
              <FaMapMarkerAlt />
            </span>
            Kigali, Rwanda
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} YegoSheCan. All rights reserved.
      </div>
    </footer>
  )
}
