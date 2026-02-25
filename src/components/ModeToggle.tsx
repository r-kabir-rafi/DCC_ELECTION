'use client';
import { useAppStore } from '@/store/useAppStore';

export default function ModeToggle() {
  const { mode, setMode } = useAppStore();

  return (
    <div className="flex p-1 bg-gray-100 rounded-lg shadow-inner">
      <button
        onClick={() => setMode('city')}
        className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
          mode === 'city' 
            ? 'bg-white shadow-sm text-indigo-700' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
        }`}
      >
        Dhaka City Election
      </button>
      <button
        onClick={() => setMode('national')}
        className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
          mode === 'national' 
            ? 'bg-white shadow-sm text-indigo-700' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
        }`}
      >
        National Election
      </button>
    </div>
  );
}
