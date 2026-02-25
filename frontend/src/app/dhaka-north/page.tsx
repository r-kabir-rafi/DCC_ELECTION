import MapView from '@/components/MapView';

export default function DhakaNorthPage() {
  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dhaka North City Corporation</h1>
      </div>
      <div className="flex-1">
        <MapView zoneFilter="DNCC" />
      </div>
    </div>
  );
}
