import MapSectionA from './components/MapSectionA';
import MapSectionB from './components/MapSectionB';
import { DNCC_CONTENT } from './content';

export default function DhakaNorthPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-950">
      {/* Page header */}
      <div className="border-b border-gray-200 bg-white px-4 py-6 dark:border-white/10 dark:bg-slate-900 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {DNCC_CONTENT.title}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {DNCC_CONTENT.subtitle}
          </p>
        </div>
      </div>

      {/* Section A: Constituencies */}
      <MapSectionA
        city={DNCC_CONTENT.cityCode}
        title={DNCC_CONTENT.sectionA.title}
        description={DNCC_CONTENT.sectionA.description}
      />

      {/* Section B: Wards + Admin */}
      <MapSectionB
        city={DNCC_CONTENT.cityCode}
        title={DNCC_CONTENT.sectionB.title}
        description={DNCC_CONTENT.sectionB.description}
      />
    </div>
  );
}
