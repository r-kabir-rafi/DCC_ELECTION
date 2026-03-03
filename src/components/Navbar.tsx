'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import ModeToggle from './ModeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored === 'dark' || (!stored && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const linkClass = (href: string) =>
    `rounded-lg border px-3 py-1.5 text-sm font-semibold transition-all duration-200 active:scale-95 ${pathname === href
      ? 'border-indigo-200 bg-indigo-100 text-indigo-800 shadow-sm dark:border-indigo-400/40 dark:bg-indigo-500/20 dark:text-indigo-200'
      : 'border-gray-200 bg-white text-gray-700 hover:-translate-y-0.5 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-sm dark:border-white/20 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-white/10 dark:hover:text-white'
    }`;

  const mobileLinkClass = (href: string) =>
    `block w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${pathname === href
      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200'
      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10'
    }`;

  const navLinks = [
    { href: '/constituencies', label: 'Constituencies' },
    { href: '/dhaka-north', label: 'Dhaka North' },
    { href: '/dhaka-south', label: 'Dhaka South' },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/80 bg-white/90 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/90">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 text-xs font-extrabold text-white shadow-sm transition-transform group-hover:scale-105">
            D
          </span>
          <span className="text-base font-extrabold tracking-tight text-indigo-700 dark:text-indigo-300">
            Dhaka Atlas
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
          <div className="ml-2 border-l border-gray-200 pl-3 dark:border-white/10">
            <ModeToggle />
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="ml-1 rounded-lg border border-gray-200 bg-white p-2 text-gray-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100 hover:shadow-sm active:scale-95 dark:border-white/20 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-white/10"
            aria-label="Toggle dark mode"
            title="Toggle theme"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Mobile buttons */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 dark:border-white/20 dark:bg-slate-800 dark:text-gray-200"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 dark:border-white/20 dark:bg-slate-800 dark:text-gray-200"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="animate-slide-up border-t border-gray-200/80 bg-white/95 backdrop-blur-md md:hidden dark:border-white/10 dark:bg-slate-900/95">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={mobileLinkClass(link.href)}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
