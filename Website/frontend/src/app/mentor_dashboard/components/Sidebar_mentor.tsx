'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaBook,
  FaHome,
  FaClipboardList,
  FaUserClock,
  FaCalendarAlt,
  FaUserEdit,
  FaSignOutAlt,
} from 'react-icons/fa';
import './sidebar.css';
import Image from 'next/image';
import logo from '../../../../public/yego-shecan-logo.png';

const SidebarMentor = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Image
          src={logo}
          alt="Yego SheCan Logo"
          width={140}
          height={70}
          style={{
            borderRadius: '50px',
            objectFit: 'contain',
            marginTop: '-3rem',
            marginBottom: '-1.5rem',
          }}
        />
      </div>
      <nav className="sidebar-nav">
        <Link
          href="/mentor_dashboard"
          className={pathname === '/mentor_dashboard' ? 'nav-item active' : 'nav-item'}
        >
          <FaHome /> Overview
        </Link>
        <Link
          href="/mentor_dashboard/AllCourses"
          className={isActive('/mentor_dashboard/AllCourses') ? 'nav-item active' : 'nav-item'}
        >
          <FaBook /> My Courses
        </Link>
        <Link
          href="/mentor_dashboard/editcourse"
          className={isActive('/mentor_dashboard/editcourse') ? 'nav-item active' : 'nav-item'}
        >
          <FaClipboardList /> Edit Content
        </Link>
        <Link
          href="/mentor_dashboard/Quiz"
          className={isActive('/mentor_dashboard/Quiz') ? 'nav-item active' : 'nav-item'}
        >
          <FaClipboardList /> Manage Quizzes
        </Link>
        <Link
          href="/mentor_dashboard/availability"
          className={isActive('/mentor_dashboard/availability') ? 'nav-item active' : 'nav-item'}
        >
          <FaCalendarAlt /> My Availability
        </Link>
        <Link
          href="/mentor_dashboard/booking"
          className={isActive('/mentor_dashboard/booking') ? 'nav-item active' : 'nav-item'}
        >
          <FaUserClock /> Bookings
        </Link>
        <Link
          href="/mentor_dashboard/settings"
          className={isActive('/mentor_dashboard/settings') ? 'nav-item active' : 'nav-item'}
        >
          <FaUserEdit /> Profile Settings
        </Link>
        <Link href="/" className="nav-item logout">
          <FaSignOutAlt /> Logout
        </Link>
      </nav>
    </aside>
  );
};

export default SidebarMentor;
