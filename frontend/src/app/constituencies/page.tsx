'use client';

import dynamic from 'next/dynamic';
import SearchBox from '@/components/SearchBox';
import ConstituencyPanel from '@/components/ConstituencyPanel';
import Legend from '@/components/Legend';
import { useAppStore } from '@/store/useAppStore';

// Leaflet requires window to be defined, so dynamic import with ssr: false is necessary
const MapView = dynamic(() => import('@/components/MapView'), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">Loading Map...</div>
});

export default function ConstituenciesPage() {
  const { mode } = useAppStore();
  
  return (
    <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
      {/* Search Header for Mobile / Float for Desktop */}
      <SearchBox />
      
      {/* Map Area */}
      <div className="flex-1 relative z-0">
        <MapView />
        <Legend />
        
        {/* Mode Indicator Overlay */}
        <div className="absolute top-6 right-6 z-[400] bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-sm border border-gray-100 hidden md:block pointer-events-none">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Viewing: {mode === 'city' ? 'City Corporation' : 'National'} Election
          </span>
        </div>
      </div>

      {/* Details Panel */}
      <ConstituencyPanel />
    </div>
  );
}
