'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const linkClass = (href: string) =>
    `rounded-md px-2 py-1 transition-colors ${
      pathname === href
        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200'
        : 'hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-white/10 dark:hover:text-white'
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-slate-900/90">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-sm font-extrabold tracking-wide text-indigo-700 dark:text-indigo-300">
          DCC ELECTION ATLAS
        </Link>
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 sm:gap-4">
          <Link href="/constituencies" className={linkClass('/constituencies')}>
            Constituencies
          </Link>
          <Link href="/dhaka-north" className={linkClass('/dhaka-north')}>
            DNCC
          </Link>
          <Link href="/dhaka-south" className={linkClass('/dhaka-south')}>
            DSCC
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md border border-gray-300 p-1.5 text-gray-700 transition-colors hover:bg-gray-100 dark:border-white/20 dark:text-gray-200 dark:hover:bg-white/10"
            aria-label="Toggle dark mode"
            title="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
