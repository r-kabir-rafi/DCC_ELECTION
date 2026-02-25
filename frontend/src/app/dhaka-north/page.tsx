'use client';

import dynamic from 'next/dynamic';
import ConstituencyPanel from '@/components/ConstituencyPanel';
import Legend from '@/components/Legend';

// Leaflet requires window to be defined
const MapView = dynamic(() => import('@/components/MapView'), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">Loading Map...</div>
});

export default function DhakaNorthPage() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 z-10 flex-shrink-0">
        <h1 className="text-2xl font-extrabold text-indigo-900 tracking-tight">Dhaka North City Corporation</h1>
        <p className="text-sm text-gray-500 font-medium">Filtered view for DNCC wards and national constituencies.</p>
      </div>
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        <div className="flex-1 relative z-0">
          <MapView zoneFilter="DNCC" />
          <Legend />
        </div>
        <ConstituencyPanel />
      </div>
    </div>
  );
}
