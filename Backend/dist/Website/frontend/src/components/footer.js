"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Footer;
const link_1 = __importDefault(require("next/link"));
const image_1 = __importDefault(require("next/image"));
const yego_shecan_logo_png_1 = __importDefault(require("../../public/yego-shecan-logo.png"));
const fa_1 = require("react-icons/fa");
require("../styles/footer.css");
function Footer() {
    return (<footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-about">
          <div className="footer-logo-wrapper">
            <image_1.default src={yego_shecan_logo_png_1.default} alt="Yego SheCan Logo" height={100}/>
          </div>
          <p className="footer-description">
            Transforming lives through education and entrepreneurship. <br />
            Empowering underserved women to build sustainable businesses.
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="Facebook" className="footer-social-link">
              <fa_1.FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter" className="footer-social-link">
              <fa_1.FaTwitter />
            </a>
            <a href="#" aria-label="Instagram" className="footer-social-link">
              <fa_1.FaInstagram />
            </a>
            <a href="#" aria-label="LinkedIn" className="footer-social-link">
              <fa_1.FaLinkedinIn />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Quick Links</h4>
          <link_1.default href="/about" className="footer-link">
            About Us
          </link_1.default>
          <link_1.default href="#services" className="footer-link">
            Services
          </link_1.default>
          <link_1.default href="/mentorship" className="footer-link">
            Mentorship
          </link_1.default>
          <link_1.default href="/shop" className="footer-link">
            Shop
          </link_1.default>
          <link_1.default href="/contact" className="footer-link">
            Contact
          </link_1.default>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Services</h4>
          <link_1.default href="#online-courses" className="footer-link">
            Online Courses
          </link_1.default>
          <link_1.default href="#physical-programs" className="footer-link">
            Physical Programs
          </link_1.default>
          <link_1.default href="#book-mentorship" className="footer-link">
            Book Mentorship
          </link_1.default>
          <link_1.default href="#become-mentor" className="footer-link">
            Become a Mentor
          </link_1.default>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Contact Info</h4>
          <p className="footer-contact-item">
            <span className="footer-icon">
              <fa_1.FaEnvelope />
            </span>{' '}
            info@yegoshecan.org
          </p>
          <p className="footer-contact-item">
            <span className="footer-icon">
              <fa_1.FaPhone />
            </span>{' '}
            +250 782 742 723
          </p>
          <p className="footer-contact-item">
            <span className="footer-icon">
              <fa_1.FaMapMarkerAlt />
            </span>
            Kigali, Rwanda
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} YegoSheCan. All rights reserved.
      </div>
    </footer>);
}
