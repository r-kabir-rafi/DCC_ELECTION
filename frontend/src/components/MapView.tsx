'use client';

export default function MapView({ zoneFilter }: { zoneFilter?: 'DNCC' | 'DSCC' }) {
  const query =
    zoneFilter === 'DNCC'
      ? 'Dhaka North City Corporation'
      : zoneFilter === 'DSCC'
        ? 'Dhaka South City Corporation'
        : 'Dhaka City Corporation';

  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

  return (
    <section className="relative h-full min-h-[420px] w-full bg-slate-50 p-2">
      <iframe
        src={src}
        className="h-full min-h-[400px] w-full rounded-lg border border-gray-200 bg-white"
        title="Dhaka map"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      {zoneFilter ? (
        <div className="pointer-events-none absolute right-4 top-4 rounded-md bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow">
          Google map view
        </div>
      ) : null}
    </section>
  );
}
