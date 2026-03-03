'use client';
import { useAppStore } from '@/store/useAppStore';

export default function ModeToggle() {
  const { mode, setMode } = useAppStore();

  return (
    <div className="flex p-1 bg-gray-100 rounded-lg shadow-inner dark:bg-slate-800">
      <button
        onClick={() => setMode('city')}
        className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${mode === 'city'
            ? 'bg-white shadow-sm text-indigo-700 dark:bg-slate-700 dark:text-indigo-300'
            : 'text-gray-500 hover:text-gray-700 hover:bg-white/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/10'
          }`}
      >
        City Election
      </button>
      <button
        onClick={() => setMode('national')}
        className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${mode === 'national'
            ? 'bg-white shadow-sm text-indigo-700 dark:bg-slate-700 dark:text-indigo-300'
            : 'text-gray-500 hover:text-gray-700 hover:bg-white/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/10'
          }`}
      >
        National
      </button>
    </div>
  );
}
