'use client';

export default function ConstituenciesMapSection() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Constituencies Map</h2>
      <p className="mt-1 text-sm text-gray-600">Interactive constituency seat map.</p>
      <div className="mt-4 h-[460px] w-full">
        <iframe
          src="/prothomalo-dhaka-map.svg"
          className="h-full w-full rounded-lg border border-gray-200 bg-white"
          title="Constituencies map"
          loading="lazy"
        />
      </div>
    </section>
  );
}
