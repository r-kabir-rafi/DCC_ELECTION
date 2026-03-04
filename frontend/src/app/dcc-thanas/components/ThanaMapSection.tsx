'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { DccFeature } from '@/lib/types';
import { getThanasGeoJSON, getThanaListItems } from '@/lib/data';
import SearchInput, { useSearch } from '@/components/common/SearchInput';
import GeoLegend from '@/components/common/GeoLegend';

const MapShell = dynamic(() => import('@/components/common/MapShell'), { ssr: false });

export default function ThanaMapSection() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const geoData = getThanasGeoJSON();
    const dnccItems = getThanaListItems('DNCC');
    const dsccItems = getThanaListItems('DSCC');
    const allItems = [...dnccItems, ...dsccItems];
    const filtered = useSearch(allItems, search, item => `${item.name} ${item.code || ''} ${item.city}`);

    const handleFeatureClick = useCallback((feature: DccFeature) => {
        setSelectedId(prev => (prev === feature.properties.id ? null : feature.properties.id));
    }, []);

    const selectedFeature = geoData.features.find(f => f.properties.id === selectedId);

    return (
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_360px]">
            <div className="h-[500px] lg:h-[600px]">
                <MapShell
                    data={geoData}
                    layerType="thana"
                    selectedId={selectedId}
                    onFeatureClick={handleFeatureClick}
                    className="h-full"
                />
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900 lg:max-h-[600px]">
                {selectedFeature ? (
                    <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                        <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                            {selectedFeature.properties.name}
                        </h3>
                        <p className="mt-1 text-xs text-amber-600 dark:text-amber-300">
                            Code: {selectedFeature.properties.code} · {selectedFeature.properties.city}
                        </p>
                        <button
                            onClick={() => setSelectedId(null)}
                            className="mt-2 text-xs text-amber-600 hover:text-amber-800 dark:text-amber-400"
                        >
                            ✕ Deselect
                        </button>
                    </div>
                ) : (
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        Click a thana polygon to see details
                    </p>
                )}

                <SearchInput placeholder="Search thana…" value={search} onChange={setSearch} />

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* DNCC Section */}
                    <p className="px-3 pt-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">DNCC</p>
                    {filtered.filter(i => i.city === 'DNCC').map(item => (
                        <button
                            key={item.id}
                            onClick={() => setSelectedId(item.id === selectedId ? null : item.id)}
                            className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${item.id === selectedId
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200'
                                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5'
                                }`}
                        >
                            <span className="font-medium">{item.name}</span>
                            <span className="ml-2 text-xs text-gray-400">{item.code}</span>
                        </button>
                    ))}

                    {/* DSCC Section */}
                    <p className="px-3 pt-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">DSCC</p>
                    {filtered.filter(i => i.city === 'DSCC').map(item => (
                        <button
                            key={item.id}
                            onClick={() => setSelectedId(item.id === selectedId ? null : item.id)}
                            className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${item.id === selectedId
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200'
                                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5'
                                }`}
                        >
                            <span className="font-medium">{item.name}</span>
                            <span className="ml-2 text-xs text-gray-400">{item.code}</span>
                        </button>
                    ))}

                    {filtered.length === 0 && <p className="py-4 text-center text-xs text-gray-400">No results</p>}
                </div>

                <GeoLegend entries={[{ label: 'Thana', type: 'thana' }]} />
            </div>
        </div>
    );
}
