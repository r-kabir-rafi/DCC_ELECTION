'use client';

export default function ConstituenciesMapSingleSection({
  compact = false,
  leftShiftClass = 'translate-x-0',
  src = '/prothomalo-dhaka-map-single.svg',
}: {
  compact?: boolean;
  leftShiftClass?: string;
  src?: string;
}) {
  const mapHeight = compact ? 'h-[460px]' : 'h-[400px]';
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-gray-900">Constituencies Map DCC</h2>
        <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
          Interactive
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-600">Click a constituency to open its detail page.</p>
      <div className={`mt-4 w-full overflow-hidden rounded-lg border border-gray-200 bg-white ${mapHeight}`}>
        <iframe
          src={src}
          className={`mx-auto block h-full w-full ${leftShiftClass}`}
          title="Constituencies map single"
          loading="lazy"
        />
      </div>
    </section>
  );
}
