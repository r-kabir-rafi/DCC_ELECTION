'use client';

import { Search } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function SearchBox() {
  const { mode, searchQuery, setMode, setSearchQuery } = useAppStore();

  return (
    <div className="absolute left-4 right-4 top-4 z-[450] rounded-xl border border-gray-200 bg-white/95 p-3 shadow md:left-6 md:right-auto md:min-w-[380px]">
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search constituency or ward"
          className="w-full bg-transparent text-sm outline-none"
          aria-label="Search constituency or ward"
        />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setMode('city')}
          className={`rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wide ${
            mode === 'city' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          City
        </button>
        <button
          type="button"
          onClick={() => setMode('national')}
          className={`rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wide ${
            mode === 'national' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          National
        </button>
      </div>
    </div>
  );
}
