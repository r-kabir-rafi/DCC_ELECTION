'use client';
import { PARTY_COLORS } from '@/lib/geo';

export default function Legend() {
  return (
    <div className="absolute bottom-6 left-6 z-[400] bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-100 min-w-[150px]">
      <h4 className="text-sm font-bold text-gray-800 mb-3 tracking-wide uppercase">Winning Party</h4>
      <div className="space-y-3">
        {Object.entries(PARTY_COLORS).map(([party, color]) => (
          <div key={party} className="flex items-center">
            <div className="w-5 h-5 rounded flex-shrink-0 mr-3 shadow-inner" style={{ backgroundColor: color }} />
            <span className="text-sm font-medium text-gray-700">{party}</span>
          </div>
        ))}
        <div className="flex items-center pt-2 border-t border-gray-100 mt-2">
          <div className="w-5 h-5 rounded flex-shrink-0 mr-3 bg-gray-200 shadow-inner" />
          <span className="text-sm font-medium text-gray-500 italic">No Data</span>
        </div>
      </div>
    </div>
  );
}
