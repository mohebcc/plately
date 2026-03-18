"use client";

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Global providers for the application. Wraps the NextAuth session provider and
 * any other client‑side context providers needed. All client components that
 * depend on session should be descendants of this component.
 */
export default function Providers({ children }: ProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>;
}