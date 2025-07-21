// src/app/auth/layout.tsx (New File)

import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  // This layout is minimal. It does not include ClientLayout,
  // so no Navbar or Footer will be rendered for auth pages.
  return <>{children}</>;
}