'use client';

export default function MapView({ zoneFilter }: { zoneFilter?: 'DNCC' | 'DSCC' }) {
  return (
    <section className="relative h-full min-h-[420px] w-full bg-slate-50 p-2">
      <object
        data="/prothomalo-dhaka-map.svg"
        type="image/svg+xml"
        className="h-full min-h-[400px] w-full rounded-lg bg-white object-contain"
        aria-label="Dhaka constituency map"
      >
        Dhaka constituency map
      </object>
      {zoneFilter ? (
        <div className="pointer-events-none absolute right-4 top-4 rounded-md bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow">
          Full Dhaka map view
        </div>
      ) : null}
    </section>
  );
}
