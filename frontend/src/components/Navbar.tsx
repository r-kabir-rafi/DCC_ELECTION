import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-sm font-extrabold tracking-wide text-indigo-700">
          DCC ELECTION ATLAS
        </Link>
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 sm:gap-4">
          <Link href="/constituencies" className="rounded-md px-2 py-1 hover:bg-indigo-50 hover:text-indigo-700">
            Constituencies
          </Link>
          <Link href="/dhaka-north" className="rounded-md px-2 py-1 hover:bg-indigo-50 hover:text-indigo-700">
            DNCC
          </Link>
          <Link href="/dhaka-south" className="rounded-md px-2 py-1 hover:bg-indigo-50 hover:text-indigo-700">
            DSCC
          </Link>
        </div>
      </nav>
    </header>
  );
}
