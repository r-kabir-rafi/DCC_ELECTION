'use client';
import { PARTY_COLORS } from '@/lib/geo';

export default function Legend() {
  return (
    <div className="absolute bottom-6 left-6 z-[400] bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-100 min-w-[150px] dark:bg-slate-800/95 dark:border-slate-700">
      <h4 className="text-sm font-bold text-gray-800 mb-3 tracking-wide uppercase dark:text-gray-200">Winning Party</h4>
      <div className="space-y-3">
        {Object.entries(PARTY_COLORS).map(([party, color]) => (
          <div key={party} className="flex items-center">
            <div className="w-5 h-5 rounded flex-shrink-0 mr-3 shadow-inner" style={{ backgroundColor: color }} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{party}</span>
          </div>
        ))}
        <div className="flex items-center pt-2 border-t border-gray-100 mt-2 dark:border-slate-700">
          <div className="w-5 h-5 rounded flex-shrink-0 mr-3 bg-gray-200 shadow-inner dark:bg-slate-600" />
          <span className="text-sm font-medium text-gray-500 italic dark:text-gray-400">No Data</span>
        </div>
      </div>
    </div>
  );
}
