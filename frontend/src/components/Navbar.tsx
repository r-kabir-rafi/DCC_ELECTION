'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const linkClass = (href: string) =>
    `rounded-lg border px-3 py-1.5 transition-all duration-200 active:scale-95 ${
      pathname === href
        ? 'border-indigo-200 bg-indigo-100 text-indigo-800 shadow-sm dark:border-indigo-400/40 dark:bg-indigo-500/20 dark:text-indigo-200'
        : 'border-gray-200 bg-white text-gray-700 hover:-translate-y-0.5 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-sm dark:border-white/20 dark:bg-slate-900 dark:text-gray-200 dark:hover:bg-white/10 dark:hover:text-white'
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/90">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-xs font-extrabold text-white shadow-sm transition-transform group-hover:scale-105">
            D
          </span>
          <span className="text-sm font-extrabold tracking-wide text-indigo-700 dark:text-indigo-300">DCC</span>
        </Link>
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 sm:gap-3">
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
            className="rounded-lg border border-gray-300 bg-white p-1.5 text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100 hover:shadow-sm active:scale-95 dark:border-white/20 dark:bg-slate-900 dark:text-gray-200 dark:hover:bg-white/10"
            aria-label="Toggle dark mode"
            title="Toggle theme"
          >
            <Sun size={16} className="hidden dark:block" />
            <Moon size={16} className="block dark:hidden" />
          </button>
        </div>
      </nav>
    </header>
  );
}
