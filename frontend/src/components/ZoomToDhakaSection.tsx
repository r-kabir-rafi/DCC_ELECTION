export default function ZoomToDhakaSection() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Zoom Flow: Bangladesh to Dhaka City</h2>
      <p className="mt-2 text-sm text-gray-600">
        This section is reserved for GIS-based progressive zooming: national Bangladesh map, then Dhaka city
        constituency map.
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Step 1</p>
          <p className="mt-1 text-base font-semibold text-gray-900">Bangladesh Overview Map</p>
          <p className="mt-1 text-sm text-gray-600">Small national map used as the first zoom anchor.</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Step 2</p>
          <p className="mt-1 text-base font-semibold text-gray-900">Dhaka City GIS Map</p>
          <p className="mt-1 text-sm text-gray-600">
            Load constituency boundaries from GIS data and transition from the national view.
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-700">
        GIS Source:{" "}
        <a
          href="http://www.gis.gov.bd/en/search.php?t=7"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-indigo-700 underline underline-offset-2"
        >
          www.gis.gov.bd
        </a>
      </p>
    </section>
  );
}
