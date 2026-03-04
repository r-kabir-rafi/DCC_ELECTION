'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/dhaka-north', label: 'Dhaka North' },
    { href: '/dhaka-south', label: 'Dhaka South' },
    { href: '/dcc-constituencies', label: 'Constituencies' },
    { href: '/dcc-thanas', label: 'Thanas' },
    { href: '/methodology', label: 'Methodology' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleTheme = () => {
        const next = !document.documentElement.classList.contains('dark');
        document.documentElement.classList.toggle('dark', next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
    };

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    const linkClass = (href: string) =>
        `rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${isActive(href)
            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white'
        }`;

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/80 bg-white/90 shadow-sm backdrop-blur-lg dark:border-white/10 dark:bg-slate-900/90">
            <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
                {/* Logo */}
                <Link href="/" className="group flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 text-xs font-extrabold text-white shadow-md transition-transform group-hover:scale-105">
                        D
                    </span>
                    <span className="hidden text-sm font-bold tracking-wide text-gray-800 dark:text-gray-100 sm:block">
                        DCC Atlas
                    </span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden items-center gap-1 md:flex">
                    {NAV_LINKS.map(link => (
                        <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                            {link.label}
                        </Link>
                    ))}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="ml-2 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
                        aria-label="Toggle dark mode"
                    >
                        <Sun size={16} className="hidden dark:block" />
                        <Moon size={16} className="block dark:hidden" />
                    </button>
                </div>

                {/* Mobile hamburger */}
                <div className="flex items-center gap-2 md:hidden">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
                        aria-label="Toggle dark mode"
                    >
                        <Sun size={16} className="hidden dark:block" />
                        <Moon size={16} className="block dark:hidden" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="border-t border-gray-200/50 bg-white/95 px-4 pb-4 pt-2 backdrop-blur-lg dark:border-white/10 dark:bg-slate-900/95 md:hidden">
                    <div className="flex flex-col gap-1">
                        {NAV_LINKS.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={linkClass(link.href)}
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
