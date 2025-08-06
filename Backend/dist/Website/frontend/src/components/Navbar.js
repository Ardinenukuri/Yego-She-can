"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Navbar;
const link_1 = __importDefault(require("next/link"));
const image_1 = __importDefault(require("next/image"));
const yego_shecan_logo_png_1 = __importDefault(require("../../public/yego-shecan-logo.png"));
const react_1 = require("react");
const navigation_1 = require("next/navigation");
require("../styles/navbar.css");
function Navbar() {
    const [showDropdown, setShowDropdown] = (0, react_1.useState)(false);
    const [hydrated, setHydrated] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setHydrated(true);
    }, []);
    (0, react_1.useEffect)(() => {
        const handleClickOutside = () => {
            if (showDropdown)
                setShowDropdown(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showDropdown]);
    return (<nav className="navbar">
      <div className="nav-content">
        <link_1.default href="/" className="logo-link">
          <image_1.default src={yego_shecan_logo_png_1.default} alt="Yego SheCan Logo" width={120} height={60} style={{ height: '60px', width: 'auto', borderRadius: '50px' }}/>
        </link_1.default>

        <div className="nav-links">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>

          <div className="dropdown-wrapper">
            <button className="dropdown-button" onClick={(e) => {
            e.stopPropagation();
            setShowDropdown(!showDropdown);
        }} onMouseEnter={() => setShowDropdown(true)}>
              Services
              <svg className="dropdown-icon" style={{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)', color: 'black' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            {hydrated && showDropdown && (<div className="dropdown-content" onMouseLeave={() => setShowDropdown(false)}>
                <link_1.default href="/services/courses" className="dropdown-item">
                  <strong className="dropdown-title">Online Courses</strong>
                  <p className="dropdown-desc">Accounting, Sales, Marketing, Design Thinking</p>
                </link_1.default>
                <link_1.default href="/services/physical" className="dropdown-item">
                  <strong className="dropdown-title">Physical Programs</strong>
                  <p className="dropdown-desc">Soap & Coffee making workshops</p>
                </link_1.default>
              </div>)}
          </div>

          <NavLink href="/products">Products</NavLink>
          <NavLink href="/mentorship">Mentorship</NavLink>
          <NavLink href="/contact">Contact</NavLink>

          <link_1.default href="/login">
            <span className="login-button">Login</span>
          </link_1.default>
        </div>
      </div>
    </nav>);
}
function NavLink({ href, children }) {
    const pathname = (0, navigation_1.usePathname)();
    const isActive = pathname === href;
    return (<link_1.default href={href}>
      <span className={`nav-link ${isActive ? 'active' : ''}`}>{children}</span>
    </link_1.default>);
}
