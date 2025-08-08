"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClientLayout;
const navigation_1 = require("next/navigation");
const Navbar_1 = __importDefault(require("./Navbar"));
const footer_1 = __importDefault(require("./footer"));
function ClientLayout({ children }) {
    const pathname = (0, navigation_1.usePathname)();
    const hideLayout = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/dashboard') || pathname.startsWith('/forgot-password') || pathname.startsWith('/auth/reset-password/') || pathname.startsWith('/auth/complete-registration/');
    return (<>
      {!hideLayout && <Navbar_1.default />}
      <main style={{ minHeight: '80vh' }}>{children}</main>
      {!hideLayout && <footer_1.default />}
    </>);
}
