'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

// Create a Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null); 

  // Fetch the current session when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
  
      if (error) {
        console.error('Failed to get session:', error.message);
        return;
      }
  
      // session can be null, so we check before accessing session.user
      if (session && session.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    };
  
    fetchUser();
  }, []);
  

  return (
    <nav className="bg-white shadow fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-800">
              JobLog
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-4">
            <Link href="/arbeidstyper" className="text-gray-700 hover:text-black">
              Task Types
            </Link>
            <Link href="/ansatte" className="text-gray-700 hover:text-black">
              Employees
            </Link>
            <Link href="/projects" className="text-gray-700 hover:text-black">
              Projects
            </Link>

            {/* Only show this if user is logged in */}
            {user && (
              <Link href="/new-entry" className="text-gray-700 hover:text-black">
                New Entry
              </Link>
            )}
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-black focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4">
          <Link href="/arbeidstyper" className="block py-2 text-gray-700 hover:text-black">
            Task Types
          </Link>
          <Link href="/ansatte" className="block py-2 text-gray-700 hover:text-black">
            Employees
          </Link>
          <Link href="/projects" className="block py-2 text-gray-700 hover:text-black">
            Projects
          </Link>

          {/* Mobile view: show "New Entry" if user is logged in */}
          {user && (
            <Link href="/new-entry" className="block py-2 text-gray-700 hover:text-black">
              New Entry
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
