'use client';

import dynamic from 'next/dynamic';

const MapViewInner = dynamic(() => import('./MapViewInner'), {
  ssr: false,
  loading: () => <div className="h-[460px] w-full rounded-xl border border-gray-200 bg-white" />,
});

export default function CityGisMapSection({ zoneFilter }: { zoneFilter?: 'DNCC' | 'DSCC' }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Dhaka City GIS Map</h2>
      <p className="mt-1 text-sm text-gray-600">GIS boundary layer for city constituencies.</p>
      <div className="mt-4 h-[460px] w-full">
        <MapViewInner zoneFilter={zoneFilter} />
      </div>
    </section>
  );
}
