'use client';

import { Map } from 'lucide-react';

type MapViewProps = {
  zoneFilter?: 'DNCC' | 'DSCC' | string;
};

export default function MapView({ zoneFilter }: MapViewProps) {
  return (
    <section className="relative h-full min-h-[420px] w-full bg-gradient-to-br from-slate-100 via-white to-blue-100">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-2xl border border-gray-200 bg-white/90 px-6 py-5 text-center shadow">
          <Map className="mx-auto h-8 w-8 text-indigo-600" />
          <p className="mt-2 text-sm font-semibold text-gray-800">Map layer is ready for integration.</p>
          <p className="mt-1 text-xs text-gray-500">
            {zoneFilter ? `Filtered zone: ${zoneFilter}` : 'Showing all zones'}
          </p>
        </div>
      </div>
    </section>
  );
}
