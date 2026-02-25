'use client';

import { useAppStore } from '@/store/useAppStore';

export default function ConstituencyPanel() {
  const { mode, searchQuery, selectedConstituency } = useAppStore();

  return (
    <aside className="z-10 h-[40vh] w-full border-t border-gray-200 bg-white md:h-full md:w-[360px] md:border-l md:border-t-0">
      <div className="h-full overflow-y-auto p-4 custom-scrollbar">
        <h2 className="text-base font-bold text-gray-900">Constituency Details</h2>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Mode: {mode === 'city' ? 'City Corporation' : 'National'}
        </p>

        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <p className="text-sm font-semibold text-gray-800">Selected</p>
          <p className="mt-1 text-sm text-gray-600">{selectedConstituency ?? 'No constituency selected yet.'}</p>
        </div>

        <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <p className="text-sm font-semibold text-gray-800">Search Query</p>
          <p className="mt-1 text-sm text-gray-600">{searchQuery || 'No active search filter.'}</p>
        </div>
      </div>
    </aside>
  );
}
