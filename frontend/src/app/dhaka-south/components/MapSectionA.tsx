'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { DccFeature } from '@/lib/types';
import { getConstituenciesByCity, getConstituencyListItems } from '@/lib/data';
import SearchInput, { useSearch } from '@/components/common/SearchInput';
import GeoLegend from '@/components/common/GeoLegend';
import type { CityCode } from '@/lib/types';

const MapShell = dynamic(() => import('@/components/common/MapShell'), { ssr: false });

interface MapSectionAProps {
    city: CityCode;
    title: string;
    description: string;
}

export default function MapSectionA({ city, title, description }: MapSectionAProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const geoData = getConstituenciesByCity(city);
    const listItems = getConstituencyListItems(city);
    const filtered = useSearch(listItems, search, item => `${item.name} ${item.code || ''}`);

    const handleFeatureClick = useCallback((feature: DccFeature) => {
        setSelectedId(prev => (prev === feature.properties.id ? null : feature.properties.id));
    }, []);

    const selectedFeature = geoData.features.find(f => f.properties.id === selectedId);

    return (
        <section className="border-b border-gray-200 dark:border-white/10">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>

                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_340px]">
                    <div className="h-[400px] lg:h-[500px]">
                        <MapShell
                            data={geoData}
                            layerType="constituency"
                            selectedId={selectedId}
                            onFeatureClick={handleFeatureClick}
                            className="h-full"
                        />
                    </div>

                    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900 lg:max-h-[500px]">
                        {selectedFeature ? (
                            <div className="rounded-lg bg-indigo-50 p-3 dark:bg-indigo-900/20">
                                <h3 className="font-semibold text-indigo-800 dark:text-indigo-200">
                                    {selectedFeature.properties.name}
                                </h3>
                                <p className="mt-1 text-xs text-indigo-600 dark:text-indigo-300">
                                    Code: {selectedFeature.properties.code} · {selectedFeature.properties.city}
                                </p>
                                <div className="mt-3 rounded-md bg-white/60 p-2 dark:bg-slate-800/50">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Election Results</p>
                                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 italic">Data will be added later</p>
                                </div>
                                <button
                                    onClick={() => setSelectedId(null)}
                                    className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                                >
                                    ✕ Deselect
                                </button>
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 dark:text-gray-500">Click a constituency polygon to see details</p>
                        )}

                        <SearchInput placeholder="Search constituency…" value={search} onChange={setSearch} />

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {filtered.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedId(item.id === selectedId ? null : item.id)}
                                    className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${item.id === selectedId
                                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200'
                                            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5'
                                        }`}
                                >
                                    <span className="font-medium">{item.name}</span>
                                    <span className="ml-2 text-xs text-gray-400">{item.code}</span>
                                    {!item.hasBoundary && (
                                        <span className="ml-2 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">not mapped</span>
                                    )}
                                </button>
                            ))}
                            {filtered.length === 0 && <p className="py-4 text-center text-xs text-gray-400">No results</p>}
                        </div>

                        <GeoLegend entries={[{ label: 'Constituency', type: 'constituency' }]} />
                    </div>
                </div>
            </div>
        </section>
    );
}
