import MapView from '@/components/MapView';

export default function ConstituenciesPage() {
  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">All Constituencies</h1>
      </div>
      <div className="flex-1">
        <MapView />
      </div>
    </div>
  );
}
