import ConstituenciesMapSingleSection from '@/components/ConstituenciesMapSingleSection';
import CityGisMapSection from '@/components/CityGisMapSection';
import ZoomToDhakaSection from '@/components/ZoomToDhakaSection';
import CityCorporationElectionTable from '@/components/CityCorporationElectionTable';
import CityConstituencyWardSection from '@/components/CityConstituencyWardSection';

export default function DhakaNorthPage() {
  return (
    <section className="h-full w-full overflow-y-auto bg-white px-6 py-4">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <h1 className="pb-3 text-3xl font-bold tracking-tight text-gray-900">Dhaka North City Corporation</h1>
        <ConstituenciesMapSingleSection />
        <CityGisMapSection zoneFilter="DNCC" />
        <CityConstituencyWardSection zone="DNCC" />
        <CityCorporationElectionTable zone="DNCC" />
        <ZoomToDhakaSection />
      </div>
    </section>
  );
}
