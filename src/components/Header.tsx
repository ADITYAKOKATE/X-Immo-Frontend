'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggle = () => setIsMenuOpen((prev) => !prev);
  const handleClose = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-0">
        <Link href="/" onClick={handleClose} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-base font-bold text-slate-950 shadow-lg shadow-cyan-500/30">
            XI
          </div>
          <div>
            <p className="text-base font-bold text-white tracking-tight">X&apos;Immo</p>
            <p className="hidden text-xs text-slate-400 sm:block">Smart Property Management</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-200 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={handleClose}
              className="transition-colors hover:text-cyan-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={handleClose}
                className="hidden rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/60 hover:text-white md:inline-flex"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:shadow-indigo-500/30"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                onClick={handleClose}
                className="hidden rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/60 hover:text-white md:inline-flex"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                onClick={handleClose}
                className="rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:shadow-indigo-500/30"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle - Distinct Look */}
        <button
          type="button"
          onClick={handleToggle}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 sm:hidden"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <span className="text-xl">{isMenuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 px-4 pb-6 pt-4 shadow-lg shadow-black/30 sm:hidden">
          <nav className="flex flex-col gap-3 text-sm font-semibold text-white">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={handleClose}
                className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 transition hover:border-cyan-400/40 hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={handleClose}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white transition hover:border-cyan-400/60 hover:bg-white/10"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    handleClose();
                  }}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:shadow-indigo-500/30"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={handleClose}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white transition hover:border-cyan-400/60 hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={handleClose}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-4 py-3 text-center text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:shadow-indigo-500/30"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

