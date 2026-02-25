export default function Legend() {
  return (
    <div className="pointer-events-none absolute bottom-4 left-4 z-[400] rounded-xl border border-gray-200 bg-white/95 p-3 shadow">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-700">Legend</p>
      <div className="mt-2 space-y-1">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="h-3 w-3 rounded-sm bg-indigo-500" />
          City Corporation Ward
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="h-3 w-3 rounded-sm bg-cyan-500" />
          National Constituency
        </div>
      </div>
    </div>
  );
}
