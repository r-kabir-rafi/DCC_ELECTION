'use client';

import dynamic from 'next/dynamic';

const MapViewInner = dynamic(() => import('./MapViewInner'), {
  ssr: false,
  loading: () => <div className="h-[460px] w-full rounded-xl border border-gray-200 bg-white" />,
});

export default function CityGisMapSection({ zoneFilter }: { zoneFilter?: 'DNCC' | 'DSCC' }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-gray-900">Dhaka City GIS Map</h2>
        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
          GIS
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-600">Boundary layer with hover and click interaction.</p>
      <div className="mt-4 h-[460px] w-full">
        <MapViewInner zoneFilter={zoneFilter} />
      </div>
    </section>
  );
}
