import MapView from '@/components/MapView';

export default function DhakaNorthPage() {
  return (
    <section className="flex h-full w-full flex-col bg-white px-6 py-4">
      <h1 className="pb-3 text-3xl font-bold tracking-tight text-gray-900">Dhaka North City Corporation</h1>
      <div className="min-h-0 flex-1">
        <MapView zoneFilter="DNCC" />
      </div>
    </section>
  );
}
