// src/app/(main)/layout.tsx (New File)

import ClientLayout from '@/components/ClientLayout';
import type { ReactNode } from 'react';

export default function MainAppLayout({ children }: { children: ReactNode }) {
  // This layout wraps all your main pages with the ClientLayout,
  // giving them the Navbar and Footer.
  return (
    <main>
      <ClientLayout>{children}</ClientLayout>
    </main>
  );
}