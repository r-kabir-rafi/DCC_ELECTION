import ConstituenciesMapSingleSection from '@/components/ConstituenciesMapSingleSection';
import CityGisMapSection from '@/components/CityGisMapSection';
import ZoomToDhakaSection from '@/components/ZoomToDhakaSection';
import CityCorporationElectionTable from '@/components/CityCorporationElectionTable';
import CityConstituencyWardSection from '@/components/CityConstituencyWardSection';

export default function DhakaSouthPage() {
  return (
    <section className="h-full w-full overflow-y-auto bg-white px-6 py-4">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <h1 className="pb-3 text-3xl font-bold tracking-tight text-gray-900">Dhaka South City Corporation</h1>
        <div className="grid items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <ConstituenciesMapSingleSection compact src="/prothomalo-dhaka-map-single-dscc.svg" leftShiftClass="translate-x-0" />
          <CityGisMapSection zoneFilter="DSCC" />
        </div>
        <CityConstituencyWardSection zone="DSCC" />
        <CityCorporationElectionTable zone="DSCC" />
        <ZoomToDhakaSection />
      </div>
    </section>
  );
}
