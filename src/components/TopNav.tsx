'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { usePathname } from 'next/navigation';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<unknown>(null);
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/signin';
  };

  const isOnSignIn = pathname === '/signin';
  const isOnRegister = pathname === '/register';

  return (
    <div className="navbar sticky top-0 shadow-md px-4 py-3 flex items-center justify-between bg-[#222831] text-white z-50">
      {/* Logo */}
      <div className="text-2xl font-bold">
        <Link href="/"><span className='text-3xl'>📎</span> SkillUp AI</Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex flex-wrap space-x-4 items-center">
        {user ? (
          <>
            <Link href="/dashboard">
              <button className="btn btn-ghost text-lg">📈 Dashboard</button>
            </Link>
            <Link href="/create-course">
              <button className="btn btn-ghost text-lg">🚀 Cook Up a New Course</button>
            </Link>
            <button onClick={handleLogout} className="btn text-lg">
              <PowerSettingsNewIcon style={{ color: '#F05454', fontSize: 24 }} /> Logout
            </button>
          </>
        ) : (
          <>
            {!isOnSignIn && (
              <Link href="/signin"><button className="btn btn-ghost text-lg">🔓 Sign In</button></Link>
            )}
            {!isOnRegister && (
              <Link href="/register"><button className="btn btn-ghost text-lg">✍🏻 Sign Up</button></Link>
            )}
          </>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <button
        className="lg:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#222831] shadow-lg flex flex-col items-center space-y-4 py-4 lg:hidden">
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                <button className="btn btn-ghost text-lg w-full">📈 Dashboard</button>
              </Link>
              <Link href="/create-course" onClick={() => setMenuOpen(false)}>
                <button className="btn btn-ghost text-lg w-full">🚀 Cook Up a New Course</button>
              </Link>
              <button onClick={handleLogout} className="btn text-lg ">
                <PowerSettingsNewIcon style={{ color: '#F05454', fontSize: 24 }} /> Logout
              </button>
            </>
          ) : (
            <>
              {!isOnSignIn && (
                <Link href="/signin" onClick={() => setMenuOpen(false)}>
                  <button className="btn btn-ghost w-full">🔓 Sign In</button>
                </Link>
              )}
              {!isOnRegister && (
                <Link href="/register" onClick={() => setMenuOpen(false)}>
                  <button className="btn btn-ghost w-full">✍🏻 Sign Up</button>
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
