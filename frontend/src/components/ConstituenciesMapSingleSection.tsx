'use client';

export default function ConstituenciesMapSingleSection() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Constituencies Map DCC</h2>
      <div className="mt-4 h-[400px] w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
        <iframe
          src="/prothomalo-dhaka-map-single.svg"
          className="h-full w-full"
          title="Constituencies map single"
          loading="lazy"
        />
      </div>
    </section>
  );
}
