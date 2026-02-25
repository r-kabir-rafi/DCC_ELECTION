import Link from 'next/link';
import ModeToggle from './ModeToggle';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm z-50 flex items-center justify-between px-6">
      <div className="flex items-center space-x-6">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-indigo-600 border-r pr-6 border-gray-200 hover:text-indigo-800 transition-colors">
          Dhaka Atlas
        </Link>
        <div className="hidden md:flex space-x-4">
          <Link href="/constituencies" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Constituencies</Link>
          <Link href="/dhaka-north" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Dhaka North</Link>
          <Link href="/dhaka-south" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Dhaka South</Link>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <ModeToggle />
      </div>
    </nav>
  );
}
