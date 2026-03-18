"use client";

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Menu } from 'lucide-react';

export function Navbar() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = session?.user?.role;

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-brand dark:text-brand-dark">
          Plately
        </Link>
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <Menu className="w-6 h-6" />
        </button>
        <div
          className={`flex-col md:flex-row md:flex items-center gap-6 md:gap-8 md:static absolute top-16 left-0 w-full md:w-auto bg-white dark:bg-gray-900 border-b md:border-none border-gray-200 dark:border-gray-700 px-4 py-4 md:p-0 transform transition-all ${
            mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible md:opacity-100 md:visible'
          }`}
        >
          <Link href="/" className="block py-2 md:py-0 hover:text-brand dark:hover:text-brand-dark">
            Home
          </Link>
          <Link href="/directory" className="block py-2 md:py-0 hover:text-brand dark:hover:text-brand-dark">
            Directory
          </Link>
          <Link href="/pricing" className="block py-2 md:py-0 hover:text-brand dark:hover:text-brand-dark">
            Pricing
          </Link>
          {status === 'authenticated' ? (
            <>
              {role === 'ADMIN' && (
                <Link href="/admin" className="block py-2 md:py-0 hover:text-brand dark:hover:text-brand-dark">
                  Admin
                </Link>
              )}
              {role === 'RESTAURANT_OWNER' && (
                <Link
                  href="/dashboard"
                  className="block py-2 md:py-0 hover:text-brand dark:hover:text-brand-dark"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="block py-2 md:py-0 text-left hover:text-brand dark:hover:text-brand-dark"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="block py-2 md:py-0 hover:text-brand dark:hover:text-brand-dark"
            >
              Sign in
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}