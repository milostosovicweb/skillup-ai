// components/TopNav.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="text-2xl font-bold text-blue-600">
        <Link href="/">SkillUp AI</Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 items-center">
        <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
        <Link href="/create-course" className="text-gray-700 hover:text-blue-600">Create Course</Link>
        <Link href="/notes" className="text-gray-700 hover:text-blue-600">Notes</Link>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">Logout</button>
      </div>

      {/* Mobile Menu Icon */}
      <button
        className="md:hidden text-gray-700"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4 md:hidden z-50">
          <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600">Dashboard</Link>
          <Link href="/create-course" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600">Create Course</Link>
          <Link href="/notes" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600">Notes</Link>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">Logout</button>
        </div>
      )}
    </nav>
  );
}
