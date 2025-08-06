"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const fa_1 = require("react-icons/fa");
require("./sidebar.css");
const image_1 = __importDefault(require("next/image"));
const yego_shecan_logo_png_1 = __importDefault(require("../../../../public/yego-shecan-logo.png"));
const Sidebar = () => {
    const pathname = (0, navigation_1.usePathname)();
    const isActive = (path) => pathname === path;
    return (<aside className="sidebar">
            <div className="sidebar-logo">
                <image_1.default src={yego_shecan_logo_png_1.default} alt="Yego SheCan Logo" width={140} height={70} style={{ borderRadius: '50px', objectFit: 'contain', marginTop: '-3rem', marginBottom: '-1.5rem' }}/>
            </div>
            <nav className="sidebar-nav">
                <link_1.default href="/dashboard" className={isActive('/dashboard') ? 'nav-item active' : 'nav-item'}>
                    <fa_1.FaHome /> Dashboard
                </link_1.default>
                <link_1.default href="/dashboard/courses" className={isActive('/dashboard/courses') ? 'nav-item active' : 'nav-item'}>
                    <fa_1.FaBook /> Courses
                </link_1.default>
                <link_1.default href="/dashboard/mentors" className={isActive('/dashboard/mentors') ? 'nav-item active' : 'nav-item'}>
                    <fa_1.FaUserFriends /> Mentors
                </link_1.default>
                <link_1.default href="/dashboard/settings" className={isActive('/dashboard/settings') ? 'nav-item active' : 'nav-item'}>
                    <fa_1.FaCog /> Settings
                </link_1.default>
                <link_1.default href="/logout" className="nav-item logout">
                    <fa_1.FaSignOutAlt /> Logout
                </link_1.default>
            </nav>
        </aside>);
};
exports.default = Sidebar;
