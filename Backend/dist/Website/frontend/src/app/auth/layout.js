"use strict";
// src/app/auth/layout.tsx (New File)
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthLayout;
function AuthLayout({ children }) {
    // This layout is minimal. It does not include ClientLayout,
    // so no Navbar or Footer will be rendered for auth pages.
    return <>{children}</>;
}
