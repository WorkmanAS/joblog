'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow fixed top-0 left-0 right-0 z-50">
      {/* Container */}
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
            <Link href="/new-entry" className="text-gray-700 hover:text-black">
            New Entry
            </Link>
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
          <Link href="/new-entry" className="text-gray-700 hover:text-black">New Entry</Link>
        </div>
      )}
    </nav>
  );
}
