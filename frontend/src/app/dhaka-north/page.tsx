import MapView from '@/components/MapView';
import ConstituenciesMapSection from '@/components/ConstituenciesMapSection';
import CityGisMapSection from '@/components/CityGisMapSection';
import ZoomToDhakaSection from '@/components/ZoomToDhakaSection';

export default function DhakaNorthPage() {
  return (
    <section className="h-full w-full space-y-6 overflow-y-auto bg-white px-6 py-4">
      <h1 className="pb-3 text-3xl font-bold tracking-tight text-gray-900">Dhaka North City Corporation</h1>
      <ConstituenciesMapSection />
      <div className="h-[70vh] min-h-[420px]">
        <MapView zoneFilter="DNCC" />
      </div>
      <CityGisMapSection zoneFilter="DNCC" />
      <ZoomToDhakaSection />
    </section>
  );
}
