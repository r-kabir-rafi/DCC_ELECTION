'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { DccFeature } from '@/lib/types';
import { getConstituenciesGeoJSON, getConstituencyListItems, getBoundaryGeoJSON } from '@/lib/data';
import SearchInput, { useSearch } from '@/components/common/SearchInput';
import GeoLegend from '@/components/common/GeoLegend';

const MapShell = dynamic(() => import('@/components/common/MapShell'), { ssr: false });

export default function ConstituencyMapSection() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const boundaryData = getBoundaryGeoJSON('DCC');
    const geoData = getConstituenciesGeoJSON();
    const listItems = getConstituencyListItems();
    const filtered = useSearch(listItems, search, item => `${item.name} ${item.code || ''} ${item.city}`);

    const handleFeatureClick = useCallback((feature: DccFeature) => {
        setSelectedId(prev => (prev === feature.properties.id ? null : feature.properties.id));
    }, []);

    const selectedFeature = geoData.features.find(f => f.properties.id === selectedId);

    return (
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_360px]">
            <div className="h-[500px] lg:h-[600px]">
                <MapShell
                    data={boundaryData}
                    layerType="constituency"
                    selectedId={selectedId}
                    onFeatureClick={handleFeatureClick}
                    className="h-full"
                />
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900 lg:max-h-[600px]">
                {selectedFeature ? (
                    <div className="rounded-lg bg-violet-50 p-3 dark:bg-violet-900/20">
                        <h3 className="font-semibold text-violet-800 dark:text-violet-200">
                            {selectedFeature.properties.name}
                        </h3>
                        <p className="mt-1 text-xs text-violet-600 dark:text-violet-300">
                            Code: {selectedFeature.properties.code} · City: {selectedFeature.properties.city}
                        </p>
                        <div className="mt-3 rounded-md bg-white/60 p-2 dark:bg-slate-800/50">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Election Results</p>
                            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 italic">Data will be added later</p>
                        </div>
                        <button
                            onClick={() => setSelectedId(null)}
                            className="mt-2 text-xs text-violet-600 hover:text-violet-800 dark:text-violet-400"
                        >
                            ✕ Deselect
                        </button>
                    </div>
                ) : (
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        Click a constituency polygon to see details
                    </p>
                )}

                <SearchInput placeholder="Search by name, code, or city…" value={search} onChange={setSearch} />

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filtered.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setSelectedId(item.id === selectedId ? null : item.id)}
                            className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${item.id === selectedId
                                ? 'bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200'
                                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5'
                                }`}
                        >
                            <span className="font-medium">{item.name}</span>
                            <span className="ml-2 text-xs text-gray-400">{item.code}</span>
                            <span className={`ml-2 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${item.city === 'DNCC'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                }`}>
                                {item.city}
                            </span>
                        </button>
                    ))}
                    {filtered.length === 0 && <p className="py-4 text-center text-xs text-gray-400">No results</p>}
                </div>

                <GeoLegend entries={[{ label: 'Constituency', type: 'constituency' }]} />
            </div>
        </div>
    );
}
